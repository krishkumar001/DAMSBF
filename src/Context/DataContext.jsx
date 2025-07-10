import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboardAPI, parameterAPI, alertAPI, equipmentAPI, authAPI } from '../Services/api';
import LoginModal from '../Components/LoginModal';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      refreshData();
    } else {
      setLoading(false);
      setShowLoginModal(true);
    }
  }, []);

  // Fetch dashboard overview data
  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getOverview();
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err.message.includes('Not authorized')) {
        setIsAuthenticated(false);
        setShowLoginModal(true);
      } else {
        setError(err.message);
      }
    }
  };

  // Fetch parameters data
  const fetchParameters = async () => {
    try {
      const response = await parameterAPI.getAll();
      setParameters(response.data);
    } catch (err) {
      console.error('Error fetching parameters:', err);
      if (err.message.includes('Not authorized')) {
        setIsAuthenticated(false);
        setShowLoginModal(true);
      } else {
        setError(err.message);
      }
    }
  };

  // Fetch alerts data
  const fetchAlerts = async () => {
    try {
      const response = await alertAPI.getActive();
      setAlerts(response.data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      if (err.message.includes('Not authorized')) {
        setIsAuthenticated(false);
        setShowLoginModal(true);
      } else {
        setError(err.message);
      }
    }
  };

  // Fetch equipment data
  const fetchEquipment = async () => {
    try {
      const response = await equipmentAPI.getAll();
      setEquipment(response.data);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      if (err.message.includes('Not authorized')) {
        setIsAuthenticated(false);
        setShowLoginModal(true);
      } else {
        setError(err.message);
      }
    }
  };

  // Refresh all data
  const refreshData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchParameters(),
        fetchAlerts(),
        fetchEquipment()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle successful login
  const handleLoginSuccess = (loginData) => {
    setIsAuthenticated(true);
    setUser(loginData.user);
    setShowLoginModal(false);
    refreshData();
  };

  // Handle logout
  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
    setDashboardData(null);
    setParameters([]);
    setAlerts([]);
    setEquipment([]);
    setShowLoginModal(true);
  };

  // Auto-refresh data every 30 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value = {
    dashboardData,
    parameters,
    alerts,
    equipment,
    loading,
    error,
    isAuthenticated,
    user,
    refreshData,
    fetchDashboardData,
    fetchParameters,
    fetchAlerts,
    fetchEquipment,
    handleLogout,
    setShowLoginModal
  };

  return (
    <DataContext.Provider value={value}>
      {children}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </DataContext.Provider>
  );
}; 