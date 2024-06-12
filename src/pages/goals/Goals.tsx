import { useEffect, useState } from 'react';
import { get } from '../../api/api';
import { Box } from '@mui/material';
import { DonutSmall } from '@mui/icons-material/';

const Goals = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    get('http://localhost:8080/api/goals/currentEmployee').then((response: any) => {
      setGoals(response);
    });
  }, [goals]);

  return (
    <Box ml={4}>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
        <DonutSmall color="primary" style={{ fontSize: 40, marginRight: 10 }} />
        <h1>Goals</h1>
      </Box>
      {goals?.map((goal: { id: number; name: string; description: string; dueDate: string }, index: number) => (
        <div key={goal.id}>
          <h2>
            {index + 1}. {goal.name}
          </h2>
          <p>{goal.description ? goal.description : 'No description'}</p>
          <p>Due: {goal.dueDate}</p>
        </div>
      ))}
    </Box>
  );
};

export default Goals;
