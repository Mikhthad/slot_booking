import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Redirect from "./pages/Redirect";
import Page1SelectSlots from "./pages/Page1SelectSlots";
import Schedule from "./pages/Schedule";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/redirect" element={<Redirect />} />
        <Route path="/select-slots" element={<Page1SelectSlots />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
