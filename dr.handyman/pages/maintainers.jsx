import FlexBox from 'components/FlexBox';
import NavbarLayout from 'components/layout/NavbarLayout';
import Maintainer from 'components/homepage/Maintainer';
import { H3, Span } from 'components/Typography';
import { Grid, Pagination } from '@mui/material';
import React from 'react';

const MaintainerList = () => {
  return <NavbarLayout>
      <H3 color="#2C2C2C" mb={2}>See Top Rated Mantainers</H3>

      <Grid container spacing={3}>
        {maintainerList.map((item, ind) => <Grid item lg={4} sm={6} xs={12} key={ind}>
            <Maintainer {...item} />
          </Grid>)}
      </Grid>

      <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt={4}>
        <Span color="grey.600">Showing 1-6 of 300 Maintaners</Span>
        <Pagination count={Math.ceil(maintainerList.length / 6)} variant="outlined" color="primary" />
      </FlexBox>
    </NavbarLayout>;
};

const maintainerList = [{
  name: 'Cat',
  rating: 5,
  address: 'Toronto',
  phone: '(613) 343-9004',
  imgUrl: '/assets/images/faces/propic.png',
  profileUrl: '/maintainers/53244445'
}, {
  name: 'Adam',
  rating: 5,
  address: 'Markham',
  phone: '(613) 343-9004',
  imgUrl: '/assets/images/faces/propic.png',
  profileUrl: '/maintainers/53244445'
}, {
  name: 'Kevin',
  rating: 4.5,
  address: 'Scarborough',
  phone: '(613) 343-9004',
  imgUrl: '/assets/images/faces/propic.png',
  profileUrl: '/maintainers/53244445'
}, {
  name: 'Bob',
  rating: 2,
  address: 'Markham',
  phone: '(613) 343-9004',
  imgUrl: '/assets/images/faces/propic.png',
  profileUrl: '/maintainers/53244445'
}, {
  name: 'Alice',
  rating: 3,
  address: 'Scarborough',
  phone: '(613) 343-9004',
  imgUrl: '/assets/images/faces/propic.png',
  profileUrl: '/maintainers/53244445'
}, {
  name: 'John',
  rating: 4.3,
  address: 'Scarborough',
  phone: '(613) 343-9004',
  imgUrl: '/assets/images/faces/propic.png',
  profileUrl: '/maintainers/53244445'
}];
export default MaintainerList;