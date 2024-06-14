import { AutoStories } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useEffect } from 'react';

const Feedback = () => {
  useEffect(() => {
    localStorage.setItem('selectedNavItem', 'Feedback');
  }, []);

  return (
    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} ml={5}>
      <AutoStories color="primary" style={{ fontSize: 50, marginRight: 10 }} />
      <h1>Feedback</h1>
    </Box>
  );
};

export default Feedback;
