import React, { useState } from 'react';

import clsx from 'clsx';
import Image from 'components/AppImage';
import FlexBox from 'components/FlexBox';
import Login from 'components/sessions/Login';
import Link from 'next/link';
import { layoutConstant } from 'utils/constants';

import PersonOutline from '@mui/icons-material/PersonOutline';
import {
  Box,
  Container,
  Dialog,
  Drawer,
  IconButton,
  styled,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import SearchBox from '../search-box/SearchBox'; // component props interface

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

const Header = ({
  isFixed,
  className
}) => {
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const toggleSidenav = () => setSidenavOpen(!sidenavOpen);

  const toggleDialog = () => setDialogOpen(!dialogOpen);

  
  
  
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
              <Image height={50} mb={0.5} src="/assets/title3.png" alt="logo" />
            </a>
          </Link>

          
        </FlexBox>

        <FlexBox justifyContent="center" flex="1 1 0">
          <SearchBox />
        </FlexBox>

        <FlexBox alignItems="center" sx={{
        display: {
          xs: 'none',
          md: 'flex'
        }
      }}>
          <Box component={IconButton} ml={2} p={1.25} bgcolor="#FCBEAF" onClick={toggleDialog}>
            <PersonOutline />
          </Box>
         
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