import { Box } from '@mui/material';
import head from '../../assets/images/head.jpg';
import GoalsCard from '../../components/goals-card/GoalsCard.tsx';
import ProgressCard from '../../components/progress-card/ProgressCard.tsx';
import OwnersCard from '../../components/owners-card/OwnersCard.tsx';

const Home = () => {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: 150,
          backgroundImage: `url(${head})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 2,
          padding: 2
        }}
      >
        <Box sx={{ width: '500px' }}>
          <GoalsCard />
        </Box>
        <Box sx={{ width: '500px' }}>
          <ProgressCard />
        </Box>
        <Box sx={{ width: '500px' }}>
          <OwnersCard />
        </Box>
      </Box>
    </>
  );
};

export default Home;
