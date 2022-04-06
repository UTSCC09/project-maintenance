import AppLayout from "components/layout/AppLayout";
import ProfileDashboardLayout from "components/layout/ProfileDashboardLayout";
import DashboardPageHeader from "components/profile/ProfileDashboardHeader";
import ProfileDashboardNavigation from "components/profile/ProfileDashboardNav";
import Link from "next/link";
import { Box } from "@mui/system";
import { H3, H5, Small, Medium } from "components/Typography";

import { styled } from "@mui/material/styles";
import { IMAGE_URL } from "/src/constant.js";
import Paper from "@mui/material/Paper";
import FlexBox from "components/FlexBox";
import { format } from "date-fns";
import { Avatar, Button, Card, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const ProfilePage = (props) => {
	const userData = useSelector((state) => state.userData);
	const [userProfileImage, setUserProfileImage] = useState("");

	useEffect(() => {
		if (!userData.email) return;
		setUserProfileImage(`${IMAGE_URL}/${userData.email}?t=${new Date().getTime()}`);
	}, [userData]);
	
	return (
		<AppLayout>
			<ProfileDashboardLayout>
				<DashboardPageHeader
					title="My Profile"
					button={
						<Link href="/profile/editProfile">
							<Button
								sx={{
									px: "2rem",
									bgcolor: "#FFF1D2",
									color: "#6D6D6D",
								}}
							>
								Edit Profile
							</Button>
						</Link>
					}
					navigation={<ProfileDashboardNavigation />}
				/>

				<Box mb={4}>
					<Grid container spacing={3}>
						<Grid item lg={6} md={6} sm={12} xs={12}>
							<Card
								sx={{
									display: "flex",
									p: "14px 32px",
									height: "100%",
									alignItems: "center",
									bgcolor: "#F7E1A9070",
								}}
							>
								{userProfileImage && (
									<Avatar
										src={userProfileImage}
										sx={{
											height: 64,
											width: 64,
											bgcolor: "#FFFFFF",
										}}
									/>
								)}
								<Box ml={1.5} flex="1 1 0">
									<FlexBox
										flexWrap="wrap"
										justifyContent="space-between"
										alignItems="center"
									>
										<div>
											<H3 my="0px">
												{userData.username}
											</H3>
										</div>
									</FlexBox>
								</Box>
							</Card>
						</Grid>
					</Grid>
				</Box>

				<FlexBox
					flexDirection="row"
					p={1}
					mt={8}
					bgcolor="#F6EDDA"
					mb={2}
				>
					<FlexBox flexDirection="column" p={1} mr={20}>
						<Medium color="grey.600" mb={0.5} textAlign="left">
							Name
						</Medium>
						<span>{userData.username}</span>
					</FlexBox>
					{/* <FlexBox flexDirection="column" p={1} mr={8}>
						<Medium color="grey.600" mb={0.5} textAlign="left">
							Last Name
						</Medium>
						<span>{userData.username}</span>
					</FlexBox> */}
					<FlexBox flexDirection="column" p={1} mr={20}>
						<Medium color="grey.600" mb={0.5} textAlign="left">
							Email
						</Medium>
						<span>{userData.email}</span>
					</FlexBox>
					<FlexBox flexDirection="column" p={1} mr={20}>
						<Medium color="grey.600" mb={0.5} textAlign="left">
							Phone
						</Medium>
						<span>{userData.phone}</span>
					</FlexBox>
					{/* <FlexBox flexDirection="column" p={1}>
						<Medium color="grey.600" mb={0.5}>
							Birth Date
						</Medium>
						<span className="pre">
							{format(new Date(2000, 9, 12), "yyyy-MM-dd")}
						</span>
					</FlexBox> */}
				</FlexBox>
			</ProfileDashboardLayout>
		</AppLayout>
	);
};

export default ProfilePage;
