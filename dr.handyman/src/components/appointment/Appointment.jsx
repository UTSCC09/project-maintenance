import Row from 'components/PostRow';
import { H5 } from 'components/Typography';
import FlexBox from 'components/FlexBox';
import { Chip, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';

import Link from 'next/link';
import AppointmentInfo from './AppointmentInfo';
import {
  
  Container,
  Dialog,
  Drawer,

  styled,
  useMediaQuery,
} from '@mui/material';
import East from '@mui/icons-material/East';
import React, { useState } from 'react';
const Appointment = ({
  appointment
}) => {
  const getTypeColor = status => {
    switch (status) {
      case 'Finished':
        return '#77ABC9';

      case 'Upcoming':
        return '#B6EBAC';

      case 'Cancelled':
            return '#C97777';
     
    }
    
   
  };
  const [dialogOpen, setDialogOpen] = useState(false);
  const toggleDialog = () => setDialogOpen(!dialogOpen);
  return <Row sx={{
        my: '1rem',
        padding: '6px 18px',
        bgcolor:"#F7E1A9",
        "&:hover": {   
          bgcolor:"#F3B356"
        }
      }}>
          <H5 m={0.75} textAlign="left">
           {appointment.content}
          </H5>
          
          
         
        
          <Typography m={0.75} textAlign="left">
            {appointment.with}
          </Typography>

          <Typography className="pre" m={0.75} textAlign="left">
          {appointment.time}
          </Typography>
          
          <Box m={0.75}>
            <Chip size="5rem" label={appointment.status} sx={{
          
            fontSize: 13,
            
            backgroundColor: getTypeColor(appointment.status)
          }} />
          </Box>

          

          
          <Typography textAlign="center" color="grey.600" sx={{
          flex: '0 0 0 !important',
          display: {
            xs: 'none',
            md: 'block'
          }
        }}>
          <Box component={IconButton} ml={2} p={1.25} bgcolor="#F7E1A9" onClick={toggleDialog}>
            <East />
          </Box>
            <Dialog open={dialogOpen} scroll="body" onClose={toggleDialog}>
          <AppointmentInfo appointment={appointment} />
        </Dialog>
          </Typography>
        
        </Row>
    
      
};

export default Appointment;