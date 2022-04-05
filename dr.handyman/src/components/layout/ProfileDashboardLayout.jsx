/*
from https://mui.com/store/items/bazar-pro-react-ecommerce-template
*/


import { Container, Grid } from '@mui/material';
import React from 'react';
import ProfileDashboardNavigation from '../profile/ProfileDashboardNav';

const ProfileDashboardLayout= ({
  children
}) => 
    <Container sx={{
    my: '40px'
   
  }}>
      <Grid container spacing={3}>
        <Grid item lg={3} xs={12} sx={{
        display: {
          xs: 'none',
          sm: 'none',
          md: 'block'
        }
      }}>
          <ProfileDashboardNavigation />
        </Grid>
        <Grid item lg={9} xs={12}>
          {children}
        </Grid>
      </Grid>
    </Container>;

export default ProfileDashboardLayout;