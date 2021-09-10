import { Provider } from "next-auth/client";
import { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Roboto",
    body: "Roboto",
  },
});
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  );
};

export default App;
