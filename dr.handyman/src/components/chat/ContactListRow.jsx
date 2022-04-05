import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { borderColor, display } from "@mui/system";
import ListItemButton from "@mui/material/ListItemButton";
import { FixedSizeList } from "react-window";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { Stack, Grid } from "@mui/material";
import { SET_CURRENT_CONV_USER_INFO } from "@/store/constants";
import { GET_LATEST_MESSAGE } from "@/GraphQL/Queries";
import { useMutation, useLazyQuery, useSubscription } from "@apollo/client";
import Emitter from "@/utils/eventEmitter";
import { IMAGE_URL } from "@/constant.js";
import { getUrlQuery, formatTime } from "@/utils";
import { useRouter } from "next/router";
import { Span } from "../Typography";

function ContactListRow({ detail, setLastMessageTimeFromChild }) {
	const router = useRouter();
	const currentConvUserInfo = useSelector(
		(state) => state.currentConvUserInfo
	);
	const activeConversation = currentConvUserInfo.conversation || {};
	const [getLatestMessage] = useLazyQuery(GET_LATEST_MESSAGE);
	const dispatch = useDispatch();
	const { conversation = {} } = detail;
	const [targetConversation, setTargetConversation] = useState("");
	const [latestMessage, setLastMessage] = useState("");
	const [latestMessageTime, setLastMessageTime] = useState("");
	const avatar = `${IMAGE_URL}/${
		conversation.userEmails && conversation.userEmails[0]
	}`;

	const setActiveContact = () => {
		dispatch({
			type: SET_CURRENT_CONV_USER_INFO,
			payload: {
				currentConvUserInfo: detail,
			},
		});
	};

	const userData = useSelector((state) => state.userData);
	let user_send = detail.username2;
	if (userData.username == detail.username2) {
		user_send = detail.username1;
	}

	let shortMessage = latestMessage;
	if (latestMessage.length >= 25) {
		shortMessage = latestMessage.substring(0, 25) + "...";
	}

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
						setLastMessageTime(
							formatTime(res.data.getLatestMessage.createdAt)
						);
						setLastMessageTimeFromChild &&
							setLastMessageTimeFromChild(
								res.data.getLatestMessage.createdAt
							);
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

		const urlQuery = getUrlQuery();
		const targetEmail = router.query.email || urlQuery.email;
		if (
			targetEmail ===
			(conversation.userEmails && conversation.userEmails[0])
		) {
			setActiveContact();
		}

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
						activeConversation._id === conversation._id &&
						"#DDF2FF",
					"&:hover": {
						backgroundColor: "#DDF2FF",
					},
				}}
			>
				<ListItemAvatar>
					<Avatar alt={user_send} src={avatar} />
				</ListItemAvatar>
				<Stack>
					<ListItem
						sx={{
							color: "#000",
							fontSize: "20px",
						}}
					>
						{user_send}
					</ListItem>
					<ListItem>
						<Span
							width="100%"
							sx={{
								color: "#aaa",
								fontSize: "16px",
								display: "inline-block",
								width: "240px",
								textOverflow: "ellipsis",
								overflow: "hidden",
							}}
						>
							{shortMessage}
						</Span>
					</ListItem>
					<Span
						ml="135px"
						sx={{
							color: "#aaaa",
							fontSize: "12px",
						}}
					>
						{latestMessageTime}
					</Span>
				</Stack>
			</ListItemButton>
		</ListItem>
	);
}
export default ContactListRow;
