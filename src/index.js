import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js'; // Added the .js extension for clarity
import reportWebVitals from './reportWebVitals.js'; // Added the .js extension
import 'bootstrap/dist/css/bootstrap.css';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';

// Importing components
import Login from './Login.js';
import Signup from './Signup.js';
import CreateTeam from './components/CreateTeam.js';
import ViewTeams from './components/ViewTeams.js';
import CreateProject from './components/CreateProject.js';
import ViewProjects from './components/ViewProjects.js';
import Home from './Home.js';
import TeamRoster from './TeamRoster.js';
import UserStory from './components/UserStory.js'; // Updated path for clarity
import AssignUserStory from './components/AssignUserStory.js'; // Added AssignUserStory import
import EditProject from './components/EditProject.js'; // Added EditProject import

// Create router with routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create-project" element={<CreateProject />} />
      <Route path="/createTeam" element={<CreateTeam />} />
      <Route path="/view-projects" element={<ViewProjects />} />
      <Route path="/viewTeams" element={<ViewTeams />} />
      <Route path="/home" element={<Home />} />
      <Route path="/team-roster" element={<TeamRoster />} />
      <Route path="/user-story" element={<UserStory />} />
      <Route path="/assign-user-stories" element={<AssignUserStory />} />
      <Route path="/edit-project/:id" element={<EditProject />} /> {/* Added EditProject route */}
    </>
  )
);

// Get the root element and render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);

// Performance monitoring
reportWebVitals();
