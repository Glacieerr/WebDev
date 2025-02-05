import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const ViewProjects = () => {
  const [projects, setProjects] = useState([]); // List of projects
  const [error, setError] = useState(''); // Error message
  const navigate = useNavigate(); // Initialize navigate hook

  // Fetch all projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5001/getProjects');
        setProjects(response.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects.');
      }
    };

    fetchProjects();
  }, []);

  // Redirect to the edit page with updated navigation logic
  const handleEditProject = (projectId, project) => {
    navigate(`/editProject/${projectId}`, { state: { project } });
  };

  // Handle deleting a project
  const handleDeleteProject = async (projectId) => {
    try {
      const response = await axios.delete(`http://localhost:5001/deleteProject/${projectId}`);
      alert(response.data.message || 'Project deleted successfully.');
      setProjects(projects.filter((project) => project._id !== projectId)); // Remove from the list
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project.');
    }
  };

  return (
    <div>
      <h1>View Projects</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {projects.length > 0 ? (
        <table border="1" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Description</th>
              <th>Product Owner</th>
              <th>Manager</th>
              <th>Team</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>{project.proj_name || 'Unnamed Project'}</td>
                <td>{project.description || 'No description available'}</td>
                <td>{project.product_owner || 'Not assigned'}</td>
                <td>{project.manager || 'Not assigned'}</td>
                <td>{project.team || 'No team assigned'}</td>
                <td>
                  <button onClick={() => handleEditProject(project._id, project)}>Edit</button>
                  <button onClick={() => handleDeleteProject(project._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No projects available to display.</p>
      )}
    </div>
  );
};

export default ViewProjects;
