import { useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';

const Statistics = () => {
  const data = [
    { subject: 'Negotiation', A: 120, B: 110 },
    { subject: 'Leadership', A: 98, B: 130 },
    { subject: 'Technical skills', A: 86, B: 130 },
    { subject: 'EQ', A: 99, B: 100 },
  ];

  useEffect(() => {
    localStorage.setItem('selectedNavItem', 'Statistics');
  }, []);

  return (
    <>
      <h1>Radar Chart</h1>
      <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 150]} />
        <Radar name="Raigardas" dataKey="A" stroke="#0092E1" fill="#0092E1" fillOpacity={0.6} />
        <Tooltip />
        <Legend />
      </RadarChart>
    </>
  );
};

export default Statistics;
