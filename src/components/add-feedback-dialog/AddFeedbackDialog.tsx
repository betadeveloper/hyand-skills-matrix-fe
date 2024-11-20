import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Button,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { post } from '../../api/api';

interface AddFeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  employees: any[];
  ownerId: number;
  onFeedbackSubmitted: () => void;
}

const AddFeedbackDialog = ({
                                                               open,
                                                               onClose,
                                                               employees,
                                                               ownerId,
                                                               onFeedbackSubmitted,
                                                             }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  const handleSubmitFeedback = () => {
    if (!selectedEmployee || !feedbackText) {
      toast.error('Please select an employee and provide feedback');
      return;
    }

    const feedbackData = {
      feedbackText,
      employeeId: selectedEmployee,
      ownerId: ownerId,
    };

    post('http://localhost:8080/api/feedback', feedbackData)
      .then(() => {
        toast.success('Feedback submitted successfully');
        setFeedbackText('');
        setSelectedEmployee('');
        onFeedbackSubmitted();
        onClose();
      })
      .catch((err) => {
        console.error('Error submitting feedback:', err);
        toast.error('Error submitting feedback');
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontSize={24} mt={2} mb={2}>
        Add Feedback
        <IconButton
          color="inherit"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
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
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmitFeedback} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFeedbackDialog;
