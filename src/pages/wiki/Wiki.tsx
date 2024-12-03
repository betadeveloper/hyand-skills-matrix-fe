import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  DialogContentText,
  Input,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { AutoStories, Close, Add } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { get, post, remove } from '../../api/api';
import { toast } from 'react-toastify';

const Wiki = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [deleteDocId, setDeleteDocId] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    localStorage.setItem('selectedNavItem', 'Wiki');
    fetchDocuments();
  }, [selectedCategory]);

  useEffect(() => {
    get('http://localhost:8080/api/employee/current').then((response) => {
      setRoles(response.roles || []);
    });
  }, []);

  const fetchDocuments = async () => {
    try {
      const url = selectedCategory === 'All' ? '/api/wiki' : `/api/wiki/category/${selectedCategory}`;
      const response = await get(url);
      setDocuments(response || []);
    } catch (error) {
      console.error('Error fetching wiki documents', error);
    }
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const downloadDocument = async (documentId) => {
    const url = `/api/wiki/download/${documentId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const contentDisposition = response.headers.get('Content-Disposition');
      console.log(response);
      let fileName = "test";
      if (contentDisposition && contentDisposition.includes('filename=')) {
        const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (matches && matches[1]) {
          fileName = matches[1].replace(/['"]/g, '');
        }
      }
      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = urlBlob;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error('Error downloading document', error);
      toast.error('Error downloading document!');
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !category) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('author', 'Raigardas Tautkus');
    formData.append('file', file);

    try {
      await post('/api/wiki/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDocuments();
      toast.success('Document uploaded successfully!');
      setFile(null);
      setTitle('');
      setDescription('');
      setCategory('');
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading document', error);
      toast.error('Error uploading document!');
    }
  };

  const handleDeleteConfirmation = (documentId) => {
    setDeleteDocId(documentId);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (deleteDocId === null) return;

    try {
      await remove(`/api/wiki/${deleteDocId}`);
      fetchDocuments();
      toast.success('Document deleted successfully!');
    } catch (error) {
      console.error('Error deleting document', error);
      toast.error('Error deleting document!');
    } finally {
      setShowDeleteDialog(false);
      setDeleteDocId(null);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mx={4}
      my={4}
      sx={{ width: '100%', maxWidth: '1200px', margin: 'auto', marginTop: 3 }}
    >
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} marginTop={4} marginBottom={2}>
        <AutoStories color="primary" style={{ fontSize: 50, marginRight: 10 }} />
        <Typography variant="h1" fontWeight="600">Wiki</Typography>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center">
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{
            width: 300,
            mb: 0,
            backgroundColor: '#fff',
            borderRadius: 1,
            '& .MuiSelect-select': {
              padding: '10px 14px'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(224, 224, 224, 1)'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(224, 224, 224, 1)'
            }
          }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Skill Progress">Skill Progress</MenuItem>
          <MenuItem value="Skill Requirements">Skill Requirements</MenuItem>
        </Select>
      </Box>

      <Box mt={0} display="flex" flexDirection="column" alignItems="center" width="100%">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <Box key={doc.id} mt={4} display="flex" flexDirection="column" alignItems="center" sx={{
              padding: 2,
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: '800px'
            }}>
              <Typography variant="h5">{doc.title}</Typography>
              <Typography variant="body1" color="textSecondary" fontWeight="bold">
                Uploaded by {doc.author}
              </Typography>
              <Typography>{doc.description}</Typography>
              <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
                {roles.includes('ROLE_ADMIN') || roles.includes('ROLE_OWNER') ? (
                  <Button variant="outlined" color="error" onClick={() => handleDeleteConfirmation(doc.id)}>
                    Delete
                  </Button>
                ) : null}
                <Button variant="outlined" color="primary" onClick={() => downloadDocument(doc.id)} sx={{ ml: 2 }}>
                  Download Document
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Typography mt={3}>No documents found</Typography>
        )}
      </Box>

      {roles.includes('ROLE_ADMIN') || roles.includes('ROLE_OWNER') ? (
        <Button variant="contained" color="primary" onClick={() => setShowUploadModal(true)} sx={{ mt: 4, mb: 2 }}>
          <Add sx={{ mr: 1 }} /> New Document
        </Button>
      ) : null}

      <Dialog
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ position: 'relative', paddingRight: '48px', fontSize: '24px', mt: 2, mb: 2 }}>
          Upload Document
          <IconButton
            color="inherit"
            onClick={() => setShowUploadModal(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="Skill Progress">Skill Progress</MenuItem>
            <MenuItem value="Skill Requirements">Skill Requirements</MenuItem>
          </Select>
          <Box display="flex" alignItems="center" sx={{ mt: 2, mb: 2 }}>
            <label htmlFor="file-upload">
              <Input id="file-upload" type="file" onChange={handleFileUpload} sx={{ display: 'none' }} />
              <Button variant="contained" component="span" sx={{ marginRight: 2 }}>
                Choose File
              </Button>
            </label>
            {file && (
              <Typography>
                {file.name}
              </Typography>
            )}
          </Box>
          <Button onClick={handleUpload} variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>
            Upload
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this document?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Wiki;
