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
  TextField
} from '@mui/material';
import { get, post, put } from '../../api/api.ts';
import { ToastContainer, toast } from 'react-toastify';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Link } from 'react-router-dom';
import { Endpoint } from '../../routes/endpoint.tsx';

const Career = () => {
  enum CareerLevel {
    JUNIOR = 'JUNIOR',
    MID = 'MID',
    SENIOR = 'SENIOR',
    LEAD = 'LEAD',
    PRINCIPAL = 'PRINCIPAL'
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
    const numerator = proficiencies.reduce((acc, proficiency, i) => acc + Math.pow(proficiency / 5, 2) * weights[i], 0);
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

  useEffect(() => {
    get('http://localhost:8080/api/employee/current').then((response: any) => {
      setFirstName(response.firstName);
      setLastName(response.lastName);
      setEmail(response.email);
      setPosition(response.position);
      setDepartment(response.department);
      setCareerLevel(response.careerLevel);
      setRoles(response.roles);
    });
    get('http://localhost:8080/api/careerPaths').then((response: any) => {
      setCareerPaths(response);
      setLoading(false);
    });
    get('http://localhost:8080/api/owners/currentEmployee').then((response: any) => {
      setOwners(response);
    });

    get('http://localhost:8080/api/skills/1').then((response: Skill[]) => {
      setSkills(response);
    });
  }, []);


  const handleClickOpen = () => {
    setOpen(true);
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

  const handleSubmitReviewRequest = () => {
    post('http://localhost:8080/api/review/createReviewRequest')
      .then(() => {
        toast.success('Review request created successfully!');
        handleCloseReviewDialog(); // Close the dialog on success
      })
      .catch((error) => {
        toast.error('Failed to create review request: ' + error.message);
      });
  };


  const calculateCareerLevel = () => {
    if (careerPaths.length > 0) {
      const weights = skills.map((skill) => skill.weight);
      const score = calculateFinalCareerPathScore(selectedProficiencies, weights);
      setScore(score);

      let newCareerLevel: CareerLevel;

      if (score <= 72) {
        newCareerLevel = CareerLevel.JUNIOR;
      } else if (score <= 144) {
        newCareerLevel = CareerLevel.MID;
      } else if (score <= 216) {
        newCareerLevel = CareerLevel.SENIOR;
      } else if (score <= 288) {
        newCareerLevel = CareerLevel.LEAD;
      } else {
        newCareerLevel = CareerLevel.PRINCIPAL;
      }

      setEvaluatedCareerLevel(newCareerLevel);

      if (newCareerLevel !== careerLevel) {
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

      <Box display="flex" justifyContent="flex-end">
        {roles.includes('ROLE_ADMIN') || roles.includes('ROLE_OWNER') ? (
          <Button component={Link} to={'/' + Endpoint.CAREER_PATHS} variant="contained" color="primary">
            Add New Career Paths
          </Button>
        ) : null}
      </Box>

      {careerPaths[0] && (
        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
          <Typography variant="h6" mt={3}>
            Skills for <b>{careerPaths[0].name}</b> Career Path
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
            ))
          ) : (
            <Typography>No skills available for this career path</Typography>
          )}

          {skills.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '400px'}}>
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
              <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Book Review
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle fontSize={32}>Book Review From Owner</DialogTitle>
        <DialogContent>
          <Typography mb={2} fontSize={18}>
            Owner: <b>{owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : 'No owners available'}</b>
          </Typography>
          <Typography mt={2} mb={2} fontSize={20}>
            Score: {score ? score.toPrecision(4) : 'N/A'}
          </Typography>
          <Typography fontSize={20}>
            Career Level: {evaluatedCareerLevel ? evaluatedCareerLevel : 'N/A'}
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