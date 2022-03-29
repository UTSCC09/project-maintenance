import AppLayout from "components/layout/AppLayout";
import { Chip, IconButton, Typography } from "@mui/material";
import DashboardPageHeader from "components/profile/ProfileDashboardHeader";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Comments from "components/comments/comments";
import Link from "next/link";
import { Box } from "@mui/system";
import { H3, H5, Small, Medium } from "components/Typography";
import EmailIcon from "@mui/icons-material/Email";
import { styled } from "@mui/material/styles";
import { getUrlQuery } from "@/utils/index";

import Paper from "@mui/material/Paper";
import FlexBox from "components/FlexBox";
import { format } from "date-fns";
import { Avatar, Button, Card, Grid } from "@mui/material";
import UserProfileLayout from "components/layout/userProfileLayout";
import { GET_ONE_WORKER } from "../src/GraphQL/Queries";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Emitter from "@/utils/eventEmitter";
import { CREATE_CONVERSATION } from "@/GraphQL/Mutations";
import { useMutation, useLazyQuery, useSubscription } from "@apollo/client";
import { useRouter } from "next/router";

const UserProfile = (props) => {
	const router = useRouter();
	const userData = useSelector((state) => state.userData);
	const [createNewConv] = useMutation(CREATE_CONVERSATION);
	const [getWorkerDetail] = useLazyQuery(GET_ONE_WORKER, {
		fetchPolicy: "network-only",
	});
	const [workerDetail, setWorkerDetail] = useState({});
	const createNewChat = () => {
		createNewConv({
			variables: {
				email: workerDetail.email,
			},
		})
			.then((res) => {
				router.push('/chat')
			})
			.catch((err) => {
				Emitter.emit("showMessage", {
					message: err.message,
					severity: "error",
				});
			});
	}
	console.log(workerDetail);

	useEffect(() => {
		const urlQuery = getUrlQuery();
		const getWorkerInfoFc = () => {
			getWorkerDetail({
				variables: {
					email: urlQuery.email,
				},
			})
				.then((res) => {
					if (res.data && res.data.getOneWorker) {
						setWorkerDetail(res.data.getOneWorker);
					} else {
						Emitter.emit("showMessage", {
							message: res.error,
							severity: "error",
						});
					}
				})
				.catch((err) => {
					console.log(err.message);
					Emitter.emit("showMessage", {
						message: err.message,
						severity: "error",
					});
				});
		};

		getWorkerInfoFc();
	}, []);

	return (
		<AppLayout>
			<UserProfileLayout>
				<DashboardPageHeader
					ml="20 "
					title={workerDetail.username + " '" + "s profile"}
				/>

				<Box mb={4}>
					<Grid container spacing={3}>
						<Grid item lg={10} md={6} sm={12} xs={12}>
							<Card
								sx={{
									display: "flex",
									p: "14px 32px",
									height: "100%",
									alignItems: "center",
									bgcolor: "#F7E1A9070",
								}}
							>
								<Avatar
									src={`https://www.drhandyman.me:4000/pictures/${workerDetail.email}`}
									sx={{
										height: 64,
										width: 64,
										bgcolor: "#FFFFFF",
									}}
								/>
								<Box ml={1.5} flex="1 1 0">
									<FlexBox
										flexWrap="wrap"
										justifyContent="space-between"
										alignItems="center"
									>
										<div>
											<H3 my="0px">
												{workerDetail.username}
											</H3>
										</div>
									</FlexBox>
								</Box>
								<FlexBox flexDirection="column" p={1} mr={8}>
									<Medium
										color="grey.600"
										mb={0.5}
										textAlign="left"
									>
										Email
									</Medium>
									<span>{workerDetail.email}</span>
								</FlexBox>
								<FlexBox flexDirection="column" p={1} mr={8}>
									<Medium
										color="grey.600"
										mb={0.5}
										textAlign="left"
									>
										Phone
									</Medium>
									<span>{workerDetail.phone}</span>
								</FlexBox>
								<Typography
									textAlign="center"
									color="grey.600"
									onClick={createNewChat}
									sx={{
										display: {
											xs: "none",
											md: "block",
										},
									}}
								>
									<IconButton>
										<ChatBubbleOutlineIcon
											fontSize="small"
											color="inherit"
										/>
									</IconButton>
								</Typography>
							</Card>
						</Grid>
					</Grid>
				</Box>

				<DashboardPageHeader
					title={"Comments on " + workerDetail.username}
					mt={5}
				/>
				<Comments />
			</UserProfileLayout>
		</AppLayout>
	);
};

export default UserProfile;
