import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { borderColor } from "@mui/system";
import ListItemButton from "@mui/material/ListItemButton";
import { FixedSizeList } from "react-window";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "@mui/material";
import { SET_CURRENT_CONV_USER_INFO } from "@/store/constants";
import { GET_LATEST_MESSAGE } from "@/GraphQL/Queries";
import { CREATE_CONVERSATION } from "@/GraphQL/Mutations";
import { useMutation, useLazyQuery, useSubscription } from "@apollo/client";
import Emitter from "@/utils/eventEmitter";
import { SERVER_URL } from "@/constant.js";

function ContactListRow({ detail }) {
	const currentConvUserInfo = useSelector(
		(state) => state.currentConvUserInfo
	);
	const activeConversation = currentConvUserInfo.conversation || {};
	console.log("currentConvUserInfo", currentConvUserInfo);
	const [getLatestMessage] = useLazyQuery(GET_LATEST_MESSAGE);
	const [createNewConv] = useMutation(CREATE_CONVERSATION);
	const dispatch = useDispatch();
	const { conversation = {} } = detail;
	const [latestMessage, setLastMessage] = useState("");
	const avatar = `https:/${SERVER_URL}/pictures/${
		conversation.userEmails && conversation.userEmails[0]
	}`;

	const setActiveContact = () => {
		dispatch({
			type: SET_CURRENT_CONV_USER_INFO,
			payload: {
				currentConvUserInfo: detail,
			},
		});
		createNewConv({
			variables: {
				email: conversation.userEmails && conversation.userEmails[0],
			},
		})
			.then((res) => {
				console.log(res, "createNewConv");
			})
			.catch((err) => {
				Emitter.emit("showMessage", {
					message: err.message,
					severity: "error",
				});
			});
	};

	useEffect(() => {
		const updateAndRenderMessage = (id) => {
			getLatestMessage({
				variables: {
					id,
				},
			})
				.then((res) => {
					if (res.data && res.data.getLatestMessage) {
						setLastMessage(res.data.getLatestMessage.content);
					}
				})
				.catch((err) => {
					Emitter.emit("showMessage", {
						message: err.message,
						severity: "error",
					});
				});
		};

		conversation._id && updateAndRenderMessage(conversation._id);

		const updateLatestMessage = (id) => {
			if (id !== conversation._id) return;
			updateAndRenderMessage(id);
		};
		Emitter.on("updateLatestMessage", updateLatestMessage);
		return () => {
			Emitter.off("updateLatestMessage", updateLatestMessage);
		};
	}, [conversation]);

	return (
		<ListItem
			alignItems="flex-start"
			component="div"
			disablePadding
			onClick={() => setActiveContact()}
		>
			<ListItemButton
				sx={{
					backgroundColor:
						(activeConversation.userEmails &&
							activeConversation.userEmails[0]) ===
							(conversation.userEmails &&
								conversation.userEmails[0]) && "#ccccd6",
					"&:hover": {
						backgroundColor: "#DDF2FF",
					},
				}}
			>
				<ListItemAvatar>
					<Avatar alt="Remy Sharp" src={avatar} />
				</ListItemAvatar>
				<Stack>
					<ListItem
						sx={{
							color: "#000",
							fontSize: "20px",
						}}
					>
						{detail.username1}
					</ListItem>
					<ListItem
						sx={{
							color: "#aaa",
							fontSize: "12px",
						}}
					>
						{latestMessage}
					</ListItem>
				</Stack>
			</ListItemButton>
		</ListItem>
	);
}
export default ContactListRow;
