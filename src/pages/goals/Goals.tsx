import { useEffect, useState } from 'react';
import { get, put } from '../../api/api';
import { Box, Typography, Button, Card, CardContent, CardActions, CircularProgress } from '@mui/material';
import { DonutSmall } from '@mui/icons-material/';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await get('http://localhost:8080/api/goals/currentEmployee');
      setGoals(response);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEndGoal = async (goal) => {
    setLoading(true);
    const updatedGoal = { ...goal, [goal.startDate ? 'endDate' : 'startDate']: new Date().toISOString() };
    await put(`http://localhost:8080/api/goals/${goal.id}`, updatedGoal);
    fetchGoals();
  };

  return (
    <Box
      ml={4}
      mb={4}
      sx={{
        maxWidth: 600,
        margin: '0 auto'
      }}
    >
      <Box display={'flex'} alignItems={'center'} justifyContent="center" mb={3} mt={3}>
        <DonutSmall color="primary" style={{ fontSize: 40, marginRight: 10 }} />
        <Typography
          variant="h4"
          fontWeight="bold"
          align="left"
        >
          Goals
        </Typography>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        goals.map((goal, index) => (
          <Card key={goal.id} variant="outlined" sx={{ mb: 2, padding: 2, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">
                {index + 1}. {goal.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {goal.description ? goal.description : 'No description'}
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight="bold">
                Due: {goal.dueDate}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleStartEndGoal(goal)}
                disabled={loading}
                fullWidth
              >
                {goal.startDate ? 'End' : 'Start'}
              </Button>
            </CardActions>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Goals;
