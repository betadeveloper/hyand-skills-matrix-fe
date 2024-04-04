import { TextField, Button, Grid, Avatar } from '@mui/material';
import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
import head from '../../assets/images/head.jpg';

const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/employees')
      .then((response) => response.json())
      .then((data) => {
        setFirstName(data[0].firstName);
        setLastName(data[0].lastName);
        setEmail(data[0].email);
        setPosition(data[0].position);
        setDepartment(data[0].department);
      });
  }, []);
  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: 150,
          backgroundImage: `url(${head})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Avatar
              alt="Profile Picture"
              src="/src/assets/images/test-profile-image.jpg"
              sx={{ width: 150, height: 150, border: '2px solid white', marginTop: '-100px' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth>
              Upload
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Profile;
