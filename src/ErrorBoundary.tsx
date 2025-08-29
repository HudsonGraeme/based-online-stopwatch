import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          minHeight="100vh"
          width="100vw"
          bg="#0a0a0a"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={8}
        >
          <VStack spacing={6} maxW="600px" textAlign="center">
            <Alert
              status="error"
              borderRadius="16px"
              bg="rgba(254, 202, 202, 0.1)"
              border="1px solid rgba(254, 202, 202, 0.2)"
            >
              <AlertIcon color="#fc8181" />
              <Box>
                <AlertTitle color="#fc8181">
                  Oops! Something went wrong
                </AlertTitle>
                <AlertDescription color="#9ca3af">
                  We encountered an unexpected error. Don't worry, your data is
                  safe.
                </AlertDescription>
              </Box>
            </Alert>

            <VStack spacing={4}>
              <Text fontSize="lg" color="white" fontWeight="600">
                🔧 Error Details
              </Text>
              <Box
                bg="rgba(255, 255, 255, 0.02)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="12px"
                p={4}
                w="100%"
                textAlign="left"
              >
                <Text fontSize="sm" color="#9ca3af" fontFamily="monospace">
                  {this.state.error?.message}
                </Text>
              </Box>
            </VStack>

            <VStack spacing={3}>
              <Button
                onClick={this.handleReset}
                colorScheme="blue"
                size="lg"
                px={8}
              >
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                variant="outline"
                size="lg"
                px={8}
              >
                Reload Page
              </Button>
            </VStack>

            <Text fontSize="sm" color="#6b7280">
              If this problem persists, please contact support.
            </Text>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
