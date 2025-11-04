import {
  Box,
  Flex,
  Text,
  VStack,
  Textarea,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState, useRef } from "react";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useWebWorkerTimer } from "./hooks/useWebWorkerTimer";
import { useTimerGestures } from "./hooks/useGestures";
import { TimerControls } from "./components/TimerControls";
import { GlassButton } from "./components/ui/GlassButton";
import { usePersisted } from "./hooks/usePersisted";
import SimplePeer from "simple-peer";

interface TimerMessage {
  type: "state" | "action";
  isRunning?: boolean;
  time?: number;
  laps?: number[];
  action?: "start" | "stop" | "reset" | "lap";
}

interface Contact {
  name: string;
  rtcData: string;
}

const RemoteTimer = () => {
  const { t } = useTranslation();
  const [peers, setPeers] = useState<Map<string, SimplePeer.Instance>>(
    new Map()
  );
  const [connectedPeers, setConnectedPeers] = useState<Set<string>>(new Set());
  const [laps, setLaps] = useState<number[]>([]);
  const [mode, setMode] = useState<"create" | "join" | "connected">("create");
  const [myRtcData, setMyRtcData] = useState<string>("");
  const [contacts, setContacts] = usePersisted<Contact[]>(
    "remote-timer-contacts",
    []
  );
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set()
  );
  const [newContactName, setNewContactName] = useState("");
  const [newContactData, setNewContactData] = useState("");
  const {
    isOpen: isAddressBookOpen,
    onOpen: onAddressBookOpen,
    onClose: onAddressBookClose,
  } = useDisclosure();
  const initiatorPeerRef = useRef<SimplePeer.Instance | null>(null);

  const {
    isRunning,
    value: time,
    start,
    stop,
    reset: resetTimer,
    updateValue,
  } = useWebWorkerTimer({
    type: "stopwatch",
    timerId: "remote-stopwatch",
    config: { initialValue: 0 },
  });

  useEffect(() => {
    const p = new SimplePeer({ initiator: true, trickle: false });

    p.on("signal", (data: SimplePeer.SignalData) => {
      const encoded = btoa(JSON.stringify(data));
      setMyRtcData(encoded);
    });

    p.on("connect", () => {
      console.log("Initiator connected");
    });

    initiatorPeerRef.current = p;

    return () => {
      if (initiatorPeerRef.current) {
        initiatorPeerRef.current.destroy();
      }
    };
  }, []);

  const connectToContact = (contact: Contact) => {
    try {
      const peerId = contact.name;

      if (peers.has(peerId)) {
        return;
      }

      const p = new SimplePeer({ initiator: false, trickle: false });

      p.on("signal", () => {});

      p.on("connect", () => {
        setConnectedPeers((prev) => new Set(prev).add(peerId));
        setMode("connected");
      });

      p.on("data", (data: string) => {
        const message: TimerMessage = JSON.parse(data.toString());
        handleRemoteMessage(message);
      });

      p.on("error", (err: Error) => {
        console.error("Peer error:", err);
      });

      p.on("close", () => {
        setConnectedPeers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(peerId);
          return newSet;
        });
        setPeers((prev) => {
          const newMap = new Map(prev);
          newMap.delete(peerId);
          return newMap;
        });
      });

      const decoded = atob(contact.rtcData);
      p.signal(JSON.parse(decoded));

      setPeers((prev) => new Map(prev).set(peerId, p));
    } catch (err) {
      console.error("Failed to connect to contact:", err);
    }
  };

  const handleSelectContact = (contactName: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactName)) {
      newSelected.delete(contactName);
    } else {
      newSelected.add(contactName);
    }
    setSelectedContacts(newSelected);
  };

  const connectToSelected = () => {
    selectedContacts.forEach((contactName) => {
      const contact = contacts.find((c) => c.name === contactName);
      if (contact) {
        connectToContact(contact);
      }
    });
  };

  const addContact = () => {
    if (!newContactName || !newContactData) return;

    setContacts([
      ...contacts,
      { name: newContactName, rtcData: newContactData },
    ]);
    setNewContactName("");
    setNewContactData("");
  };

  const deleteContact = (contactName: string) => {
    setContacts(contacts.filter((c) => c.name !== contactName));
  };

  const handleRemoteMessage = (message: TimerMessage) => {
    if (message.type === "state") {
      if (message.time !== undefined) updateValue(message.time);
      if (message.laps !== undefined) setLaps(message.laps);
      if (message.isRunning !== undefined) {
        if (message.isRunning && !isRunning) {
          start();
        } else if (!message.isRunning && isRunning) {
          stop();
        }
      }
    } else if (message.type === "action") {
      switch (message.action) {
        case "start":
          start();
          break;
        case "stop":
          stop();
          break;
        case "reset":
          stop();
          resetTimer();
          setLaps([]);
          break;
      }
    }
  };

  const broadcastState = (lapsOverride?: number[]) => {
    const message: TimerMessage = {
      type: "state",
      isRunning,
      time,
      laps: lapsOverride ?? laps,
    };

    const messageStr = JSON.stringify(message);

    peers.forEach((peer, peerId) => {
      if (connectedPeers.has(peerId)) {
        try {
          peer.send(messageStr);
        } catch (err) {
          console.error(`Failed to send to ${peerId}:`, err);
        }
      }
    });
  };

  const handleStartStop = () => {
    const newState = !isRunning;
    if (newState) {
      start();
    } else {
      stop();
    }
    broadcastState();
  };

  const handleReset = () => {
    stop();
    resetTimer();
    setLaps([]);
    broadcastState([]);
  };

  const handleLap = () => {
    const newLaps = [...laps, time];
    setLaps(newLaps);
    broadcastState(newLaps);
  };

  useKeyboardShortcuts({
    onStartStop: handleStartStop,
    onReset: handleReset,
    onLap: handleLap,
  });

  const gestureHandlers = useTimerGestures({
    onStartStop: handleStartStop,
    onReset: handleReset,
    onSecondaryAction: handleLap,
    disabled: false,
  });

  const formatTime = (time: number) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const centiseconds = Math.floor((time % 1000) / 10);

    return { days, hours, minutes, seconds, centiseconds };
  };

  const { days, hours, minutes, seconds, centiseconds } = formatTime(time);

  const lapList = useMemo(() => {
    return laps.map((lap, index) => {
      const lapTime = format(new Date(lap), "mm:ss.SS");
      return (
        <Flex
          key={index}
          justifyContent="space-between"
          alignItems="center"
          py={3}
          px={2}
          borderRadius="8px"
          bg={index % 2 === 0 ? "rgba(255, 255, 255, 0.02)" : "transparent"}
          _hover={{
            bg: "rgba(255, 255, 255, 0.05)",
          }}
          transition="background-color 0.2s ease"
        >
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="rgba(255, 255, 255, 0.8)"
            fontWeight="500"
          >
            {t("Lap")} {index + 1}
          </Text>
          <Text
            fontFamily="monospace"
            fontSize={{ base: "sm", md: "md" }}
            color="#ffffff"
            fontWeight="600"
          >
            {lapTime}
          </Text>
        </Flex>
      );
    });
  }, [laps, t]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareLink = myRtcData
    ? `${window.location.origin}/remote-timer?c=${encodeURIComponent(myRtcData)}`
    : "";

  if (mode === "create") {
    return (
      <Box
        textAlign="center"
        px={{ base: 4, md: 0 }}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box maxW="600px" w="100%">
          <Text fontSize="3xl" fontWeight="bold" color="white" mb={8}>
            {t("Remote Timer")}
          </Text>

          <VStack spacing={6} w="100%">
            <Text fontSize="lg" color="white">
              {t("Select contacts to connect")}
            </Text>

            <GlassButton
              onClick={onAddressBookOpen}
              variant="primary"
              glassLevel="medium"
            >
              {t("Manage Address Book")}
            </GlassButton>

            <VStack spacing={2} w="100%">
              {contacts.map((contact) => (
                <HStack
                  key={contact.name}
                  w="100%"
                  p={3}
                  bg={
                    selectedContacts.has(contact.name)
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(255, 255, 255, 0.02)"
                  }
                  borderRadius="8px"
                  border="1px solid rgba(255, 255, 255, 0.1)"
                  cursor="pointer"
                  onClick={() => handleSelectContact(contact.name)}
                  _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}
                >
                  <Text color="white" flex={1}>
                    {contact.name}
                  </Text>
                  {connectedPeers.has(contact.name) && (
                    <Box w="8px" h="8px" borderRadius="50%" bg="green.400" />
                  )}
                </HStack>
              ))}
            </VStack>

            <GlassButton
              onClick={connectToSelected}
              variant="primary"
              glassLevel="medium"
              isDisabled={selectedContacts.size === 0}
              w="100%"
            >
              {t("Connect to Selected")}
            </GlassButton>

            <GlassButton
              onClick={() => setMode("connected")}
              variant="secondary"
              glassLevel="subtle"
              w="100%"
            >
              {t("Start Timer")}
            </GlassButton>
          </VStack>

          <Modal
            isOpen={isAddressBookOpen}
            onClose={onAddressBookClose}
            size="xl"
          >
            <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
            <ModalContent
              bg="rgba(10, 10, 10, 0.95)"
              border="1px solid rgba(255, 255, 255, 0.1)"
            >
              <ModalHeader color="white">{t("Address Book")}</ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody pb={6}>
                <VStack spacing={4} align="stretch">
                  <VStack spacing={2} align="stretch">
                    <Text fontSize="sm" color="gray.400">
                      {t("Add New Contact")}
                    </Text>
                    <Input
                      placeholder={t("Name")}
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      bg="rgba(255, 255, 255, 0.05)"
                      border="1px solid rgba(255, 255, 255, 0.1)"
                      color="white"
                    />
                    <Textarea
                      placeholder={t("RTC Data (base64)")}
                      value={newContactData}
                      onChange={(e) => setNewContactData(e.target.value)}
                      rows={3}
                      fontFamily="monospace"
                      fontSize="xs"
                      bg="rgba(255, 255, 255, 0.05)"
                      border="1px solid rgba(255, 255, 255, 0.1)"
                      color="white"
                    />
                    <GlassButton
                      onClick={addContact}
                      variant="primary"
                      glassLevel="medium"
                      isDisabled={!newContactName || !newContactData}
                    >
                      {t("Add Contact")}
                    </GlassButton>
                  </VStack>

                  <VStack spacing={2} align="stretch">
                    <Text fontSize="sm" color="gray.400">
                      {t("Contacts")}
                    </Text>
                    {contacts.map((contact) => (
                      <Flex
                        key={contact.name}
                        p={3}
                        bg="rgba(255, 255, 255, 0.02)"
                        borderRadius="8px"
                        border="1px solid rgba(255, 255, 255, 0.1)"
                        justify="space-between"
                        align="center"
                      >
                        <VStack align="start" spacing={0} flex={1}>
                          <Text color="white" fontWeight="600">
                            {contact.name}
                          </Text>
                          <Text
                            fontSize="xs"
                            fontFamily="monospace"
                            color="gray.500"
                            isTruncated
                            maxW="200px"
                          >
                            {contact.rtcData}
                          </Text>
                        </VStack>
                        <IconButton
                          aria-label="Delete"
                          icon={<Text>🗑</Text>}
                          size="sm"
                          onClick={() => deleteContact(contact.name)}
                          bg="rgba(255, 0, 0, 0.1)"
                          _hover={{ bg: "rgba(255, 0, 0, 0.2)" }}
                        />
                      </Flex>
                    ))}
                  </VStack>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      textAlign="center"
      px={{ base: 4, md: 0 }}
      {...gestureHandlers}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box maxW="800px" w="100%">
        <Flex
          justify="center"
          align="baseline"
          gap={{ base: 2, md: 4 }}
          mb={{ base: 6, md: 4 }}
        >
          <VStack spacing={0}>
            <Text
              fontSize={{ base: "4xl", sm: "6xl", md: "7xl" }}
              fontFamily="monospace"
              fontWeight="bold"
            >
              {days}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {t("days")}
            </Text>
          </VStack>

          <VStack spacing={0}>
            <Text
              fontSize={{ base: "4xl", sm: "6xl", md: "7xl" }}
              fontFamily="monospace"
              fontWeight="bold"
            >
              {hours}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {t("hours")}
            </Text>
          </VStack>

          <VStack spacing={0}>
            <Text
              fontSize={{ base: "4xl", sm: "6xl", md: "7xl" }}
              fontFamily="monospace"
              fontWeight="bold"
            >
              {minutes}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {t("minutes")}
            </Text>
          </VStack>

          <VStack spacing={0}>
            <Text
              fontSize={{ base: "4xl", sm: "6xl", md: "7xl" }}
              fontFamily="monospace"
              fontWeight="bold"
            >
              {seconds}.{centiseconds.toString().padStart(2, "0")}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {t("seconds")}
            </Text>
          </VStack>
        </Flex>

        <TimerControls
          primaryAction={{
            label: isRunning ? t("Stop") : t("Start"),
            onClick: handleStartStop,
            variant: isRunning ? "danger" : "success",
          }}
          secondaryActions={[
            {
              label: t("Reset"),
              onClick: handleReset,
              disabled: time === 0 && !isRunning,
              variant: "secondary",
            },
            {
              label: t("Lap"),
              onClick: handleLap,
              disabled: !isRunning,
              variant: "secondary",
            },
          ]}
          size="lg"
          spacing={4}
        />

        <Box
          mt={{ base: 6, md: 8 }}
          height="200px"
          bg="rgba(255, 255, 255, 0.02)"
          borderRadius="12px"
          border="1px solid rgba(255, 255, 255, 0.05)"
          backdropFilter="blur(20px)"
          overflowY="auto"
          px={{ base: 3, md: 4 }}
          py={3}
        >
          {laps.length === 0 ? (
            <Flex
              height="100%"
              alignItems="center"
              justifyContent="center"
              opacity={0.4}
            >
              <Text fontSize="sm" color="rgba(255, 255, 255, 0.5)">
                {t("Lap times will appear here")}
              </Text>
            </Flex>
          ) : (
            lapList
          )}
        </Box>

        <Flex justify="center" align="center" gap={2} mt={4}>
          <Box
            w="8px"
            h="8px"
            borderRadius="50%"
            bg={connectedPeers.size > 0 ? "green.400" : "orange.400"}
          />
          <Text fontSize="xs" color="gray.500">
            {connectedPeers.size > 0
              ? `${t("Connected")} (${connectedPeers.size})`
              : t("No connections")}
          </Text>
        </Flex>

        <Text
          fontSize={{ base: "xs", md: "sm" }}
          color="gray.500"
          mt={4}
          textAlign="center"
        >
          <kbd>Space</kbd> Start/Stop • <kbd>R</kbd> Reset • <kbd>L</kbd> Lap •{" "}
          <kbd>?</kbd> for help
        </Text>

        <Box
          position="fixed"
          bottom={{ base: "100px", md: "80px" }}
          left="20px"
          bg="rgba(10, 10, 10, 0.95)"
          borderRadius="8px"
          border="1px solid rgba(255, 255, 255, 0.1)"
          p={3}
          maxW="300px"
        >
          <VStack spacing={2} align="stretch">
            <Text fontSize="xs" color="gray.400">
              {t("My RTC Data")}
            </Text>
            <Textarea
              value={myRtcData}
              isReadOnly
              size="xs"
              rows={3}
              fontFamily="monospace"
              fontSize="9px"
              bg="rgba(255, 255, 255, 0.05)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              color="white"
              resize="none"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
            <GlassButton
              size="xs"
              onClick={() => copyToClipboard(myRtcData)}
              variant="primary"
              glassLevel="medium"
            >
              {t("Copy")}
            </GlassButton>
            {shareLink && (
              <>
                <Text fontSize="xs" color="gray.400" mt={2}>
                  {t("Share Link")}
                </Text>
                <Input
                  value={shareLink}
                  isReadOnly
                  size="xs"
                  fontFamily="monospace"
                  fontSize="9px"
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid rgba(255, 255, 255, 0.1)"
                  color="white"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <GlassButton
                  size="xs"
                  onClick={() => copyToClipboard(shareLink)}
                  variant="primary"
                  glassLevel="medium"
                >
                  {t("Copy Link")}
                </GlassButton>
              </>
            )}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default RemoteTimer;
