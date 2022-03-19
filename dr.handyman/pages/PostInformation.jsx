import AppLayout from "components/layout/AppLayout";
import { H1, H2, H3, H5 } from "components/Typography";
import MaintainerList from "components/homepage/maintainers";
import Posts from "components/homepage/posts";
import { Box, Grid, Card, Hidden } from "@mui/material";
import FlexBox from "components/FlexBox";
import Link from "next/link";
import { Chip, IconButton, Button, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { GET_POST_DETAIL } from "../src/GraphQL/Queries";
import { ACCEPT_POST, CANCEL_ACCEPT_POST } from '../src/GraphQL/Mutations'
import { useLazyQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FIND_TYPE_MAP } from "../src/constant";
import { formatTime, getUrlQuery } from "../src/utils";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux'
import { TRIGGER_MESSAGE } from '../src/store/constants'
import { useState } from 'react'

const PostInformation = () => {
  const router = useRouter();
	const [getPostDetail, { loading, error, data = {} }] =
		useLazyQuery(GET_POST_DETAIL, {
			fetchPolicy: "network-only"
		});
	const postDetail = data.getOnePost || {};
	const userData = useSelector(state => state.userData);
	const [fetchAcceptPost] = useMutation(ACCEPT_POST)
	const [fetchCancelAcceptPost] = useMutation(CANCEL_ACCEPT_POST);
	const dispatch = useDispatch();
	const [btnLoading, setBtnLoading] = useState(false);

	// const isAccepted = postDetail.acceptorEmail && postDetail.acceptorEmail.indexOf(userData.email) === -1;
    const isAccepted = postDetail.acceptorEmail !== '';
    const sameUser = userData.email === postDetail.posterEmail;
    const isAcceptedByCurrentUser = postDetail.acceptorEmail !== '' && userData.email === postDetail.acceptorEmail;
	console.log('postDetail', postDetail)
	console.log(btnLoading);
    console.log('is accepted', isAccepted);
    console.log('is accepted by current user', isAcceptedByCurrentUser);

	const getDetailInfo = () => {
		const urlQuery = getUrlQuery();
		const id = router.query.id || urlQuery.id;
		getPostDetail({
			variables: {
				id,
				$id: id,
			},
		}).then(res => {
			setBtnLoading(false)
		}).catch((res) => {
			setBtnLoading(false)
			console.log(res);
		});
	}

	const acceptOrCancelPost = () => {
		const urlQuery = getUrlQuery();
		const id = router.query.id || urlQuery.id;
		const fetchMethod = isAccepted ? fetchCancelAcceptPost : fetchAcceptPost;
		setBtnLoading(true);
		fetchMethod({
			variables: {
				id
			}
		}).then(res => {
			dispatch({
				type: TRIGGER_MESSAGE,
				payload: {
					globalMessage: {
						message: `${isAccepted ? "Cancel" : "Accept"} Post Success.`,
						severity: "success"
					}
				}
			})
			getDetailInfo()
		}).catch((res) => {
			setBtnLoading(false)
			dispatch({
				type: TRIGGER_MESSAGE,
				payload: {
					globalMessage: {
						message: `${isAccepted ? "Cancel" : "Accept"} Post Failed.`,
						severity: "error"
					}
				}
			})
		})
	}

	useEffect(() => {
		getDetailInfo()
	}, []);


	return (
		<AppLayout>
			<Card sx={{ width: "700px", ml: "150px", mt: "40px", margin: "100px auto" }}>
				<Grid
					container
					spacing={3}
					justifyContent="space-around"
					sx={{ mt: "20px" }}
				>
					<Grid item md={6} xs={12} alignItems="center">
						<H1 mb={2}>Post Tiltle: {postDetail.title}</H1>

						<FlexBox alignItems="center" mb={2}>
							<Box fontSize={18}>Posted by: </Box>
							<Link href={`/userProfile` /*post user url*/}>
								<H5
									ml={1}
									mr={1}
									sx={{ textDecoration: "underline" }}
								>
									{postDetail.posterUsername}
								</H5>
							</Link>
							<Link href={"/chat"}>
								<Typography
									textAlign="center"
									color="grey.600"
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
							</Link>
						</FlexBox>
						<Box fontSize={18}>Content: </Box>
						<FlexBox fontSize={18} alignItems="center" mb={2}>
							<Box fontSize={18}>{postDetail.content}</Box>
						</FlexBox>
						<Box mb={3}>Type: {FIND_TYPE_MAP[postDetail.type]}</Box>
						<Box mb={3}>
							State:{" "}
							{postDetail.state ? "Accepted" : "Not Accepted"}
						</Box>
						<Box mb={3}>
							Accept User:{" "}
							{postDetail.acceptorUsername
								? postDetail.acceptorUsername
								: "N/A"}
						</Box>
					
						<Box mb={3}>
							Post Time: {formatTime(postDetail.createdAt)}
						</Box>
                      {!isAccepted && !sameUser && <Hidden>
                        <LoadingButton
							variant={isAccepted ? "outlined" : "contained"}
							type="submit"
							loading={btnLoading}
							disabled={ (+postDetail.type === 0 && userData.type !== "worker") }
							fullWidth
							onClick={acceptOrCancelPost}
							color={isAccepted ? 'secondary' : "primary"}
							sx={{
								mb: "1.65rem",
								height: 44
							}}
						>
							
                             Accept Post
						</LoadingButton> </Hidden> }

					{isAcceptedByCurrentUser && <LoadingButton
							variant={isAccepted ? "outlined" : "contained"}
							type="submit"
							loading={btnLoading}
							// disabled={ (+postDetail.type === 0 && userData.type !== "worker") }
							fullWidth
							onClick={acceptOrCancelPost}
							color={isAccepted ? 'secondary' : "primary"}
							sx={{
								mb: "1.65rem",
								height: 44
							}}
						>
							{/* {isAccepted ? "Cancel Accepted Post" : "Accept Post"} */}
                           Cancel Accepted Post
						</LoadingButton> }
					</Grid>
				</Grid>
			</Card>
		</AppLayout>
	);
};

export default PostInformation;
