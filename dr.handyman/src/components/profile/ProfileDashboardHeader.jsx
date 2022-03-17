
import FlexBox from 'components/FlexBox';

import { H2 } from 'components/Typography';
import Sidenav from 'components/sidenav/Sidenav';
import Menu from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import React from 'react';
const StyledBox = styled(Box)(({
 
}) => ({
  display: 'flex',
  marginTop: '20px',
  marginBottom: '20px',
  '& .headerHold': {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1
  }
}));

const DashboardPageHeader = ({
  title,
  button,
  navigation,
  ...props
}) => {
 

  return <StyledBox>
      
      <FlexBox mt={2} className="headerHold">
        <FlexBox alignItems="center">       
          <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
            {title}
          </H2>
        </FlexBox>
       
        <Box mt={2}>{button}</Box>
       
       

       
      </FlexBox>

   
    </StyledBox>;
};

export default DashboardPageHeader;