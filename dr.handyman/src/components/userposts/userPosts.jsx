import FlexBox from 'components/FlexBox';
import NavbarLayout from 'components/layout/NavbarLayout';
import UserPost from './userPost';
import { H3, Span,H5 } from 'components/Typography';
import { Grid, Pagination } from '@mui/material';
import React from 'react';
import PostRow from 'components/PostRow';


const UserPosts = () => {
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
        <H5 flex="0 0 0 !important" color="grey.600" px={2.75} py={0.5} my={0}></H5>
      </PostRow>
      {postsList.map((item, ind) => <UserPost post={item} key={ind} />)}
     
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
  type: 'Find a Contractor'
  
}, {
  title: 'Cat',
  user: 'Alice',
postUrl: '/posts/53244445',
content: 'this is the content',
time: '2022-03-21',
userUrl:'/users/500000',
type:'Find a Contractor'
}, {
  title: 'Cat',
    user: 'Alice',
  postUrl: '/posts/53244445',
  content: 'this is the content',
  time: '2022-03-21',
  userUrl:'/users/500000',
  type:'Find a Contractor'
  
}, {
  title: 'Cat',
  user: 'Alice',
postUrl: '/posts/53244445',
content: 'this is the content',
time: '2022-03-21',
userUrl:'/users/500000',
type:'Find a Handyman'

}, {
  title: 'Cat',
  user: 'Alice',
postUrl: '/posts/53244445',
content: 'this is the content',
time: '2022-03-21',
userUrl:'/users/500000',
type:'Find a Handyman'

}, {
  title: 'Cat',
  user: 'Alice',
postUrl: '/posts/53244445',
content: 'this is the content',
time: '2022-03-21',
userUrl:'/user/500000',
type:'Find a Handyman'

}];
export default UserPosts;