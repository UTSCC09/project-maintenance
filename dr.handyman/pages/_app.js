import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink
} from "@apollo/client";
import { store } from '../src/store'
import { Provider } from "react-redux";

const link = new HttpLink({ uri: "http://www.drhandyman.me:4000/graphql" })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

export default function App({ Component, pageProps }) {
  console.log(Component)
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ApolloProvider>
  )
}
