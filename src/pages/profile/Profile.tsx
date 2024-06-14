import { TextField, Button, Grid, Avatar } from '@mui/material';
import { Box } from '@mui/system';
import { useState, useEffect, useRef } from 'react';
import head from '../../assets/images/head.jpg';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import { get, put } from '../../api/api.ts';
import { Employee } from '../../interface/Employee.tsx';

const Profile = () => {
  interface EmployeeResponse {
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    department: string;
  }

  const [firstName, setFirstName] = useState<string>(' ');
  const [lastName, setLastName] = useState<string>(' ');
  const [email, setEmail] = useState<string>(' ');
  const [position, setPosition] = useState<string>(' ');
  const [department, setDepartment] = useState<string>(' ');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = () => {
    toast('Uploaded');
  };

  const handleInputClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    get<EmployeeResponse>('http://localhost:8080/api/employee/current').then((response: EmployeeResponse) => {
      setFirstName(response.firstName);
      setLastName(response.lastName);
      setEmail(response.email);
      setPosition(response.position);
      setDepartment(response.department);
    });
  }, []);

  const updateEmployee = (newEmployeeDetails: EmployeeResponse) => {
    return put<EmployeeResponse>('http://localhost:8080/api/employee/current', newEmployeeDetails)
      .then((response) => {
        toast.success('Employee data updated successfully!');
        return response;
      })
      .catch((error) => {
        console.error('There was an error!', error);
        toast.error('Failed to update employee data.');
      });
  };

  const handleButtonClick = () => {
    const newEmployeeDetails: Employee = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      position: position,
      department: department
    };
    updateEmployee(newEmployeeDetails).then((data) => {
      if (data) {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setPosition(data.position);
        setDepartment(data.department);
      }
    });
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: 150,
          backgroundImage: `url(${head})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <IconButton
              sx={{ width: 150, height: 150, border: '2px solid white', marginTop: '-100px' }}
              onClick={handleInputClick}>
              <Avatar
                alt="Profile Picture"
                src="/src/assets/images/test-profile-image.jpg"
                sx={{ width: 150, height: 150, border: '2px solid white' }}
              />
            </IconButton>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              value={firstName ? firstName : ''}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              // Added invalid inputs validation
              error={firstName && (firstName.length < 3 || firstName.length > 50)}
              helperText={
                firstName &&
                (firstName.length < 3
                  ? 'First Name is too short (min 3 characters)'
                  : firstName.length > 50
                    ? 'First Name is too long (max 50 characters)'
                    : '')
              }
            />
            <TextField
              label="Last Name"
              value={lastName ? lastName : ''}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField disabled={true} label="Email" value={email ? email : ''} fullWidth sx={{ mb: 2 }} />
            <TextField
              label="Position"
              value={position ? position : ''}
              onChange={(e) => setPosition(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Department"
              value={department ? department : ''}
              onChange={(e) => setDepartment(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={handleButtonClick}>
              Upload
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Profile;
