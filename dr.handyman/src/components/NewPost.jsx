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
import { CREATE_POST_MUTATION } from "../GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import { H5, Medium } from "components/Typography";
import { getLocation } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { TRIGGER_MESSAGE } from "../store/constants";

import { Box, Card, Divider, Button } from "@mui/material";
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

const NewPost = ({ setDialog, post = {} }) => {
	const [sendPost] = useMutation(CREATE_POST_MUTATION);
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.userData);
	const handleFormSubmit = async (values) => {
		if (!userData.isLogin) {
			dispatch({
				type: TRIGGER_MESSAGE,
				payload: {
					globalMessage: {
						message: "Please login first.",
						severity: "error",
					},
				},
			});
		}
		getLocation()
			.then((res) => {
				const coords = res.coords;
				const { title, description: content, type } = values;
				sendPost({
					variables: {
						title,
						type: +type,
						content,
						coordinates: [coords.longitude, coords.latitude],
					},
				})
					.then((res) => {
						if (
							res.data &&
							res.data.addPost &&
							res.data.addPost._id
						) {
							Emitter.emit("updatePostInfo");
							Emitter.emit("updateMyPosts");
							dispatch({
								type: TRIGGER_MESSAGE,
								payload: {
									globalMessage: {
										message: "Add new post success.",
										severity: "success",
									},
								},
							});
							setDialog(false);
						}
					})
					.catch(() => {
						dispatch({
							type: TRIGGER_MESSAGE,
							payload: {
								globalMessage: {
									message: "Add new post failed.",
									severity: "error",
								},
							},
						});
					});
			})
			.catch(() => {
				dispatch({
					type: TRIGGER_MESSAGE,
					payload: {
						globalMessage: {
							message: "Get location failed.",
							severity: "error",
						},
					},
				});
			});
	};
	const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
		useFormik({
			initialValues: {
				title: post.title || "",
				description: post.content || "",
				type: post.type || null,
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
				<DialogTitle fontSize="25px">New Post</DialogTitle>

				<TextField
					autoFocus
					margin="dense"
					id="title"
					label="Title"
					type="content"
					fullWidth
					variant="standard"
					onBlur={handleBlur}
					onChange={handleChange}
					value={values.title || ""}
					error={!!touched.title && !!errors.title}
					helperText={touched.title && errors.title}
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
				/>
				<FormControl mt="10px" mb="10px">
					<FormLabel id="type">Post Type</FormLabel>
					<RadioGroup
						row
						aria-labelledby="demo-row-radio-buttons-group-label"
						name="type"
						onChange={handleChange}
					>
						<FormControlLabel
							disabled={userData.type === "user"}
							value={1}
							control={<Radio />}
							label="Find a Contractor"
						/>
						<FormControlLabel
							value={0}
							control={<Radio />}
							label="Find a Handyman"
						/>

						{/* to be done 设置disable radio， 只有修理工可以发布find contractor post <FormControlLabel
          value="disabled"
          disabled
          control={<Radio />}
          label="other"
        /> */}
					</RadioGroup>
				</FormControl>

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
					Submit the Post
				</Button>
				<Button
					variant="contained"
					type="submit"
					fullWidth
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
	title: yup.string().required("title is required"),
	description: yup.string().required("post description is required"),
	type: yup.string().required("type is required"),
	//type 必选验证 to be done
});
export default NewPost;
