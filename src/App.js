import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Home.js'; // Home Page
import CreateProject from './components/CreateProject.js'; // Create Project Page
import UserStory from './components/UserStory.js'; // Create User Story Page
import AssignUserStory from './components/AssignUserStory.js'; // Assign User Story Page
import ViewProjects from './components/ViewProjects.js'; // View/Edit Projects Page
import Login from './Login.js'; // Login Page
import Signup from './Signup.js'; // Signup Page
import EditProject from './components/EditProject.js';

function App() {
  return (
    <Router>
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/user-stories" element={<UserStory />} />
        <Route path="/assign-user-stories" element={<AssignUserStory />} /> 
        <Route path="/view-projects" element={<ViewProjects />} />
        <Route path="/editProject/:id" element={<EditProject />} />
        
        {/* Fallback for unmatched routes */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
