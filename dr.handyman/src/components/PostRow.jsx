/*
from https://mui.com/store/items/bazar-pro-react-ecommerce-template
*/

import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
const PostRow = styled(Card)({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  borderRadius: '10px',
  cursor: 'pointer',
  '& > *': {
    flex: '1 1 0'
  },
  '& .pre': {
    whiteSpace: 'pre'
  }
});
export default PostRow;