import { Container } from '@mui/material';
import React from 'react';

import AppLayout from './AppLayout';

const NavbarLayout = ({
  children
}) => {
  return <Container sx={{
      my: '2rem'
    }}>{children}</Container>
   ;
};

export default NavbarLayout;