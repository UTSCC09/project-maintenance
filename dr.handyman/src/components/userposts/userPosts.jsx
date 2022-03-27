import FlexBox from "components/FlexBox";
import NavbarLayout from "components/layout/NavbarLayout";
import UserPost from "./userPost";
import { H3, Span, H5 } from "components/Typography";
import { Grid, Pagination } from "@mui/material";
import React from "react";
import PostRow from "components/PostRow";
import { useSelector, useStore } from "react-redux";

import {
	GET_USER_POST,
	GET_USER_POST_COUNT,
	GET_ACCEPT_USER_POST,
	GET_ACCEPT_USER_POST_COUNT,
} from "../../GraphQL/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { Query } from "react-query";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import Emitter from "@/utils/eventEmitter";

const UserPosts = ({ type = "all" }) => {
	const userLocation = useSelector((state) => state.userLocation);
	const [page, setPage] = useState(1);
	const store = useStore()

	const [getPostPage, { data = {}, loading }] = useLazyQuery(
		type === "accept" ? GET_ACCEPT_USER_POST : GET_USER_POST
	);
	const [getCount, { loading: cloading }] = useLazyQuery(
		type === "accept" ? GET_ACCEPT_USER_POST_COUNT : GET_USER_POST_COUNT
	);
	//   if (postCount == null){
	// postCount = [];
	//   }
	const [postCount, setPostCount] = useState(0);
	const [postData, setPostData] = useState([]);

	useEffect(() => {
		const updateMyPosts = () => {
			const userLocationNew = store.getState().userLocation;
			getCount()
				.then((res) => {
					if (res.data) {
						setPostCount(
							res.data[
								type === "accept"
									? "getAcceptedPostCount"
									: "getUserPostCount"
							]
						);
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

			getPostPage({
				variables: {
					page: 0,
					[type === "accept"
						? "acceptedPostPerPage"
						: "userPostPerPage"]: 6,
					coordinates: [
						userLocationNew.longitude,
						userLocationNew.latitude,
					],
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
						setPostData(
							res.data[
								type === "accept"
									? "getAcceptedPostsPage"
									: "getUserPostsPage"
							] || []
						);
					}
				})
				.catch((err) => {
					Emitter.emit("showMessage", {
						message: err.message,
						severity: "error",
					});
				});
		};
		updateMyPosts();

		Emitter.on("updateMyPosts", updateMyPosts);

		return () => {
			Emitter.off("updateMyPosts", updateMyPosts);
		};
	}, []);
	if (loading || cloading) {
		return (
			<NavbarLayout>
				<H3 color="#2C2C2C" mb={2}>
					See my posts
				</H3>
				<div>Loading...</div>
			</NavbarLayout>
		);
	}
	console.log("load");
	let index1 = (page - 1) * 6 + 1;
	let index2 = page * 6;
	if (postCount <= page * 6) {
		index2 = postCount;
	}

	if (postCount == 0) {
		index1 = 0;
		index2 = 0;
	}

	const handleChange = (event, value) => {
		getPostPage({
			variables: {
				page: value - 1 || 0,
				postPerPage: 6,
				coordinates: [userLocation.longitude, userLocation.latitude],
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
					setPostData(
						res.data[
							type === "accept"
								? "getAcceptedPostsPage"
								: "getUserPostsPage"
						] || []
					);
				}
			})
			.catch((err) => {
				Emitter.emit("showMessage", {
					message: err.message,
					severity: "error",
				});
			});
		setPage(value);
	};

	return (
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
				<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
					Title
				</H5>

				<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
					Posts Type
				</H5>

				<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
					State
				</H5>
				{type === "accept" ? (
					<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
						Posted By
					</H5>
				) : (
					<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
						User Accept
					</H5>
				)}

				<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
					Post Time
				</H5>

				<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
					Distance
				</H5>
				<H5
					flex="0 0 0 !important"
					color="grey.600"
					px={7.75}
					py={0.5}
					my={0}
				></H5>
			</PostRow>
			{postData.map((item, ind) => (
				<UserPost post={item} key={ind} type={type} />
			))}

			<FlexBox
				flexWrap="wrap"
				justifyContent="space-between"
				alignItems="center"
				mt={4}
			>
				<Span color="grey.600">
					Showing {index1}-{index2} of {postCount} Posts
				</Span>
				<Pagination
					count={Math.ceil(postCount / 6)}
					page={page}
					onChange={handleChange}
					boundaryCount={0}
					siblingCount={0}
					variant="outlined"
					color="primary"
				/>
			</FlexBox>
		</NavbarLayout>
	);
};

const postsList = [
	{
		title: "Cat",
		user: "Alice",
		postUrl: "/posts/53244445",
		content: "this is the content",
		time: "2022-03-21",
		userUrl: "/users/500000",
		type: "Find a Contractor",
		state: "Accepted",
		userAccept: "Bob",
	},
	{
		title: "Cat",
		user: "Alice",
		postUrl: "/posts/53244445",
		content: "this is the content",
		time: "2022-03-21",
		userUrl: "/users/500000",
		type: "Find a Contractor",
		state: "Accepted",
		userAccept: "Bob",
	},
	{
		title: "Cat",
		user: "Alice",
		postUrl: "/posts/53244445",
		content: "this is the content",
		time: "2022-03-21",
		userUrl: "/users/500000",
		type: "Find a Contractor",
		state: "Not Accepted",
		userAccept: "N/A",
	},
	{
		title: "Cat",
		user: "Alice",
		postUrl: "/posts/53244445",
		content: "this is the content",
		time: "2022-03-21",
		userUrl: "/users/500000",
		type: "Find a Handyman",
		state: "Not Accepted",
		userAccept: "N/A",
	},
	{
		title: "Cat",
		user: "Alice",
		postUrl: "/posts/53244445",
		content: "this is the content",
		time: "2022-03-21",
		userUrl: "/users/500000",
		type: "Find a Handyman",
		state: "Not Accepted",
		userAccept: "N/A",
	},
	{
		title: "Cat",
		user: "Alice",
		postUrl: "/posts/53244445",
		content: "this is the content",
		time: "2022-03-21",
		userUrl: "/user/500000",
		type: "Find a Handyman",
		state: "Not Accepted",
		userAccept: "N/A",
	},
];
export default UserPosts;
