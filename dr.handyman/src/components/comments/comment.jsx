import Row from 'components/PostRow';
import { H5 } from 'components/Typography';
import East from '@mui/icons-material/East';
import { Chip, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

const Comment = ({
  comment
}) => {
  
  return <Row sx={{
        my: '1rem',
        padding: '6px 18px',
        bgcolor: '#B9D9EF',
        "&:hover": {   
          bgcolor:"#AEC5F2"
        }
      }}>
          <Link href={comment.userUrl}>
          <Typography m={0.75} textAlign="left">
            {comment.user}
          </Typography></Link>
          
          <Typography m={0.75} textAlign="left"> {comment.content}
           
          </Typography>
         
          

          

          <Typography className="pre" m={0.75} textAlign="left">
          {comment.time}
          </Typography>

          
        </Row>
       
};

export default Comment;