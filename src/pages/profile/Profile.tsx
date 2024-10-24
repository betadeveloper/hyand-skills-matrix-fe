import { useState, useEffect } from 'react';
import { AutoStories } from '@mui/icons-material';
import { Box, Typography, Button, Modal, Input, MenuItem, Select, TextField, styled } from '@mui/material';
import { get, post, remove } from '../../api/api';
import { toast } from 'react-toastify';

const StyledInput = styled(Input)({
  display: 'none',
});

const StyledFileName = styled(Typography)({
  fontSize: '1.5rem',
  borderBottom: '1px solid #e0e0e0',
  marginLeft: '8px',
});

const Wiki = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [deleteDocId, setDeleteDocId] = useState(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('selectedNavItem', 'Wiki');
    fetchDocuments();
  }, [selectedCategory]);

  useEffect(() => {
    get('http://localhost:8080/api/employee/current').then((response: any) => {
      setRoles(response.roles || []);
    });
  }, []);

  const fetchDocuments = async () => {
    try {
      const url = selectedCategory === 'All' ? '/api/wiki' : `/api/wiki/category/${selectedCategory}`;
      const response: any = await get(url);
      setDocuments(response || []);
    } catch (error) {
      console.error('Error fetching wiki documents', error);
    }
  };

  const handleFileUpload = (e: any) => {
    setFile(e.target.files[0]);
  };

  const downloadDocument = async (documentId: number) => {
    const url = `/api/wiki/download/${documentId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'document.pdf';
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
        headers: { 'Content-Type': 'multipart/form-data' },
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

  const handleDeleteConfirmation = (documentId: number) => {
    setDeleteDocId(documentId);
    setShowDeleteConfirmation(true);
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
      setShowDeleteConfirmation(false);
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
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'} marginTop={3}>
        <AutoStories color="primary" style={{ fontSize: 50, marginRight: 10 }} />
        <Typography variant="h4" fontWeight="bold">Wiki</Typography>
      </Box>

      {roles.includes('ROLE_ADMIN') || roles.includes('ROLE_OWNER') ? (
        <Button variant="contained" color="primary" onClick={() => setShowUploadModal(true)} sx={{ mt: 2, mb: 2 }}>
          New Document
        </Button>
      ) : null}

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
              padding: '10px 14px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(224, 224, 224, 1)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(224, 224, 224, 1)',
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
            <Box key={doc.id} mt={4} display="flex" flexDirection="column" alignItems="center" sx={{ padding: 2, border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '800px' }}>
              <Typography variant="h5">{doc.title}</Typography>
              <Typography variant="body1" color="textSecondary" fontWeight="bold">
                Uploaded by {doc.author}
              </Typography>
              <Typography>{doc.description}</Typography>
              <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
                <Button variant="outlined" color="primary" onClick={() => downloadDocument(doc.id)}>
                  Download Document
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDeleteConfirmation(doc.id)} sx={{ ml: 2 }}>
                  Delete
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Typography mt={3}>No documents found</Typography>
        )}
      </Box>

      <Modal open={showUploadModal} onClose={() => setShowUploadModal(false)}>
        <Box
          p={4}
          sx={{
            background: '#fff',
            margin: 'auto',
            marginTop: '5%',
            width: '40%',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Typography variant="h5" mb={2}>
            Upload a New Document
          </Typography>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Select value={category} onChange={(e) => setCategory(e.target.value)} fullWidth margin="normal" sx={{ backgroundColor: '#fff' }}>
            <MenuItem value="Skill Progress">Skill Progress</MenuItem>
            <MenuItem value="Skill Requirements">Skill Requirements</MenuItem>
          </Select>

          <Box display="flex" alignItems="center" sx={{ mt: 2, mb: 2 }}>
            <label htmlFor="file-upload">
              <StyledInput id="file-upload" type="file" onChange={handleFileUpload} />
              <Button variant="contained" component="span" sx={{ marginRight: 2 }}>
                Choose File
              </Button>
            </label>
            {file && (
              <StyledFileName variant="body3">
                {file.name}
              </StyledFileName>
            )}
          </Box>

          <Button onClick={handleUpload} variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>
            Upload
          </Button>
        </Box>
      </Modal>

      <Modal open={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
        <Box
          p={4}
          sx={{
            background: '#fff',
            margin: 'auto',
            marginTop: '30%',
            width: '30%',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Typography variant="h6" mb={2}>
            Are you sure you want to delete this document?
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Confirm
            </Button>
            <Button variant="outlined" color="primary" onClick={() => setShowDeleteConfirmation(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Wiki;
