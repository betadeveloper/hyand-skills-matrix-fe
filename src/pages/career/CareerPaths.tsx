import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post, remove, put } from '../../api/api.ts';
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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Add, Close, ArrowBack, Delete } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CareerPaths = () => {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assignedEmployees, setAssignedEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [newCareerPath, setNewCareerPath] = useState<CareerPath>({
    id: 0,
    name: '',
    description: '',
    skills: []
  });
  const [showInputs, setShowInputs] = useState(false);
  const [assignEmployeeModalOpen, setAssignEmployeeModalOpen] = useState(false);
  const [viewEmployeesAndSkillsModalOpen, setViewEmployeesAndSkillsModalOpen] = useState(false);
  const [isCreateSkillVisible, setIsCreateSkillVisible] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [careerPathToDelete, setCareerPathToDelete] = useState<number | null>(null);
  const [selectedCareerPathId, setSelectedCareerPathId] = useState<number | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Skill>({
    id: 0,
    name: '',
    description: '',
    proficiency: 0,
    weight: 0,
  });

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
    firstName: string;
    lastName: string;
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
      toast.success('Career path created successfully!');
    });
  };

  const handleConfirmDeleteCareerPath = (id: number) => {
    setCareerPathToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteCareerPath = () => {
    if (careerPathToDelete !== null) {
      remove(`http://localhost:8080/api/careerPaths/${careerPathToDelete}`).then(() => {
        setCareerPaths(careerPaths.filter((careerPath) => careerPath.id !== careerPathToDelete));
        setDeleteConfirmationOpen(false);
        toast.success('Career path deleted successfully!');
      });
    }
  };

  const handleShowInputs = () => {
    setShowInputs(true);
  };

  const handleCancelCreate = () => {
    setShowInputs(false);
  };

  const handleOpenAssignEmployeeModal = (id) => {
    setSelectedCareerPathId(id);

    get(`http://localhost:8080/api/careerPaths/${id}/employees`).then((response) => {
      setAssignedEmployees(response);
      setSelectedEmployees(response.map((employee) => employee.id));
      setAssignEmployeeModalOpen(true);
    });
  };

  const handleCloseAssignEmployeeModal = () => {
    setAssignEmployeeModalOpen(false);
    setSelectedEmployees([]);
  };

  const handleAddSkillClick = () => {
    setIsCreateSkillVisible(true);
  };

  const handleOpenViewEmployeesAndSkillsModal = (id: number) => {
    setSelectedCareerPathId(id);
    get(`http://localhost:8080/api/skills/${id}`).then((response: any) => {
      setSkills(response);
    });
    setViewEmployeesAndSkillsModalOpen(true);
  };

  const handleCloseViewEmployeesAndSkillsModal = () => {
    setViewEmployeesAndSkillsModalOpen(false);
    setIsCreateSkillVisible(false);
    setSelectedEmployees([]);
    setSkills([]);
  };

  const handleToggleEmployee = (id: number) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleAssignEmployees = () => {
    if (!selectedCareerPathId) return;

    put(`http://localhost:8080/api/careerPaths/${selectedCareerPathId}/assignEmployees`, selectedEmployees)
      .then((response) => {
        setAssignedEmployees(response.employees);
        toast.success('Employees assigned successfully!');
        handleCloseAssignEmployeeModal();
      })
      .catch((error) => {
        console.error("Error assigning employees:", error);
        toast.error("Failed to assign employees. Please try again.");
      });
  };

  const handleCreateSkill = () => {
    if (selectedCareerPathId) {
      post(`http://localhost:8080/api/skills/${selectedCareerPathId}`, newSkill).then((response: any) => {
        setSkills([...skills, response]);
        setNewSkill({ id: 0, name: '', description: '', proficiency: 0, weight: 0 });
        toast.success('Skill created successfully!');
      });
    }
  };

  const handleDeleteSkill = (id: number) => {
    remove(`http://localhost:8080/api/skills/${id}`).then(() => {
      setSkills(skills.filter(skill => skill.id !== id));
      toast.success('Skill deleted successfully!');
    });
  };

  const handleUpdateSkill = (id: number) => {
    put(`http://localhost:8080/api/skills/${id}`, newSkill).then((response: any) => {
      setSkills(skills.map(skill => (skill.id === id ? response : skill)));
      setNewSkill({ id: 0, name: '', description: '', proficiency: 0, weight: 0 });
      toast.success('Skill updated successfully!');
    });
  };

  const handleGoBack = () => {
    navigate('/career');
  };

  return (
    <Box maxWidth={800} margin="40px auto" padding={2}>
      <ToastContainer />
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Button startIcon={<ArrowBack />} variant="outlined" onClick={handleGoBack}>
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
                <Typography
                  variant="h6"
                  gutterBottom
                  onClick={() => handleOpenViewEmployeesAndSkillsModal(careerPath.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {careerPath.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {careerPath.description}
                </Typography>
              </Box>
              <Button variant="outlined" onClick={() => handleOpenAssignEmployeeModal(careerPath.id)}>
                Assign Employees
              </Button>
              <IconButton onClick={() => handleConfirmDeleteCareerPath(careerPath.id)}>
                <Delete/>
              </IconButton>
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
            <Add sx={{ mr: 1 }} />
            Create Career Path
          </Fab>
        </Box>
      )}

      <Modal open={assignEmployeeModalOpen} onClose={handleCloseAssignEmployeeModal}>
        <Box style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', width: 400, backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>
            Assign Employees
          </Typography>
          <List>
            {employees.map((employee) => (
              <ListItem key={employee.id} button onClick={() => handleToggleEmployee(employee.id)}>
                <ListItemIcon>
                  <Checkbox checked={selectedEmployees.includes(employee.id)} />
                </ListItemIcon>
                <ListItemText primary={`${employee.firstName} ${employee.lastName}`} />
              </ListItem>
            ))}
        </List>
          <Box display="flex" justifyContent="space-between" marginTop={2}>
            <Button variant="outlined" color="primary" onClick={handleCloseAssignEmployeeModal}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleAssignEmployees}>
              Assign
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={viewEmployeesAndSkillsModalOpen} onClose={handleCloseViewEmployeesAndSkillsModal}>
        <Box style={{
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          position: 'absolute', width: 600, backgroundColor: 'white',
          padding: '16px', borderRadius: '8px', maxHeight: '80vh', overflowY: 'auto'
        }}>
          <Typography variant="h6" gutterBottom>
            Assigned Employees and Skills
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Employees:
          </Typography>
          <List>
            {assignedEmployees.map((employee) => (
              <ListItem key={employee.id}>
                <ListItemText primary={`${employee.firstName} ${employee.lastName}`} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle1" gutterBottom>
            Skills:
          </Typography>
          <List>
            {skills.map((skill) => (
              <Paper key={skill.id} elevation={3} style={{ margin: '8px 0', padding: '8px' }}>
                <ListItem>
                  <Box flexGrow={1}>
                    <Typography variant="h6" gutterBottom>
                      {skill.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {skill.description}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => handleDeleteSkill(skill.id)}>
                    <Delete />
                  </IconButton>
                </ListItem>
              </Paper>
            ))}
          </List>

          <Box display="flex" justifyContent="center" marginTop={2}>
            <Button variant="contained" color="primary" onClick={handleAddSkillClick}>
              <Add /> Create Skill
            </Button>
          </Box>

          {isCreateSkillVisible && (
            <Box marginTop={4}>
              <Typography variant="h6">Create New Skill</Typography>
              <TextField
                label="Skill Name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Skill Description"
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
              <TextField
                label="Proficiency"
                value={newSkill.proficiency}
                onChange={(e) => setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })}
                fullWidth
                margin="normal"
                type="number"
              />
              <TextField
                label="Weight"
                value={newSkill.weight}
                onChange={(e) => setNewSkill({ ...newSkill, weight: Number(e.target.value) })}
                fullWidth
                margin="normal"
                type="number"
              />
              <Box display="flex" justifyContent="space-between" marginTop={2}>
                <Button variant="contained" color="primary" onClick={handleCreateSkill}>
                  Add Skill
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>

      <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this career path?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCareerPath} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CareerPaths;
