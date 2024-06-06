import { useEffect, useState } from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { get } from '../../api/api.ts';
const Career = () => {
  enum CareerLevel {
    JUNIOR = 'JUNIOR',
    MID = 'MID',
    SENIOR = 'SENIOR',
    LEAD = 'LEAD',
    PRINCIPAL = 'PRINCIPAL',
  }

  interface Skill {
    id: number;
    name: string;
    description: string;
    proficiency: number;
    weight: number;
  }

  interface CareerPath {
    id: number;
    name: string;
    description: string;
    score: number;
    skills: Skill[];
  }

  function calculateFinalCareerPathScore(proficiencies: number[], weights: number[]): number {
    const numerator = proficiencies.reduce((acc, proficiency, i) => acc + proficiency * weights[i], 0);
    const denominator = weights.reduce((acc, weight) => acc + weight, 0);

    return (numerator / denominator) * 360;
  }

  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [careerLevel, setCareerLevel] = useState<CareerLevel>();

  const careerLevels = Object.values(CareerLevel);

  useEffect(() => {
    get('http://localhost:8080/api/employee/current').then((response) => {
      setFirstName(response.firstName);
      setLastName(response.lastName);
      setEmail(response.email);
      setPosition(response.position);
      setDepartment(response.department);
      setCareerLevel(response.careerLevel);
    });
    get('http://localhost:8080/api/careerPaths').then((response) => {
      console.log(response);
      setCareerPaths(response.data);
      console.log(careerPaths);
    });
  }, []);
  return (
    <Box display={'flex'}>
      {careerLevels.map((careerLevelEl: CareerLevel, index: number) => (
        <Box key={index} sx={{ maxWidth: 400 }} flex={1}>
          <Card
            variant="outlined"
            sx={{
              backgroundColor: careerLevelEl === careerLevel ? 'primary.main' : 'white',
              color: careerLevelEl === careerLevel ? 'white' : 'black',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center">
                <Typography variant="h5" fontWeight={'Bold'}>
                  {careerLevelEl === careerLevel ? ' Current career level: ' : 'Career level: '}
                  <br />
                  {careerLevelEl}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default Career;
