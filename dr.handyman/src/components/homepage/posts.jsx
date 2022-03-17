import FlexBox from 'components/FlexBox';
import NavbarLayout from 'components/layout/NavbarLayout';
import Post from './post';
import { H3, Span,H5 } from 'components/Typography';
import { Grid, Pagination } from '@mui/material';
import React from 'react';
import PostRow from 'components/PostRow';

import { GET_POSTS_QUERY } from "../../GraphQL/getAllPost";
import { useMutation, useQuery } from "@apollo/client";
import { Query } from 'react-query';
import {useState, useEffect} from "react";



const Posts = () => {

  const [post, setPost] = useState([]);
  // console.log(useQuery(GET_POSTS_QUERY));
  const {data, loading, error } = useQuery(GET_POSTS_QUERY);
  // useEffect(() => {
  //   if (!loading){
  //   setPost(data.getAllPost);
  // },[])
  if (loading) {
    return <div>Loading...</div>;
  }
  console.log("load");
  console.log(loading);
  console.log(error);
  console.log(data);

  // if (!loading) {
  // useEffect(() => {
  //   setPost(data.getAllPost);
  // },[])
  // }


  return <NavbarLayout>
      

      <PostRow sx={{
      display: {
        xs: 'none',
        md: 'flex'
      },
      padding: '0px 18px',
      background: 'none',
      bgcolor: '#B9D9EF'
    }} elevation={0}>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Title
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Information
        </H5>
        <H5 color="grey.600" my="0px" mx={0.75} textAlign="left">
          Posted By
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
          Accept User
        </H5>
        <H5 flex="0 0 0 !important" color="grey.600" px={2.75} py={0.5} my={0}></H5>
      </PostRow>
      {postsList.map((item, ind) => <Post post={item} key={ind} />)}
     
      <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt={4}>
        <Span color="grey.600">Showing 1-6 of {postsList.length} Posts</Span>
        <Pagination count={Math.ceil(postsList.length / 6)} variant="outlined" color="primary" />
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
  state :'Not Accepted',
  userAccept:'N/A'
  
}, {
  title: 'Cat',
  user: 'Alice',
postUrl: '/posts/53244445',
content: 'this is the content',
time: '2022-03-21',
userUrl:'/users/500000',
type:'Find a Contractor',
state :'Not Accepted',
userAccept:'N/A'
}, {
  title: 'Cat',
    user: 'Alice',
  postUrl: '/posts/53244445',
  content: 'this is the content',
  time: '2022-03-21',
  userUrl:'/users/500000',
  type:'Find a Contractor',
  state :'Not Accepted',
  userAccept:'N/A'
  
}, {
  title: 'Cat',
  user: 'Alice',
postUrl: '/posts/53244445',
content: 'this is the content',
time: '2022-03-21',
userUrl:'/users/500000',
type:'Find a Handyman',
state :'Accepted',
userAccept:'Bob'

}, {
  title: 'Cat',
  user: 'Alice',
postUrl: '/posts/53244445',
content: 'this is the content',
time: '2022-03-21',
userUrl:'/users/500000',
type:'Find a Handyman',
state :'Accepted',
userAccept:'Bob'

}, {
  title: 'Cat',
  user: 'Alice',
postUrl: '/posts/53244445',
content: 'this is the content dhaoh dahd jwio hipdhw qipdh phiadwhipwqh djwipadj  djaij  jpwaj jdpqwj jdpj jpjwoqj jpwqji jpw jj eowpjqp jpqwpjp jqwjpjpj jjwpqjpoq jpwjqj oqwj pqjwrop',
time: '2022-03-21',
userUrl:'/user/500000',
type:'Find a Handyman',
state :'Accepted',
userAccept:'Bob'

}];
export default Posts;