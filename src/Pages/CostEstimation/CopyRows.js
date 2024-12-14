// src/components/CopyRowsPopup.js
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';

const CopyRowsPopup = () => {
  const [open, setOpen] = useState(false);
  const [oldPltNO, setOldPltNO] = useState('');
  const [newPltNO, setNewPltNO] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://127.0.0.1:5000/copy_rows', {
        old_pltNO: oldPltNO,
        new_pltNO: newPltNO + " Copy",
      },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        <ContentCopyIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Copy Rows</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Estimate Number"
            type="text"
            fullWidth
            variant="outlined"
            value={oldPltNO}
            onChange={(e) => setOldPltNO(e.target.value)}
          />
          <TextField
            margin="dense"
            label="New Estimate Number"
            type="text"
            fullWidth
            variant="outlined"
            value={newPltNO}
            onChange={(e) => setNewPltNO(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CopyRowsPopup;
