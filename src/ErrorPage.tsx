import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { isRouteErrorResponse, useRouteError } from "react-router";

function ErrorPage() {
  const error = useRouteError();

  let errorCode = "500";

  if (isRouteErrorResponse(error)) {
    errorCode = error.status.toString();
  }

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <Box
      minHeight="100vh"
      width="100vw"
      bg="#0a0a0a"
      pt="80px"
      position="relative"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="calc(100vh - 80px)"
        p={8}
      >
        <VStack spacing={8} textAlign="center">
          <Text
            fontSize="20rem"
            fontFamily="monospace"
            fontWeight="bold"
            color="white"
            lineHeight="1"
          >
            {errorCode}
          </Text>
          
          <Button
            onClick={handleGoHome}
            bg="rgba(0, 0, 0, 0.4)"
            color="white"
            border="1px solid white"
            borderRadius="4px"
            px={6}
            py={3}
            fontSize="lg"
            fontWeight="600"
            _hover={{
              bg: "rgba(0, 0, 0, 0.6)",
              transform: "translateY(-1px)"
            }}
            _active={{
              transform: "translateY(0)"
            }}
            transition="all 0.2s ease"
          >
            Go Home
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default ErrorPage;
