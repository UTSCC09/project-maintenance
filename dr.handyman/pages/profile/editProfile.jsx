import { Avatar, Button, Card, Grid, Typography } from "@mui/material";
import FlexBox from "components/FlexBox";
import ProfileDashboardLayout from "components/layout/ProfileDashboardLayout";
import DashboardPageHeader from "components/profile/ProfileDashboardHeader";
import ProfileDashboardNavigation from "components/profile/ProfileDashboardNav";
import CameraEnhance from "@mui/icons-material/CameraEnhance";
import Person from "@mui/icons-material/Person";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { Formik, useFormik } from "formik";
import Link from "next/link";
import React, { useState } from "react";
import * as yup from "yup";
import AppLayout from "components/layout/AppLayout";
import { SET_USER } from "../../src/GraphQL/Mutations";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";
import { TRIGGER_MESSAGE, UPDATE_USER_DATA } from "../../src/store/constants";
import { useRouter } from "next/router";
import { GET_USER_DATA } from "../../src/GraphQL/Queries";
import Emitter from "@/utils/eventEmitter";
import axios from "axios";
import { IMAGE_URL, SERVER_URL } from '/src/constant.js'

const ProfileEdit = () => {
	const [modifyUser] = useMutation(SET_USER);
	const userData = useSelector((state) => state.userData);
	const dispatch = useDispatch();
	const router = useRouter();
	const [fetchUserData] = useLazyQuery(GET_USER_DATA);
	const [waitForUserProfileAvatarFile, setWaitForUserProfileAvatarFile] =
		useState(null);

	let userProfileImage = `${IMAGE_URL}/${userData.email}`;
	
	if (waitForUserProfileAvatarFile) {
		userProfileImage = window.URL.createObjectURL(
			waitForUserProfileAvatarFile
		);
	}

	const uploadAvatar = () => {
		const formData = new FormData();
		formData.append(
			"operations",
			JSON.stringify({
				query: "mutation Mutation($file: Upload!){ profilePicUpload(file: $file)}",
			})
		);
		formData.append("map", JSON.stringify({ 0: ["variables.file"] }));
		formData.append("0", waitForUserProfileAvatarFile);

		return axios({
			url: `https://${SERVER_URL}/graphql`,
			method: "POST",
			withCredentials: true,
			data: formData,
		})
			.then((res) => {
				if (
					res.data &&
					res.data.data &&
					res.data.data.profilePicUpload
				) {
					Emitter.emit("showMessage", {
						message: "upload successfully",
						severity: "success",
					});
				}
			})
			.catch((err) => {
				Emitter.emit("showMessage", {
					message: err.message,
					severity: "error",
				});
			});
	};

	const handleSubmit = (values) => {
		const { username, phone, email } = values;
		uploadAvatar().then(() => {
			modifyUser({
				variables: {
					phone,
					username,
				},
			})
				.then(() => {
					dispatch({
						type: TRIGGER_MESSAGE,
						payload: {
							globalMessage: {
								message: `Update Successfully.`,
								severity: "success",
							},
						},
					});
					fetchUserData()
						.then((res) => {
							if (res.data && res.data.currentUser) {
								dispatch({
									type: UPDATE_USER_DATA,
									payload: {
										userData: {
											...res.data.currentUser,
											isLogin: true,
										},
									},
								});
							}
						})
						.catch(() => {
							Emitter.emit("showMessage", {
								message: err.message,
								severity: "error",
							});
						});
					router.push("/profile");
				})
				.catch((err) => {
					
					dispatch({
						type: TRIGGER_MESSAGE,
						payload: {
							globalMessage: {
								message: `Update Failed.`,
								severity: "error",
							},
						},
					});
				});
		});
	};

	const formik = useFormik({
		initialValues: {
			username: userData.username || "",
			email: userData.email || "",
			phone: userData.phone || "",
		},
		validationSchema: checkoutSchema,
		onSubmit: handleSubmit,
	});

	return (
		<AppLayout>
			<ProfileDashboardLayout>
				<DashboardPageHeader
					icon={Person}
					title="Edit Profile"
					button={
						<Link href="/profile">
							<Button
								sx={{
									px: "2rem",
									bgcolor: "#FFF1D2",
									color: "#6D6D6D",
								}}
							>
								Cancel
							</Button>
						</Link>
					}
					navigation={<ProfileDashboardNavigation />}
				/>

				<Card sx={{ p: 4, bgcolor: "#FFF9EC" }}>
					<FlexBox alignItems="flex-end" mb={3}>
						<Avatar
							src={userProfileImage}
							sx={{
								height: 64,
								width: 64,
								bgcolor: "#FFFFFF",
							}}
						/>

						<Box ml={-2}>
							<label htmlFor="profile-image">
								<Button
									component="span"
									color="secondary"
									sx={{
										bgcolor: "#ECE8DF",
										height: "auto",
										p: "3px",
										borderRadius: "100%",
									}}
								>
									<CameraEnhance fontSize="small" />
								</Button>
							</label>
						</Box>
						<Box display="none">
							<input
								onChange={(e) =>
									setWaitForUserProfileAvatarFile(
										e.target.files[0]
									)
								}
								id="profile-image"
								accept="image/*"
								type="file"
							/>
						</Box>
					</FlexBox>
					<form onSubmit={formik.handleSubmit}>
						<Box mb={4}>
							<Grid container spacing={3}>
								<Grid item md={6} xs={12}>
									<TextField
										name="username"
										label="Name"
										fullWidth
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										value={formik.values.username || ""}
										error={
											!!formik.touched.username &&
											!!formik.errors.username
										}
										helperText={
											formik.touched.username &&
											formik.errors.username
										}
									/>
								</Grid>

							
								<Grid item md={6} xs={12}>
									<TextField
										name="phone"
										label="Phone"
										fullWidth
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										value={formik.values.phone || ""}
										error={
											!!formik.touched.phone &&
											!!formik.errors.phone
										}
										helperText={
											formik.touched.phone &&
											formik.errors.phone
										}
									/>
								</Grid>
							
							</Grid>
						</Box>

						<Button
							type="submit"
							variant="contained"
							sx={{
								bgcolor: "#F7D794",
								color: "#797979",
								"&:hover": {
									bgcolor: "#ECB25D",
								},
							}}
						>
							Save Changes
						</Button>
					</form>
				</Card>
			</ProfileDashboardLayout>
		</AppLayout>
	);
};

const phoneRegEx = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

const checkoutSchema = yup.object().shape({
	username: yup.string().required("required"),	
	phone: yup
		.string()
		.matches(phoneRegEx, "Phone number is not valid")
		.required("${path} is required"),
	
});
export default ProfileEdit;
