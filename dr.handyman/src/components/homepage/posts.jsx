import FlexBox from "components/FlexBox";
import NavbarLayout from "components/layout/NavbarLayout";
import Post from "./post";
import { H3, Span, H5, H4 } from "components/Typography";
import { Grid, Pagination } from "@mui/material";
import React from "react";
import PostRow from "components/PostRow";

import {
	GET_POSTS_QUERY,
	GET_COUNT,
	SEARCH_POST,
	SEARCH_POST_COUNT,
} from "../../GraphQL/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useSelector, useStore } from "react-redux";
import Emitter from "@/utils/eventEmitter";

const Posts = () => {
	const [page, setPage] = useState(1);
	const [getPosts, { loading }] = useLazyQuery(GET_POSTS_QUERY, {
		fetchPolicy: "no-cache",
	});
	const userLocation = useSelector((state) => state.userLocation);
	const [postsData, setPostsData] = useState([]);
	const [postsCount, setPostsCount] = useState(0);
	const [searchPost] = useLazyQuery(SEARCH_POST);
	const [searchPostCount] = useLazyQuery(SEARCH_POST_COUNT);
	const store = useStore();
	const [getCount, { loading: cloading }] = useLazyQuery(GET_COUNT, {
		fetchPolicy: "no-cache",
	});

	useEffect(() => {
		const updatePostInfo = () => {
			getPosts({ variables: { page: 0, postPerPage: 6, coordinates: [
				userLocation.longitude,
				userLocation.latitude,
			], } }).then((res) => {
				setPostsData(res.data.getPostPage);
			});
			getCount().then((res) => {
				setPostsCount(res.data.getPostCount);
			});
		};

		const handlerPostsSearch = ({ queryText = "" }) => {
			if (!queryText) return updatePostInfo();
			const userLocationNew = store.getState().userLocation;
			searchPostCount({
				variables: { page: 0, postPerPage: 6, queryText },
			})
				.then((res) => {
					setPostsCount(res.data.searchPostCount || 0);
				})
				.catch((err) => {
					Emitter.emit("showMessage", {
						message: err.message,
						severity: "error",
					});
				});
			searchPost({
				variables: {
					page: 0,
					postPerPage: 6,
					queryText,
					coordinates: [
						userLocationNew.longitude,
						userLocationNew.latitude,
					],
				},
			})
				.then((res) => {
					setPostsData(res.data.searchPostPage || []);
				})
				.catch((err) => {
					Emitter.emit("showMessage", {
						message: err.message,
						severity: "error",
					});
				});
		};

		updatePostInfo();
		Emitter.on("updatePostInfo", updatePostInfo);
		Emitter.on("searchPosts", handlerPostsSearch);
		Emitter.on("clearPosts", () => {
			setPostsData([]);
			setPostsCount(0)
		});

		return () => {
			Emitter.off("updatePostInfo", updatePostInfo);
			Emitter.off("searchPosts", handlerPostsSearch);
		};
	}, [userLocation]);

	if (loading || cloading) {
		return (
			<NavbarLayout>
				<H3 color="#2C2C2C" mb={2}>
					See Newest Posts
				</H3>
				<div>Loading...</div>
			</NavbarLayout>
		);
	}
	let index1 = (page - 1) * 6 + 1;
	let index2 = page * 6;
	if (postsCount <= page * 6) {
		index2 = postsCount;
	}
	if (postsCount == 0) {
		index1 = 0;
		index2 = 0;
	}
	
	const handleChange = (event, value) => {
		getPosts({
			variables: {
				page: value - 1,
				postPerPage: 6,
				coordinates: [userLocation.longitude, userLocation.latitude],
			},
		}).then((res) => {
			setPostsData(res.data.getPostPage);
		});
		setPage(value);
	};

	return (
		<NavbarLayout>
			<H3 color="#2C2C2C" mb={2}>
				See Newest Posts
			</H3>
			<PostRow
				sx={{
					display: {
						xs: "none",
						md: "flex",
					},
					padding: "0px 18px",
					background: "none",
					bgcolor: "#B9D9EF",
				}}
				elevation={0}
			>
				<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
					Title
				</H5>
			
				<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
					Posted By
				</H5>

				<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
					Posts Type
				</H5>
				<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
					State
				</H5>
				<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
					Accept User
				</H5>
				<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
					Post Time
				</H5>
				<H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
					Distance
				</H5>
				<H5
					flex="0 0 0 !important"
					color="grey.600"
					px={2.75}
					py={0.5}
					my={0}
				></H5>
			</PostRow>
		
			{postsData.map((item, ind) => (
				<Post post={item} key={ind} />
			))}

			<FlexBox
				flexWrap="wrap"
				justifyContent="space-between"
				alignItems="center"
				mt={5}
			>
				<Span color="grey.600">
					{}
					Showing {index1}-{index2} of {postsCount} Posts
				</Span>
				<Pagination
					count={Math.ceil(postsCount / 6)}
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

export default Posts;
