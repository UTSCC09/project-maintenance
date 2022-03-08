import FlexBox from 'components/FlexBox';
import { H3, H4, Span } from 'components/Typography';
import Call from '@mui/icons-material/Call';
import East from '@mui/icons-material/East';
import Place from '@mui/icons-material/Place';
import { alpha, Avatar, Card, IconButton, Rating, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import React from 'react';

const Post = ({
  title,
  user,
  postUrl,
  userUrl,
  content,
  time
}) => {
  return <Box sx={{
      color: '#373737',
      p: '17px 30px 56px',   
      bgcolor: '#FFEBDF',     
    }}>  

<H3 fontWeight="600" mb={1}>{title}</H3>

    <FlexBox>
    <Link href={userUrl}>
        <H4 fontWeight="600" mb={1}>
          {user}
        </H4>
        </Link>
    </FlexBox>
    <Span color="secondary" ml={1.5}>
            {content}
          </Span>
          <Span color="secondary" ml={1.5}>
            {time}
          </Span>


    <FlexBox>
    <Link href={postUrl}>
        <a>
            <IconButton sx={{ my: '0.25rem'}}>
              <East />
            </IconButton>
          </a>
        </Link>
    </FlexBox>
       
       
      </Box>

      
        
     
    ;
};

export default Post;