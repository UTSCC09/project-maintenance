import { Container, Grid } from '@mui/material';
import React from 'react';
import ProfileDashboardNavigation from '../profile/ProfileDashboardNav';

const ContactListLayout= ({
  children
}) => 
    <Container sx={{
    my: '40px',
    ml: '10px',
    mr:'10px',
    border:'solid grey',
    borderRadius:'20px',
    boxShadow:'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    width:'400px',
    height:'500px'
   
  }}>
      <Grid container spacing={0}>
        <Grid item  sx={{
        display: {
          xs: 'none',
          sm: 'none',
          md: 'block',
          p:'1,1,1,1'
        }
      }}>
          
        </Grid>
        <Grid item >
          {children}
        </Grid>
      </Grid>
    </Container>;

export default ContactListLayout;