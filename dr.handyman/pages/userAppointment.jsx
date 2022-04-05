import AppLayout from 'components/layout/AppLayout';
import ProfileDashboardLayout from 'components/layout/ProfileDashboardLayout';
import DashboardPageHeader from 'components/profile/ProfileDashboardHeader';
import ProfileDashboardNavigation from 'components/profile/ProfileDashboardNav';
import Link from 'next/link';
import { Box } from '@mui/system';


import { styled } from '@mui/material/styles';
import FlexBox from 'components/FlexBox';
import NavbarLayout from 'components/layout/NavbarLayout';
import Appointment from '../src/components/appointment/Appointment';
import { H3, Span,H5 } from 'components/Typography';
import { Pagination } from '@mui/material';
import React from 'react';
import PostRow from 'components/PostRow';
import Paper from '@mui/material/Paper';

import { format } from 'date-fns';
import { Avatar, Button, Card, Grid, Typography } from '@mui/material';




const UserAppointment = props => {
  
  return <AppLayout>
<ProfileDashboardLayout > 
  <DashboardPageHeader title = "My Appointment" 
  
    navigation={<ProfileDashboardNavigation />} /> 

<NavbarLayout>
      

      <PostRow sx={{
      display: {
        xs: 'none',
        md: 'flex'
      },
      padding: '0px 18px',
      background: 'none',
      bgcolor: '#F7E1A9'
    }} elevation={0}>
        <H5 color="grey.600" mx={0.75} textAlign="left">
          Information
        </H5>
        <H5 color="grey.600" mx={0.75} textAlign="left">
          With
        </H5>
        <H5 color="grey.600" mx={0.75}  textAlign="left">
          Time
        </H5>
        <H5 color="grey.600" textAlign="left">
          State
        </H5>
        <H5 flex="0 0 0 !important" color="grey.600" px={2.75} py={0.5} my={0}></H5>
      </PostRow>
     {appointmentList.map((item, ind) => <Appointment appointment={item} key={ind} />)}
     
      <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt={4}>
        <Span color="grey.600">Showing 1-{appointmentList.length} of {appointmentList.length} Appointments</Span>
        <Pagination count={Math.ceil(appointmentList.length / 6)} variant="outlined" color="primary" />
      </FlexBox>
    </NavbarLayout>


</ProfileDashboardLayout>
    </AppLayout>;
};


const appointmentList = [{

with: 'Alice',
content: 'this is the conte sdjf jfa dq w qj  nqn nq q; nfqn; fnqn;nnqjfn;jqip f afjn fioaf nt',
time: '2022-03-21',
userUrl:'/users/500000',
status: 'Upcoming'

}, {
  
with: 'Alice',
content: 'this is the  ijaf content',
time: '2022-03-21',
userUrl:'/users/500000',
status:'Finished'
}, {
 
with: 'Alice',
content: 'this is the content',
time: '2022-03-21',
userUrl:'/users/500000',
status:'Cancelled'

}];


export default UserAppointment;