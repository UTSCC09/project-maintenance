import React, { useState, useEffect, useRef } from "react";
import { Box, Container, TextField, Chip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_MESSAGE } from "@/GraphQL/Mutations";
import { GET_LATEST_MESSAGE } from "@/GraphQL/Queries";
import { useMutation, useLazyQuery, useSubscription } from "@apollo/client";
import Emitter from "@/utils/eventEmitter";
import { GET_CHAT_SUBSCRIBE } from "@/GraphQL/Subscribes";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

const convId2MsgList = {};

const ChatMessage = () => {
	const [messageContent, setMessageContent] = useState("");
	const [messageList, setMessageList] = useState([]);
	const [createNewMessage] = useMutation(CREATE_MESSAGE);
	const emojiRef = useRef(null);
	const messageAreaRef = useRef(null);
	const [emojiShow, setEmojiShow] = useState(false);
	const currentConvUserInfo = useSelector(
		(state) => state.currentConvUserInfo
	);

	useEffect(() => {
		setMessageList(convId2MsgList[conversation._id] || []);
		if (messageAreaRef.current) {
			setTimeout(() => {
				messageAreaRef.current.scrollTop =
					messageAreaRef.current.scrollHeight;
			});
		}
	}, [currentConvUserInfo]);

	useEffect(() => {
		window.addEventListener('click', (e) => {
			if (e.target !== emojiRef.current) {
				setEmojiShow(false);
			}
		}, false)
	}, [])

	const userData = useSelector((state) => state.userData);
	const conversation = currentConvUserInfo.conversation || {};
	useSubscription(GET_CHAT_SUBSCRIBE, {
		variables: {
			conversationId: conversation._id,
			count: 10,
		},
		onSubscriptionData: ({ client, subscriptionData }) => {
			const chatList =
				subscriptionData &&
				subscriptionData.data &&
				subscriptionData.data.getChat;
			console.log(chatList, 'chatList');
			convId2MsgList[conversation._id] = chatList || [];
			setMessageList(chatList);
			messageAreaRef.current.scrollTop =
				messageAreaRef.current.scrollHeight;
		},
	});
	const toggleShowEmoji = (e) => {
		e.stopPropagation();
		setEmojiShow(!emojiShow);
	};

	const addEmoji = (data) => {
		setMessageContent(pre => pre.concat(data.native))
		console.log("emoji", data);
		setEmojiShow(false);
	};
	const submitMsg = () => {
		createNewMessage({
			variables: {
				id: conversation._id,
				content: messageContent,
			},
		})
			.then((res) => {
				Emitter.emit("showMessage", {
					message: "Send Message Success",
					severity: "success",
				});
				Emitter.emit("updateLatestMessage", conversation._id);
				setMessageList((pre) =>
					pre.concat({
						content: messageContent,
						email: userData.email,
					})
				);
				setMessageContent("");
			})
			.catch((err) => {
				Emitter.emit("showMessage", {
					message: err.message,
					severity: "error",
				});
			});
	};

	useEffect(() => {
		// conversation._id && getLatestMessage({
		// 	variables: {
		// 		id: conversation._id
		// 	}
		// }).then(res => {
		// 	console.log(res);
		// }).catch(err => {
		// 	Emitter.emit("showMessage", {
		// 		message: err.message,
		// 		severity: "error",
		// 	});
		// })
	}, [conversation]);

	if (!currentConvUserInfo.conversation) return null;

	return (
		<Container
			sx={{
				position: "relative",
				padding: "0px!important",
			}}
		>
			<Container
				maxWidth="sm"
				sx={{
					width: "100vw",
					backgroundColor: "#dfe3e6",
					height: "700px",
					borderRadius: "10px",
					padding: "0px!important",
					overflow: "hidden",
				}}
			>
				<Box
					sx={{
						textAlign: "center",
						padding: "20px",
						backgroundColor: "#8abcd1",
						height: "50px",
						boxSizing: "border-box",
					}}
				>
					{currentConvUserInfo.username1}
				</Box>
				<Box
					sx={{
						width: "100%",
						height: "500px",
						backgroundColor: "#c6dfc8",
						overflowY: "auto",
						padding: "20px",
						boxSizing: "border-box",
					}}
					ref={messageAreaRef}
				>
					{messageList.map((item, index) => {
						return (
							<Box
								sx={{
									width: "100%",
									display: "flex",
									justifyContent:
										item.email === userData.email
											? "right"
											: "left",
								}}
								key={index}
							>
								<Box
									sx={{
										maxWidth: "300px",
										minWidth: "250px",
										padding: "10px",
										backgroundColor: "#ccccd6",
										minHeight: "30px",
										borderRadius: "10px",
										ml:
											item.email === userData.email
												? "10px"
												: "0",
										mr:
											item.email === userData.email
												? "10px"
												: "0",
										mt: "20px",
									}}
								>
									{item.content}
								</Box>
							</Box>
						);
					})}
				</Box>

				<Box
					sx={{
						width: "100%",
						minHeight: "150px",
						backgroundColor: "#ccc",
						position: "relative",
					}}
				>
					<TextField
						label="Message Input"
						placeholder="Input your message"
						multiline
						size="large"
						rows={5}
						value={messageContent}
						onChange={(e) => setMessageContent(e.target.value)}
						sx={{
							width: "100%",
							borderRadius: "10px",
						}}
					/>
					<Chip
						label="Submit"
						variant="outlined"
						color="primary"
						onClick={submitMsg}
						sx={{
							position: "absolute",
							right: "5px",
							bottom: "5px",
							zIndex: 100,
						}}
					></Chip>
					<EmojiEmotionsIcon
						sx={{
							position: "absolute",
							top: "-30px",
							left: "5px",
							cursor: "pointer",
							color: "#9ab4cd",
							fontSize: "26px",
							":hover": {
								color: "#ceb64a",
							},
						}}
						onClick={toggleShowEmoji}
					></EmojiEmotionsIcon>
				</Box>
			</Container>
			<Box
				sx={{
					position: "absolute",
					left: "5px",
					bottom: "-280px",
					zIndex: 100,
				}}
				onClick={e => e.stopPropagation()}
			>
				{emojiShow && <Picker onSelect={addEmoji} set="facebook" ref={emojiRef}/>}
			</Box>
		</Container>
	);
};

export default ChatMessage;
