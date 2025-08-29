import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      "html, body, #root": {
        height: "100%",
        margin: "0",
        padding: "0",
        background: "#0a0a0a",
      },
    },
  },
  components: {},
});