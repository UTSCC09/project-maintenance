import React, { useCallback, useState } from "react";

import { CREATE_USER_MUTATION } from "../../GraphQL/Mutations";
import { useMutation } from "@apollo/client";

import TextField from "components/AppTextField";
import FlexBox from "components/FlexBox";
import { H3, H6, Small } from "components/Typography";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import * as yup from "yup";
import { useSelector } from "react-redux";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, Card, Divider, IconButton, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { UPDATE_USER_DATA } from "../../store/constants";
import Emitter from '@/utils/eventEmitter';

const StyledCard = styled(({ children, passwordVisibility, ...rest }) => (
	<Card {...rest}>{children}</Card>
))(({ passwordVisibility }) => ({
	width: 500,

	".content": {
		textAlign: "center",
		padding: "3rem 3.75rem 0px",
	},
	".passwordEye": {
		color: passwordVisibility ? "#AEB4BE" : "#DAE1E7",
	},
}));

const Login = () => {
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();
	const socket = useSelector((state) => state.socket);
	const [login] = useMutation(CREATE_USER_MUTATION);

	const togglePasswordVisibility = useCallback(() => {
		setPasswordVisibility((visible) => !visible);
	}, []);

	const handleFormSubmit = async (values) => {
		const { email, password } = values;

		login({
			variables: {
				email: email,
				password: password,
			},
		}).then((response) => {
			Emitter.emit('updatePostInfo');
			const userData =
				(response.data &&
					response.data.login &&
					response.data.login.user) ||
				{};
			if (response.data.login) 
				{
					userData.isLogin = true;
					socket.emit("login", email);
				}
			dispatch({
				type: UPDATE_USER_DATA,
				payload: {
					userData,
				},
			});
			router.replace("/", undefined, {
				shallow: true,
			});
		}).catch((err) => {
			Emitter.emit('showMessage', {
				message: err.message,
				severity: "error"
			})
			console.log(err.message);
		});
	};
	const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
		useFormik({
			onSubmit: handleFormSubmit,
			initialValues,
			validationSchema: formSchema,
		});
	return (
		<StyledCard elevation={3} passwordVisibility={passwordVisibility}>
			<form className="content" onSubmit={handleSubmit}>
				<H3 textAlign="center" mb={1}>
					Welcome To Mr.Handyman
				</H3>
				<Small
					fontWeight="600"
					fontSize="12px"
					color="grey.800"
					textAlign="center"
					mb={4.5}
					display="block"
				>
					Log in with email & password
				</Small>

				<TextField
					mb={1.5}
					name="email"
					label="Email"
					placeholder="Enter your email"
					variant="outlined"
					size="small"
					type="email"
					fullWidth
					onBlur={handleBlur}
					onChange={handleChange}
					value={values.email || ""}
					error={!!touched.email && !!errors.email}
					helperText={touched.email && errors.email}
				/>

				<TextField
					mb={2}
					name="password"
					label="Password"
					placeholder="Enter your password"
					autoComplete="on"
					type={passwordVisibility ? "text" : "password"}
					variant="outlined"
					size="small"
					fullWidth
					InputProps={{
						endAdornment: (
							<IconButton
								size="small"
								type="button"
								onClick={togglePasswordVisibility}
							>
								{passwordVisibility ? (
									<Visibility
										className="passwordEye"
										fontSize="small"
									/>
								) : (
									<VisibilityOff
										className="passwordEye"
										fontSize="small"
									/>
								)}
							</IconButton>
						),
					}}
					onBlur={handleBlur}
					onChange={handleChange}
					value={values.password || ""}
					error={!!touched.password && !!errors.password}
					helperText={touched.password && errors.password}
				/>

				<Button
					variant="contained"
					type="submit"
					fullWidth
					sx={{
						mb: "1.65rem",
						height: 44,
						bgcolor: "#4D88AF",
						"&:hover": {
							bgcolor: "#4D88AF",
						},
					}}
				>
					Login
				</Button>

				<Box mb={2}>
					<Box width="200px" mx="auto">
						<Divider />
					</Box>

					<FlexBox justifyContent="center" mt={-1.625}>
						<Box color="#AEB4BE" bgcolor="#F6F9FC" px={2}></Box>
					</FlexBox>
				</Box>

				<FlexBox
					justifyContent="center"
					alignItems="center"
					my="1.25rem"
				>
					<Box>Don’t have account?</Box>
					<Link href="/signup">
						<a>
							<H6 ml={1}>Sign Up</H6>
						</a>
					</Link>
				</FlexBox>
			</form>
		</StyledCard>
	);
};

const initialValues = {
	email: "",
	password: "",
};
const formSchema = yup.object().shape({
	email: yup.string().email("invalid email").required("${path} is required"),
	password: yup.string().required("${path} is required"),
});
export default Login;
