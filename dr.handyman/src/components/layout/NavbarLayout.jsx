import { Container } from '@mui/material';
import React from 'react';

import AppLayout from './AppLayout';

const NavbarLayout = ({
  children
}) => {
  return <Container sx={{
      marginTop: '2rem',
      marginBottom:'3rem'
    }}>{children}</Container>
   ;
};

export default NavbarLayout;