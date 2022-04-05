import Row from "components/PostRow";
import { H5 } from "components/Typography";

import { Chip, IconButton, Typography, Rating, Dialog } from "@mui/material";
import { Box } from "@mui/system";
import { format } from "date-fns";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import East from "@mui/icons-material/East";
import MyCommentInfo from "./myCommentInfo";
import { formatTime, getUrlQuery } from "@/utils";


const MyComment = ({ comment }) => {
	let short_comment = comment.content;
	if (short_comment.length >= 10) {
		short_comment = short_comment.substring(0, 10) + "...";
	}

	const [dialogOpen, setDialogOpen] = useState(false);
	const toggleDialog = () => setDialogOpen(!dialogOpen);

	return (
		<Row
			sx={{
				my: "1rem",
				padding: "6px 18px",
				bgcolor: "#F7E1A9",
				"&:hover": {
					bgcolor: "#AEC5F2",
				},
			}}
		>
			<Typography m={0.75} textAlign="left">
				{comment.workerEmail}
			</Typography>

			<Typography m={0.75} textAlign="left">
				{" "}
				{short_comment}
			</Typography>

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

			<Typography className="pre" m={0.75} textAlign="left">
				{formatTime(comment.createdAt)}
			</Typography>

			<Typography
				textAlign="center"
				color="grey.600"
				sx={{
					flex: "0 0 0 !important",
					display: {
						xs: "none",
						md: "block",
					},
				}}
			>
				<Box
					component={IconButton}
					ml={2}
					p={1.25}
					b
					onClick={toggleDialog}
				>
					<East />
				</Box>
				<Dialog open={dialogOpen} scroll="body" onClose={toggleDialog}>
					<MyCommentInfo comment={comment} closeDialog={toggleDialog}/>
				</Dialog>
			</Typography>
		</Row>
	);
};

export default MyComment;
