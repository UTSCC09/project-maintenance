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
import { EDIT_COMMENT } from "@/GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { CANCEL_ACCEPT } from "@/GraphQL/Mutations";

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

const EditComment = ({ closeDialog, comment = {} }) => {
	const [editComment] = useMutation(EDIT_COMMENT);
	const userData = useSelector(state => state.userData);
	const handleFormSubmit = async (values) => {
		const { description: content, rating } = values;
		if (!userData.isLogin) {
			Emitter.emit("showMessage", {
				message: "Please login first.",
				severity: "error",
			});
		}
		editComment({
			variables: {
				id: comment._id,
				rating,
				content
			},
		})
			.then((res) => {
				if (res.data && res.data.editComment) {
					Emitter.emit("showMessage", {
						message: "Edit post success.",
						severity: "success",
					});
					Emitter.emit("updateCommentList");
					closeDialog();
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
				description: comment.content || "",
				rating: comment.rating
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
				<DialogTitle fontSize="25px">Edit Comment</DialogTitle>

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
				/>
				<Typography m={0.75} textAlign="center">
					{" "}
					Rating
				</Typography>

				<Rating
					color="warn"
					size="small"
					id="rating"
					precision={0.1}
					sx={{ mb: "0.75rem" }}
					onBlur={handleBlur}
					onChange={(e, newValue) => {
						setFieldValue('rating', newValue);
					}}
					value={values.rating || 0}
					error={!!touched.rating && !!errors.rating}
					helpertext={touched.rating && errors.rating}
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
					Submit the Changes
				</Button>
				<Button
					variant="contained"
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
	// title: yup.string().required("title is required"),
	description: yup.string().required("post description is required"),
	// type: yup.string().required("type is required"),
	//type 必选验证 to be done
});
export default EditComment;
