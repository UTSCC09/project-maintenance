import AppLayout from 'components/layout/AppLayout';
import { Chip, IconButton, Typography } from '@mui/material';
import DashboardPageHeader from 'components/profile/ProfileDashboardHeader';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Comments from 'components/comments/comments';
import Link from 'next/link';
import { Box } from '@mui/system';
import { H3, H5, Small,Medium } from 'components/Typography';
import EmailIcon from '@mui/icons-material/Email';
import { styled } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import FlexBox from 'components/FlexBox';
import { format } from 'date-fns';
import { Avatar, Button, Card, Grid } from '@mui/material';
import UserProfileLayout from 'components/layout/userProfileLayout';



const UserProfile = props => {
  
  return <AppLayout>
<UserProfileLayout>
  <DashboardPageHeader ml="20 "title = "Alice's Profile"
  /> 

<Box mb={4} >
        <Grid container spacing={3}>
          <Grid item lg={10} md={6} sm={12} xs={12}>
            <Card sx={{
            display: 'flex',
            p: '14px 32px',
            height: '100%',
            alignItems: 'center',
            bgcolor:"#F7E1A9070"
          }}>
              <Avatar src="/assets/u1.png" sx={{
              height: 64,
              width: 64,
              bgcolor:'#FFFFFF',
              
            }} />
              <Box ml={1.5} flex="1 1 0">
                <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center">
                  <div>
                    <H3 my="0px">Alice Alice</H3>
                    
                  </div>

                </FlexBox>
              </Box>
              <FlexBox flexDirection="column" p={1} mr={8}>
          <Medium color="grey.600" mb={0.5} textAlign="left">
            Email
          </Medium>
          <span>a@email.com</span>
        </FlexBox>
        <FlexBox flexDirection="column" p={1} mr={8}>
          <Medium color="grey.600" mb={0.5} textAlign="left">
            Phone
          </Medium>
          <span>+1234324324</span>
        </FlexBox>
              <Link href={'/chat'}>
          <Typography textAlign="center" color="grey.600" sx={{
          
          display: {
            xs: 'none',
            md: 'block'
          }
        }}>
            <IconButton>
              <ChatBubbleOutlineIcon fontSize="small" color="inherit" />
            </IconButton>
          </Typography>
          </Link>
            </Card>
          </Grid>
          </Grid>
      </Box>


  <DashboardPageHeader title = "Comments on Alice"/> 
  <Comments />
  </UserProfileLayout>
    </AppLayout>;
};





export default UserProfile;