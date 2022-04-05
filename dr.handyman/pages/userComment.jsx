import AppLayout from "components/layout/AppLayout";
import ProfileDashboardLayout from "components/layout/ProfileDashboardLayout";
import DashboardPageHeader from "components/profile/ProfileDashboardHeader";
import ProfileDashboardNavigation from "components/profile/ProfileDashboardNav";
import Link from "next/link";
import { Box } from "@mui/system";
import { H3, H5, Small, Medium, Span } from "components/Typography";
import NavbarLayout from "components/layout/NavbarLayout";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import FlexBox from "components/FlexBox";
import { format } from "date-fns";
import {
	Avatar,
	Button,
	Card,
	Grid,
	Typography,
	Pagination,
} from "@mui/material";
import PostRow from "components/PostRow";
import MyComment from "../src/components/comments/myComment";
import {
	GET_COMMENT_BY_USER,
	GET_COMMENT_BY_USER_COUNT,
} from "@/GraphQL/Queries";
import { useLazyQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import Emitter from "@/utils/eventEmitter";

const UserComment = (props) => {
	const [getCommentsPages, { loading }] = useLazyQuery(GET_COMMENT_BY_USER);
	const userData = useSelector((state) => state.userData);
	const [getCount, { loading: cloading }] = useLazyQuery(
		GET_COMMENT_BY_USER_COUNT
	);
	const [commentCount, setCommentCount] = useState(0);
	const [commentList, setCommentData] = useState([]);
	const [page, setPage] = useState(1);
	console.log('commentCount', commentCount)
	useEffect(() => {
		const getCommentsData = (page = 0) => {
			if (!userData.isLogin) {
				return Emitter.emit("showMessage", {
					message: "Please login first.",
					severity: "error",
				});
			}

			getCount({
				variables: {
					email: userData.email,
				},
			})
				.then((res) => {
					if (res.data) {
						setCommentCount(res.data.getCommentByUserCount);
					}
					if (res.error) {
						Emitter.emit("showMessage", {
							message: res.error,
							severity: "error",
						});
					}
				})
				.catch((err) => {
					Emitter.emit("showMessage", {
						message: err.message,
						severity: "error",
					});
				});
			getCommentsPages({
				variables: {
					email: userData.email,
					commentPerPage: 6,
					page,
				},
			})
				.then((res) => {
					if (res.error) {
						Emitter.emit("showMessage", {
							message: res.error,
							severity: "error",
						});
					}
					if (res.data) {
						setCommentData(res.data.getCommentByUserPage || []);
					}
				})
				.catch((err) => {
					Emitter.emit("showMessage", {
						message: err.message,
						severity: "error",
					});
				});
		};

		getCommentsData();

		Emitter.on("updateCommentList", getCommentsData);
	}, [userData]);

	if (loading || cloading) {
		return (
			<NavbarLayout>
				<H3 color="#2C2C2C" mb={2}>
					See my comments
				</H3>
				<div>Loading...</div>
			</NavbarLayout>
		);
	}

	let index1 = (page - 1) * 6 + 1;
	let index2 = page * 6;
	if (commentCount <= page * 6) {
		index2 = commentCount;
	}
	if (commentCount == 0) {
		index1 = 0;
		index2 = 0;
	}

	const handleChange = (event, value) => {
		Emitter.emit('updateCommentList', value - 1)
		setPage(value);
	};

	return (
		<AppLayout>
			<ProfileDashboardLayout>
				<DashboardPageHeader
					title="My Comments"
					navigation={<ProfileDashboardNavigation />}
				/>
				<NavbarLayout>
					<PostRow
						sx={{
							display: {
								xs: "none",
								md: "flex",
							},
							padding: "0px 18px",
							background: "none",
							bgcolor: "#F7E1A9",
						}}
						elevation={0}
					>
						<H5 color="grey.600" mx={0.75} textAlign="left">
							Comment On
						</H5>
						<H5 color="grey.600" mx={0.75} textAlign="left">
							Content
						</H5>
						<H5 color="grey.600" mx={0.75} textAlign="left">
							Rating
						</H5>
						<H5 color="grey.600" mx={0.75} textAlign="left">
							Time
						</H5>

						<H5
							flex="0 0 0 !important"
							color="grey.600"
							px={2.75}
							py={0.5}
							my={0}
						></H5>
					</PostRow>
					{commentList.map((item, ind) => (
						<MyComment comment={item} key={ind} />
					))}

					<FlexBox
						flexWrap="wrap"
						justifyContent="space-between"
						alignItems="center"
						mt={4}
					>
						<Span color="grey.600">
							Showing {index1}-{index2} of {commentCount} Comments
						</Span>
						<Pagination
							count={Math.ceil(commentCount / 6)}
							variant="outlined"
							color="primary"
							onChange={handleChange}
							page={page}
						/>
					</FlexBox>
				</NavbarLayout>
			</ProfileDashboardLayout>
		</AppLayout>
	);
};

const commentList = [
	{
		to: "Alice",
		content:
			"this is the conte sdjf jfa dq w qj  nqn nq q; nfqn; fnqn;nnqjfn;jqip f afjn fioaf nt",
		time: "2022-03-21",
		rating: "4.5",
	},
	{
		to: "Alice",
		content:
			"this is the conte sdjf jfa dq w qj  nqn nq q; nfqn; fnqn;nnqjfn;jqip f afjn fioaf nt",
		time: "2022-03-21",
		rating: "3",
	},
	{
		to: "Bob",
		content:
			"this is the conte sdjf jfa dq w qj  nqn nq q; nfqn; fnqn;nnqjfn;jqip f afjn fioaf nt",
		time: "2022-03-21",
		rating: "4",
	},
];

export default UserComment;
