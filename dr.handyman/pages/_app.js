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
import { UPDATE_USER_DATA, TRIGGER_MESSAGE } from '../src/store/constants'
import Message from 'components/message';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Emitter from '@/utils/eventEmitter';

const link = new createHttpLink({
	// uri: "http://www.drhandyman.me:4000/graphql"
	// uri: "https://localhost:3000/graphql",
	 uri: "https://api.drhandyman.me/graphql",
	credentials: "include",
	opts: {
		credentials: "include",
	},
});
// const link = new HttpLink({
// 	// uri: "http://www.drhandyman.me:4000/graphql"
// 	//uri: "https://localhost:3000/graphql",
// 	 uri: "https://www.drhandyman.me:4000/graphql",

// });
const client = new ApolloClient({
	cache: new InMemoryCache(),
	link,
	fetchOptions: {
		credentials: "include",
	},
	credentials: "include",
});

const whiteList = ['/', '/login', '/signup'];

export default function App({ Component, pageProps }) {
	const state = store.getState();
  const dispatch = store.dispatch;
  const userData = state.userData || {};
  const router = useRouter();
  const [stateChanged, setStateChanged] = useState(false);

  store.subscribe(() => {
    setStateChanged(true);
  });

	const updateUserData = () => {
		console.log('updateUserData');
		if (!state.userData.isLogin) {
			client
				.query({
					query: GET_USER_DATA,
					fetchPolicy: "network-only"
				})
				.then((res) => {
					if (res.data && res.data.currentUser) {
						dispatch({
							type: UPDATE_USER_DATA,
							payload: {
								userData: {
									...res.data.currentUser,
									isLogin: true,
									isLoaded: true
								},
							},
						});
					}
				}).catch((err) => {
					if (err.message.indexOf('Not Authorised') !== -1) {
						const url = document.location.pathname;
						if (whiteList.indexOf(url) === -1) {
							router.push('/login', undefined, {
								shallow: true
							})
							console.log('Not Login!')
						}
					}
					Emitter.emit('showMessage', {
						message: err.message,
						severity: "error"
					})
				});
		}
	}

	useEffect(() => {
		updateUserData();
		const messageHandler = (data) => {
			dispatch({
				type: TRIGGER_MESSAGE,
				payload: {
					globalMessage: data || {}
				}
			})
		}

		Emitter.on('updateUserData', updateUserData);
		Emitter.on('showMessage', messageHandler);
		return () => {
			Emitter.off('updateUserData', updateUserData);
			Emitter.off('showMessage', messageHandler);
		}
	}, [])

  useEffect(() => {
    const handlerRouterUpdate = (url) => {
      if (whiteList.indexOf(url) === -1 && userData.isLoaded && !userData.isLogin) {
        router.replace('/login', undefined, { shallow: true})
      }
    }
		handlerRouterUpdate();

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
