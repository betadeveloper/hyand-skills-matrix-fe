import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Container, Box, Button } from '@mui/material';
import { get } from '../../../api/api.ts';

const FinishedReviews = () => {
  const [finishedReviews, setFinishedReviews] = useState([]);

  useEffect(() => {
    fetchFinishedReviews();
  }, []);

  const fetchFinishedReviews = async () => {
    try {
      const response = await get('http://localhost:8080/api/reviews');
      setFinishedReviews(response);
      console.log("Finished Reviews:", response);
    } catch (error) {
      console.error("Error fetching finished reviews:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: '600', mb: 4 }}>Finished Reviews</Typography>
      {finishedReviews.map((review) => (
        <Card
          key={review.id}
          sx={{
            marginBottom: 2,
            padding: 2,
            border: review.status === 'approved' ? '2px solid green' : '2px solid red',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{review.employee.firstName} {review.employee.lastName}</Typography>
            <Typography variant="body1">{review.reviewDate}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default FinishedReviews;
