import { createStore } from "redux";
import { produce } from "immer";
import { UPDATE_USER_DATA, TRIGGER_MESSAGE } from "./constants";

const initialData = {
	userData: {},
	globalMessage: {
		message: "hint text",
		severity: "success",
		duration: 3000,
		show: false,
	},
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
			default:
				return initialData;
		}
	});

export const store = createStore(reducer);
