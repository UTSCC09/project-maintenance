import React, {
  useCallback,
  useState,
} from 'react';


import TextField from 'components/AppTextField';
import FlexBox from 'components/FlexBox';
import {
  H3,
  H6,
  Small,
} from 'components/Typography';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as yup from 'yup';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Card,
  Divider,
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
  
  ".content": {
    textAlign: "center",
    padding: "3rem 3.75rem 0px",
    
  },
  ".passwordEye": {
    color: passwordVisibility ? "#AEB4BE" : "#DAE1E7"
  }
}));

const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const router = useRouter();
  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility(visible => !visible);
  }, []);
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit
  } = useFormik({
   
    initialValues,
    validationSchema: formSchema
  });
  return <StyledCard elevation={3} passwordVisibility={passwordVisibility}>
      <form className="content" onSubmit={handleSubmit}>
        <H3 textAlign="center" mb={1}>
          Welcome To Mr.Handyman
        </H3>
        <Small fontWeight="600" fontSize="12px" color="grey.800" textAlign="center" mb={4.5} display="block">
          Log in with email & password
        </Small>

        <TextField mb={1.5} name="email" label="Email" placeholder="Enter your email" variant="outlined" size="small" type="email" fullWidth onBlur={handleBlur} onChange={handleChange} value={values.email || ""} error={!!touched.email && !!errors.email} helperText={touched.email && errors.email} />

        <TextField mb={2} name="password" label="Password" placeholder="Enter your password" autoComplete="on" type={passwordVisibility ? "text" : "password"} variant="outlined" size="small" fullWidth InputProps={{
        endAdornment: <IconButton size="small" type="button" onClick={togglePasswordVisibility}>
                {passwordVisibility ? <Visibility className="passwordEye" fontSize="small" /> : <VisibilityOff className="passwordEye" fontSize="small" />}
              </IconButton>
      }} onBlur={handleBlur} onChange={handleChange} value={values.password || ""} error={!!touched.password && !!errors.password} helperText={touched.password && errors.password} />

        <Button variant="contained"  type="submit" fullWidth sx={{
        mb: "1.65rem",
        height: 44,
        bgcolor:"#F7B9A6",
        "&:hover": {   
          bgcolor:"#FCB19A"
        }
      }}>
          Login
        </Button>

        <Box mb={2}>
          <Box width="200px" mx="auto">
            <Divider />
          </Box>

          <FlexBox justifyContent="center" mt={-1.625}>
            <Box color="#AEB4BE" bgcolor="#F6F9FC" px={2}>
             
            </Box>
          </FlexBox>
        </Box>

       
        <FlexBox justifyContent="center" alignItems="center" my="1.25rem">
          <Box>Don’t have account?</Box>
          <Link href="/signup">
            <a>
              <H6 ml={1}>
                Sign Up
              </H6>
            </a>
          </Link>
        </FlexBox>
      </form>

    </StyledCard>;
};

const initialValues = {
  email: "",
  password: ""
};
const formSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("${path} is required"),
  password: yup.string().required("${path} is required")
});
export default Login;