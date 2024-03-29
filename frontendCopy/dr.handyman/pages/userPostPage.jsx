import AppLayout from "components/layout/AppLayout";
import ProfileDashboardLayout from "components/layout/ProfileDashboardLayout";
import DashboardPageHeader from "components/profile/ProfileDashboardHeader";
import ProfileDashboardNavigation from "components/profile/ProfileDashboardNav";
import Link from "next/link";
import { Box } from "@mui/system";
import { H3, H5, Small, Medium } from "components/Typography";

import { styled } from "@mui/material/styles";

import Paper from "@mui/material/Paper";
import FlexBox from "components/FlexBox";
import { format } from "date-fns";
import { Avatar, Button, Card, Grid, Typography } from "@mui/material";

import UserPosts from "components/userposts/userPosts";

const UserPostPage = (props) => {
	return (
		<AppLayout>
			<ProfileDashboardLayout>
				<DashboardPageHeader
					title="My Posts"
					navigation={<ProfileDashboardNavigation />}
				/>

				<UserPosts />
			</ProfileDashboardLayout>
		</AppLayout>
	);
};

export default UserPostPage;
