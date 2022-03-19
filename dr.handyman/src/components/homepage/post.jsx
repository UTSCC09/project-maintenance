import Row from 'components/PostRow';
import { H5 } from 'components/Typography';
import East from '@mui/icons-material/East';
import { Chip, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

const Post = ({
  post
}) => {
  const getTypeColor = status => {
    switch (status) {
      case 0:
        return '#EEDCBA';

      case 1:
        return '#B6EBAC';
     
    }
  };
  const getStateColor = status => {
    switch (status) {
      case true:
        return '#B6EBE5';

      case false:
        return '#F8CBC9';

     
    }
  };
  return <Link href={""/*post.postUrl*/}>
  <Row sx={{
        my: '1rem',
        padding: '6px 18px',
        bgcolor: '#B9D9EF',
        "&:hover": {   
          bgcolor:"#AEC5F2"
        }
      }}>
          <H5 m={0.75} textAlign="left">
           {post.title}
          </H5>
          
          {/* <Typography m={0.75} textAlign="left"> {post.content}</Typography> */}
         
          <Link href={""/*post.postUrl*/}>
          <Typography m={0.75} textAlign="left">
            {post.posterUsername}
          </Typography></Link>
          

          <Box m={0.75}>
            <Chip size="5rem" label={post.type === 0 ? 'Find a Handyman' : 'Find a Contractor'} sx={{
          
            fontSize: 13,
            
            backgroundColor: getTypeColor(post.type)
          }} />
          </Box>
          <Box m={0.75}>
            <Chip size="5rem" label={post.state ? 'Accpted' : 'Not Accepted'} sx={{
          
            fontSize: 13,
            
            backgroundColor: getStateColor(post.state)
          }} />
          </Box>
          {/* <Typography m={0.75} textAlign="left"> {post.state ? 'Accpted' : 'Not Accepted'}</Typography> */}
          <Typography m={0.75} textAlign="left"> {post.acceptorUsername || "N/A"}</Typography>
          <Typography className="pre" m={0.75} textAlign="left" mr="10px">
          {`${new Date(+post.createdAt).toLocaleDateString()} ${new Date(+post.createdAt).toLocaleTimeString()}`}
          </Typography>

          <Link href={""/*post.postUrl*/}>
          <Typography textAlign="center" color="grey.600" sx={{
          flex: '0 0 0 !important',
          display: {
            xs: 'none',
            md: 'block'
          }
        }}>
            <IconButton>
              <East fontSize="small" color="inherit" />
            </IconButton>
          </Typography>
          </Link>
        </Row>
        </Link> 
};

export default Post;