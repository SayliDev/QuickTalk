import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuickTalk from "./pages/QuickTalk"; // Import the chat page component
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/quicktalk" element={<QuickTalk />} />
        <Route path="/login" element={<LoginPage />} />

        {/* QuickTalk chat page */}
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
