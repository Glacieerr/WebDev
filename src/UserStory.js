import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserStory = () => {
  const [projects, setProjects] = useState([]); // For project dropdown
  const [selectedProject, setSelectedProject] = useState(''); // Selected project ID
  const [storyName, setStoryName] = useState(''); // User Story Name
  const [storyDescription, setStoryDescription] = useState(''); // Story description
  const [priority, setPriority] = useState(0); // Priority (default 0)

  // Fetch projects on component mount
  useEffect(() => {
    axios.get('http://localhost:5001/getProjects')
      .then((res) => setProjects(res.data))
      .catch((err) => console.error('Error fetching projects:', err));
  }, []);

  // Handle adding a new user story
  const handleAddUserStory = (e) => {
    e.preventDefault();

    // Ensure required fields are filled
    if (!storyName || !selectedProject || !storyDescription) {
      alert('Please fill in all required fields.');
      return;
    }

    // API call to create a new user story
    axios.post('http://localhost:5001/createUserStory', {
      story_name: storyName, // Include User Story Name
      proj_name: projects.find(p => p._id === selectedProject)?.project_name || '',
      description: storyDescription,
      priority: priority,
      project_id: selectedProject
    })
      .then(() => {
        alert('User story added successfully!');
        setSelectedProject(''); // Reset project selection
        setStoryName(''); // Reset story name
        setStoryDescription(''); // Reset description
        setPriority(0); // Reset priority
      })
      .catch(err => console.error('Error adding user story:', err));
  };

  return (
    <div>
      <h2>Create User Story</h2>
      <form onSubmit={handleAddUserStory}>
        {/* User Story Name */}
        <label>User Story Name:</label>
        <input
          type="text"
          value={storyName}
          onChange={(e) => setStoryName(e.target.value)}
          placeholder="Enter the user story name"
          required
        />
        <br />

        {/* Select Project */}
        <label>Select Project:</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          required
        >
          <option value="">Select a Project</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>{project.project_name}</option>
          ))}
        </select>
        <br />

        {/* Story Description */}
        <label>User Story Description:</label>
        <textarea
          value={storyDescription}
          onChange={(e) => setStoryDescription(e.target.value)}
          placeholder="Enter the user story description"
          required
        />
        <br />

        {/* Priority */}
        <label>Priority:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(parseInt(e.target.value))}
          required
        >
          {[0, 1, 2, 3, 4, 5].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <br />

        <button type="submit">Add User Story</button>
      </form>
    </div>
  );
};

export default UserStory;
