import FlexBox from "components/FlexBox";
import NavbarLayout from "components/layout/NavbarLayout";
import Post from "./post";
import { H3, Span, H5,H4 } from "components/Typography";
import { Grid, Pagination } from "@mui/material";
import React from "react";
import PostRow from "components/PostRow";

import { GET_POSTS_QUERY, GET_COUNT } from "../../GraphQL/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { Query } from "react-query";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

const Posts = () => {
	// const [post, setPost] = useState([]);
	const [page, setPage] = useState(1);
	// console.log(useQuery(GET_POSTS_QUERY));
	const [getPosts, { data, loading, error }] = useLazyQuery(GET_POSTS_QUERY);
	const [getCount, { data: cdata, loading: cloading }] =
		useLazyQuery(GET_COUNT);
	// useEffect(() => {
	//   if (!loading){
	//   setPost(data.getAllPost);
	// },[])
	useEffect(() => {
		getCount();
		getPosts({ variables: { page: 0, postPerPage: 6 } });
	}, []);
	if (loading || cloading || data == undefined || cdata == undefined) {
		return <NavbarLayout><H3 color="#2C2C2C" mb={2}>
    See Newest Posts
  </H3><div>Loading...</div></NavbarLayout>;
	}
	console.log("load");
	console.log(loading);
	console.log(error);
	console.log(data);
	console.log(cdata);
let index1 = (page-1)*6+1;
let index2 = page*6;
if (cdata.getPostCount <= page*6) {
  index2 = cdata.getPostCount;
}
if (cdata.getPostCount == 0){
  index1=0;
  index2 = 0;
}
	// if (!loading) {
	// useEffect(() => {
	//   getPosts();
	//  },[])

	const handleChange = (event, value) => {
		getPosts({ variables: { page: value - 1, postPerPage: 6 } });
		console.log(page);
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
				{/* <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Information
        </H5> */}
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
				<H5
					flex="0 0 0 !important"
					color="grey.600"
					px={2.75}
					py={0.5}
					my={0}
				></H5>
			</PostRow>
      {cdata.getPostCount == 0 && 	<H4 color="#2C2C2C" mt={3}>
				No posts found.
			</H4>}
			{data.getPostPage.map((item, ind) => (
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
					Showing {index1}-{index2} of {cdata.getPostCount} Posts
				</Span>
				<Pagination
					count={Math.ceil(cdata.getPostCount / 6)}
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
