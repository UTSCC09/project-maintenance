import React, { useState } from "react";
import { Typography } from "@mui/material";

import FlexBox from "components/FlexBox";
import { H5, Medium } from "components/Typography";

import Link from "next/link";

import { Box, Card, Divider, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FIND_TYPE_MAP } from "@/utils/constants";
import { formatTime } from "@/utils/index";
import { useMutation } from "@apollo/client";
import { DEL_POST } from "@/GraphQL/Mutations";
import Emitter from "@/utils/eventEmitter";
import LoadingButton from "@mui/lab/LoadingButton";
import EditPost from "./editPost";


import { CANCEL_ACCEPT } from "@/GraphQL/Mutations";
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

const UserPostInfo = ({ post, closeDialog,type }) => {
	const [fetchDelPost] = useMutation(DEL_POST);
	const [showDelBtnLoading, setShowDelBtnLoading] = useState(false);
	const [displayType, setDisplayType] = useState('');

	const delPost = () => {
		setShowDelBtnLoading(true);
		fetchDelPost({
			variables: {
				id: post._id,
			},
		})
			.then((res) => {
				Emitter.emit("updateMyPosts");
				closeDialog();
				Emitter.emit("showMessage", {
					message: "Del Post Success.",
					severity: "success",
				});
				setShowDelBtnLoading(false);
			})
			.catch((err) => {
				Emitter.emit("showMessage", {
					message: err.message || "Del Post Failed.",
					severity: "error",
				});
				setShowDelBtnLoading(false);
			});
	};

    const [fetchCancelAccept,{ loading: btnLoading }] = useMutation(CANCEL_ACCEPT, {
        variables: {
          id: post._id
        }
      });
    
      const cancelAccept = () => {
        fetchCancelAccept().then(res => {
          if (res.data) {
            Emitter.emit('updateMyPosts')
          }
        }).catch(err => {
          Emitter.emit('showMessage', {
            message: err.message || "Cancel Post Failed.",
            severity: "error"
          })
        })
      }
	return (
		<StyledCard elevation={3}>
			{displayType === "edit" ? (
				<EditPost post={post} closeDialog={closeDialog}></EditPost>
			) : (
				<form className="content">
					<H5 textAlign="center" mb={1} fontSize="18px">
						Post Information
					</H5>
					<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						Title: {post.title}
					</Medium>
					<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						Description: {post.content}
					</Medium>
					<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						Type: {FIND_TYPE_MAP[post.type]}
					</Medium>
					<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						Time Posted: {formatTime(post.createdAt)}
					</Medium>
					<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						State: {post.state ? "Accpted" : "Not Accepted"}
					</Medium>
                    {type === 'accept' ? (<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						User Accept: {post.posterUsername || "N/A"}
					</Medium>) : 	(<Medium
						fontSize="16px"
						color="grey.800"
						textAlign="center"
						mb={4.5}
						display="block"
					>
						User Accept: {post.acceptorUsername || "N/A"}
					</Medium>)}
					

        {type === "accept" ? ( <LoadingButton
          type="submit"
          loading={btnLoading}
          onClick={cancelAccept}
          variant="outlined"
          color="warning"
         sx={{mb:"20px"}}
        >
          Cancel Accept
        </LoadingButton>
				) : 	(<><Button
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
                                Edit Post
                            </Button>
                            <LoadingButton
                                variant="contained"
                                fullWidth
                                loading={showDelBtnLoading}
                                onClick={delPost}
                                sx={{
                                    mb: "1.65rem",
                                    height: 44,
                                    bgcolor: "#FFAB92",
                                    "&:hover": {
                                        bgcolor: "#F20E0E",
                                    },
                                    
                                }}
                            >
                                    Delete Post
                                </LoadingButton>
                                
                                </>)}
					{/* <Button
						variant="contained"
						fullWidth
						onClick={() => setDisplayType("edit")}
						sx={{
							mb: "1.65rem",
							height: 44,
							bgcolor: "#5498E6",
							"&:hover": {
								bgcolor: "#4790E5",
							},
						}}
					>
						Edit Post
					</Button>
					<LoadingButton
						variant="contained"
						fullWidth
						loading={showDelBtnLoading}
						onClick={delPost}
						sx={{
							mb: "1.65rem",
							height: 44,
							bgcolor: "#E33939",
							"&:hover": {
								bgcolor: "#F20E0E",
							},
						}}
					>
						Delete Post
					</LoadingButton> */}

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

export default UserPostInfo;
