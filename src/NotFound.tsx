import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box 
      textAlign="center" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="calc(100vh - 160px)"
    >
      <VStack spacing={8}>
        <Text
          fontSize="20rem"
          fontFamily="monospace"
          fontWeight="bold"
          color="white"
          lineHeight="1"
        >
          404
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
  );
}

export default NotFound;