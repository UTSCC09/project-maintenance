import { createStore } from "redux";
import { produce } from "immer";
import { UPDATE_USER_DATA, TRIGGER_MESSAGE, UPDATE_USER_POSITION } from "./constants";

const initialData = {
    userData: {},
    globalMessage: {
        message: "hint text",
        severity: "success",
        duration: 3000,
        show: false,
    },
    userLocation: {}
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
                    globalMessage: Object.assign({},
                        draft.globalMessage, {
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
            default:
                return initialData;
        }
    });

export const store = createStore(reducer);