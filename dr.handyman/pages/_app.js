import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
	createHttpLink,
} from "@apollo/client";
import { store } from "../src/store";
import { Provider } from "react-redux";
import { GET_USER_DATA } from "../src/GraphQL/Queries";
import { UPDATE_USER_DATA } from '../src/store/constants'
import Message from 'components/message';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

const link = new createHttpLink({
	// uri: "http://www.drhandyman.me:4000/graphql"
	uri: "https://localhost:3000/graphql",
	// uri: "https://www.drhandyman.me:4000/graphql",
	credentials: "include",
	opts: {
		credentials: "include",
	},
});

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link,
	fetchOptions: {
		credentials: "include",
	},
	credentials: "include",
});

export default function App({ Component, pageProps }) {
	const state = store.getState();
  const dispatch = store.dispatch;
  const userData = state.userData || {};
  const router = useRouter();
  const [stateChanged, setStateChanged] = useState(false);

  store.subscribe(() => {
    setStateChanged(true);
  });

	if (!state.userData.isLogin) {
		client
			.query({
				query: GET_USER_DATA,
			})
			.then((res) => {
				if (res.data && res.data.currentUser) {
					dispatch({
						type: UPDATE_USER_DATA,
						payload: {
							userData: {
								...res.data.currentUser,
								isLogin: true,
							},
						},
					});
				}
			}).catch(() => {
        console.log('Not Login!')
      });
	}

  useEffect(() => {
    const handlerRouterUpdate = (url) => {
      console.log('userData', userData)
      if (url !== '/' && url !== '/login'&& url !== '/signup' && !userData.isLogin) {
        router.replace('/login', undefined, { shallow: true})
      }
    }

    router.events.on('routeChangeComplete', handlerRouterUpdate);

    return () => {
      router.events.off('routeChangeComplete', handlerRouterUpdate);
    }
  }, [userData, stateChanged]);

	return (
		<ApolloProvider client={client}>
			<Provider store={store}>
				<Component {...pageProps} />
        <Message></Message>
			</Provider>
		</ApolloProvider>
	);
}
