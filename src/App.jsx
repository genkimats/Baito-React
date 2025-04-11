import ManageWorkdayPage from "./pages/ManageWorkdayPage";
import SalaryPage from "./pages/SalaryPage";
import SettingsPage from "./pages/SettingsPage";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import { BaitoManager } from "./context/BaitoContext";
import "./css/App.css";

function App() {
  return (
    <BaitoManager>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ManageWorkdayPage />} />
          <Route path="/salary" element={<SalaryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </BaitoManager>
  );
}

export default App;
