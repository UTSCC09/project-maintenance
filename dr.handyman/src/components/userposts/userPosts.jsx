import FlexBox from 'components/FlexBox';
import NavbarLayout from 'components/layout/NavbarLayout';
import UserPost from './userPost';
import { H3, Span,H5 } from 'components/Typography';
import { Grid, Pagination } from '@mui/material';
import React from 'react';
import PostRow from 'components/PostRow';

import { GET_USER_POST, GET_USER_POST_COUNT} from "../../GraphQL/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { Query } from "react-query";
import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";



const UserPosts = () => {

  const [page, setPage] = useState(1);

	const [getUserPostsPage, { data, loading, error }] = useLazyQuery(GET_USER_POST);
	const [getCount, { data: cdata, loading: cloading }] = useLazyQuery(GET_USER_POST_COUNT);
	
	useEffect(() => {
		getCount();
		getUserPostsPage({ variables: { page: 0, userPostPerPage: 6 } });
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
  if (cdata.getUserPostCount <= page*6) {
    index2 = cdata.getUserPostCount;
  }
  if (cdata.getUserPostCount == 0){
    index1=0;
    index2 = 0;
  }
  
	const handleChange = (event, value) => {
		getUserPostsPage({ variables: { page: value - 1, postPerPage: 6 } });
		console.log(page);
		setPage(value);
	};

  return <NavbarLayout>
      

      <PostRow sx={{
      display: {
        xs: 'none',
        md: 'flex'
      },
      padding: '0px 18px',
      background: 'none',
      bgcolor: '#F7E1A9'
    }} elevation={0}>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Title
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Information
        </H5>
       
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Posts Type
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Post Time
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          State
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          User Accept
        </H5>
        <H5 flex="0 0 0 !important" color="grey.600" px={2.75} py={0.5} my={0}></H5>
      </PostRow>
      {data.getUserPostsPage.map((item, ind) => <UserPost post={item} key={ind} />)}
     
      <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt={4}>
        <Span color="grey.600">Showing 1-6 of {postsList.length} Posts</Span>
        <Pagination count={Math.ceil(cdata.getUserPostCount / 6)} page={page}
					onChange={handleChange}
					boundaryCount={0}
					siblingCount={0}
					variant="outlined"
					color="primary" />
      </FlexBox>
    </NavbarLayout>;
};

const postsList = [{
    title: 'Cat',
    user: 'Alice',
  postUrl: '/posts/53244445',
  content: 'this is the content',
  time: '2022-03-21',
  userUrl:'/users/500000',
  type: 'Find a Contractor',
  state:'Accepted',
  userAccept:'Bob'
  
}, {
  title: 'Cat',
  user: 'Alice',
postUrl: '/posts/53244445',
content: 'this is the content',
time: '2022-03-21',
userUrl:'/users/500000',
type:'Find a Contractor',
state:'Accepted',
userAccept:'Bob'
}, {
  title: 'Cat',
    user: 'Alice',
  postUrl: '/posts/53244445',
  content: 'this is the content',
  time: '2022-03-21',
  userUrl:'/users/500000',
  type:'Find a Contractor',
  state:'Not Accepted',
  userAccept:'N/A'
  
}, {
  title: 'Cat',
  user: 'Alice',
postUrl: '/posts/53244445',
content: 'this is the content',
time: '2022-03-21',
userUrl:'/users/500000',
type:'Find a Handyman',
state:'Not Accepted',
userAccept:'N/A'

}, {
  title: 'Cat',
  user: 'Alice',
postUrl: '/posts/53244445',
content: 'this is the content',
time: '2022-03-21',
userUrl:'/users/500000',
type:'Find a Handyman',
state:'Not Accepted',
userAccept:'N/A'

}, {
  title: 'Cat',
  user: 'Alice',
postUrl: '/posts/53244445',
content: 'this is the content',
time: '2022-03-21',
userUrl:'/user/500000',
type:'Find a Handyman',
state:'Not Accepted',
userAccept:'N/A'

}];
export default UserPosts;