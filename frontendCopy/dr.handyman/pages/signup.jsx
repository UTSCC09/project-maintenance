import FlexBox from 'components/FlexBox';
import Signup from 'components/sessions/Signup';
import React from 'react';

const SignUpPage = () => {
  return <FlexBox flexDirection="column" minHeight="100vh" alignItems="center" justifyContent="center" bgcolor="#7BA4BF">
      <Signup />
    </FlexBox>;
};

export default SignUpPage;