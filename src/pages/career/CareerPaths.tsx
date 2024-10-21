import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../api/api.ts';
import {
  Box,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  Fab,
  Paper,
  Modal,
  Checkbox,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CareerPaths = () => {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [newCareerPath, setNewCareerPath] = useState<CareerPath>({
    id: 0,
    name: '',
    description: '',
    skills: []
  });
  const [showInputs, setShowInputs] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  interface CareerPath {
    id: number;
    name: string;
    description: string;
    skills: Skill[];
  }

  interface Skill {
    id: number;
    name: string;
    description: string;
    proficiency: number;
    weight: number;
  }

  interface Employee {
    id: number;
    name: string;
  }

  useEffect(() => {
    get('http://localhost:8080/api/careerPaths/all').then((response: any) => {
      setCareerPaths(response);
    });
    get('http://localhost:8080/api/employees').then((response: any) => {
      setEmployees(response);
    });
  }, []);

  const handleCreateCareerPath = () => {
    post('http://localhost:8080/api/careerPaths', newCareerPath).then((response: any) => {
      setCareerPaths([...careerPaths, response]);
      setNewCareerPath({
        id: 0,
        name: '',
        description: '',
        skills: []
      });
      setShowInputs(false);
    });
  };

  const handleShowInputs = () => {
    setShowInputs(true);
  };

  const handleCancelCreate = () => {
    setShowInputs(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleToggleEmployee = (id: number) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleAssignEmployees = () => {
    console.log('Assigned Employees:', selectedEmployees);
    handleCloseModal();
  };

  const handleGoBack = () => {
    navigate('/career');
  };

  return (
    <Box maxWidth={800} margin="40px auto" padding={2}>
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={handleGoBack}>
          Go Back
        </Button>
      </Box>

      <Typography variant="h4" fontWeight={600} align="center" gutterBottom>
        Career Paths
      </Typography>
      <List>
        {careerPaths.map((careerPath) => (
          <Paper key={careerPath.id} elevation={3} style={{ margin: '16px 0', padding: '16px' }}>
            <ListItem>
              <Box flexGrow={1}>
                <Typography variant="h6" gutterBottom>
                  {careerPath.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {careerPath.description}
                </Typography>
              </Box>
              <Button variant="outlined" onClick={handleOpenModal}>
                Assign Employees
              </Button>
            </ListItem>
          </Paper>
        ))}
      </List>

      {showInputs ? (
        <Box maxWidth={400} margin="20px auto">
          <TextField
            label="Name"
            value={newCareerPath.name}
            onChange={(e) => setNewCareerPath({ ...newCareerPath, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={newCareerPath.description}
            onChange={(e) => setNewCareerPath({ ...newCareerPath, description: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />

          <Box display="flex" justifyContent="space-between" marginTop={2}>
            <Button variant="outlined" color="primary" onClick={handleCancelCreate}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleCreateCareerPath}>
              Create
            </Button>
          </Box>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" marginTop={4}>
          <Fab variant="extended" color="primary" aria-label="add" onClick={handleShowInputs}>
            <AddIcon sx={{ mr: 1 }} />
            Add
          </Fab>
        </Box>
      )}

      {/* Modal for Assigning Employees */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          width={400}
          padding={4}
          bgcolor="background.paper"
          borderRadius={2}
          margin="100px auto"
          boxShadow={3}
          position="relative">
          {/* Close (X) Button for Modal */}
          <IconButton style={{ position: 'absolute', right: 8, top: 8 }} onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Assign Employees
          </Typography>
          <List>
            {employees.map((employee) => (
              <ListItem key={employee.id} button onClick={() => handleToggleEmployee(employee.id)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedEmployees.includes(employee.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={employee.name} />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssignEmployees}
            fullWidth
            style={{ marginTop: '16px' }}>
            Assign
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CareerPaths;
