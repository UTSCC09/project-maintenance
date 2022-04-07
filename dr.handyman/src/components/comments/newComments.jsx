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
import { ADD_NEW_COMMENT } from "../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import { H5, Medium } from "components/Typography";
import { getLocation } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { TRIGGER_MESSAGE } from "../../store/constants";

import { Box, Card, Divider, Button, Rating } from "@mui/material";
import { styled } from "@mui/material/styles";
import Emitter from "@/utils/eventEmitter";

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

const NewComment = ({ closeDialog, appointment = {} }) => {
	
	const dispatch = useDispatch();
	

	const [fetchAddComment] = useMutation(ADD_NEW_COMMENT);
	const userData = useSelector((state) => state.userData);
	const handleFormSubmit = (values) => {
		const { content, rate } = values;
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


		fetchAddComment({
			variables: {
				content,
				rating: +rate,
				appointmentId: appointment._id,
				workerEmail: appointment.workerEmail,

			},
		})
			.then((res) => {
				if (res.data.addComment) {
					Emitter.emit("showMessage", {
						message: "Success",
						severity: "success",
					});
					Emitter.emit("updateHistoryAppointment");
					closeDialog()
				}
			})
			.catch((err) => {
				Emitter.emit("showMessage", {
					message: err.message,
					severity: "error",
				});
			});
	};
	const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } =
		useFormik({
			initialValues: {
				content: "",
				rate: 0,
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
				<DialogTitle fontSize="25px">Make the Comment</DialogTitle>

				<TextField
					mt="20px"
					id="content"
					label="Content"
					multiline
					rows={5}
					fullWidth
					onBlur={handleBlur}
					onChange={handleChange}
					value={values.content || ""}
					error={!!touched.content && !!errors.content}
					helpertext={touched.content && errors.content}
				/>
				<Typography m={0.75} textAlign="center">
					{" "}
					Rating
				</Typography>
				<Rating
					color="warn"
					size="small"
					id="rate"
					precision={0.1}
					sx={{ mb: "0.75rem" }}
					onBlur={handleBlur}
					onChange={(e, newValue) => {
						setFieldValue('rate', newValue);
					}}
					value={values.rate || 0}
					error={!!touched.rate && !!errors.rate}
					helpertext={touched.rate && errors.rate}
				/>

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
					Submit the Comment
				</Button>
				<Button
					variant="contained"
					type="submit"
					fullWidth
					onClick={closeDialog}
					sx={{
						mb: "1.65rem",
						height: 44,
						bgcolor: "#FFAB92",
						"&:hover": {
							bgcolor: "#F20E0E",
						},
					}}
				>
					Cancel
				</Button>
			</form>
		</StyledCard>
	);
};
const formSchema = yup.object().shape({
	content: yup.string().required("post description is required"),

});
export default NewComment;
