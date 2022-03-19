import AppLayout from 'components/layout/AppLayout';
import { H1, H2, H3, H5} from "components/Typography";
import MaintainerList from 'components/homepage/maintainers';
import Posts from 'components/homepage/posts';
import { Box, Grid,Card } from "@mui/material";
import FlexBox from "components/FlexBox";
import Link from "next/link";
import { Chip, IconButton, Button,Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
const PostInformation = props => {
  return (
    <AppLayout>
      <Card sx={{width:'700px', ml:'150px',mt:'40px'}}>
     <Grid container spacing={3} justifyContent="space-around" sx={{mt:'20px'}}>
     <Grid item md={6} xs={12} alignItems="center">
          <H1 mb={2}>Post Tiltle: title</H1>

          <FlexBox alignItems="center" mb={2}>
            <Box fontSize={18}>Posted by:</Box>
            <Link href={"/userProfile"/*post user url*/}>
            <H5 ml={1} mr={1} sx={{textDecoration:'underline'}}>user1</H5></Link>
            <Link href={'/chat'}>
          <Typography textAlign="center" color="grey.600" sx={{
          
          display: {
            xs: 'none',
            md: 'block'
          }
        }}>
            <IconButton>
              <ChatBubbleOutlineIcon fontSize="small" color="inherit" />
            </IconButton>
          </Typography>
          </Link>
          </FlexBox>
          <Box fontSize={18}>Content: </Box>
          <FlexBox fontSize={18} alignItems="center" mb={2}>  
            
          <Box fontSize={18} >This is the content dhao daiohd  lqwho qoi howq hioqhorqhhqior hqihr hqhiohifoqh iooir hqh ioqrhoiwqh ioqwh i hioqwh hqorhqwihorhoqwhi hiqh hioqwrihqioh hiqiowr ihoq hh howih ohrwqihr oiqhrh qowhroq hwhqro hqwrhqor hoqwhrq hqhroqwh qoiw</Box>
          </FlexBox>
          <Box mb={3}>
           Type: Find a Handyman
            
          </Box>
          <Box mb={3}>
           State: Not Accepted
            
          </Box>
          <Box mb={3}>
           User Accept: N/A
            
          </Box>
          <Box mb={3}>
           State: Not Accepted
            
          </Box>
          <Box mb={3}>
           Post Time: time
            
          </Box>
          <Button variant="contained"  type="submit" fullWidth sx={{
          mb: "1.65rem",
          height: 44,
          bgcolor:"#719BBF",
          "&:hover": {   
            bgcolor:"#4790E5"
          }
        }}>
           Accept Post
          </Button>
          


          </Grid>
          </Grid>
          </Card>
    </AppLayout>
  );
};


export default PostInformation;