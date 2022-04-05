import Row from "components/PostRow";
import { H5 } from "components/Typography";
import FlexBox from "components/FlexBox";
import { Chip, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import Link from "next/link";
import AppointmentInfo from "./AppointmentInfo";
import {
	Container,
	Dialog,
	Drawer,
	styled,
	useMediaQuery,
} from "@mui/material";
import East from "@mui/icons-material/East";
import React, { useState } from "react";
import { formatTime, getUrlQuery } from "@/utils";



const Appointment = ({ appointment, type} ) => {
	const [dialogOpen, setDialogOpen] = useState(false);
  const userData = useSelector((state) => state.userData);
  console.log(appointment)
  let user_email = appointment.userEmail;
  if (appointment.userEmail == userData.email){
       user_email = appointment.workerEmail;
  }
	const toggleDialog = () => setDialogOpen(!dialogOpen);
	let short_content = appointment.description || '';
	if (short_content.length >= 20) {
		short_content = short_content.substring(0, 20) + "...";
	}
	return (
		<Row
			sx={{
				my: "1rem",
				padding: "6px 18px",
				bgcolor: "#F7E1A9",
				"&:hover": {
					bgcolor: "#F3B356",
				},
			}}
		>
			<H5 m={0.75} textAlign="left">
				{short_content}
			</H5>

			<Typography m={0.75} textAlign="left">
				{user_email}
			</Typography>

			<Typography className="pre" m={0.75} textAlign="left">
				{formatTime(appointment.startTime)}
			</Typography>

			<Typography
				textAlign="center"
				color="grey.600"
				sx={{
					flex: "0 0 0 !important",
					display: {
						xs: "none",
						md: "block",
					},
				}}
			>
				<Box
					component={IconButton}
					ml={2}
					p={1.25}
					bgcolor="#F7E1A9"
					onClick={toggleDialog}
				>
					<East />
				</Box>
				<Dialog open={dialogOpen} scroll="body" onClose={toggleDialog}>
					<AppointmentInfo appointment={appointment} type = {type} closeDialog={toggleDialog} />
				</Dialog>
			</Typography>
		</Row>
	);
};

export default Appointment;
