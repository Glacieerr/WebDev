import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();

  // User session
  const loggedInUser = localStorage.getItem('loggedInUser') || 'Guest'; // Default to 'Guest' if not logged in
  const userId = localStorage.getItem('user_id'); // Current logged-in user ID

  // State for dashboard data
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [error, setError] = useState(''); // For capturing and displaying errors

  // Fetch teams, projects, and user stories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          throw new Error('User ID is missing. Redirecting to login.');
        }

        // Fetch teams associated with the user from cye4.teams
        console.log('Fetching teams for user:', userId);
        const teamResponse = await axios.get('/getTeamsForUser', { params: { user_id: userId } });
        setTeams(teamResponse.data);
        console.log('Teams fetched:', teamResponse.data);

        // Fetch projects from cye4.projects
        console.log('Fetching projects assigned to user\'s teams...');
        const projectResponse = await axios.get('/getProjects');
        setProjects(projectResponse.data);
        console.log('Projects fetched:', projectResponse.data);

        // Fetch assigned user stories from cye4.assignedstories
        console.log('Fetching user stories assigned to user...');
        const storyResponse = await axios.get('/getAssignedUserStories', { params: { user_id: userId } });
        setUserStories(storyResponse.data);
        console.log('User stories fetched:', storyResponse.data);
      } catch (err) {
        console.error('Error fetching data for the home page:', err.message);
        setError();
      }
    };

    fetchData();
  }, [userId]);

  // Handle user sign-out
  const handleSignOut = (event) => {
    event.preventDefault();
    localStorage.clear(); // Clear user session
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      {/* Navigation bar */}
      <nav>
        <ul>
          <li><Link to="/create-project">Create Project</Link></li>
          <li><Link to="/team-roster">Create Team Roster</Link></li>
          <li><Link to="/user-story">Create User Story</Link></li> {/* Link for creating user story */}
          <li><Link to="/assign-user-stories">Assign User Stories</Link></li> {/* Link for assigning user stories */}
          <li><Link to="/view-projects">View/Edit Projects</Link></li>
        </ul>
      </nav>

      <h1>Home</h1>

      {/* Welcome message */}
      {loggedInUser !== 'Guest' ? (
        <>
          <p>Welcome, {loggedInUser}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <p>Please <Link to="/login">login</Link>.</p>
      )}

      <hr />

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Teams section */}
      <h3>Your Teams</h3>
      {teams.length > 0 ? (
        <ul>
          {teams.map((team) => (
            <li key={team._id}>
              <Link to={`/team/${team._id}`}>{team.team_name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No teams available.</p>
      )}

      <hr />

      {/* Projects section */}
      <h3>Projects Assigned to Your Teams</h3>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <Link to={`/project/${project._id}`}>{project.proj_name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects available.</p>
      )}

      <hr />

      {/* User Stories section */}
      <h3>Your Assigned User Stories</h3>
      {userStories.length > 0 ? (
        <ul>
          {userStories.map((story) => (
            <li key={story._id}>{story.story_name}</li>
          ))}
        </ul>
      ) : (
        <p>No user stories assigned.</p>
      )}
    </div>
  );
};

export default Home;
