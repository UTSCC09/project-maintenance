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

// function renderMessageRow(props) {
//   const { key, style, item} = props;
//   // const [getConvos, { loading, data, error }] = useLazyQuery(GET_CURRENT_CONVOS_DES);

//   // //const [convos, setConvos] = useState([]);

//   // useEffect(() => {
// 	// 		getConvos();
// 	// 			//setConvos(res.data.getCurrentConvos[0].userEmails[0])

//   // }, []);
//   // if (loading || data == undefined) {
//   //   return <div>Loading...</div>
//   // }
//   // console.log(data.getCurrentConvos);
//   // //setConvos(data.getCurrentConvos)

//   return (
//     <ListItem style={style} key={key} alignItems="flex-start" component="div"   disablePadding >
//       <ListItemButton divider sx={{
//           mt:'10px',
//                     height:'90px',

//                 }}>

//       <ListItemAvatar>
//           <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
//         </ListItemAvatar>

//         <ListItemText
//           primary={item.userEmails[0]}
//           secondary={
//             <React.Fragment>

//               I'll be in your neighborhood doing errands this…
//               <Typography
//               sx={{ display: 'inline'}}
//               component="span"
//               variant="overline"
//               color="text.primary"
//             >
//               2022-03-11
//             </Typography>

//             </React.Fragment>

//           }
//         />

//       </ListItemButton>

//     </ListItem>

//   );
// }

export default function ContactList() {
	const [getConvos, { loading, data, error }] =
		useLazyQuery(GET_CURRENT_CONVOS_DES);

	//const [convos, setConvos] = useState([]);

	useEffect(() => {
		getConvos();
		//setConvos(res.data.getCurrentConvos[0].userEmails[0])
	}, []);
	if (loading || data == undefined) {
		return <div>Loading...</div>;
	}

	console.log('data', data)
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
					{data.getCurrentConvosWithDescription?.map((item, index) => (
						<ContactListRow detail={item} key={index}/>
					))}
					{/* {fakeList.map((item, index) => (
        <ContactListRow contact={item} key={index}/>
        ))} */}
				</List>
			</Box>
		</ContactListLayout>
	);
}

const fakeList = [
	{ userEmails: ["u1email", "u2email"], _typename: "mesage", _id: "id" },
	{ userEmails: ["u1email", "u2email"], _typename: "mesage", _id: "id" },
	{ userEmails: ["u1email", "u2email"], _typename: "mesage", _id: "id" },
	{ userEmails: ["u1email", "u2email"], _typename: "mesage", _id: "id" },
	{ userEmails: ["u1email", "u2email"], _typename: "mesage", _id: "id" },
	{ userEmails: ["u1email", "u2email"], _typename: "mesage", _id: "id" },
	{ userEmails: ["u1email", "u2email"], _typename: "mesage", _id: "id" },
	{ userEmails: ["u1email", "u2email"], _typename: "mesage", _id: "id" },
];
