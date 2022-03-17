import React from 'react';
import { Typography } from '@mui/material';
  

  import FlexBox from 'components/FlexBox';
  import {
  
    H5,
    Medium,
  } from 'components/Typography';

  import Link from 'next/link';

  
  
  import {
    Box,
    Card,
    Divider,
    
    Button
  } from '@mui/material';
  import { styled } from '@mui/material/styles';
  
  
  const StyledCard = styled(({
    children,

    ...rest
  }) => <Card {...rest}>{children}</Card>)(({
    

  }) => ({
    width: 600,
    
    ".content": {
      textAlign: "center",
      padding: "3rem 3.75rem 0px",
      
    },
   
  }));
  
  const AppointmentInfo =({
    appointment
  }) => {
    
    
    
    return <StyledCard elevation={3} >
        <form className="content" >
          <H5 textAlign="center" mb={1} fontSize="18px">
            Appointment Information
          </H5>
          <Medium fontSize="16px" color="grey.800" textAlign="center" mb={4.5} display="block">
          Description: {appointment.content}
        </Medium>
        <Link href={appointment.userUrl} >
          <Typography fontSize="16px" color="grey.800" textAlign="center"  mb={4.5}sx={{textDecorationLine:'underline'}} >
            With: {appointment.with}
          </Typography></Link>
        <Medium fontSize="16px" color="grey.800" textAlign="center" mb={4.5} display="block">
          Time: {appointment.time}
        </Medium>
        <Medium fontSize="16px" color="grey.800" textAlign="center" mb={4.5} display="block">
          Status: {appointment.status}
        </Medium>
        <Button variant="contained"  type="submit" fullWidth sx={{
          mb: "1.65rem",
          height: 44,
          bgcolor:"#5498E6",
          "&:hover": {   
            bgcolor:"#4790E5"
          }
        }}>
            Change Appointment Time
          </Button>
          <Button variant="contained"  type="submit" fullWidth sx={{
          mb: "1.65rem",
          height: 44,
          bgcolor:"#E33939",
          "&:hover": {   
            bgcolor:"#F20E0E"
          }
        }}>
            Cancel Appointment
          </Button>

          
  
          <Box mb={2}>
            <Box width="200px" mx="auto">
              <Divider />
            </Box>
  
            <FlexBox justifyContent="center" mt={-1.625}>
              <Box color="#AEB4BE" bgcolor="#F6F9FC" px={2}>
               
              </Box>
            </FlexBox>
          </Box>
  
         
          
        </form>
  
      </StyledCard>;
  };
  
  
  export default AppointmentInfo;