import FlexBox from 'components/FlexBox';
import NavbarLayout from 'components/layout/NavbarLayout';
import Maintainer from 'components/homepage/Maintainer';
import { H3, Span } from 'components/Typography';
import { Grid, Pagination } from '@mui/material';
import React from 'react';

const Posts = () => {
  return <NavbarLayout>
      <H3 color="#2C2C2C" mb={2}>See Top Rated Mantainers</H3>

      <Grid container spacing={3}>
        {postsList.map((item, ind) => <Grid item lg={4} sm={6} xs={12} key={ind}>
            <Maintainer {...item} />
          </Grid>)}
      </Grid>

      <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt={4}>
        <Span color="grey.600">Showing 1-6 of 300 Posts</Span>
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
  userUrl:'/user/500000'
}, {
    title: 'Cat',
    user: 'Alice',
  postUrl: '/posts/53244445',
  content: 'this is the content',
  time: '2022-03-21',
  userUrl:'/user/500000'
}, {
    title: 'Cat',
    user: 'Alice',
  postUrl: '/posts/53244445',
  content: 'this is the content',
  time: '2022-03-21',
  userUrl:'/user/500000'
}, {
    title: 'Cat',
    user: 'Alice',
  postUrl: '/posts/53244445',
  content: 'this is the content',
  time: '2022-03-21',
  userUrl:'/user/500000'
}, {
    title: 'Cat',
    user: 'Alice',
  postUrl: '/posts/53244445',
  content: 'this is the content',
  time: '2022-03-21',
  userUrl:'/user/500000'
}, {
    title: 'Cat',
    user: 'Alice',
  postUrl: '/posts/53244445',
  content: 'this is the content',
  time: '2022-03-21',
  userUrl:'/user/500000'
}];
export default Posts;