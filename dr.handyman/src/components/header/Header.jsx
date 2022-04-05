import React, { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import clsx from "clsx";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FlexBox from "components/FlexBox";
import Login from "components/sessions/Login";
import Link from "next/link";
import { layoutConstant } from "utils/constants";
import NewPost from "components/NewPost";
import PersonOutline from "@mui/icons-material/PersonOutline";
import {
	Box,
	Container,
	Dialog,
	Drawer,
	IconButton,
	styled,
	useMediaQuery,
	Button,
	DialogTitle,
	DialogActions,
	Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import NewAppointment from "../appointment/newAppointment";
import SearchBox from "../homepage/SearchBox"; // component props interface
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_LOGOUT_MUTATION, SET_WORKER } from "../../GraphQL/Mutations";
import {
	UPDATE_USER_DATA,
	TRIGGER_MESSAGE,
	UPDATE_USER_POSITION,
} from "../../store/constants";
import { useRouter } from "next/router";
import { getLocation } from "../../utils";
import Emitter from "@/utils/eventEmitter";
import {  IMAGE_URL} from "@/constant";

// styled component
export const HeaderWrapper = styled(Box)(({ theme }) => ({
	position: "relative",
	zIndex: 1,
	height: layoutConstant.headerHeight,
	background: theme.palette.background.paper,
	transition: "height 250ms ease-in-out",
	[theme.breakpoints.down("sm")]: {
		height: layoutConstant.mobileHeaderHeight,
	},
}));

// https://codesandbox.io/s/kywquu?file=/demo.js
const StyledMenu = styled((props) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: "bottom",
			horizontal: "right",
		}}
		transformOrigin={{
			vertical: "top",
			horizontal: "right",
		}}
		{...props}
	/>
))(({ theme }) => ({
	"& .MuiPaper-root": {
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 180,
		color:
			theme.palette.mode === "light"
				? "rgb(55, 65, 81)"
				: theme.palette.grey[300],
		boxShadow:
			"rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
		"& .MuiMenu-list": {
			padding: "4px 0",
		},
		"& .MuiMenuItem-root": {
			"& .MuiSvgIcon-root": {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			"&:hover": {
				backgroundColor: "#B9D9EF",
			},
		},
	},
}));

const Header = ({ isFixed, className }) => {
	const [anchorEl, setAnchorEl] = React.useState(false);
	const dispatch = useDispatch();
	const open = Boolean(anchorEl);
	const router = useRouter();
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const [sidenavOpen, setSidenavOpen] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [postDialogOpen, setPostDialogOpen] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
	const userData = useSelector((state) => state.userData);
	const [repairmanDialogOpen, setRepairmanDialogOpen] = useState(false);
	const [fetchApplyRepairmanApi] = useMutation(SET_WORKER);
	const [newAppointmentDialogOpen, setNewAppointmentDialogOpen] =
		useState(false);
	const toggleNewAppointmentDialog = () =>
		setNewAppointmentDialogOpen(!newAppointmentDialogOpen);
	const toggleSidenav = () => setSidenavOpen(!sidenavOpen);
	const togglePostDialog = () => setPostDialogOpen(!postDialogOpen);
	const toggleDialog = () => {
		if (!userData || !userData.isLogin) {
			setDialogOpen(!dialogOpen);
		}
	};

	const authorizePosition = () => {
		getLocation().then((data) => {
			const coords = data.coords;
			dispatch({
				type: UPDATE_USER_POSITION,
				payload: {
					userLocation: coords || {},
				},
			});
			Emitter.emit("showMessage", {
				message: "User Location Authorization Success",
				severity: "success",
			});
		});
	};

	const handleCloseRepairmanDialog = () => {
		setRepairmanDialogOpen(false);
	};

	const fetchApplyRepairman = () => {
		getLocation().then((data) => {
			const coords = data.coords;
			fetchApplyRepairmanApi({
				variables: {
					coordinates: [coords.longitude, coords.latitude],
				},
			}).then((res) => {
				if (res.data.setWorker) {
					Emitter.emit("updatePostInfo");
					dispatch({
						type: TRIGGER_MESSAGE,
						payload: {
							globalMessage: {
								message: "You have applied as a Handyman now.",
							},
						},
					});
					Emitter.emit("updateUserData");
					setRepairmanDialogOpen(false);
				}
			});
		});
	};

	const [fetchLogout] = useMutation(CREATE_LOGOUT_MUTATION);
	const logout = () => {
		fetchLogout().then((res) => {
			if (res.data) {
				dispatch({
					type: UPDATE_USER_DATA,
					payload: {
						userData: {
							isLogin: false,
						},
					},
				});
				router.replace("/");
			}
		});
	};

	useEffect(() => {
		if (userData.isLogin) setDialogOpen(false);
	}, [userData]);
	let button;
	if (userData.isLogin) {
		button = (
			<Box
				component={IconButton}
				ml={2}
				p={1.25}
				mr={2}
				onClick={handleClick}
			>
				<Avatar
					src={`${IMAGE_URL}/${userData.email}?t=${Date.now()}`}
					sx={{
						height: 50,
						width: 50,
						bgcolor: "#FFFFFF",
					}}
				/>

				{/* <PersonOutline /> */}
			</Box>
		);
	} else {
		button = (
			<Box
				component={IconButton}
				ml={2}
				p={1.25}
				mr={2}
				bgcolor="#99CBE9"
				onClick={toggleDialog}
			>
				<PersonOutline />
			</Box>
		);
	}
	return (
		<HeaderWrapper className={clsx(className)}>
			<Container
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					height: "100%",
				}}
			>
				<FlexBox
					alignItems="center"
					mr={2}
					minWidth="170px"
					sx={{
						display: {
							xs: "none",
							md: "flex",
						},
					}}
				>
					<Link href="/">
						<a>
							<img
								height={50}
								mb={0.5}
								src="/assets/title.jpg"
								alt="logo"
							/>
						</a>
					</Link>
				</FlexBox>

				<FlexBox justifyContent="center" flex="1 1 0">
					<SearchBox />
				</FlexBox>
				<Button
					sx={{
						bgcolor: "#99CBE9",
						color: "#3D3F40",
						margin: "0 10px",
					}}
					onClick={authorizePosition}
				>
					Authorize Position
				</Button>
				{userData && userData.isLogin && (
					<>
						<Button
							sx={{
								bgcolor: "#99CBE9",
								color: "#3D3F40",
								margin: "0 10px",
							}}
							onClick={togglePostDialog}
						>
							New Posts
						</Button>
						{userData.type != "worker" && (
							<Button
								sx={{
									bgcolor: "#99CBE9",
									color: "#3D3F40",
									margin: "0 10px",
								}}
								onClick={() => setRepairmanDialogOpen(true)}
							>
								Apply be a Handyman
							</Button>
						)}
					</>
				)}

				<Dialog
					open={repairmanDialogOpen}
					onClose={handleCloseRepairmanDialog}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{"Are you sure you want to apply to be a Handyman?"}
					</DialogTitle>
					<DialogActions>
						<Button
							onClick={handleCloseRepairmanDialog}
							sx={{ color: "#FD3A2E" }}
						>
							Cancel
						</Button>
						<Button onClick={fetchApplyRepairman} autoFocus>
							Confirm
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={postDialogOpen}
					fullWidth={isMobile}
					scroll="body"
					onClose={togglePostDialog}
				>
					<NewPost setDialog={setPostDialogOpen} />
				</Dialog>
				<FlexBox
					alignItems="center"
					sx={{
						display: {
							xs: "none",
							md: "flex",
						},
					}}
				>
					{button}
					<FlexBox
						sx={{
							color: "#6C6E6E",
						}}
					>
						{userData.username}
					</FlexBox>
					{userData.email && (
						<StyledMenu
							id="demo-customized-menu"
							MenuListProps={{
								"aria-labelledby": "demo-customized-button",
							}}
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
						>
							<MenuItem
								disableRipple
								onClick={() =>
									router.push("/profile", undefined, {
										shallow: true,
									})
								}
							>
								My Profile
							</MenuItem>
							<Divider sx={{ my: 0.5 }} />
							<MenuItem
								disableRipple
								onClick={() =>
									router.push("/userPostPage", undefined, {
										shallow: true,
									})
								}
							>
								My Posts
							</MenuItem>

							<MenuItem
								disableRipple
								onClick={() =>
									router.push("/userComment", undefined, {
										shallow: true,
									})
								}
							>
								My Comments
							</MenuItem>

							<MenuItem
								disableRipple
								onClick={() =>
									router.push(
										"/userUpcomingAppointment",
										undefined,
										{
											shallow: true,
										}
									)
								}
							>
								My Upcoming Appointments
							</MenuItem>
							<MenuItem
								disableRipple
								onClick={() =>
									router.push(
										"/userHistoryAppointment",
										undefined,
										{
											shallow: true,
										}
									)
								}
							>
								My History Appointments
							</MenuItem>
							{userData.type === "worker" && (
								<MenuItem
									disableRipple
									onClick={toggleNewAppointmentDialog}
								>
									Add New Appointment
								</MenuItem>
							)}
							<Dialog
								open={newAppointmentDialogOpen}
								scroll="body"
								onClose={toggleNewAppointmentDialog}
							>
								<NewAppointment
									setDialog={setNewAppointmentDialogOpen}
								/>
							</Dialog>
							<MenuItem
								disableRipple
								onClick={() =>
									router.push(
										"/userAcceptedPosts",
										undefined,
										{
											shallow: true,
										}
									)
								}
							>
								Accepted Posts
							</MenuItem>
							<MenuItem
								disableRipple
								onClick={() =>
									router.push("/chat", undefined, {
										shallow: true,
									})
								}
							>
								ChatBox
							</MenuItem>
							<Divider sx={{ my: 0.5 }} />
							<MenuItem disableRipple onClick={logout}>
								Log out
							</MenuItem>
						</StyledMenu>
					)}
				</FlexBox>

				<Dialog
					open={dialogOpen}
					fullWidth={isMobile}
					scroll="body"
					onClose={toggleDialog}
				>
					<Login />
				</Dialog>

				<Drawer
					open={sidenavOpen}
					anchor="right"
					onClose={toggleSidenav}
				></Drawer>
			</Container>
		</HeaderWrapper>
	);
};

export default Header;
