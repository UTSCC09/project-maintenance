import Row from 'components/PostRow';
import { H5 } from 'components/Typography';
import East from '@mui/icons-material/East';
import { Chip, IconButton, Typography ,Dialog} from '@mui/material';
import { Box } from '@mui/system';
import { format } from 'date-fns';
import Link from 'next/link';
import React, { useState } from 'react';
import UserPostInfo from './userPostInfo';
const UserPost = ({
  post
}) => {
  const getTypeColor = status => {
    switch (status) {
      case 'Find a Handyman':
        return '#A9BDF7';

      case 'Find a Contractor':
        return '#B6EBAC';

     
    }
  };
  const [dialogOpen, setDialogOpen] = useState(false);
  const toggleDialog = () => setDialogOpen(!dialogOpen);
  return <Row sx={{
        my: '1rem',
        padding: '6px 18px',
        bgcolor: '#F7E1A9',
        "&:hover": {   
          bgcolor:"#F3B356"
        }
      }}>
          <H5 m={0.75} textAlign="left">
           {post.title}
          </H5>
          
          <Typography m={0.75} textAlign="left"> {post.content}
           
          </Typography>
         
         
          <Box m={0.75}>
            <Chip size="5rem" label={post.type} sx={{
          
            fontSize: 13,
            
            backgroundColor: getTypeColor(post.type)
          }} />
          </Box>

          <Typography className="pre" m={0.75} textAlign="left">
          {post.time}
          </Typography>
 
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
          <UserPostInfo post={post} />
        </Dialog>
          </Typography>
         
        </Row>
      
};

export default UserPost;