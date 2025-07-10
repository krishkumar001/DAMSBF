import React from 'react';
import { Box, Typography, Paper, Chip, CircularProgress, Alert, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useData } from '../Context/DataContext';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

const ActiveAlerts = () => {
  const { alerts, loading, error } = useData();

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
        Error loading alerts: {error}
      </Alert>
    );
  }

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <ErrorIcon sx={{ color: '#d32f2f' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#ed6c02' }} />;
      default:
        return <InfoIcon sx={{ color: '#1976d2' }} />;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
        Active Alerts ({alerts.length})
      </Typography>
      
      {alerts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="success.main">
            ✅ No active alerts
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            All systems are operating normally
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <List>
            {alerts.map((alert, index) => (
              <ListItem
                key={alert._id}
                sx={{
                  borderBottom: index < alerts.length - 1 ? '1px solid #e0e0e0' : 'none',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <ListItemIcon>
                  {getAlertIcon(alert.severity)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {alert.title}
                      </Typography>
                      <Chip
                        label={alert.severity}
                        color={getAlertColor(alert.severity)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        {alert.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Typography variant="caption" color="textSecondary">
                          Parameter: {alert.parameterName || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Equipment: {alert.equipmentName || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Time: {formatTimestamp(alert.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default ActiveAlerts; 