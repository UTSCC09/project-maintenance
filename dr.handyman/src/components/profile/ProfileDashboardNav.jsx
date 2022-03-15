import FlexBox from 'components/FlexBox';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import Person from '@mui/icons-material/Person';
import CommentIcon from '@mui/icons-material/Comment';
import EmailIcon from '@mui/icons-material/Email';
import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import PostAddIcon from '@mui/icons-material/PostAdd';
import React, { Fragment } from 'react';
import { DashboardNavigationWrapper, StyledDashboardNav } from '../layout/DashboardStyle';

const ProfileDashboardNavigation = () => {
  const {
    pathname
  } = useRouter();
  return <DashboardNavigationWrapper sx={{
    px: '0px',
    pb: '1.5rem',
    color: 'grey.900',
    my:'50px',
    bgcolor: '#D2E8FF'
   
  }}>
      {linkList.map(item => <Fragment key={item.title}>
          <Typography p="26px 30px 1rem" color="grey.600" fontSize="12px">
            {item.title}
          </Typography>
          {item.list.map(item => <StyledDashboardNav isCurrentPath={pathname.includes(item.href)} href={item.href} key={item.title}>
              <FlexBox alignItems="center">
                <item.icon className="nav-icon" fontSize="small" color="inherit" sx={{
            mr: '10px'
          }} />

                <span>{item.title}</span>
              </FlexBox>
            
            </StyledDashboardNav>)}
        </Fragment>)}
    </DashboardNavigationWrapper>;
};

const linkList = [{
  title: 'DASHBOARD',
  list: [{
    href: '/userPostPage',
    title: 'My Posts',
    icon: PostAddIcon,
    
  }, {
    href: '/userAppointment',
    title: 'My Appointments',
    icon: CalendarTodayIcon,
   
  },{
    href: '/userComment',
    title: 'My Comments',
    icon: CommentIcon,
   
  },{
    href: '/userMessage',
    title: 'MessageBox',
    icon: EmailIcon,
   
  } ]
}, {
  title: 'ACCOUNT SETTINGS',
  list: [{
    href: '/profile',
    title: 'My Profile',
    icon: Person,
    
  }]
}];
export default ProfileDashboardNavigation;