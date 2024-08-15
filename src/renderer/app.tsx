import { HashRouter, Route, Routes } from "react-router-dom";
import { Splash } from "./pages/splash";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Splash />}/>
      </Routes>
    </HashRouter>
  )
}