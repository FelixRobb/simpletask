"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { StyleFunctionProps } from "@chakra-ui/theme-tools";

// Custom theme
const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode("gray.100", "gray.999")(props),
        backgroundImage: "url('https://source.unsplash.com/1600x900/?abstract,dark')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "full",
      },
    },
    Modal: {
      baseStyle: (props: StyleFunctionProps) => ({
        dialog: {
          bg: mode("rgba(255, 255, 255, 0.8)", "rgba(26, 32, 44, 0.8)")(props),
          backdropFilter: "blur(10px)",
          borderRadius: "2xl",
        },
      }),
    },
  },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
