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
  const [owners, setOwners] = useState<any[]>([]);

  const [score, setScore] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);

  const [selectedProficiencies, setSelectedProficiencies] = useState<number[]>([]);

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');

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
    get('http://localhost:8080/api/owners/currentEmployee').then((response: any) => {
      setOwners(response);
    });
  }, [selectedProficiencies]);

  if (loading) {
    return <div>Loading...</div>;
  }

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

  const calculateCareerLevel = () => {
    if (careerPaths.length > 0) {
      const weights = careerPaths[0].skills.map((skill) => skill.weight);
      const score = calculateFinalCareerPathScore(selectedProficiencies, weights);
      setScore(score);

      if (score <= 72) {
        setCareerLevel(CareerLevel.JUNIOR);
      } else if (score <= 144) {
        setCareerLevel(CareerLevel.MID);
      } else if (score <= 216) {
        setCareerLevel(CareerLevel.SENIOR);
      } else if (score <= 288) {
        setCareerLevel(CareerLevel.LEAD);
      } else {
        setCareerLevel(CareerLevel.PRINCIPAL);
      }
    }
  };

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
              <Box key={index} flex={1}>
                <Card
                    variant="outlined"
                    sx={{
                      backgroundColor: careerLevelEl === careerLevel ? 'primary.main' : 'white',
                      color: careerLevelEl === careerLevel ? 'white' : 'black'
                    }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h5" fontWeight={'Bold'}>
                    <span style={{ visibility: careerLevelEl === careerLevel ? 'visible' : 'hidden' }}>
                      Current career level:
                    </span>
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
              Skills for <b>{careerPaths[0].name}</b> Career Path
            </Typography>
            {careerPaths[0].skills.length > 0 ? (
                careerPaths[0].skills.map((skill, index) => (
                    <Box key={index} sx={{ marginBottom: 2 }}>
                      <Typography variant="body1">{skill.name}</Typography>
                      <Select
                          sx={{ width: '400px' }}
                          defaultValue={0}
                          onChange={(event) => {
                            const newProficiencies = [...selectedProficiencies];
                            newProficiencies[index] = Number(event.target.value);
                            setSelectedProficiencies(newProficiencies);
                          }}>
                        <MenuItem value={0} disabled>
                          Select proficiency
                        </MenuItem>
                        <MenuItem value={1} title="Beginner - Fundamentals, basic abilities with the skill">
                          Beginner
                        </MenuItem>
                        <MenuItem value={2} title="Medium - Have some experience with this skill">
                          Medium
                        </MenuItem>
                        <MenuItem value={3} title="Advanced - Have substantial understanding and experience with this skill">
                          Advanced
                        </MenuItem>
                        <MenuItem value={4} title="Master - Have deep understanding and experience with this skill">
                          Master
                        </MenuItem>
                        <MenuItem value={5} title="Expert - Have comprehensive and authoritative knowledge of this skill">
                          Expert
                        </MenuItem>
                      </Select>
                    </Box>
                ))
            ) : (
                <Typography>No skills available for this career path</Typography>
            )}
            {careerPaths[0].skills.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '400px', mt: 2 }}>
                  <Button
                      onClick={calculateCareerLevel}
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        ':hover': { backgroundColor: 'primary.main', opacity: 0.8 }
                      }}
                  >
                    Evaluate
                  </Button>
                  <Button sx={{ ml: 20 }} variant="outlined" color="primary" onClick={handleClickOpen}>
                    Book Meeting
                  </Button>
                </Box>
            )}
            {careerPaths[0].skills.length === 0 && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      // TODO: Add skills logic here
                    }}
                >
                  Add skills
                </Button>
            )}
            <Dialog open={open} onClose={handleClose} fullWidth>
              <DialogTitle fontSize={32}>Book a Meeting With Owner</DialogTitle>
              <DialogContent>
                <Typography mb={2} fontSize={18}>
                  Owner:{' '}
                  <b>{owners.length > 0 ? `${owners[0].firstName} ${owners[0].lastName}` : 'No owners available'}</b>
                </Typography>
                <Typography mt={2} mb={2} fontSize={20}>
                  Score: {`${score.toPrecision(4)}`}
                </Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    id="date"
                    label="Meeting Date"
                    type="datetime-local"
                    fullWidth
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true
                    }}
                    required
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Send</Button>
              </DialogActions>
            </Dialog>
            <ToastContainer />
          </Box>
      )}
      </>
  );
};

export default Career;
