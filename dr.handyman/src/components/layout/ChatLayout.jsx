import { Container, Grid } from "@mui/material";
import React from "react";
import ContactListRow from "../chat/ContactListRow";
import ProfileDashboardNavigation from "../profile/ProfileDashboardNav";
import ContactList from "../chat/ContactList";
import ContractMessage from "../chat/ChatMessage";
const ChatLayout = ({ children }) => (
	<Container
	maxWidth={false}
		sx={{
			my: "40px",
			ml: "100px",
		}}
	>
		<Grid container spacing={3}>
			<Grid
				item
				sx={{
					display: {
						xs: "4",
						sm: "none",
						md: "block",
					},
				}}
			>
				<ContactList />
			</Grid>
			<Grid
				item
				sx={{
					display: {
						xs: "4",
						sm: "none",
						md: "block",
					},
				}}
			>
				<ContractMessage></ContractMessage>
			</Grid>
			<Grid
				item
				sx={{
					display: {
						xs: "12",
						sm: "none",
						md: "block",
					},
				}}
			>
			</Grid>
		</Grid>
	</Container>
);

export default ChatLayout;
