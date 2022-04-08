import { Container, Grid } from '@mui/material';
import React from 'react';
import ProfileDashboardNavigation from '../profile/ProfileDashboardNav';

const UserProfileLayout= ({
  children
}) => 
    <Container sx={{
    my: '40px',
    ml: '0px'
   
  }}>
      <Grid container spacing={3}>
        <Grid item lg={3} xs={12} sx={{
        display: {
          xs: 'none',
          sm: 'none',
          md: 'block'
        }
      }}>
          
        </Grid>
        <Grid item lg={9} xs={12}>
          {children}
        </Grid>
      </Grid>
    </Container>;

export default UserProfileLayout;