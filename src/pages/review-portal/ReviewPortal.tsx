import { useState, useEffect } from 'react';
import { get, put } from '../../api/api';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';

const ReviewPortal = () => {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await get('http://localhost:8080/api/reviews/currentOwner');
      setReviews(response);
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
    <div>
      <h1>Review Portal</h1>
      {reviews.map((review) => (
        <div key={review.id}>
          <Typography variant="h6">{review.employeeName}</Typography>
          <Typography variant="body1">{review.reviewDate}</Typography>
          <Button onClick={() => handleOpen(review)}>View Review</Button>
        </div>
      ))}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Review Report</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{selectedReview?.employeeName}</Typography>
          <Typography variant="body1">{selectedReview?.reviewDate}</Typography>
          <Typography variant="body1">{selectedReview?.reviewReport}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleApprove(selectedReview?.id)} color="primary">Approve</Button>
          <Button onClick={() => handleReject(selectedReview?.id)} color="secondary">Reject</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReviewPortal;
