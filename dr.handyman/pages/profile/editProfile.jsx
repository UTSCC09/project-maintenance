import { Avatar, Button, Card, Grid, Typography } from '@mui/material';
import FlexBox from 'components/FlexBox';
import ProfileDashboardLayout from 'components/layout/ProfileDashboardLayout';
import DashboardPageHeader from 'components/profile/ProfileDashboardHeader';
import ProfileDashboardNavigation from 'components/profile/ProfileDashboardNav';
import CameraEnhance from '@mui/icons-material/CameraEnhance';
import Person from '@mui/icons-material/Person';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import Link from 'next/link';
import React from 'react';
import * as yup from 'yup';
import AppLayout from 'components/layout/AppLayout';

const ProfileEdit = () => {
    const handleFormSubmit = async values => {
      console.log(values);
    };
  
    return  <AppLayout>
    <ProfileDashboardLayout>
        <DashboardPageHeader icon={Person} title="Edit Profile" button={<Link href="/profile">
        <Button sx={{
        px: '2rem',
        bgcolor: '#FFF1D2',
        color:"#6D6D6D"
      }}>
                Cancel
              </Button>
            </Link>} navigation={<ProfileDashboardNavigation />} />
  
        <Card sx={{ p: 4, bgcolor: '#FFF9EC' }}>
          <FlexBox alignItems="flex-end" mb={3}>
            <Avatar src="/assets/u1.png" sx={{
            height: 64,
            width: 64,
            bgcolor:'#FFFFFF'
          }} />
  
            <Box ml={-2}>
              <label htmlFor="profile-image">
                <Button component="span" color="secondary" sx={{
                bgcolor: '#ECE8DF',
                height: 'auto',
                p: '3px',
                borderRadius: '100%'
              }}>
                  <CameraEnhance fontSize="small" />
                </Button>
              </label>
            </Box>
            <Box display="none">
              <input onChange={e => console.log(e.target.files)} id="profile-image" accept="image/*" type="file" />
            </Box>
          </FlexBox>
  
          <Formik initialValues={initialValues} validationSchema={checkoutSchema} onSubmit={handleFormSubmit}>
            {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue
          }) => <form onSubmit={handleSubmit}>
                <Box mb={4}>
                  <Grid container spacing={3}>
                    <Grid item md={6} xs={12}>
                      <TextField name="first_name" label="First Name" fullWidth onBlur={handleBlur} onChange={handleChange} value={values.first_name || ''} error={!!touched.first_name && !!errors.first_name} helperText={touched.first_name && errors.first_name} />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField name="last_name" label="Last Name" fullWidth onBlur={handleBlur} onChange={handleChange} value={values.last_name || ''} error={!!touched.last_name && !!errors.last_name} helperText={touched.last_name && errors.last_name} />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField name="email" type="email" label="Email" fullWidth onBlur={handleBlur} onChange={handleChange} value={values.email || ''} error={!!touched.email && !!errors.email} helperText={touched.email && errors.email} />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField name="contact" label="Phone" fullWidth onBlur={handleBlur} onChange={handleChange} value={values.contact || ''} error={!!touched.contact && !!errors.contact} helperText={touched.contact && errors.contact} />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker label="Birth Date" value={values.birth_date} maxDate={new Date()} inputFormat="dd MMMM, yyyy" shouldDisableTime={() => false} renderInput={props => <TextField size="small" fullWidth {...props} error={!!touched.birth_date && !!errors.birth_date || props.error} helperText={touched.birth_date && errors.birth_date} />} onChange={newValue => setFieldValue('birth_date', newValue)} />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Box>
  
                <Button type="submit" variant="contained" sx={{
                    bgcolor:"#F7D794",
                    color:'#797979',
                    '&:hover': {
                        bgcolor: '#ECB25D'}

                }}>
                  Save Changes
                </Button>
              </form>}
          </Formik>
        </Card>
      </ProfileDashboardLayout>
      </AppLayout>;
  };
  
  const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    contact: '',
    birth_date: new Date()
  };
  const checkoutSchema = yup.object().shape({
    first_name: yup.string().required('required'),
    last_name: yup.string().required('required'),
    email: yup.string().email('invalid email').required('required'),
    contact: yup.string().required('required'),
    birth_date: yup.date().required('invalid date')
  });
  export default ProfileEdit;