import React, { useState, useRef } from 'react';
import { Box, Typography, Grid, Paper, List, ListItem, ListItemText, Slide, CircularProgress, Alert, Tabs, Tab, Button, Chip } from '@mui/material';
import SubmenuSidebar from '../Components/SubmenuSidebar';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import LiveParameters from '../Components/LiveParameters';
import ActiveAlerts from '../Components/ActiveAlerts';
import { useData } from '../Context/DataContext';

const cardData = [
  {
    name: 'Blast Furnace',
    subPages: ['BLT', 'PCI'],
  },
  {
    name: 'Caster',
    subPages: ['Caster 1', 'Caster 2', 'Caster 3'],
  },
  {
    name: 'Steel Melting Shop',
    subPages: ['BOF 1', 'BOF 2', 'BOF 3'],
  },
];

// Sparkle component for burst effect
const Sparkle = ({ x, y, keyId }) => (
  <Box
    key={keyId}
    className="sparkle-burst"
    sx={{
      position: 'absolute',
      left: x,
      top: y,
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'radial-gradient(circle, #fffbe7 0%, #fda085 80%, transparent 100%)',
      opacity: 0.8,
      pointerEvents: 'none',
      zIndex: 200,
    }}
  />
);

// Dashboard Stats Component
const DashboardStats = ({ dashboardData, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        Error loading dashboard data: {error}
      </Alert>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <Box sx={{ mb: 4, width: '100%', maxWidth: 1200 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e', mb: 3, textAlign: 'center' }}>
        System Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {dashboardData.totalParameters}
            </Typography>
            <Typography variant="body2">Total Parameters</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {dashboardData.activeParameters}
            </Typography>
            <Typography variant="body2">Active Parameters</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {dashboardData.normalParameters}
            </Typography>
            <Typography variant="body2">Normal Status</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {dashboardData.overallHealth}%
            </Typography>
            <Typography variant="body2">System Health</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

function Home() {
  const { dashboardData, loading, error, isAuthenticated, user, handleLogout } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSubPages, setActiveSubPages] = useState([]);
  const [activeTitle, setActiveTitle] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [tilt, setTilt] = useState({});
  const [sparkles, setSparkles] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const cardRefs = useRef({});

  // 3D tilt effect
  const handleMouseMove = (e, cardName) => {
    const card = cardRefs.current[cardName];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -10;
    setTilt((prev) => ({ ...prev, [cardName]: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }));
  };
  const handleMouseLeave = (cardName) => {
    setTilt((prev) => ({ ...prev, [cardName]: 'rotateX(0deg) rotateY(0deg)' }));
    setHoveredCard(null);
  };
  // Sparkle burst on hover
  const handleMouseEnter = (cardName) => {
    setHoveredCard(cardName);
    const sparkArray = Array.from({ length: 8 }).map((_, i) => ({
      x: `${40 + Math.random() * 60}%`,
      y: `${30 + Math.random() * 40}%`,
      keyId: `${cardName}-sparkle-${i}-${Date.now()}`,
    }));
    setSparkles(sparkArray);
    setTimeout(() => setSparkles([]), 700);
  };

  // Ripple effect for subpage click
  const [ripple, setRipple] = useState({});
  const handleSubpageClick = (sub, cardName, e) => {
    // Ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ [sub]: { x, y, show: true } });
    setTimeout(() => setRipple({}), 400);
    // You can add navigation logic here if needed
  };

  const handleCardClick = (card) => {
    setActiveSubPages(card.subPages);
    setActiveTitle(card.name);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{
      p: { xs: 1, sm: 3 },
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Header with User Info and Logout */}
      <Box sx={{ 
        width: '100%', 
        maxWidth: 1200, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 1, color: '#1a237e', textShadow: '0 2px 8px #fff8' }}>
        Plant Home
      </Typography>
        
        {isAuthenticated && user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={`${user.firstName} ${user.lastName} (${user.role})`}
              color="primary"
              variant="outlined"
            />
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderColor: '#fda085',
                color: '#fda085',
                '&:hover': {
                  borderColor: '#f6d365',
                  backgroundColor: 'rgba(253,160,133,0.1)',
                }
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Box>
      
      {/* Dashboard Stats Section */}
      <DashboardStats dashboardData={dashboardData} loading={loading} error={error} />
      
      {/* Navigation Cards */}
      <Grid container spacing={4} justifyContent="center" sx={{ width: '100%', maxWidth: 1200, mb: 4 }}>
        {cardData.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.name}>
            <Box
              ref={el => cardRefs.current[card.name] = el}
              sx={{ perspective: 1200 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: 5,
                  position: 'relative',
                  overflow: 'visible',
                  minHeight: 210,
                  background: 'rgba(255,255,255,0.25)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                  backdropFilter: 'blur(8px)',
                  border: '2.5px solid',
                  borderImage: hoveredCard === card.name
                    ? 'linear-gradient(270deg, #f6d365, #fda085, #f6d365, #fda085) 1'
                    : 'linear-gradient(120deg, #f6d365 0%, #fda085 100%) 1',
                  transition: 'transform 0.25s cubic-bezier(.4,2,.3,1), box-shadow 0.2s, border-image 1s',
                  boxSizing: 'border-box',
                  transform: tilt[card.name] || 'rotateX(0deg) rotateY(0deg)',
                  '&:hover': {
                    boxShadow: '0 16px 40px 0 rgba(253,160,133,0.25), 0 2px 8px 0 #f6d36544',
                  },
                  mt: { xs: 2, sm: 0 },
                }}
                onClick={() => handleCardClick(card)}
                onMouseMove={e => handleMouseMove(e, card.name)}
                onMouseLeave={() => handleMouseLeave(card.name)}
                onMouseEnter={() => handleMouseEnter(card.name)}
              >
                {/* Sparkles */}
                {hoveredCard === card.name && sparkles.map(s => <Sparkle {...s} key={s.keyId} />)}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 0.5, color: '#1a237e', textShadow: '0 1px 8px #fff6' }}>{card.name}</Typography>
                  <Slide direction="down" in={hoveredCard === card.name} mountOnEnter unmountOnExit timeout={350}>
                    <ArrowDropDownCircleIcon sx={{ ml: 1, color: '#fda085', fontSize: 32, transition: 'transform 0.3s', transform: hoveredCard === card.name ? 'rotate(180deg)' : 'none' }} />
                  </Slide>
                </Box>
                <Typography variant="body2" sx={{ color: '#5c5c5c', mb: 2, fontWeight: 500, letterSpacing: 0.2 }}>
                  Click for more details
                </Typography>
                {/* Hover Dropdown */}
                <Slide direction="down" in={hoveredCard === card.name} mountOnEnter unmountOnExit timeout={350}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      mt: 2,
                      minWidth: 200,
                      background: 'rgba(255,255,255,0.85)',
                      borderRadius: 4,
                      boxShadow: '0 8px 32px 0 rgba(253,160,133,0.18)',
                      border: '2px solid #fda085',
                      zIndex: 100,
                      py: 1,
                      px: 0.5,
                      transition: 'all 0.2s',
                      overflow: 'hidden',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    <Box sx={{ height: 4, width: '100%', background: 'linear-gradient(90deg, #fda085 0%, #f6d365 100%)', borderRadius: 2, mb: 1 }} />
                    <List>
                      {card.subPages.map((sub, idx) => (
                        <Slide
                          key={sub}
                          direction="right"
                          in={hoveredCard === card.name}
                          style={{ transitionDelay: `${idx * 80 + 100}ms` }}
                          mountOnEnter
                          unmountOnExit
                        >
                          <ListItem
                            button
                            onClick={e => handleSubpageClick(sub, card.name, e)}
                            sx={{
                              borderRadius: 2,
                              my: 0.5,
                              px: 2,
                              transition: 'background 0.18s, color 0.18s',
                              display: 'flex',
                              alignItems: 'center',
                              fontWeight: 600,
                              position: 'relative',
                              overflow: 'hidden',
                              '&:hover': {
                                background: 'linear-gradient(90deg, #fda085 0%, #f6d365 100%)',
                                color: '#fff',
                                boxShadow: '0 2px 8px #fda08533',
                              },
                            }}
                          >
                            <ChevronRightIcon sx={{ color: '#fda085', mr: 1, fontSize: 22 }} />
                            <ListItemText primary={sub} sx={{ textAlign: 'left', fontWeight: 600, fontSize: 18 }} />
                            {/* Ripple effect */}
                            {ripple[sub]?.show && (
                              <Box
                                className="ripple-anim"
                                sx={{
                                  position: 'absolute',
                                  left: ripple[sub].x - 20,
                                  top: ripple[sub].y - 20,
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  background: 'rgba(253,160,133,0.25)',
                                  pointerEvents: 'none',
                                  zIndex: 10,
                                }}
                              />
                            )}
                          </ListItem>
                        </Slide>
                      ))}
                    </List>
                  </Box>
                </Slide>
            </Paper>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Live Data Tabs */}
      {isAuthenticated && (
        <Box sx={{ width: '100%', maxWidth: 1200 }}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ backgroundColor: '#f5f5f5' }}>
              <Tab label="Live Parameters" />
              <Tab label="Active Alerts" />
            </Tabs>
            <Box sx={{ p: 0 }}>
              {activeTab === 0 && <LiveParameters />}
              {activeTab === 1 && <ActiveAlerts />}
            </Box>
          </Paper>
        </Box>
      )}

      <SubmenuSidebar
        open={sidebarOpen}
        onClose={handleCloseSidebar}
        title={activeTitle}
        subPages={activeSubPages}
      />
    </Box>
  );
}

export default Home;
