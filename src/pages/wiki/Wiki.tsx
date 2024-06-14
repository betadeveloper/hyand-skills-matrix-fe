import { useEffect } from 'react';
import { AutoStories } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const Wiki = () => {
  useEffect(() => {
    localStorage.setItem('selectedNavItem', 'Wiki');
  }, []);

  return (
    <Box ml={4}>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
        <AutoStories color="primary" style={{ fontSize: 50, marginRight: 10 }} />
        <h1>Wiki</h1>
      </Box>
      <Typography width={600}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos blanditiis dolorem eum tempore numquam
        exercitationem sint! Delectus est at iste, eos quibusdam officiis ex dolore in earum tenetur eligendi sapiente
        non assumenda hic aperiam doloribus, tempora cupiditate alias pariatur aspernatur maiores. Error excepturi est
        fugiat blanditiis atque, quisquam hic dolores!
      </Typography>
      <Typography width={600} mt={8}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos blanditiis dolorem eum tempore numquam
        exercitationem sint! Delectus est at iste, eos quibusdam officiis ex dolore in earum tenetur eligendi sapiente
        non assumenda hic aperiam doloribus, tempora cupiditate alias pariatur aspernatur maiores. Error excepturi est
        fugiat blanditiis atque, quisquam hic dolores!
      </Typography>
    </Box>
  );
};

export default Wiki;
