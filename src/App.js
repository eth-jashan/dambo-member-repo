import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Onboarding from "./pages/Onboarding";

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="onboarding" element={<Onboarding />} />
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
