import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuickTalk from "./pages/QuickTalk";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/quicktalk" element={<QuickTalk />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
