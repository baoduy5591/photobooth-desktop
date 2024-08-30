import { HashRouter, Route, Routes } from 'react-router-dom';
import { Splash } from './pages/splash';
import Home from './pages/home';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Splash />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
