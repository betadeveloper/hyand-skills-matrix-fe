import { useState, useEffect } from 'react';
import { get, put } from '../../api/api';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Card, CardContent, Container } from '@mui/material';
import { Assistant, Close } from '@mui/icons-material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';


const ReviewPortal = () => {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await get('http://localhost:8080/api/reviews/currentOwner');
      setReviews(response);
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

  const handleOpen = (review) => {
    setSelectedReview(review);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReview(null);
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
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{review.employee.firstName} {review.employee.lastName}</Typography>
            <Typography variant="body1">{review.reviewDate}</Typography>
          </CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
            <Button onClick={() => handleOpen(review)} variant="outlined">
              View Review
            </Button>
          </Box>
        </Card>
      ))}

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        }
      }}>
        <DialogTitle sx={{
          fontSize: 24,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e0e0e0',
        }}>
          <span>Review {selectedReview?.employee.firstName} {selectedReview?.employee.lastName} Promotion</span>
          <IconButton onClick={handleClose} edge="end">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '24px'}}>
          <Typography variant="h6" sx={{ marginBottom: 1, color: 'text.secondary' }}>
            {selectedReview?.name}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2, color: 'text.secondary' }}>
            Date: {selectedReview?.reviewDate}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.primary' }}>
            {selectedReview?.reviewReport}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 3, borderTop: '1px solid #e0e0e0', justifyContent: 'flex-end' }}>
          <Button onClick={() => handleReject(selectedReview?.id)} variant="outlined" color="error">
            Reject
          </Button>
          <Button onClick={() => handleApprove(selectedReview?.id)} variant="outlined" color="primary" >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewPortal;
