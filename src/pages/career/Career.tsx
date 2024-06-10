import { useEffect, useState } from 'react';
import { Card, CardContent, Box, Typography, MenuItem, Select, LinearProgress } from '@mui/material';
import { get, post, put } from '../../api/api.ts';
import { toast } from 'react-toastify';
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
    const numerator = proficiencies.reduce((acc, proficiency, i) => acc + (proficiency / 5) * weights[i], 0);
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

  const [score, setScore] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);

  const [selectedProficiencies, setSelectedProficiencies] = useState<number[]>([]);

  const careerLevels = Object.values(CareerLevel);

  useEffect(() => {
    get('http://localhost:8080/api/employee/current').then((response: any) => {
      setFirstName(response.firstName);
      setLastName(response.lastName);
      setEmail(response.email);
      setPosition(response.position);
      setDepartment(response.department);
    });
    get('http://localhost:8080/api/careerPaths').then((response: any) => {
      setCareerPaths(response);
      setLoading(false);
    });

    if (careerPaths.length > 0) {
      const weights = careerPaths[0].skills.map((skill) => skill.weight);
      const score = calculateFinalCareerPathScore(selectedProficiencies, weights);
      setScore(score);

      if (score < 72) {
        setCareerLevel(CareerLevel.JUNIOR);
      } else if (score < 144) {
        setCareerLevel(CareerLevel.MID);
      } else if (score < 216) {
        setCareerLevel(CareerLevel.SENIOR);
      } else if (score < 288) {
        setCareerLevel(CareerLevel.LEAD);
      } else {
        setCareerLevel(CareerLevel.PRINCIPAL);
      }
    }
  }, [selectedProficiencies]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box sx={{ width: '100%', mb: 0.5 }}>
        <Typography sx={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center' }}>
          Score: {score.toFixed(2)}
        </Typography>
        <LinearProgress variant="determinate" value={(score / 360) * 100} sx={{ height: '24px' }} />
      </Box>
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

      {careerPaths && (
        <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
          <Typography variant="h6" mt={3}>
            Skills for {careerPaths[0].name} Career Path
          </Typography>
          {careerPaths[0].skills.map((skill, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <Typography variant="body1">{skill.name}</Typography>
              <Select
                sx={{ width: '400px' }}
                defaultValue={0}
                onChange={(event) => {
                  const newProficiencies = [...selectedProficiencies];
                  newProficiencies[index] = Number(event.target.value);
                  setSelectedProficiencies(newProficiencies);
                }}
              >
                <MenuItem value={0} disabled>
                  Select proficiency
                </MenuItem>
                <MenuItem value={1}>Beginner</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>Advanced</MenuItem>
                <MenuItem value={4}>Master</MenuItem>
                <MenuItem value={5}>Expert</MenuItem>
              </Select>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export default Career;
