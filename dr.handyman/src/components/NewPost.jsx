import React from 'react';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import * as yup from "yup";
import DialogTitle from '@mui/material/DialogTitle';
import { useFormik } from "formik";
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
  import FlexBox from 'components/FlexBox';
  import {
  
    H5,
    Medium,
  } from 'components/Typography';

  import Link from 'next/link';

  
  
  import {
    Box,
    Card,
    Divider,
    
    Button
  } from '@mui/material';
  import { styled } from '@mui/material/styles';
  
  
  const StyledCard = styled(({
    children,

    ...rest
  }) => <Card {...rest}>{children}</Card>)(({
    

  }) => ({
    width: 600,
    
    ".content": {
      textAlign: "center",
      padding: "3rem 3.75rem 0px",
      
    },
   
  }));
  
  const NewPost =({
   
  }) => {
    const handleFormSubmit = async (values) => {
		
	};
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
		useFormik({
			initialValues,
			onSubmit: handleFormSubmit,
			validationSchema: formSchema,
		});
    
    return <StyledCard elevation={3} sx={{
        '& .MuiTextField-root': { m: 2},
      }}>
        <form className="content" onSubmit={handleSubmit}>
        <DialogTitle fontSize="25px">New Post</DialogTitle>
        
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="content"
            fullWidth
            variant="standard"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.title || ""}
            error={!!touched.title && !!errors.title}
            helperText={touched.title && errors.title}
          />
       
       
        
        <TextField
        mt="20px"
          id="description"
          label="Description"
          multiline
          rows={5}
          fullWidth
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.description || ""}
          error={!!touched.description && !!errors.description}
          helperText={touched.description && errors.description}
        />
        
        
          <FormControl mt="10px" mb="10px">
          <FormLabel id="type">Post Type</FormLabel>
          
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="Find a Contractor" control={<Radio />} label="Find a Contractor" />
        <FormControlLabel value="Find a Handyman" control={<Radio />} label="Find a Handyman" />
       
        {/* to be done 设置disable radio， 只有修理工可以发布find contractor post <FormControlLabel
          value="disabled"
          disabled
          control={<Radio />}
          label="other"
        /> */}
      </RadioGroup>
      
    </FormControl>
       
       
       
        <Button variant="contained"  type="submit" fullWidth sx={{
          mb: "1.65rem",
          height: 44,
          bgcolor:"#4790E5",
          "&:hover": {   
            bgcolor:"#146DA3"
          },
          mt:'20px'
        }}>
            Submit the Post
          </Button>
          <Button variant="contained"  type="submit" fullWidth sx={{
          mb: "1.65rem",
          height: 44,
          bgcolor:"#FFAB92",
          "&:hover": {   
            bgcolor:"#F20E0E"
          }
        }}>
            Cancel
          </Button>

          

  
         
          
        </form>
  
      </StyledCard>;
  };
  const initialValues = {
	title: "",
	description: "",
	
	type1: false,
    type2: false
};
  const formSchema = yup.object().shape({
	title: yup.string().required("title is required"),
	description: yup.string().required("post description is required"),
	//type 必选验证 to be done
	
	
});
  export default NewPost;

  