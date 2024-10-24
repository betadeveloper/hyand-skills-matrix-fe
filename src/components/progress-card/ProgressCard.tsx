import { Box, Button, Typography } from '@mui/material';
import { TrackChanges } from '@mui/icons-material/';
import { Endpoint } from '../../routes/endpoint.tsx';

const ProgressCard = () => {
  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: '16px auto',
        padding: 3,
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: 2,
        minHeight: 200
      }}
      variant="outlined"
    >
      <Box display="flex" alignItems="center" mb={2}>
        <TrackChanges color="primary" />
        <Typography variant="h5" fontWeight={'Bold'} ml={1}>Progress</Typography>
        <Button sx={{ ml: 'auto' }} component="a" href={Endpoint.STATISTICS}>View Details</Button>
      </Box>
      <Typography>This section will display the progress details.</Typography>
    </Box>
  );
};

export default ProgressCard;
