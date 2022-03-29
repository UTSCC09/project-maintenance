import AppLayout from "components/layout/AppLayout";
import ContactList from "../src/components/chat/ContactList";
import ChatLayout from "components/layout/ChatLayout";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContactListHeader from "../src/components/chat/ContactListHeader";
import ContactListLayout from "components/layout/ContactListLayout";
import {
	Avatar,
	Button,
	Box,
	IconButton,
	Card,
	Grid,
	Typography,
	Container,
} from "@mui/material";


const ChatPage = (props) => {
	return (
		<AppLayout>
			<ChatLayout>
				
			</ChatLayout>
		</AppLayout>
	);
};

export default ChatPage;
