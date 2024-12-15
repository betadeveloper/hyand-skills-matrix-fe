import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  MenuItem,
  Select,
  LinearProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { get, post } from '../../api/api.ts';
import { ToastContainer, toast } from 'react-toastify';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Link } from 'react-router-dom';
import { Endpoint } from '../../routes/endpoint.tsx';

import { Add } from '@mui/icons-material/';


const Career = () => {
  enum CareerLevel {
    JUNIOR = 'JUNIOR',
    MID = 'MID',
    SENIOR = 'SENIOR',
    LEAD = 'LEAD',
    PRINCIPAL = 'PRINCIPAL'
  }

  const careerLevelOrder = [
    CareerLevel.JUNIOR,
    CareerLevel.MID,
    CareerLevel.SENIOR,
    CareerLevel.LEAD,
    CareerLevel.PRINCIPAL
  ];

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
    const numerator = proficiencies.reduce((acc, proficiency, i) => acc + Math.pow(proficiency / 5, 2) * weights[i], 0);
    const denominator = weights.reduce((acc, weight) => acc + weight, 0);
    return (numerator / denominator) * 360;
  }

  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [careerPath, setCareerPath] = useState<CareerPath>();
  const [careerLevel, setCareerLevel] = useState<CareerLevel>();
  const [roles, setRoles] = useState<string[]>([]);
  const [evaluatedCareerLevel, setEvaluatedCareerLevel] = useState<CareerLevel>();
  const [owners, setOwners] = useState<any[]>([]);

  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProficiencies, setSelectedProficiencies] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);

  const { width, height } = useWindowSize();

  const careerLevels = Object.values(CareerLevel);

  const handleSubmitReviewRequest = () => {
    const reviewRequest = {
      score: score,
      careerLevel: careerLevel,
      evaluatedCareerLevel: evaluatedCareerLevel
    };

    post('http://localhost:8080/api/reviews/createReviewRequest', reviewRequest)
      .then(() => {
        toast.success('Review request created successfully!');
        handleClose();
      })
      .catch((error) => {
        toast.error('Failed to create review request: ' + error.message);
        handleClose();
      });
  };

  useEffect(() => {
    get('http://localhost:8080/api/employee/current').then((response: any) => {
      setCareerLevel(response.careerLevel);
      setRoles(response.roles);
    });
    get('http://localhost:8080/api/careerPaths/all').then((response: any) => {
      setCareerPaths(response);
      setLoading(false);
    });
    get('http://localhost:8080/api/owners/currentEmployee').then((response: any) => {
      setOwners(response);
    });

    get('http://localhost:8080/api/careerPaths/current').then((response: CareerPath) => {
      setCareerPath(response);

      if (response && response.id) {
        get(`http://localhost:8080/api/skills/${response.id}`).then((skillsResponse: Skill[]) => {
          setSkills(skillsResponse);
        });
      }
    });
  }, []);


  const handleClickOpen = () => {
    setOpen(true);
    console.log(careerLevel);
    console.log(evaluatedCareerLevel);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (!date) {
      toast.error('Please select a date!');
      return;
    }

    toast.success(`Meeting has been scheduled with ${owners[0].firstName} ${owners[0].lastName} on ${date}!`);
    setOpen(false);
  };


  const calculateCareerLevel = () => {
    if (careerPaths.length > 0) {
      const weights = skills.map((skill) => skill.weight);
      const score = calculateFinalCareerPathScore(selectedProficiencies, weights);
      setScore(score);

      let newCareerLevel: CareerLevel;

      if (score <= 72) {
        newCareerLevel = careerLevelOrder[0];
      } else if (score <= 144) {
        newCareerLevel = careerLevelOrder[1];
      } else if (score <= 216) {
        newCareerLevel = careerLevelOrder[2];
      } else if (score <= 288) {
        newCareerLevel = careerLevelOrder[3];
      } else {
        newCareerLevel = careerLevelOrder[4];
      }

      setEvaluatedCareerLevel(newCareerLevel);

      if (careerLevelOrder.indexOf(newCareerLevel) > careerLevelOrder.indexOf(careerLevel as CareerLevel)) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} />}
      <Box
        sx={{
          width: '100%',
          mb: 0.5,
          backgroundImage: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0px 8px 24px rgba(0,0,0,0.1)'
        }}>
        <Typography sx={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#1976d2' }}>
          Score: {score ? score.toFixed(2) : 'Not evaluated'}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(score / 360) * 100}
          sx={{ height: '24px', borderRadius: '12px' }}
        />
      </Box>
      <Box display={'flex'} mt={4} justifyContent="space-around">
        {careerLevels.map((careerLevelEl: CareerLevel, index: number) => (
          <Box key={index} flex={1}>
            <Card
              variant="outlined"
              sx={{
                backgroundColor: careerLevelEl === evaluatedCareerLevel ? '#1976d2' : '#fff',
                color: careerLevelEl === evaluatedCareerLevel ? '#fff' : '#000',
                transition: 'background-color 0.3s',
                padding: '8px',
                borderRadius: '8px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                border: careerLevelEl === careerLevel ? '2px solid #2196f3' : 'none' //
              }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  {careerLevelEl}
                </Typography>
                {careerLevelEl === careerLevel && (
                  <Typography
                    fontSize={18}
                    sx={{ mt: 1, color: careerLevelEl === evaluatedCareerLevel ? '#FFF' : '#1976d2' }}>
                    Current Career Level
                  </Typography>
                )}
                {careerLevelEl === evaluatedCareerLevel && (
                  <Typography fontSize={18} color="#ffffff" sx={{ mt: 1 }}>
                    Evaluated Career Level
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      <Box position="relative" display="flex" justifyContent="flex-start">
        <Box position="absolute" right={24} top={55}>
          {roles.includes('ROLE_ADMIN') || roles.includes('ROLE_OWNER') ? (
            <Button component={Link} to={'/' + Endpoint.CAREER_PATHS} variant="contained" color="primary">
              <Add sx={{ mr: 1 }} />Add New Career Paths
            </Button>
          ) : null}
          <Box position="absolute" right={0} top={55}>
          <Link to="/career-level-requirements" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" sx={{width: '235px'}}>View Career Level Expectations</Button>
          </Link>
          </Box>
        </Box>
      </Box>

      {careerPath ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
          <Typography variant="h4" mt={3} mb={2}>
            Skills for <b>{careerPath.name}</b> Career Path
          </Typography>
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <Box key={index} sx={{ marginBottom: 2, width: '400px' }}>
                <Typography variant="body1" fontWeight="bold" mb={1}>
                  {skill.name}
                </Typography>
                <Select
                  sx={{ width: '100%', marginBottom: '16px' }}
                  defaultValue={0}
                  onChange={(event) => {
                    const newProficiencies = [...selectedProficiencies];
                    newProficiencies[index] = Number(event.target.value);
                    setSelectedProficiencies(newProficiencies);
                  }}>
                  <MenuItem value={0} disabled title="Select a proficiency level">
                    Select proficiency
                  </MenuItem>
                  <MenuItem value={1} title="Able to convey basic ideas and instructions">
                    Beginner
                  </MenuItem>
                  <MenuItem value={2} title="Demonstrating structured and detailed understanding">
                    Medium
                  </MenuItem>
                  <MenuItem value={3} title="Proficient in the skill, able to perform complex tasks, mentor others">
                    Advanced
                  </MenuItem>
                  <MenuItem value={4} title="Highly skilled, with extensive experience, can take leadership, solving very complex problems">
                    Master
                  </MenuItem>
                  <MenuItem value={5} title="Deep understanding, expert in the field, can solve super complex problems, consult others">
                    Expert
                  </MenuItem>
                </Select>
              </Box>
            ))
          ) : (
            <Typography>No skills available for this career path</Typography>
          )}
        </Box>
      ) : (
        <Typography sx={{textAlign: 'center', mt: 3, fontSize: '24px'}}>No career path available</Typography>
      )}

      {careerPath && (
        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
          {skills.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '400px' }}>
              <Button
                onClick={calculateCareerLevel}
                sx={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  ':hover': { backgroundColor: '#1565c0' },
                  fontSize: '16px'
                }}>
                Evaluate 🎉
              </Button>
              {(careerLevel && careerLevelOrder.indexOf(evaluatedCareerLevel) > careerLevelOrder.indexOf(careerLevel)) && (
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                  Book Review
                </Button>
              )}
            </Box>
          )}
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle fontSize={24} mb={2}>Book Review From Owner</DialogTitle>
        <DialogContent>
          <Typography mb={2} fontSize={18}>
            Owner: <b>{owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : 'No owners available'}</b>
          </Typography>
          <Typography mt={2} mb={2} fontSize={20}>
            Score: {score ? score.toPrecision(4) : 'N/A'}
          </Typography>
          <Typography fontSize={20}>
            Evaluated Career
            Level: {evaluatedCareerLevel && careerLevel ? `${careerLevel} --> ${evaluatedCareerLevel} ` : 'N/A'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmitReviewRequest}>Send</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default Career;