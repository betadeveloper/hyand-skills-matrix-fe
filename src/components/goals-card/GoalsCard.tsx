import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions, DialogContentText } from '@mui/material';
import { DonutSmall } from '@mui/icons-material/';
import { useEffect, useState } from 'react';
import { get, post, remove } from '../../api/api.ts';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const GoalsCard = () => {
  const [goals, setGoals] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().substring(0, 10));
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  const fetchGoals = () => {
    get('http://localhost:8080/api/goals/currentEmployee').then((response) => {
      setGoals(response);
    }).catch((error) => {
      console.error("Error fetching goals:", error);
    });
  };

  const handleAddGoal = () => {
    if (!description || !dueDate || !name) {
      toast.error('Please fill in all fields');
      return;
    }

    const newGoal = {
      name: name,
      description: description,
      dueDate: dueDate,
    };

    post('http://localhost:8080/api/goal', newGoal)
      .then(() => {
        fetchGoals();
        setOpen(false);
        setName('');
        setDescription('');
        toast.success('Goal added successfully');
      })
      .catch((error) => {
        console.error("Error adding goal:", error);
        toast.error('Failed to add goal. Please try again.');
      });
  };

  const handleDeleteGoal = (goalId) => {
    remove(`http://localhost:8080/api/goal/${goalId}`)
      .then(() => {
        fetchGoals();
        toast.success('Goal deleted successfully');
      })
      .catch((error) => {
        console.error("Error deleting goal:", error);
        toast.error('Failed to delete goal. Please try again.');
      });
  };

  const openDeleteDialog = (goal) => {
    setGoalToDelete(goal);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (goalToDelete) {
      handleDeleteGoal(goalToDelete.id);
    }
    setConfirmDeleteOpen(false);
  };

  useEffect(() => {
    fetchGoals();
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
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Ensures space is utilized
      }}
      variant="outlined"
    >
      <Box display="flex" alignItems="center" mb={2}>
        <DonutSmall color="primary" />
        <Link to={`/goals`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
          <Typography variant="h5" fontWeight={'Bold'} ml={1}>Goals</Typography>
        </Link>
        <Box sx={{ width: '32px' }} />
        <Button onClick={() => setOpen(true)}>Add Goal</Button>
      </Box>
      <Box flexGrow={1}>
        {goals.map((goal) => (
          <Box key={goal.id} display={'flex'} alignItems={'center'} mb={1}>
            <Typography fontWeight={500}>{goal.name}</Typography>
            <Typography fontWeight={400} ml={'auto'}>{goal.dueDate}</Typography>
            <Button
              onClick={() => openDeleteDialog(goal)}
              color="error"
              sx={{ ml: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>X</span>
            </Button>
          </Box>
        ))}
      </Box>

      {/* New button for viewing goal details */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Link to="/goals" style={{ textDecoration: 'none' }}>
          <Button variant="outlined">View Goal Details</Button>
        </Link>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Goal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Goal Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            label="Goal Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            sx={{ mb:2}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddGoal}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this goal?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GoalsCard;
