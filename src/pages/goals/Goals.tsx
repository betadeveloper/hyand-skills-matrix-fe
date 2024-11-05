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

  const handleStartGoal = async (goal) => {
    const currentDate = new Date().toISOString();
    const updatedGoal = { ...goal, startDate: currentDate };
    try {
      await put(`http://localhost:8080/api/goal/${goal.id}`, updatedGoal);
      fetchGoals();
    } catch (error) {
      console.error("Error starting goal:", error);
    }
  };

  const handleEndGoal = async (goal) => {
    const currentDate = new Date().toISOString();
    const updatedGoal = { ...goal, endDate: currentDate };
    try {
      await put(`http://localhost:8080/api/goal/${goal.id}`, updatedGoal);
      fetchGoals();
    } catch (error) {
      console.error("Error ending goal:", error);
    }
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
        <Typography variant="h4" fontWeight="bold" align="left">
          Goals
        </Typography>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        goals.map((goal, index) => (
          <Card
            key={goal.id}
            variant="outlined"
            sx={{
              mb: 4,
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: goal.endDate ? '#f5f5f5' : 'white',
              opacity: goal.endDate ? 0.85 : 1
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">
                  {index + 1}. {goal.name}
                </Typography>
                <Box textAlign="right">
                  {goal.startDate && !goal.endDate && (
                    <Typography variant="body2" color="text.secondary">
                      Started: {new Date(goal.startDate).toLocaleString()}
                    </Typography>
                  )}
                  {goal.endDate && (
                    <Typography variant="body2" color="text.secondary">
                      Ended: {new Date(goal.endDate).toLocaleString()}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {goal.description || 'No description'}
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight="bold">
                Due: {goal.dueDate}
              </Typography>
            </CardContent>
            <CardActions>
              {!goal.startDate && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleStartGoal(goal)}
                  disabled={loading}
                  fullWidth
                >
                  Start
                </Button>
              )}
              {goal.startDate && !goal.endDate && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleEndGoal(goal)}
                  disabled={loading}
                  fullWidth
                >
                  End
                </Button>
              )}
            </CardActions>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Goals;
