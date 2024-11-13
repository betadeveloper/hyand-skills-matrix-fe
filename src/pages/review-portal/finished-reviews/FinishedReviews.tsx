import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Container, Box, Button } from '@mui/material';
import { get } from '../../../api/api.ts';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material'; // Import the ArrowBack icon

const FinishedReviews = () => {
  const [finishedReviews, setFinishedReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFinishedReviews();
  }, []);

  const fetchFinishedReviews = async () => {
    try {
      const response = await get('http://localhost:8080/api/reviews/currentOwner');
      const filteredReviews = response.filter(review => review.status !== 'NEW');
      setFinishedReviews(filteredReviews);
      console.log("Finished Reviews:", filteredReviews);
    } catch (error) {
      console.error("Error fetching finished reviews:", error);
    }
  };

  const handleBack = () => {
    navigate('/review-portal');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 2 }}>
      <Typography variant="h2" sx={{ fontWeight: '600', mb: 4 }}>Finished Reviews</Typography>

      {finishedReviews.length === 0 ? (
        <Typography variant="body1">No finished reviews available.</Typography>
      ) : (
        finishedReviews.map((review) => (
          <Card
            key={review.id}
            sx={{
              marginBottom: 2,
              padding: 2,
              border: review.status === 'APPROVED' ? '2px solid green' : '2px solid red',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {review.employee.firstName} {review.employee.lastName}
              </Typography>
              <Typography variant="body1">{review.reviewDate}</Typography>
              <Typography variant="body2" sx={{ marginTop: 1, color: 'text.secondary' }}>
                {review.reviewReport}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}

      <Box sx={{ marginBottom: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Back to Review Portal
        </Button>
      </Box>
    </Container>
  );
};

export default FinishedReviews;
