import ManageWorkdayPage from "./pages/ManageWorkdayPage";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import { BaitoManager } from "./context/BaitoContext";

function App() {
  return (
    <BaitoManager>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ManageWorkdayPage />} />
        </Routes>
      </main>
    </BaitoManager>
  );
}

export default App;
