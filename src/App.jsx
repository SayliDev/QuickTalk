import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuickTalk from "./pages/QuickTalk";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/quicktalk" element={<QuickTalk />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profilesetup" element={<ProfileSetupPage />} />
      </Routes>
    </Router>
  );
};

export default App;
