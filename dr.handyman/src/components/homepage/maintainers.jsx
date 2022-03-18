import FlexBox from 'components/FlexBox';
import NavbarLayout from 'components/layout/NavbarLayout';
import Maintainer from './maintainer';
import { H3, Span } from 'components/Typography';
import { Grid, Pagination } from '@mui/material';
import React from 'react';
import { useSelector } from "react-redux";

import { GET_POSTS_QUERY, WORKER_COUNT, GET_WORKER } from "../../GraphQL/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { Query } from 'react-query';
import {useState, useEffect} from "react";
import { useLazyQuery } from '@apollo/client';

const MaintainerList = () => {
  const userData = useSelector(state => state.userData);
  console.log('userData', userData)

  const [page, setPage] = useState(1);
  // console.log(useQuery(GET_POSTS_QUERY));
  const [getWorkers, {data, loading, error }] = useLazyQuery(GET_WORKER);
  const [getCount, { data: cdata, loading: cloading }] = useLazyQuery(WORKER_COUNT);

  useEffect(() => {
    getCount();
    getWorkers({variables: {page: 0, workerPerPage: 6}});
   },[])
  if (loading || cloading || data == undefined || cdata == undefined) {
    return <div>Loading...</div>;
  }

  const handleChange = (event, value) => {
    getWorkers({variables: {page: value-1, workerPerPage: 6}});

    setPage(value);
  }

  return <NavbarLayout>
      <H3 color="#2C2C2C" mb={2}>See Top Rated Mantainers</H3>

      <Grid container spacing={3}>
        {data.getWorkerPage.map((item, ind) => <Grid item lg={4} sm={6} xs={12} key={ind}>
            <Maintainer {...item} />
          </Grid>)}
      </Grid>

      <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt={4}>
        <Span color="grey.600">Showing 1-6 of {maintainerList.length} Maintaners</Span>
        <Pagination count={Math.ceil(cdata / 6)} page={page} onChange={handleChange} boundaryCount={0} siblingCount={0} variant="outlined" color="primary" />
      </FlexBox>
    </NavbarLayout>;
};

const maintainerList = [{
  name: 'Cat',
  rating: 5,
  address: 'Toronto',
  phone: '(613) 343-9004',
  imgUrl: '/assets/u1.png',
  profileUrl: '/maintainers/53244445'
}, {
  name: 'Adam',
  rating: 5,
  address: 'Markham',
  phone: '(613) 343-9004',
  imgUrl: '/assets/u1.png',
  profileUrl: '/maintainers/53244445'
}, {
  name: 'Kevin',
  rating: 4.5,
  address: 'Scarborough',
  phone: '(613) 343-9004',
  imgUrl: '/assets/u1.png',
  profileUrl: '/maintainers/53244445'
}, {
  name: 'Bob',
  rating: 2,
  address: 'Markham',
  phone: '(613) 343-9004',
  imgUrl: '/assets/u1.png',
  profileUrl: '/maintainers/53244445'
}, {
  name: 'Alice',
  rating: 3,
  address: 'Scarborough',
  phone: '(613) 343-9004',
  imgUrl: '/assets/u1.png',
  profileUrl: '/maintainers/53244445'
}, {
  name: 'John',
  rating: 4.3,
  address: 'Scarborough',
  phone: '(613) 343-9004',
  imgUrl: '/assets/u1.png',
  profileUrl: '/maintainers/53244445'
}];
export default MaintainerList;