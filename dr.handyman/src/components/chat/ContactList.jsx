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
import ContactListHeader from './ContactListHeader';
import Link from 'next/link'
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContactListLayout from '../layout/ContactListLayout';

function renderMessageRow(props) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} alignItems="flex-start" component="div"   disablePadding > 
      <ListItemButton divider sx={{
          mt:'10px',
                    height:'90px',
                    
                }}>
                    
      <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        
        <ListItemText
          primary="Alice"
          secondary={
            <React.Fragment>
              
              I'll be in your neighborhood doing errands this…
              <Typography 
              sx={{ display: 'inline'}}
              component="span"
              variant="overline"
              color="text.primary"
            >
              2022-03-11
            </Typography>
           
            </React.Fragment>
            
          }
        />
       
      </ListItemButton>
      
    </ListItem>
    
    
    
  );
}


export default function ContactList() {
  return (
    <ContactListLayout>
    <Box sx={{ width: '100%', maxWidth: 360, color: 'grey'}}>
        <ContactListHeader title = "Contact List" button={<Link href="/profile">
          
          <ArrowBackIcon sx={{
              borderRadius:'20px',
              mr:'20px',
              
          }}/>
      </Link>} />

      <Divider sx={{ my: 0.5 }} />
      <FixedSizeList
        height={350}
        width={360}
        itemSize={100}
        itemCount={20}
        overscanCount={5}
        
        
      >
        {renderMessageRow}
        
      </FixedSizeList>
      
    </Box>
    </ContactListLayout>
  );
}


