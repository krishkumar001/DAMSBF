import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { authAPI } from '../Services/api';

const LoginModal = ({ open, onClose, onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: 'admin@dams.com',
    password: 'admin123'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(credentials);
      
      // Store token and user data
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      onLoginSuccess(response.data);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', color: '#1a237e' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          DAMS Login
        </Typography>
      </DialogTitle>
      <form onSubmit={handleLogin}>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Use the default credentials to access the system:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Email: admin@dams.com
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Password: admin123
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled={loading}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginModal; 