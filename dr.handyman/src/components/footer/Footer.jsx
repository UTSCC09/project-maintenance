import React from 'react';

import { styled } from '@mui/material';
import Link from 'next/link'

const StyledLink = styled('a')(({
  theme
}) => ({
  position: 'relative',
  display: 'block',
  padding: '0.3rem 0rem',
  color: theme.palette.grey[500],
  cursor: 'pointer',
  borderRadius: 4,
  '&:hover': {
    color: theme.palette.grey[100]
  }
}));

const Footer = () => {
  return <footer>
      <Link href="/credit" >
          <a>Credits</a>
      </Link>
    </footer>;
};


export default Footer;