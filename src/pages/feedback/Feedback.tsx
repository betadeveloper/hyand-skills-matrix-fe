import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { InsertComment } from '@mui/icons-material';
import { get } from '../../api/api';

const Feedback = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [roles] = useState<any[]>([]);

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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" ml={5}>
      <Box display="flex" flexDirection="row" alignItems="center" mb={3} mt={3}>
        <InsertComment color="primary" style={{ fontSize: 50, marginRight: 10 }} />
        <Typography variant="h1" fontWeight={600}>
          Feedback
        </Typography>
      </Box>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : feedback.length > 0 ? (
        <Box display="flex" flexDirection="column" mt={3} width="80%">
          {feedback.map((item, index) => (
            <Box
              key={index}
              mb={3}
              p={3}
              sx={{
                backgroundColor: '#f9f9f9',
                borderRadius: 4,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
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
        <Button variant="contained" color="primary" sx={{ mt: 3 }}>
          Give Feedback
        </Button>
      )}

    </Box>
  );
};

export default Feedback;
