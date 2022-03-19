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
import React from "react";
import * as yup from "yup";
import AppLayout from "components/layout/AppLayout";
import { SET_USER } from "../../src/GraphQL/Mutations";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";
import { TRIGGER_MESSAGE, UPDATE_USER_DATA } from "../../src/store/constants";
import { useRouter } from 'next/router'
import { GET_USER_DATA } from '../../src/GraphQL/Queries'

const ProfileEdit = () => {
	const [modifyUser] = useMutation(SET_USER);
	const userData = useSelector((state) => state.userData);
	const dispatch = useDispatch();
  const router = useRouter();
  const [fetchUserData] = useLazyQuery(GET_USER_DATA)

	const handleSubmit = (values) => {
		const { username, phone, email } = values;
		modifyUser({
			variables: {
				user: {
					type: userData.type,
					phone,
					rating: userData.rating,
					permissions: userData.permissions,
				},
			},
		})
			.then(() => {
				dispatch({
					type: TRIGGER_MESSAGE,
					payload: {
						globalMessage: {
							message: `Update Success.`,
							severity: "success",
						},
					},
				});
        fetchUserData().then((res) => {
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
        }).catch(() => {
          console.log('Not Login!')
        });
        router.push('/profile')
			})
			.catch((err) => {
				console.log(err);
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
	};

	const formik = useFormik({
		initialValues: {
			username: "",
			email: "",
			phone: null,
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
							src="/assets/u1.png"
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
								onChange={(e) => console.log(e.target.files)}
								id="profile-image"
								accept="image/*"
								type="file"
							/>
						</Box>
					</FlexBox>
					<form onSubmit={formik.handleSubmit}>
						<Box mb={4}>
							<Grid container spacing={3}>
								{/* <Grid item md={6} xs={12}>
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
								</Grid> */}
								{/* <Grid item md={6} xs={12}>
											<TextField
												name="last_name"
												label="Last Name"
												fullWidth
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.last_name || ""}
												error={
													!!touched.last_name &&
													!!errors.last_name
												}
												helperText={
													touched.last_name &&
													errors.last_name
												}
											/>
										</Grid> */}
								{/* <Grid item md={6} xs={12}>
									<TextField
										name="email"
										type="email"
										label="Email"
										fullWidth
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										value={formik.values.email || ""}
										error={
											!!formik.touched.email &&
											!!formik.errors.email
										}
										helperText={
											formik.touched.email &&
											formik.errors.email
										}
									/>
								</Grid> */}
								<Grid item md={6} xs={12}>
									<TextField
										name="phone"
										label="Phone"
                    type="number"
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
								{/* <Grid item md={6} xs={12}>
											<LocalizationProvider
												dateAdapter={AdapterDateFns}
											>
												<DateTimePicker
													label="Birth Date"
													value={values.birth_date}
													maxDate={new Date()}
													inputFormat="dd MMMM, yyyy"
													shouldDisableTime={() =>
														false
													}
													renderInput={(props) => (
														<TextField
															size="small"
															fullWidth
															{...props}
															error={
																(!!touched.birth_date &&
																	!!errors.birth_date) ||
																props.error
															}
															helperText={
																touched.birth_date &&
																errors.birth_date
															}
														/>
													)}
													onChange={(newValue) =>
														setFieldValue(
															"birth_date",
															newValue
														)
													}
												/>
											</LocalizationProvider>
										</Grid> */}
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

const initialValues = {
	// username: "",
	// last_name: "",
	// email: "",
	phone: "",
	// birth_date: new Date(),
};
const phoneRegEx = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

const checkoutSchema = yup.object().shape({
	// username: yup.string().required("required"),
	// last_name: yup.string().required("required"),
	// email: yup.string().email("invalid email").required("required"),
	phone: yup.string().matches(phoneRegEx, 'Phone number is not valid').required("${path} is required"),
	// birth_date: yup.date().required("invalid date"),
});
export default ProfileEdit;
