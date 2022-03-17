import FlexBox from 'components/FlexBox';
import NavbarLayout from 'components/layout/NavbarLayout';

import { H3, Span,H5 } from 'components/Typography';
import { Grid, Pagination } from '@mui/material';
import React from 'react';
import PostRow from 'components/PostRow';
import Comment from './comment';

const Comments = () => {
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
        
        
        <H5 color="grey.600"  mx={0.75} textAlign="left">
          Posted By
        </H5>
        <H5 color="grey.600"  mx={0.75} textAlign="left">
         Content
        </H5>
        <H5 color="grey.600" mx={0.75} textAlign="left">
          Post Time
        </H5>
        
      </PostRow>
      {commentsList.map((item, ind) => <Comment comment={item} key={ind} />)}
     
      <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt={4}>
        <Span color="grey.600">Showing 1-6 of {commentsList.length} Comments</Span>
        <Pagination count={Math.ceil(commentsList.length / 6)} variant="outlined" color="primary" />
      </FlexBox>
    </NavbarLayout>;
};

const commentsList = [{
   
    user: 'Alice',
  
  content: 'this is the co ntent ',
  time: '2022-03-21',
  userUrl:'/users/500000'
  
}, {
  
  user: 'Alice',

content: 'this is the content',
time: '2022-03-21',
userUrl:'/users/500000',

}, {
    user: 'Alice',

    content: 'this is the content',
    time: '2022-03-21',
    userUrl:'/users/500000',
  
}, {
    user: 'Alice',

    content: 'this is the content',
    time: '2022-03-21',
    userUrl:'/users/500000',

}, {
    user: 'Alice',

    content: 'this is the content',
    time: '2022-03-21',
    userUrl:'/users/500000',


}, {
    user: 'Alice',

    content: 'this is the content',
    time: '2022-03-21',
    userUrl:'/users/500000',

}];
export default Comments;