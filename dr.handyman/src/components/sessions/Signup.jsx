import React, {useState,useCallback } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { SERVER_URL } from 'constant';
import axios from 'axios';
import TextField from 'components/AppTextField';
import FlexBox from 'components/FlexBox';
import {
  H3,
  H6,
  Small,
} from 'components/Typography';
import Link from 'next/link';
import * as yup from 'yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(({
  children,
  passwordVisibility,
  ...rest
}) => <Card {...rest}>{children}</Card>)(({
  
  passwordVisibility
}) => ({
  width: 500,
  
  '.content': {
    padding: '3rem 3.75rem 0px',
   
  },
  '.passwordEye': {
    color: passwordVisibility ? "#AEB4BE" : "#DAE1E7"
  },
  
  '.agreement': {
    marginTop: 12,
    marginBottom: 24
  }
}));

const Signup = () => {
  
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility(visible => !visible);
  }, []);

  const handleFormSubmit = async values => {
    try {
      const name = values.name.split(' ');
      const {
        data
      } = await axios.post(`${SERVER_URL}/auth/register`, {
        first_name: name[0],
        last_name: name[1],
        email: values.email,
        password: values.password
      });
      console.log(data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit
  } = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: formSchema
  });
  
  return <StyledCard elevation={3} passwordVisibility={passwordVisibility}>
      <form className="content" onSubmit={handleSubmit}>
        <H3 textAlign="center" mb={1}>
          Create Your Account
        </H3>
        <Small fontWeight="600" fontSize="12px" color="grey.800" textAlign="center" mb={4.5} display="block">
          Please fill all fields
        </Small>

        <TextField mb={1.5} name="name" label="Full Name" placeholder="Name" variant="outlined" size="small" fullWidth onBlur={handleBlur} onChange={handleChange} value={values.name || ''} error={!!touched.name && !!errors.name} helperText={touched.name && errors.name} />

        <TextField mb={1.5} name="email" label="Email or Phone Number" placeholder="Email" variant="outlined" size="small" type="email" fullWidth onBlur={handleBlur} onChange={handleChange} value={values.email || ''} error={!!touched.email && !!errors.email} helperText={touched.email && errors.email} />

        <TextField mb={1.5} name="password" label="Password" placeholder="Password" autoComplete="on" type={passwordVisibility ? 'text' : 'password'} variant="outlined" size="small" fullWidth InputProps={{
        endAdornment: <IconButton size="small" type="button" onClick={togglePasswordVisibility}>
                {passwordVisibility ? <Visibility className="passwordEye" fontSize="small" /> : <VisibilityOff className="passwordEye" fontSize="small" />}
              </IconButton>
      }} onBlur={handleBlur} onChange={handleChange} value={values.password || ''} error={!!touched.password && !!errors.password} helperText={touched.password && errors.password} />

        <TextField name="re_password" label="Confirm Password" placeholder="Enter Password Again" autoComplete="on" type={passwordVisibility ? 'text' : 'password'} variant="outlined" size="small" fullWidth InputProps={{
        endAdornment: <IconButton size="small" type="button" onClick={togglePasswordVisibility}>
                {passwordVisibility ? <Visibility className="passwordEye" fontSize="small" /> : <VisibilityOff className="passwordEye" fontSize="small" />}
              </IconButton>
      }} onBlur={handleBlur} onChange={handleChange} value={values.re_password || ''} error={!!touched.re_password && !!errors.re_password} helperText={touched.re_password && errors.re_password} />

        <FormControlLabel className="agreement" name="agreement" onChange={handleChange} control={
        <Checkbox size="small" color="default" checked={values.agreement || false }  />} 
        label={<FlexBox flexWrap="wrap" alignItems="center" justifyContent="flex-start">
              By signing up, you agree to
              <a href="/" target="_blank" rel="noreferrer noopener">
                <H6 ml={1} borderColor="grey.900">
                  Terms & Condtion
                </H6>
              </a>
            </FlexBox>} />

            <Button variant="contained"  type="submit" fullWidth sx={{
        mb: "1.65rem",
        height: 44,
        bgcolor:"#5B8FB1",
        "&:hover": {
          
          bgcolor:"#4D88AF"
        }
      }}>
          Sign Up
        </Button>

        <Box mb={2} mt={3.3}>
          <Box width="200px" mx="auto">
            <Divider />
          </Box>

          <FlexBox justifyContent="center" mt={-1.625}>
            <Box color="grey.600" bgcolor="background.paper" px={2}>
              on
            </Box>
          </FlexBox>
        </Box>

        

        <FlexBox justifyContent="center" alignItems="center" my="1.25rem">
          <Box>Already have an account?</Box>
          <Link href="/login">
            <a>
              <H6 ml={1} borderColor="grey.900">
                Log In
              </H6>
            </a>
          </Link>
        </FlexBox>
      </form>

      
    </StyledCard>;
};
const initialValues = {
  name: '',
  email: '',
  password: '',
  re_password: '',
  agreement: false
};
const formSchema = yup.object().shape({
  name: yup.string().required('${path} is required'),
  email: yup.string().email('invalid email').required('${path} is required'),
  password: yup.string().required('${path} is required'),
  re_password: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Please re-type password'),
  agreement: yup.bool().test('agreement', 'You have to agree with our Terms and Conditions!', value => value === true).required('You have to agree with our Terms and Conditions!')
});

export default Signup;