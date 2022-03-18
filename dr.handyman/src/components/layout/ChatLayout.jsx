import { Container, Grid } from '@mui/material';
import React from 'react';
import ContactListRow from '../chat/ContactListRow';
import ProfileDashboardNavigation from '../profile/ProfileDashboardNav';
import ContactList from '../chat/ContactList';
const ChatLayout= ({
  children
}) => 
    <Container sx={{
    my: '40px',
    ml: '20px',
   
   
  }}>
      <Grid container spacing={3}>
        <Grid item  sx={{
        display: {
          xs: 'none',
          sm: 'none',
          md: 'block'
        }
      }}>
          <ContactList />
        </Grid>
        <Grid item >
          {children}
        </Grid>
      </Grid>
    </Container>;

export default ChatLayout;