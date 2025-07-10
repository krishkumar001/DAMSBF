import React from 'react';
import { Box, Typography, Grid, Paper, Chip, CircularProgress, Alert } from '@mui/material';
import { useData } from '../Context/DataContext';

const LiveParameters = () => {
  const { parameters, loading, error } = useData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading parameters: {error}
      </Alert>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      temperature: '#ff6b6b',
      pressure: '#4ecdc4',
      flow: '#45b7d1',
      level: '#96ceb4',
      speed: '#feca57',
      vibration: '#ff9ff3',
      electrical: '#54a0ff',
      other: '#5f27cd'
    };
    return colors[category] || '#95a5a6';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
        Live Parameters
      </Typography>
      
      {parameters.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No parameters available
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {parameters.slice(0, 12).map((parameter) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={parameter._id}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: `2px solid ${getCategoryColor(parameter.category)}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                    {parameter.displayName}
                  </Typography>
                  <Chip
                    label={parameter.status}
                    color={getStatusColor(parameter.status)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  {parameter.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    {parameter.currentValue || 'N/A'}
                  </Typography>
                  {parameter.unit && (
                    <Typography variant="body2" sx={{ ml: 1, color: 'textSecondary' }}>
                      {parameter.unit}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    Target: {parameter.target || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    UCL: {parameter.ucl || 'N/A'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="textSecondary">
                    LCL: {parameter.lcl || 'N/A'}
                  </Typography>
                  <Chip
                    label={parameter.category}
                    size="small"
                    sx={{
                      backgroundColor: getCategoryColor(parameter.category),
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
      
      {parameters.length > 12 && (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="textSecondary">
            Showing 12 of {parameters.length} parameters
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LiveParameters; 