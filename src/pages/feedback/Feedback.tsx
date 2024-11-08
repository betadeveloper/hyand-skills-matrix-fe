import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, Typography } from '@mui/material';
import { InsertComment, Close } from '@mui/icons-material';
import { get, post } from '../../api/api';
import { toast } from 'react-toastify';

const Feedback = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    get('http://localhost:8080/api/employee/current').then((response) => {
      setRoles(response.roles || []);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedNavItem', 'Feedback');

    get('http://localhost:8080/api/feedback/currentEmployee')
      .then((response: any) => {
        setFeedback(response);
      })
      .catch((err) => {
        console.error('Error fetching feedback:', err);
        setError('Failed to load feedback');
      });

    get('http://localhost:8080/api/employee/managedBy/ownerId')
      .then((response: any) => {
        setEmployees(response);
      })
      .catch((err) => {
        console.error('Error fetching employees:', err);
      });
  }, []);

  const handleSubmitFeedback = () => {
    if (!selectedEmployee || !feedbackText) {
      toast.error('Please select an employee and provide feedback');
      return;
    }

    const feedbackData = {
      feedbackText,
      employeeId: selectedEmployee,
      ownerId: 'ownerId',
    };

    post('http://localhost:8080/api/feedback', feedbackData)
      .then(() => {
        toast.success('Feedback submitted successfully');
        setOpenDialog(false);
        setFeedbackText('');
        setSelectedEmployee('');
        return get('http://localhost:8080/api/feedback/currentEmployee');
      })
      .then((response) => {
        setFeedback(response);
      })
      .catch((err) => {
        console.error('Error submitting feedback:', err);
        toast.error('Error submitting feedback');
      });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} ml={5}>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} mb={3} mt={3}>
        <InsertComment color="primary" style={{ fontSize: 50, marginRight: 10 }} />
        <Typography variant="h1" fontWeight={600}>
          Feedback
        </Typography>
      </Box>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : feedback.length > 0 ? (
        <Box display={'flex'} flexDirection={'column'} mt={3} width="80%">
          {feedback.map((item, index) => (
            <Box
              key={index}
              mb={3}
              p={3}
              sx={{
                backgroundColor: '#f9f9f9',
                borderRadius: 4,
                transition: '0.3s',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}>
              <Typography variant="body1" gutterBottom>
                <strong>"{item.feedbackText}"</strong>
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                <strong>Given by:</strong> {item.owner.firstName} {item.owner.lastName}, <strong>on:</strong>{' '}
                {formatDate(item.createdAt)}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>No feedback available yet</Typography>
      )}

      {roles.includes('ROLE_ADMIN') && (
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)} sx={{ mt: 3 }}>
          Give Feedback
        </Button>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontSize={24}  mt={2} mb={2}>
          Add Feedback
          <IconButton
            color="inherit"
            onClick={() => setOpenDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8}}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Employee</InputLabel>
            <Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              label="Employee"
            >
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Feedback"
            multiline
            fullWidth
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitFeedback} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Feedback;
