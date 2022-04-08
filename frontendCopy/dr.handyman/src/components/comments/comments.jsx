import FlexBox from "components/FlexBox";
import NavbarLayout from "components/layout/NavbarLayout";

import { H3, Span, H5 } from "components/Typography";
import { Grid, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import PostRow from "components/PostRow";
import Comment from "./comment";
import {
	GET_COMMENT_ON_WORKER_PAGE,
	GET_COMMENT_COUNT_ON_WORKER_PAGE,
} from "@/GraphQL/Queries";
import { useMutation, useLazyQuery } from "@apollo/client";
import Emitter from "@/utils/eventEmitter";

const Comments = ({ workerInfo }) => {
	const [fetchGetCommentList, { loading }] = useLazyQuery(
		GET_COMMENT_ON_WORKER_PAGE
	);
	const [fetchGetCommentListCount, { cloading }] = useLazyQuery(
		GET_COMMENT_COUNT_ON_WORKER_PAGE
	);

	const [commentCount, setCommentCount] = useState(0);
	const [commentsList, setCommentData] = useState([]);
	const [page, setPage] = useState(1);

	useEffect(() => {
		const getCommentsData = (page = 0) => {
			if (!workerInfo.email) return;
			setPage(page + 1);
			fetchGetCommentListCount({
				variables: {
					email: workerInfo.email,
				},
			})
				.then((res) => {
					if (res.data) {
						setCommentCount(res.data.getCommentOnWorkerCount);
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
			fetchGetCommentList({
				variables: {
					email: workerInfo.email,
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
						setCommentData(res.data.getCommentOnWorkerPage || []);
					}
				})
				.catch((err) => {
					Emitter.emit("showMessage", {
						message: err.message,
						severity: "error",
					});
				});
		};

		Emitter.on('getCommentsData', getCommentsData);
		getCommentsData();
	}, [workerInfo]);

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
		Emitter.emit('getCommentsData', value - 1)
	};

	if (loading || cloading) {
		return (
			<NavbarLayout>
				<H3 color="#2C2C2C" mb={2}>
					See comments
				</H3>
				<div>Loading...</div>
			</NavbarLayout>
		);
	}

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
					bgcolor: "#B9D9EF",
				}}
				elevation={0}
			>
				
				<H5 color="grey.600" mx={0.75} textAlign="left">
					Posted By
				</H5>
				<H5 color="grey.600" mx={0.75} textAlign="left">
					Content
				</H5>
				<H5 color="grey.600" mx={0.75} textAlign="left">
					Rating
				</H5>
				<H5 color="grey.600" mx={0.75} textAlign="left">
					Post Time
				</H5>
			</PostRow>
			{commentsList.map((item, ind) => (
				<Comment comment={item} key={ind} />
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
	);
};


export default Comments;
