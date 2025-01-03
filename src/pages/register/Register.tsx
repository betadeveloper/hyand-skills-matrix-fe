import { useState } from 'react';
import {
  ThemeProvider,
  Typography,
  Container,
  Box,
  TextField,
  Button,
  CssBaseline,
  Link,
  Grid,
  Avatar
} from '@mui/material';

import { Lock } from '@mui/icons-material';
import { post } from '../../api/api.ts';

import { useForm } from 'react-hook-form';
import theme from '../../theme';
import { useNavigate } from 'react-router-dom';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmit = (data: FormData) => {
    const { firstName, lastName, email, password } = data;
    post<{ firstName: string; lastName: string; email: string; password: string }>('/auth/signup', {
      firstName,
      lastName,
      email,
      password
    })
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        if (error.response.status === 409) {
          setErrorMessage('User already exists');
        } else {
          setErrorMessage(error.response.data);
        }
      });
  };

  const password = watch('password');

  return (
    <ThemeProvider theme={theme}>
      <Link href="/">
        <Typography margin={2}>Return to presentation page</Typography>
      </Link>
      <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <Avatar sx={{ m: 1, bgcolor: '#D8DAFF', width: 55, height: 55 }}>
            <Lock sx={{ fontSize: 40, color: '#000' }} />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight={'medium'}>
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First name"
                  autoFocus
                  {...register('firstName', {
                    required: 'First name is required.',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters long.'
                    }
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last name"
                  autoFocus
                  {...register('lastName', {
                    required: 'Last name is required.',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters long.'
                    }
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoFocus
                {...register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Please enter a valid email address (e.g., example@domain.com).'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required.',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long.'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.'
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                id="confirm-password"
                autoComplete="current-password"
                {...register('confirmPassword', {
                  validate: (value) => value === password || 'Passwords do not match.'
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </Box>
          {errorMessage && (
            <Typography color="error" sx={{ mt: 1 }}>
              {errorMessage}
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 3, mb: 3 }}>
          <Typography variant="body2" color="textSecondary" align="center">
            By registering, you agree to our
            <Link href="/tos"> Terms of Service</Link> and
            <Link href="/privacy-policy"> Privacy Policy</Link>.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
