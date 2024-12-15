import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { get } from '../../api/api.ts';

const Statistics = () => {
  // TODO: get from career path skills
  const data = [
    { subject: 'Negotiation', A: 120, B: 110 },
    { subject: 'Leadership', A: 98, B: 130 },
    { subject: 'Technical skills', A: 120, B: 130 },
    { subject: 'EQ', A: 99, B: 100 },
    { subject: 'Communication', A: 85, B: 90 },
    { subject: 'Problem solving', A: 120, B: 85 },
    { subject: 'Teamwork', A: 90, B: 80 },
    { subject: 'Time management', A: 70, B: 90 },
    { subject: 'Creativity', A: 80, B: 85 }
  ];

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  useEffect(() => {
    localStorage.setItem('selectedNavItem', 'Statistics');

    get('http://localhost:8080/api/employee/current').then((response) => {
      setFirstName(response.firstName);
      setLastName(response.lastName);
    });
  }, []);

  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} mt={4}>
        <TrackChangesIcon color="primary" style={{ fontSize: 50, marginRight: 10 }} />
        <Typography variant="h1" fontWeight={600}>Statistics</Typography>
      </Box>
      <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 150]} />
        <Radar name={`${firstName} ${lastName}`} dataKey="A" stroke="#0092E1" fill="#0092E1" fillOpacity={0.6} />
        <Tooltip />
        <Legend />
      </RadarChart>
    </Box>
  );
};

export default Statistics;
