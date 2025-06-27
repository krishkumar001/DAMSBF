// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './Pages/Home';
// import About from './Pages/About';
// import NotFound from './Pages/NotFound';
// import Layout from './Components/Layout';
// import BLT from './Pages/BLT';
// import Dashboard from './Pages/Dashboard/Dashboard';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route path="home" element={<Home />} />
//           <Route path="about" element={<About />} />
//           <Route path="BLT" element={<BLT />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="*" element={<NotFound />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import NotFound from './Pages/NotFound';
import Layout from './Components/Layout';
import BLT from './Pages/BLT';
import PCI from './Pages/PCI';
import Caster1 from './Pages/Caster1';
import Caster2 from './Pages/Caster2';
import Caster3 from './Pages/Caster3';
import BOF1 from './Pages/BOF1';
import BOF2 from './Pages/BOF2';
import BOF3 from './Pages/BOF3';
import Dashboard from './Pages/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="BLT" element={<BLT />} />
          <Route path="pci" element={<PCI />} />
          <Route path="caster-1" element={<Caster1 />} />
          <Route path="caster-2" element={<Caster2 />} />
          <Route path="caster-3" element={<Caster3 />} />
          <Route path="bof-1" element={<BOF1 />} />
          <Route path="bof-2" element={<BOF2 />} />
          <Route path="bof-3" element={<BOF3 />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
