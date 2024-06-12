import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { Link } from 'react-router-dom';
import { Endpoint } from '../../routes/endpoint.tsx';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import { post, remove } from '../../api/api.ts';
import { useState } from 'react';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

interface InformationCardProps {
  IconComponent: React.ElementType<SvgIconProps>;
  title: string;
  buttonText?: string;
  linkEndpoint?: Endpoint;
  content?: unknown;
  owners?: Array<{ id: number; firstName: string; lastName: string }>;
  goals?: Array<{ id: number; name: string; description: string; dueDate: string }>;
  actionButton?: boolean;
  actionButtonText?: string;
  actionButtonLink?: string;
}

export default function InformationCard({
  IconComponent,
  title,
  content,
  buttonText,
  linkEndpoint,
  owners,
  goals,
  actionButton,
  actionButtonText
}: Readonly<InformationCardProps>) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().substring(0, 10));

  const handleCreateGoal = () => {
    post('http://localhost:8080/api/goal', {
      name,
      description,
      dueDate
    }).then(() => {
      setOpen(false);
      toast.success('Goal added successfully');
    });
  };

  const removeGoal = (goalId: number) => {
    remove(`http://localhost:8080/api/goal/${goalId}`).then(() => {
      toast.success('Goal removed successfully');
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" alignItems="center" gap={1}>
            <IconComponent color="primary" />
            <Typography variant="h5" fontWeight={'Bold'}>
              {title}
            </Typography>
            {actionButton && (
              <Button onClick={handleClickOpen} sx={{ ml: 'auto' }}>
                {actionButtonText}
              </Button>
            )}
          </Box>
          <Box>
            <Typography mb={4}>{content as React.ReactNode}</Typography>
          </Box>
          {owners && owners.length > 0 && (
            <Box>
              {owners.map((owner) => (
                <Link to={`/employee/${owner.id}`} key={owner.id}>
                  <Typography key={owner.id} fontWeight={500}>{`${owner.firstName} ${owner.lastName}`}</Typography>
                </Link>
              ))}
            </Box>
          )}
          {goals && goals.length > 0 && (
            <Box>
              {goals.map((goal) => (
                <Box display={'flex'} alignItems={'center'} key={goal.id}>
                  <Link to={`/goals`} key={goal.id}>
                    <Typography fontWeight={500}>{`${goal.name}`}</Typography>
                  </Link>
                  <Typography fontWeight={400} ml={'auto'}>{`${goal.dueDate}`}</Typography>
                  <Button onClick={() => removeGoal(goal.id)}>
                    <CloseIcon />
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Goal</DialogTitle>
          <DialogContent>
            <DialogContentText>To add a goal, please enter the details below.</DialogContentText>
            <TextField
              autoFocus
              id="name"
              label="Goal Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2, mt: 2 }}
              fullWidth
            />
            <TextField
              id="description"
              label="Goal Description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 3 }}
              fullWidth
            />
            <TextField
              id="date"
              label="Due Date"
              type="date"
              onChange={(e) => setDueDate(e.target.value)}
              value={dueDate}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleCreateGoal}>Add</Button>
          </DialogActions>
        </Dialog>
        <CardActions>
          {linkEndpoint && (
            <Button size="small" color="primary" component={Link} to={linkEndpoint}>
              {buttonText}
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}
