import React, { useState } from "react";
import { Typography } from "@mui/material";

import FlexBox from "components/FlexBox";
import { H5, Medium } from "components/Typography";
import NewComment from "components/comments/newComments";
import Link from "next/link";
import EditAppointment from "./editAppointment";
import { Box, Card, Divider, Button, Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatTime, getUrlQuery } from "@/utils";
import { DEL_APPOINTMENT } from "@/GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
const StyledCard = styled(
	({
		children,

		...rest
	}) => <Card {...rest}>{children}</Card>
)(({}) => ({
	width: 600,

	".content": {
		textAlign: "center",
		padding: "3rem 3.75rem 0px",
	},
}));

const AppointmentInfo = ({ appointment, closeDialog, type }) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [displayType, setDisplayType] = useState("");
	const [displayNewComment, setNewComment] = useState("");
	const userData = useSelector((state) => state.userData);
	const toggleDialog = () => setDialogOpen(!dialogOpen);
	console.log('appointment', appointment);
	let user_email = appointment.userEmail;
	if (appointment.userEmail == userData.email) {
		user_email = appointment.workerEmail;
	}
	const [fetchDelAppointment] = useMutation(DEL_APPOINTMENT);

	const delAppointment = () => {
		//setShowDelBtnLoading(true);
		fetchDelAppointment({
			variables: {
				id: appointment._id,
			},
		})
			.then((res) => {
				Emitter.emit("updateMyAppointment");
				closeDialog();
				Emitter.emit("showMessage", {
					message: "Delete Appointment Success.",
					severity: "success",
				});
				//setShowDelBtnLoading(false);
			})
			.catch((err) => {
				Emitter.emit("showMessage", {
					message: err.message || "Delete Appointment Failed.",
					severity: "error",
				});
				//	setShowDelBtnLoading(false);
			});
	};
	return (
		<StyledCard elevation={3}>
			{displayType === "edit" ? (
				<EditAppointment
					appointment={appointment}
					closeDialog={closeDialog}
				></EditAppointment>
			) : (
				<form className="content">
					<H5 textAlign="center" mb={1} fontSize="18px">
						Appointment Information
					</H5>
					<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						Information: {appointment.description}
					</Medium>

					<Typography
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
					>
						With: {user_email}
					</Typography>
					<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						StartTime: {formatTime(appointment.startTime)}
					</Medium>
					<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						EndTime: {formatTime(appointment.endTime)}
					</Medium>

					{type !== "history" ? (
						<>
							{userData.email === appointment.workerEmail && (
								<Button
									variant="contained"
									type="submit"
									fullWidth
									onClick={() => setDisplayType("edit")}
									sx={{
										mb: "1.65rem",
										height: 44,
										bgcolor: "#4790E5",
										"&:hover": {
											bgcolor: "#146DA3",
										},
									}}
								>
									Edit Appointment
								</Button>
							)}
							<Button
								variant="contained"
								type="submit"
								fullWidth
								onClick={delAppointment}
								sx={{
									mb: "1.65rem",
									height: 44,
									bgcolor: "#FFAB92",
									"&:hover": {
										bgcolor: "#F20E0E",
									},
								}}
							>
								Cancel Appointment
							</Button>
						</>
					) : (
						<>
							{(userData.email !== appointment.workerEmail) && (!appointment.isCommented) && (
								<>
									<Button
										variant="contained"
										fullWidth
										onClick={toggleDialog}
										sx={{
											mb: "1.65rem",
											height: 44,
											bgcolor: "#4790E5",
											"&:hover": {
												bgcolor: "#146DA3",
											},
										}}
									>
										Make a Comment
									</Button>
									<Dialog
										open={dialogOpen}
										scroll="body"
										onClose={toggleDialog}
									>
										<NewComment
											appointment={appointment}
											closeDialog={() => {
												toggleDialog();
												closeDialog();
											}}
										></NewComment>
									</Dialog>
								</> )}
                {/* {appointment.isCommented === true && (
								<>
									<Button
										variant="contained"
										fullWidth
										onClick={toggleDialog}
										sx={{
											mb: "1.65rem",
											height: 44,
											bgcolor: "#4790E5",
											"&:hover": {
												bgcolor: "#146DA3",
											},
										}}
									>
										View Comment
									</Button>
									<Dialog
										open={dialogOpen}
										scroll="body"
										onClose={toggleDialog}
									>
										<MyCommentInfo
											appointment={appointment}
											closeDialog={toggleDialog}
										></MyCommentInfo>
									</Dialog>
								</>
							)} */}
						</>
					)}

					<Box mb={2}>
						<FlexBox justifyContent="center" mt={-1.625}>
							<Box color="#AEB4BE" bgcolor="#F6F9FC" px={2}></Box>
						</FlexBox>
					</Box>
				</form>
			)}
		</StyledCard>
	);
};

export default AppointmentInfo;
