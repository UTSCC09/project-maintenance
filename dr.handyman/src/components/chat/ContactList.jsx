import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { borderColor } from "@mui/system";
import ListItemButton from "@mui/material/ListItemButton";
import { FixedSizeList } from "react-window";
import ContactListHeader from "./ContactListHeader";
import Link from "next/link";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContactListLayout from "../layout/ContactListLayout";

import { GET_CURRENT_CONVOS_DES } from "/src/GraphQL/Queries";
import { useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import ContactListRow from "./ContactListRow.jsx";
import { useRouter } from "next/router";


export default function ContactList() {
	const router = useRouter();
	const [getConvos, { loading, data, error }] =
		useLazyQuery(GET_CURRENT_CONVOS_DES);
	let [convosList, setConvosList] = useState([])
	


	useEffect(() => {
		getConvos().then(res => {
			if (res.data) {
				let convos = (res.data.getCurrentConvosWithDescription || []).slice();
				convos.sort((a, b) =>  +b.time - +a.time);
				setConvosList(convos);
			}
		});
		
	}, []);
	if (loading || data == undefined) {
		return <div>Loading...</div>;
	}

	const setLastMessageTimeFromChild = (time, id) => {
		const index = convosList.findIndex(item => item.conversation && item.conversation._id === id)
		convosList[index] = Object.assign({}, convosList[index], { time });
		const beforeSortItemsStr = convosList.map(item => item.conversation._id).join(',');
		convosList.sort((a, b) =>  +b.time - +a.time);
		const afterSortItemsStr = convosList.map(item => item.conversation._id).join(',');
		(beforeSortItemsStr !== afterSortItemsStr) && setConvosList(convosList.slice());
	}

	return (
		<ContactListLayout>
			<Box sx={{ width: "100%", maxWidth: 360, color: "grey" }}>
				<ContactListHeader
					title="Contact List"
					button={
						<Link href="/profile">
							<ArrowBackIcon
								sx={{
									borderRadius: "20px",
									mr: "20px",
								}}
							/>
						</Link>
					}
				/>

				<Divider sx={{ my: 0.5 }} />
				<List
					sx={{
						maxHeight: "350px",
						overflow: "auto",

						width: 360,
					}}
				>
					{convosList?.map((item, index) => (
						<ContactListRow detail={item} key={(item.conversation && item.conversation._id) || index} setLastMessageTimeFromChild={(time) => setLastMessageTimeFromChild(time, item.conversation && item.conversation._id)}/>
					))}
					
				</List>
			</Box>
		</ContactListLayout>
	);
}