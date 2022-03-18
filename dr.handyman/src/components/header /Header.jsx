import React, { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import clsx from 'clsx';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FlexBox from 'components/FlexBox';
import Login from 'components/sessions/Login';
import Link from 'next/link';
import { layoutConstant } from 'utils/constants';
import NewPost from 'components/NewPost';
import PersonOutline from '@mui/icons-material/PersonOutline';
import {
  Box,
  Container,
  Dialog,
  Drawer,
  IconButton,
  styled,
  useMediaQuery,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import SearchBox from '../homepage/SearchBox'; // component props interface
import { useSelector } from "react-redux";

// styled component
export const HeaderWrapper = styled(Box)(({
  theme
}) => ({
  position: 'relative',
  zIndex: 1,
  height: layoutConstant.headerHeight,
  background: theme.palette.background.paper,
  transition: 'height 250ms ease-in-out',
  [theme.breakpoints.down('sm')]: {
    height: layoutConstant.mobileHeaderHeight
  }
}));

// https://codesandbox.io/s/kywquu?file=/demo.js
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:hover': {
        backgroundColor: '#B9D9EF'
        
      },
    },
  },
}));


const Header = ({
  isFixed,
  className
}) => {
  
  const [anchorEl, setAnchorEl] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const userData = useSelector(state => state.userData);

  const toggleSidenav = () => setSidenavOpen(!sidenavOpen);
  const togglePostDialog = () => setPostDialogOpen(!postDialogOpen);
  const toggleDialog = () => {
    if (!userData.email) {
      setDialogOpen(!dialogOpen)
    };
  };

  useEffect(() => {
    if (userData.email) setDialogOpen(false);
    }, [userData]);

  let button;
  if (userData.email) {
    button = <Box component={IconButton} ml={2} p={1.25} mr={2} bgcolor="#99CBE9" onClick={handleClick} >
    <PersonOutline />
    
  </Box>;
  } else {
    button = <Box component={IconButton} ml={2} p={1.25} mr={2} bgcolor="#99CBE9" onClick={toggleDialog} >
    <PersonOutline />
  </Box>
  }
  return <HeaderWrapper className={clsx(className)}>
      <Container sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%'
    }}>
        <FlexBox alignItems="center" mr={2} minWidth="170px" sx={{
        display: {
          xs: 'none',
          md: 'flex'
        }
      }}>
          <Link href="/">
            <a>
              <img height={50} mb={0.5} src="/assets/title.jpg" alt="logo"/>
            </a>
          </Link>
          
        </FlexBox>

        <FlexBox justifyContent="center" flex="1 1 0">
          <SearchBox />
        </FlexBox>
{/* {userData.email &&  */}

<Button sx={{
       
        bgcolor: '#99CBE9',
        color:"#3D3F40"
      }} onClick={togglePostDialog}>
              New Posts
            </Button>
{/* } */}
<Dialog open={postDialogOpen} fullWidth={isMobile} scroll="body" onClose={togglePostDialog}>
          <NewPost />
        </Dialog>
        <FlexBox alignItems="center" sx={{
        display: {
          xs: 'none',
          md: 'flex'
        }
      }}>
         {button}
         <FlexBox sx={{
          color:'#6C6E6E'
         }}>{userData.username}</FlexBox>
          {
         userData.email && 
          <StyledMenu
              id="demo-customized-menu"
              MenuListProps={{
                'aria-labelledby': 'demo-customized-button'
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem disableRipple>

                My Profile
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem disableRipple>

                My Posts
              </MenuItem>
             
              <MenuItem disableRipple>

                My Comments
              </MenuItem>
              

              
              <MenuItem disableRipple>

                My Appointments
              </MenuItem>
              <MenuItem disableRipple>

                Accepted Posts
              </MenuItem>
              <MenuItem disableRipple>

               ChatBox
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem disableRipple>

               Log out
              </MenuItem>
            </StyledMenu>}
        </FlexBox>

        <Dialog open={dialogOpen} fullWidth={isMobile} scroll="body" onClose={toggleDialog}>
          <Login />
        </Dialog>

        <Drawer open={sidenavOpen} anchor="right" onClose={toggleSidenav}>
          
        </Drawer>
      </Container>
    </HeaderWrapper>;
};

export default Header
;