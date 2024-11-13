import { useState, useEffect } from 'react';
import { get, put } from '../../api/api';
import { Button, Typography, Card, CardContent, Container } from '@mui/material';
import { Assistant } from '@mui/icons-material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const ReviewPortal = () => {
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await get('http://localhost:8080/api/reviews/currentOwner');
      setReviews(response.filter(review => review.status === 'NEW'));
      console.log("Reviews:", response);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await put(`http://localhost:8080/api/reviews/${reviewId}/approve`);
      fetchReviews();
    } catch (error) {
      console.error("Error approving review:", error);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await put(`http://localhost:8080/api/reviews/${reviewId}/reject`);
      fetchReviews();
    } catch (error) {
      console.error("Error rejecting review:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
        <Assistant color="primary" sx={{ fontSize: 50, marginRight: 2 }} />
        <Typography variant="h1" sx={{ fontWeight: '600' }}>Review Portal</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/finished-reviews')}
        >
          Go to Finished Reviews
        </Button>
      </Box>

      {reviews.map((review) => (
        <Card
          key={review.id}
          sx={{
            marginBottom: 2,
            padding: 2,
            maxWidth: 'sm',
            margin: '0 auto',
            border: '1px solid #e0e0e0',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {review.employee.firstName} {review.employee.lastName}
            </Typography>
            <Typography>{review.reviewDate}</Typography>
            <Typography sx={{ marginTop: 1, color: 'text.secondary' }}>
              {review.reviewReport}
            </Typography>

            <Typography sx={{ marginTop: 1 }}>
              Career Level: {review.careerLevel} &rarr; {review.evaluatedCareerLevel}
            </Typography>
            {review.score && (
              <Typography  sx={{ marginTop: 1 }}>
                Score: {review.score}
              </Typography>
            )}
          </CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
            <Button onClick={() => handleReject(review.id)} variant="outlined" color="error">
              Reject
            </Button>
            <Button onClick={() => handleApprove(review.id)} variant="outlined" color="primary">
              Approve
            </Button>
          </Box>
        </Card>
      ))}
    </Container>
  );
};

export default ReviewPortal;
