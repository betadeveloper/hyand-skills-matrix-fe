import { AutoStories } from '@mui/icons-material';
import { Box, Typography, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { get } from '../../api/api';

// Helper function to format date
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

const Feedback = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} ml={5}>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} mb={3} mt={3}>
        <AutoStories color="primary" style={{ fontSize: 50, marginRight: 10 }} />
        <Typography variant="h3" fontWeight={600}>
          Feedback
        </Typography>
      </Box>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : feedback.length > 0 ? (
        <Box display={'flex'} flexDirection={'column'} mt={3} width="80%">
          {feedback.map((item, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                mb: 3,
                p: 3,
                backgroundColor: '#f9f9f9',
                borderRadius: 4,
                transition: '0.3s',
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                }
              }}>
              <Typography variant="body1" gutterBottom>
                <strong>"{item.feedbackText}"</strong>
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                <strong>Given by:</strong> {item.owner.firstName} {item.owner.lastName}, <strong>on:</strong>{' '}
                {formatDate(item.createdAt)}
              </Typography>
            </Paper>
          ))}
        </Box>
      ) : (
        <Typography>No feedback available yet</Typography>
      )}
    </Box>
  );
};

export default Feedback;
