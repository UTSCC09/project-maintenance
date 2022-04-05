import { createStore } from "redux";
import { produce } from "immer";
import { UPDATE_USER_DATA, TRIGGER_MESSAGE, UPDATE_USER_POSITION, SET_CURRENT_CONV_USER_INFO, UPDATE_CALLING_USER } from "./constants";
import io from "socket.io-client"
const initialData = {
	userData: {},
	globalMessage: {
		message: "hint text",
		severity: "success",
		duration: 3000,
		show: false,
	},
	userLocation: {},
	currentConvUserInfo: {},
	socket:  io.connect('https://localhost:4000/'),
	callingUser: ""
};

const reducer = (state = initialData, action) =>
	produce(state, (draft) => {
		const { payload } = action;
		switch (action.type) {
			case UPDATE_USER_DATA:
				return Object.assign({}, draft, {
					userData: payload.userData,
				});
			case TRIGGER_MESSAGE:
				return Object.assign({}, draft, {
					globalMessage: Object.assign(
            {},
						draft.globalMessage,
						{
							show: true,
              severity: "success"
						},
						payload.globalMessage
					),
				});
			case UPDATE_USER_POSITION:
				return Object.assign({}, draft, {
					userLocation: payload.userLocation
				})
			case SET_CURRENT_CONV_USER_INFO:
				return Object.assign({}, draft, {
					currentConvUserInfo: payload.currentConvUserInfo
				})
			case UPDATE_CALLING_USER:
				return Object.assign({}, draft, {
					callingUser: payload,
				});
			default:
				return initialData;
		}
	});

export const store = createStore(reducer);
