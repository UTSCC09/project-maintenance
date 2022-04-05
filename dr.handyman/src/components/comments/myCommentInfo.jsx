import React, { useState } from "react";
import { Typography } from "@mui/material";

import FlexBox from "components/FlexBox";
import { H5, Medium } from "components/Typography";

import Link from "next/link";

import { Box, Card, Divider, Button, Rating } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FIND_TYPE_MAP } from "@/utils/constants";
import { formatTime } from "@/utils/index";
import { useMutation } from "@apollo/client";
import { DEL_COMMENT } from "@/GraphQL/Mutations";
import Emitter from "@/utils/eventEmitter";
import LoadingButton from "@mui/lab/LoadingButton";
import EditComment from "./editComment";

import { CANCEL_ACCEPT_POST } from "@/GraphQL/Mutations";
const StyledCard = styled(
	({
		children,

		...rest
	}) => <Card {...rest}>{children}</Card>
)(({}) => ({
	width: 600,

	".content": {
		textAlign: "center",
		padding: "3rem 3.75rem 0px",
	},
}));

const MyCommentInfo = ({ comment, closeDialog, isPreview }) => {
	const [showDelBtnLoading, setShowDelBtnLoading] = useState(false);
	const [displayType, setDisplayType] = useState("");
	const [fetchDelComment] = useMutation(DEL_COMMENT);

	const delComment = () => {
		fetchDelComment({ variables: { id: comment._id } })
			.then((res) => {
				if (res.data && res.data.deleteComment) {
					Emitter.emit("showMessage", {
						message: "Del post success.",
						severity: "success",
					});
					Emitter.emit("updateCommentList");
					closeDialog();
				}
			})
			.catch((err) => {
				Emitter.emit("showMessage", {
					message: err.message,
					severity: "error",
				});
			});
	};

	return (
		<StyledCard elevation={3}>
			{displayType === "edit" ? (
				<EditComment
					comment={comment}
					closeDialog={closeDialog}
				></EditComment>
			) : (
				<form className="content">
					<H5 textAlign="center" mb={1} fontSize="25px">
						Comment
					</H5>
					<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						Comment on: {comment.userEmail}
					</Medium>
					<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						Content: {comment.content}
					</Medium>

					<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						Rating:{" "}
						<Rating
							value={comment.rating || 0}
							color="warn"
							size="small"
							readOnly
							precision={0.5}
							sx={{
								mb: "0.75rem",
							}}
						/>
					</Medium>
					<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						Time Posted: {formatTime(comment.createdAt)}
					</Medium>

					{!isPreview ? (
						<Button
							variant="contained"
							fullWidth
							onClick={() => setDisplayType("edit")}
							sx={{
								mb: "1.65rem",
								height: 44,
								bgcolor: "#4790E5",
								"&:hover": {
									bgcolor: "#4790E5",
								},
							}}
						>
							Edit Comment
						</Button>
					) : null}

					{!isPreview ? (
						<LoadingButton
							variant="contained"
							fullWidth
							loading={showDelBtnLoading}
							onClick={delComment}
							sx={{
								mb: "1.65rem",
								height: 44,
								bgcolor: "#FFAB92",
								"&:hover": {
									bgcolor: "#F20E0E",
								},
							}}
						>
							Delete Comment
						</LoadingButton>
					) : null}

					<Box mb={2}>
						<FlexBox justifyContent="center" mt={-1.625}>
							<Box color="#AEB4BE" bgcolor="#F6F9FC" px={2}></Box>
						</FlexBox>
					</Box>
				</form>
			)}
		</StyledCard>
	);
};

export default MyCommentInfo;
