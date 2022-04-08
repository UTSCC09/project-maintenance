import React, { useState } from "react";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import * as yup from "yup";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FlexBox from "components/FlexBox";
import { ADD_NEW_APPOINTMENT } from "@/GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import { H5, Medium } from "components/Typography";
import { getLocation } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { TRIGGER_MESSAGE } from "../../store/constants";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { Box, Card, Divider, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Emitter from "@/utils/eventEmitter";
import DesktopDateRangePicker from "@mui/lab/DesktopDateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

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

const NewAppointment = ({ setDialog, appointment = {} }) => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.userData);
	const [fetchAddAppointment] = useMutation(ADD_NEW_APPOINTMENT);
	const [dateRange0, setDateRange0] = useState(null);
	const [dateRange1, setDateRange1] = useState(null);
	const handleFormSubmit = async (values) => {
		const { userEmail, description } = values;
		if (!userData.isLogin) {
			return dispatch({
				type: TRIGGER_MESSAGE,
				payload: {
					globalMessage: {
						message: "Please login first.",
						severity: "error",
					},
				},
			});
		}

		if (!dateRange0) {
			return dispatch({
				type: TRIGGER_MESSAGE,
				payload: {
					globalMessage: {
						message: "Please select time.",
						severity: "error",
					},
				},
			});
		}
		if (!dateRange1) {
			return dispatch({
				type: TRIGGER_MESSAGE,
				payload: {
					globalMessage: {
						message: "Please select time.",
						severity: "error",
					},
				},
			});
		}

	

		fetchAddAppointment({
			variables: {
				description,
				userEmail,
				startTime: dateRange0.getTime(),
				endTime: dateRange1.getTime(),
			
			},
		})
			.then((res) => {
				if (res.data.addAppointment) {
					Emitter.emit("updateHistoryAppointment");
					Emitter.emit("updateUpcomingAppointment");
					Emitter.emit("showMessage", {
						message: "Success",
						severity: "success",
					});
					setDialog(false);
				}
			})
			.catch((err) => {
				Emitter.emit("showMessage", {
					message: err.message,
					severity: "error",
				});
			});
	
	};
	const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
		useFormik({
			initialValues: {
				userEmail: appointment.userEmail || "",
				description: appointment.content || "",
			},
			onSubmit: handleFormSubmit,
			validationSchema: formSchema,
		});
	return (
		<StyledCard
			elevation={3}
			sx={{
				"& .MuiTextField-root": { m: 2 },
			}}
		>
			<form className="content" onSubmit={handleSubmit}>
				<DialogTitle fontSize="25px">New Appointment</DialogTitle>
				<TextField
					mt="20px"
					id="userEmail"
					label="User Email"
					multiline
					rows={1}
					fullWidth
					onBlur={handleBlur}
					onChange={handleChange}
					value={values.userEmail}
					onKeyDown={(e)=>{
						e.stopPropagation();
					}}
					error={!!touched.userEmail && !!errors.userEmail}
					helperText={touched.userEmail && errors.userEmail}
				/>
				<TextField
					mt="20px"
					id="description"
					label="Description"
					multiline
					rows={5}
					fullWidth
					onBlur={handleBlur}
					onChange={handleChange}
					value={values.description || ""}
					error={!!touched.description && !!errors.description}
					helperText={touched.description && errors.description}
					onKeyDown={(e)=>{
						e.stopPropagation();
					}}
				/>

				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DateTimePicker
						label="Appointment start"
						value={dateRange0}
						onChange={(newValue) => {
							setDateRange0(newValue);
						}}
						renderInput={(startProps) => (
							<TextField {...startProps} />
						)}
					/>
				</LocalizationProvider>
				<Box sx={{ mx: 2 }}> to </Box>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DateTimePicker
						label="Appointment End"
						value={dateRange1}
						onChange={(newValue) => {
							setDateRange1(newValue);
						}}
						renderInput={(endProps) => <TextField {...endProps} />}
					/>
				</LocalizationProvider>
			

				<Button
					variant="contained"
					type="submit"
					fullWidth
					sx={{
						mb: "1.65rem",
						height: 44,
						bgcolor: "#4790E5",
						"&:hover": {
							bgcolor: "#146DA3",
						},
						mt: "20px",
					}}
				>
					Submit the Appointment
				</Button>
				
			</form>
		</StyledCard>
	);
};
const formSchema = yup.object().shape({
	userEmail: yup.string().email().required("User email is required"),

	description: yup.string().required("Appointment description is required"),

});
export default NewAppointment;
