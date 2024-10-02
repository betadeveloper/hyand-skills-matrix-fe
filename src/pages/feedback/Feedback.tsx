import { AutoStories } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { get } from 'react-hook-form';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    localStorage.setItem('selectedNavItem', 'Feedback');

    get('http://localhost:8080/api/feedback/currentEmployee').then((response: any) => {
      setFeedback(response);
    });
  }, []);

  return (
    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} ml={5}>
      <AutoStories color="primary" style={{ fontSize: 50, marginRight: 10 }} />
      <h1>Feedback</h1>
    </Box>
  );
};

export default Feedback;
