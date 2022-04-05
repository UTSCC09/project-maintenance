import Row from "components/PostRow";
import { H5 } from "components/Typography";
import East from "@mui/icons-material/East";
import { Chip, IconButton, Typography, Rating, Dialog } from "@mui/material";
import { Box } from "@mui/system";
import { format } from "date-fns";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { formatTime, getUrlQuery } from "@/utils";
import MyCommentInfo from "./myCommentInfo";


const Comment = ({ comment }) => {
	const [showDetail, setShowDetail] = useState(false);
	const toggleDialog = () => setShowDetail(!showDetail);
  let short_content = comment.content || '';
	if (short_content.length >= 20) {
		short_content = short_content.substring(0, 20) + "...";
	}
	return (
		<Row
			sx={{
				my: "1rem",
				padding: "6px 18px",
				bgcolor: "#B9D9EF",
				"&:hover": {
					bgcolor: "#AEC5F2",
				},
			}}
			onClick={toggleDialog}
		>
			<Typography m={0.75} textAlign="left">
				{comment.userEmail}
			</Typography>

			<Typography m={0.75} textAlign="left" sx={{
				overflow: "hidden",
				textOverflow: "ellipsis"
			}}>
				{" "}
				{short_content}
			</Typography>

			<Rating
				value={comment.rating || 0}
				color="warn"
				size="small"
				readOnly
				sx={{
					mb: "0.75rem",
				}}
			/>

			<Typography className="pre" m={0.75} textAlign="left">
				{formatTime(comment.createdAt)}
			</Typography>

			<Dialog open={showDetail} scroll="body" onClose={toggleDialog}>
				<MyCommentInfo comment={comment} closeDialog={toggleDialog} isPreview/>
			</Dialog>
		</Row>
	);
};

export default Comment;
