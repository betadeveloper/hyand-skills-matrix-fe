import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { Group } from '@mui/icons-material/';
import { useEffect, useState } from 'react';
import { get, post } from '../../api/api.ts';
import { toast } from 'react-toastify';

const OwnersCard = () => {
  const [owners, setOwners] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [roles, setRoles] = useState([]);


  const fetchOwners = () => {
    get('http://localhost:8080/api/owners/currentEmployee').then((response) => {
      setOwners(response);
    });
  };

  const fetchEmployeeRole = () => {
    get('http://localhost:8080/api/employee/current').then((response) => {
      setRoles(response.roles);
    });
  };

  const handleAddOwner = () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }
    post('http://localhost:8080/api/owners/currentEmployee', { employeeId: selectedEmployee })
      .then(() => {
        fetchOwners();
        setOpen(false);
        toast.success('Owner added successfully');
      })
      .catch((error) => {
        console.error("Error adding owner:", error);
      });
  };

  useEffect(() => {
    fetchEmployeeRole();
    fetchOwners();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: '16px auto',
        padding: 3,
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: 2,
        minHeight: 200
      }}
      variant="outlined"
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Group color="primary" />
        <Typography variant="h5" fontWeight={'Bold'} ml={1}>Owners</Typography>
        {roles.includes('ROLE_ADMIN') || roles.includes('ROLE_OWNER') ? (
        <Button onClick={() => setOpen(true)} sx={{ ml: 'auto' }}>Add Owner</Button>
        ) : null}
      </Box>
      <Box>
        {owners.map((owner) => (
          <Typography key={owner.id} fontWeight={500}>
            {`${owner.firstName} ${owner.lastName}`}
          </Typography>
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Owner</DialogTitle>
        <DialogContent>
          <TextField
            label="Employee ID"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddOwner}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OwnersCard;
