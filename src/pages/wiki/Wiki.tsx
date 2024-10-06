import { useState, useEffect } from 'react';
import { AutoStories } from '@mui/icons-material';
import { Box, Typography, Button, Modal, Input, MenuItem, Select, TextField } from '@mui/material';
import { get, post } from '../../api/api';

const Wiki = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    localStorage.setItem('selectedNavItem', 'Wiki');
    fetchDocuments();
  }, [selectedCategory]);

  const fetchDocuments = async () => {
    try {
      const url = selectedCategory === 'All' ? '/api/wiki' : `/api/wiki/category/${selectedCategory}`;
      const response = await get(url);
      setDocuments(response);
    } catch (error) {
      console.error('Error fetching wiki documents', error);
    }
  };

  const handleFileUpload = (e) => setFile(e.target.files[0]);

  const downloadDocument = async (documentId) => {
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
        if (matches != null && matches[1]) {
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
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDocuments();
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading document', error);
    }
  };

  return (
    <Box ml={4}>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
        <AutoStories color="primary" style={{ fontSize: 50, marginRight: 10 }} />
        <h1>Wiki</h1>
      </Box>

      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Skill Progress">Skill Progress</MenuItem>
          <MenuItem value="Skill Requirements">Skill Requirements</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={() => setShowUploadModal(true)}>
          New Document
        </Button>
      </Box>

      <Box mt={6}>
        {documents.length > 0 ? (
          documents.map((doc) => (
            <Box key={doc.id} mt={4}>
              <Typography variant="h5">{doc.title}</Typography>
              <Typography variant="body1" color="textSecondary">
                By {doc.author}
              </Typography>
              <Typography>{doc.description}</Typography>
              <Button variant="outlined" color="primary" onClick={() => downloadDocument(doc.id)}>
                Download Document
              </Button>
            </Box>
          ))
        ) : (
          <Typography>No documents found</Typography>
        )}
      </Box>

      {/* Upload Modal */}
      <Modal open={showUploadModal} onClose={() => setShowUploadModal(false)}>
        <Box p={4} style={{ background: '#fff', margin: 'auto', marginTop: '5%', width: '50%' }}>
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
          <Select value={category} onChange={(e) => setCategory(e.target.value)} fullWidth margin="normal">
            <MenuItem value="Skill Progress">Skill Progress</MenuItem>
            <MenuItem value="Skill Requirements">Skill Requirements</MenuItem>
          </Select>
          <Input type="file" onChange={handleFileUpload} />
          <Button onClick={handleUpload} variant="contained" color="primary" mt={2}>
            Upload
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Wiki;
