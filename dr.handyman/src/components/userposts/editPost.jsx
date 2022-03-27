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
import { SET_POST } from "@/GraphQL/Mutations";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from 'react-redux'
import { CANCEL_ACCEPT } from "@/GraphQL/Mutations";


import { Box, Card, Divider, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Emitter from '@/utils/eventEmitter';

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

const EditPost = ({ closeDialog, post = {} }) => {
	const [editPost] = useMutation(SET_POST);
	const userData = useSelector(state => state.userData);
	const handleFormSubmit = async (values) => {
    const { title, description: content } = values;
		if (!userData.isLogin) {
      Emitter.emit('showMessage', {
        message: "Please login first.",
        severity: "error"
      })
		}
    editPost({
      variables: {
        id: post._id,
        title,
        content
      },
    }).then((res) => {
      if (res.data && res.data.setPost) {
        Emitter.emit('updatePostInfo')
        Emitter.emit('updateMyPosts')
        Emitter.emit('showMessage', {
          message: "Edit post success.",
          severity: "success"
        })
        closeDialog()
      }
    }).catch((err) => {
      Emitter.emit('showMessage', {
        message: err.message,
        severity: "error"
      })
    });
  }
	const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
		useFormik({
			initialValues: {
        title: post.title || "",
				description: post.content || "",
				// type: post.type || null,
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
				{/* <FormControl mt="10px" mb="10px">
					<FormLabel id="type">Post Type</FormLabel>
					<RadioGroup
						row
						aria-labelledby="demo-row-radio-buttons-group-label"
						name="type"
						onChange={handleChange}
            defaultValue={post.type}
					>
						<FormControlLabel
							disabled={userData.type === 'user'}
							value={1}
							control={<Radio />}
							label="Find a Contractor"
						/>
						<FormControlLabel
							value={0}
							control={<Radio />}
							label="Find a Handyman"
						/>

					</RadioGroup>
				</FormControl> */}
 
				
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
	title: yup.string().required("title is required"),
	description: yup.string().required("post description is required"),
    // type: yup.string().required("type is required"),
	//type 必选验证 to be done
});
export default EditPost;
