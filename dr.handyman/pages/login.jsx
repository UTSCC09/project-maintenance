
import Login from 'components/sessions/Login';
import React from 'react';
import { Box } from "@mui/system";

const LoginPage = () => {
  return <Box display="flex" flexDirection="column"  minHeight="100vh" alignItems="center" justifyContent="center" bgcolor="#7BA4BF">
      <Login />
    </Box>;
};

export default LoginPage;