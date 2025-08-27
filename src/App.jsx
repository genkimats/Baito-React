import ManageWorkdayPage from './pages/ManageWorkdayPage';
import SalaryPage from './pages/SalaryPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage'; // Import LoginPage
import NavBar from './components/NavBar';
import { Route, Routes } from 'react-router-dom';
import { BaitoManager } from './context/BaitoContext';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import './css/App.css';
import SplashScreen from './components/SplashScreen';

function App() {
  return (
    <>
      <SplashScreen />
      <BaitoManager>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ManageWorkdayPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/salary"
              element={
                <ProtectedRoute>
                  <SalaryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </BaitoManager>
    </>
  );
}

export default App;
