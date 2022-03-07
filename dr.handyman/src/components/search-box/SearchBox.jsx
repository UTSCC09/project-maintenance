import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'; // styled components

import FlexBox from 'components/FlexBox';
import Menu from 'components/Menu';
import Link from 'next/link';

import KeyboardArrowDownOutlined
  from '@mui/icons-material/KeyboardArrowDownOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import {
  Box,
  Card,
  MenuItem,
  TextField,
} from '@mui/material';
import TouchRipple from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';

export const SearchOutlinedIcon = styled(SearchOutlined)(({
  theme
}) => ({
  color: theme.palette.grey[600],
  marginRight: 6
})); 

export const SearchResultCard = styled(Card)(() => ({
  position: "absolute",
  top: "100%",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  width: "100%",
  zIndex: 99
  
}));
const DropDownHandler = styled(FlexBox)(({
  theme
}) => ({
  
  borderTopRightRadius: 300,
  borderBottomRightRadius: 300,
  whiteSpace: "pre",
  borderLeft: `1px solid ${theme.palette.text.disabled}`,
  [theme.breakpoints.down("xs")]: {
    display: "none"
  }
}));

const SearchBox = () => {
  const [category, setCategory] = useState("All Categories");
  const [resultList, setResultList] = useState([]);
  const parentRef = useRef();

  const handleCategoryChange = cat => () => {
    
    setCategory(cat);
  };

 
  const hanldeSearch = useCallback(event => {
    event.persist();
    
  }, []);

  const handleDocumentClick = () => {
    setResultList([]);
  };

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("click", handleDocumentClick);
    };
  }, []);
  const categoryDropdown = <Menu direction="left" handler={<DropDownHandler alignItems="center" bgcolor="#FFDBCF" height="100%" px={3} color="grey.700" component={TouchRipple}>
          <Box mr={0.5}>{category}</Box>
          <KeyboardArrowDownOutlined fontSize="small" color="inherit" />
        </DropDownHandler>}>
      {categories.map(item => <MenuItem key={item} onClick={handleCategoryChange(item) } >
          {item}
        </MenuItem >)}
    </Menu>;
  return <Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto" {...{
    ref: parentRef
  }}>
      <TextField variant="outlined" placeholder="Searching for Mantianers and Posts ..." fullWidth onChange={hanldeSearch} InputProps={{
      sx: {
        height: 44,
        borderRadius: 300,
        paddingRight: 0,
        color: "grey.700",
        overflow: "hidden",
        "&:hover .MuiOutlinedInput-notchedOutline": {
          border: 1
        }
      },
      endAdornment: categoryDropdown,
      startAdornment: <SearchOutlinedIcon fontSize="small" />
    }} />

      {!!resultList.length && <SearchResultCard elevation={2}>
          {resultList.map(item => <Link href={`/product/search/${item}`} key={item}>
              <MenuItem key={item} InputProps={{
      sx: {
       
        "&:hover ": {
          bgcolor: "#FFDBCF",
          
        }
      }
     
    }}>{item}</MenuItem>
            </Link>)}
        </SearchResultCard>}
    </Box>;
};

const categories = ["All Categories", "Mantainers","Posts"];

export default SearchBox;;