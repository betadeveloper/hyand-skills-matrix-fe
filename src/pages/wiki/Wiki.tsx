import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { get } from '../../api/api.ts';
import { AutoStories, Close, Add } from "@mui/icons-material";
import { Button, IconButton, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle, Input, TextField } from "@mui/material";

const Wiki = () => {
  const [files, setFiles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [fileIndexToDelete, setFileIndexToDelete] = useState(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [customName, setCustomName] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    get('http://localhost:8080/api/employee/current').then((response: any) => {
      setRoles(response.roles);
    });

    const savedFiles = JSON.parse(localStorage.getItem("files") || "[]");
    setFiles(savedFiles);
  }, []);

  const saveFilesToLocalStorage = (updatedFiles: any) => {
    localStorage.setItem("files", JSON.stringify(updatedFiles));
  };

  const handleFileUpload = (event: any) => {
    const uploadedFiles = Array.from(event.target.files).map((file: any) => {
      const maxSize = 20 * 1024 * 1024; // 20MB
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'text/csv'];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type.");
        return null;
      }

      if (file.size > maxSize) {
        toast.error("File size exceeds the 20MB limit.");
        return null;
      }

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const fileName = customName || "Career Tracking - " + file.name;
          resolve({
            name: fileName,
            size: file.size,
            type: file.type,
            content: reader.result,
          });
        };
        reader.readAsDataURL(file);
      });
    }).filter(Boolean);

    Promise.all(uploadedFiles)
      .then((newFiles: any) => {
        const mergedFiles: any = [...files, ...newFiles];
        setFiles(mergedFiles);
        saveFilesToLocalStorage(mergedFiles);
        toast.success("Files uploaded successfully!");
        setCustomName('');
        setShowUpload(false);
      })
  };

  const handleFileDownload = (file: any) => {
    const link = document.createElement("a");
    link.href = file.content;
    link.download = file.name;
    link.click();
  };

  const handleFileDelete = (fileIndex: any) => {
    setFileIndexToDelete(fileIndex);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    const updatedFiles = files.filter((_, index) => index !== fileIndexToDelete);
    setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    toast.success("File deleted successfully!");
    setOpenDialog(false);
  };

  const cancelDelete = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      padding="20px"
      maxWidth="600px"
      margin="0 auto"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box display="flex" alignItems="center" mb={2}>
        <AutoStories color="primary" style={{ fontSize: 50, marginRight: 10 }} />
        <Typography variant="h2" fontWeight={600}>
          Wiki
        </Typography>
      </Box>

      {roles.includes('ROLE_ADMIN') || roles.includes('ROLE_OWNER') ? (
        <Box marginBottom="20px" textAlign="center">
          <Button
            variant="contained"
            onClick={() => setShowUpload(!showUpload)}
            sx={{
              marginBottom: 2,
              padding: "10px 20px",
              fontSize: "16px",
              color: "white",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Add sx={{ marginRight: 1 }} />
            Upload New Document
          </Button>
        </Box>
      ) : null}

      {showUpload && (
        <Box width="100%">
          <TextField
            label="Document Name"
            variant="outlined"
            fullWidth
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            component="label"
            sx={{
              marginBottom: 2,
              padding: "10px 20px",
              fontSize: "16px",
              color: "white",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
              display: "flex",
              alignItems: "center",
            }}
          >
            Choose Document
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg,.xlsx,.csv"
              sx={{ display: "none" }}
            />
          </Button>
        </Box>
      )}

      <Box width="100%" marginTop={2}>
        <Typography variant="h6" mb={2}>
          Career Tracking Documents:
        </Typography>
        {files.length === 0 ? (
          <Typography>No files uploaded yet.</Typography>
        ) : (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {files.map((file: any, index: number) => (
              <li
                key={index}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <Typography
                  variant="body1"
                  style={{ wordBreak: "break-word", maxWidth: "70%" }}
                >
                  {file.name}
                </Typography>
                <Box display="flex" alignItems="center" gap="10px">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleFileDownload(file)}
                  >
                    Download
                  </Button>
                  <IconButton
                    onClick={() => handleFileDelete(index)}
                    style={{ color: "red" }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </li>
            ))}
          </ul>
        )}
      </Box>

      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this file?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Wiki;
