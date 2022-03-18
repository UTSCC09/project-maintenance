import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { borderColor } from '@mui/system';
import ListItemButton from '@mui/material/ListItemButton';
import { FixedSizeList } from 'react-window';
import Box from '@mui/material/Box';

const ContactListRow = ({
    contact
  }) => {
  

  return (
    <ListItem alignItems="flex-start" component="div"   disablePadding> 
      <ListItemButton sx={{
                    
                    '&:hover': {
                        backgroundColor: '#DDF2FF'
            
                        },
                }}>
      <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={contact.user_send}
          secondary={
           
              
             contact.newest_message
           
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

export default ContactListRow;