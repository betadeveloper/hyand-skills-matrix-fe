import { useState, useEffect } from 'react';
import { get, put, post } from '../../api/api';
import {
  Button,
  Typography,
  Card,
  CardContent,
  Container,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Assistant } from '@mui/icons-material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import AddFeedbackDialog from '../../components/add-feedback-dialog/AddFeedbackDialog.tsx';

const ReviewPortal = () => {
  const [reviews, setReviews] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState('');
  const [employee, setEmployee] = useState(null);
  const [ownerId, setOwnerId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();

    get('http://localhost:8080/api/employee/current').then((response) => {
      setOwnerId(response.id);
    });
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await get('http://localhost:8080/api/reviews/currentOwner');
      const newReviews = response.filter((review) => review.status === 'NEW');
      setReviews(newReviews);

      setCheckboxStates(newReviews.reduce((acc, review) => {
        acc[review.id] = true;
        return acc;
      }, {}));

      console.log('Reviews:', response);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleCheckboxChange = (reviewId, checked) => {
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [reviewId]: checked,
    }));
  };

  const handleAction = async (reviewId, action) => {
    const selectedReview = reviews.find((review) => review.id === reviewId);
    setSelectedReviewId(reviewId);
    setEmployee(selectedReview?.employee || null);
    setConfirmationAction(action);

    if (checkboxStates[reviewId]) {
      setOpenFeedbackDialog(true);
    } else {
      setOpenConfirmationDialog(true);
    }
  };


  const handleConfirmAction = async () => {
    try {
      if (selectedReviewId && confirmationAction) {
        await put(`http://localhost:8080/api/reviews/${selectedReviewId}/${confirmationAction}`);
        fetchReviews();
      }
      setOpenConfirmationDialog(false);
      setSelectedReviewId(null);
      setConfirmationAction('');
    } catch (error) {
      console.error(`Error performing ${confirmationAction} action:`, error);
    }
  };


  const handleFeedbackSubmit = async (feedbackText, selectedEmployeeId) => {
    try {
      if (feedbackText && selectedReviewId) {
        await post('http://localhost:8080/api/feedback', {
          feedbackText,
          reviewId: selectedReviewId,
          employeeId: selectedEmployeeId,
        });
      }

      if (confirmationAction === 'approve') {
        await put(`http://localhost:8080/api/reviews/${selectedReviewId}/approve`);
      }
      else if (confirmationAction === 'reject') {
        await put(`http://localhost:8080/api/reviews/${selectedReviewId}/reject`);
      }

      fetchReviews();

      setOpenFeedbackDialog(false);
      setSelectedReviewId(null);
    } catch (error) {
      console.error('Error submitting feedback or review action:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
        <Assistant color="primary" sx={{ fontSize: 50, marginRight: 2 }} />
        <Typography variant="h1" sx={{ fontWeight: '600' }}>
          Review Portal
        </Typography>
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
            borderRadius: '8px',
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
              <Typography sx={{ marginTop: 1 }}>
                Score: {review.score.toFixed(2).replace(/\.00$/, '')}
              </Typography>
            )}
          </CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkboxStates[review.id] || false}
                  onChange={(e) => handleCheckboxChange(review.id, e.target.checked)}
                />
              }
              label="Leave Feedback"
            />
            <Box>
              <Button onClick={() => handleAction(review.id, 'reject')} variant="outlined" color="error">
                Reject
              </Button>
              <Button onClick={() => handleAction(review.id, 'approve')} variant="outlined" color="primary" sx={{ ml: 2 }}>
                Approve
              </Button>
            </Box>
          </Box>
        </Card>
      ))}

      {openFeedbackDialog && (
        <AddFeedbackDialog
          open={openFeedbackDialog}
          onClose={() => setOpenFeedbackDialog(false)}
          onFeedbackSubmitted={handleFeedbackSubmit}
          employee={employee}
          ownerId={ownerId}
        />
      )}

      {openConfirmationDialog && (
        <Dialog open={openConfirmationDialog} onClose={() => setOpenConfirmationDialog(false)}>
          <DialogTitle>Confirm {confirmationAction}</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {confirmationAction} this review without leaving feedback?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmationDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} color="primary">
              {confirmationAction}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default ReviewPortal;
