// src/routes/routes.jsx
import Home from '../Pages/Home';
import BLT from '../Pages/BLT';
import About from '../Pages/About';
// import Dashboard from '../pages/Dashboard';
import NotFound from '../Pages/NotFound';
import BOF1 from '../Pages/BOF1';
import BOF2 from '../Pages/BOF2';
import BOF3 from '../Pages/BOF3';
import Caster1 from '../Pages/Caster1';
import Caster2 from '../Pages/Caster2';
import Caster3 from '../Pages/Caster3';
import PCI from '../Pages/PCI';

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/BLT',
    element: <BLT />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/bof-1',
    element: <BOF1 />,
  },
  {
    path: '/bof-2',
    element: <BOF2 />,
  },
  {
    path: '/bof-3',
    element: <BOF3 />,
  },
  {
    path: '/caster-1',
    element: <Caster1 />,
  },
  {
    path: '/caster-2',
    element: <Caster2 />,
  },
  {
    path: '/caster-3',
    element: <Caster3 />,
  },
  {
    path: '/pci',
    element: <PCI />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
