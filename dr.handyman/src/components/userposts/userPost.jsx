import Row from "components/PostRow";
import { H5 } from "components/Typography";
import East from "@mui/icons-material/East";
import { Chip, IconButton, Typography, Dialog } from "@mui/material";
import { Box } from "@mui/system";
import { format } from "date-fns";
import Link from "next/link";
import React, { useState } from "react";
import UserPostInfo from "./userPostInfo";
import { FIND_TYPE_MAP } from "@/utils/constants";
import { formatTime } from "@/utils/index";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation } from "@apollo/client";
import { CANCEL_ACCEPT } from "@/GraphQL/Mutations";
import Emitter from "@/utils/eventEmitter";

const UserPost = ({ post, type }) => {
	const getTypeColor = (status) => {
		switch (status) {
			case 0:
				return "#A9BDF7";

			case 1:
				return "#B6EBAC";
		}
	};

	const getStateColor = (status) => {
		switch (status) {
			case true:
				return "#B6EBE5";

			case false:
				return "#F8CBC9";
		}
	};
	const [dialogOpen, setDialogOpen] = useState(false);
	const toggleDialog = () => setDialogOpen(!dialogOpen);
	// const [fetchCancelAccept,{ loading: btnLoading }] = useMutation(CANCEL_ACCEPT, {
	//   variables: {
	//     id: post._id
	//   }
	// });

	// const cancelAccept = () => {
	//   fetchCancelAccept().then(res => {
	//     if (res.data) {
	//       Emitter.emit('updateMyPosts')
	//     }
	//   }).catch(err => {
	//     Emitter.emit('showMessage', {
	//       message: err.message || "Cancel Post Failed.",
	//       severity: "error"
	//     })
	//   })
	// }

	return (
		<Row
			sx={{
				my: "1rem",
				padding: "6px 18px",
				bgcolor: "#F7E1A9",
				"&:hover": {
					bgcolor: "#F3B356",
				},
			}}
		>
			<H5 m={0.75} textAlign="left">
				{post.title}
			</H5>
			<Box m={0.75}>
				<Chip
					size="5rem"
					label={FIND_TYPE_MAP[post.type]}
					sx={{
						fontSize: 13,

						backgroundColor: getTypeColor(post.type),
					}}
				/>
			</Box>

			<Box m={0.75}>
				<Chip
					size="5rem"
					label={post.state ? "Accpted" : "Not Accepted"}
					sx={{
						fontSize: 13,

						backgroundColor: getStateColor(post.state),
					}}
				/>
			</Box>
			{type === "accept" ? (
				<Typography className="pre" m={0.75} textAlign="left">
					{post.posterUsername || "N/A"}
				</Typography>
			) : (
				<Typography className="pre" m={0.75} textAlign="left">
					{post.acceptorUsername || "N/A"}
				</Typography>
			)}
			{/* <Typography className="pre" m={0.75} textAlign="left">
				{post.acceptorUsername || "N/A"}
			</Typography> */}

			<Typography className="pre" m={0.75} textAlign="left">
				{formatTime(post.createdAt)}
			</Typography>
			{post.distance !== null && <Typography className="pre" ml={2.75} textAlign="left">
					{(post.distance).toFixed(2) || "N/A"} KM
				</Typography>}

			{ post.distance === null && <Typography className="pre" ml={2.75} textAlign="left">
					{Math.ceil(post.distance) || "N/A"} KM
				</Typography>}

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
				{/* {type === "accept" ? (
          <LoadingButton
          type="submit"
          loading={btnLoading}
          onClick={cancelAccept}
          variant="outlined"
          color="warning"
        >
          Cancel Accept
        </LoadingButton>
				) : (
				
				)} */}
				<Box
					component={IconButton}
					ml={2}
					p={1.25}
					bgcolor="#F7E1A9"
					onClick={toggleDialog}
				>
					<East />
				</Box>
				<Dialog open={dialogOpen} scroll="body" onClose={toggleDialog}>
					<UserPostInfo
						post={post}
						closeDialog={toggleDialog}
						type={type}
					/>
				</Dialog>
			</Typography>
		</Row>
	);
};

export default UserPost;
