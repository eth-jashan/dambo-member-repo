import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <Link to="onboarding">
      <button>Go to Onboarding</button>
    </Link>
  );
}

export default App;
