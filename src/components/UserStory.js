import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserStory = ({ existingStory, onSave }) => {
    const [projects, setProjects] = useState([]);
    const [storyName, setStoryName] = useState(existingStory?.story_name || '');
    const [projectName, setProjectName] = useState(existingStory?.proj_name || '');
    const [description, setDescription] = useState(existingStory?.description || '');
    const [priority, setPriority] = useState(existingStory?.priority || 0);
    const [projectId, setProjectId] = useState(existingStory?.project_id || '');

    // Fetch available projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:5001/getProjects');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                alert('Failed to fetch projects. Please try again later.');
            }
        };
        fetchProjects();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!storyName || !description || !projectId) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const payload = {
                story_name: storyName,
                proj_name: projectName,
                description,
                priority,
                project_id: projectId,
            };

            if (existingStory) {
                // Update existing user story
                const response = await axios.put(
                    `http://localhost:5001/updateUserStory/${existingStory._id}`,
                    payload
                );
                alert(response.data.message || 'User story updated successfully.');
            } else {
                // Create new user story
                const response = await axios.post('http://localhost:5001/createUserStory', payload);
                alert(response.data.message || 'User story created successfully.');
            }

            // Callback to refresh or redirect
            onSave && onSave();
        } catch (error) {
            console.error('Error saving user story:', error);
            alert('Failed to save user story. Please try again.');
        }
    };

    return (
        <div>
            <h1>{existingStory ? 'Edit User Story' : 'Create User Story'}</h1>
            <form onSubmit={handleSubmit}>
                {/* User Story Name */}
                <label htmlFor="storyName">User Story Name:</label>
                <input
                    id="storyName"
                    type="text"
                    value={storyName}
                    onChange={(e) => setStoryName(e.target.value)}
                    placeholder="Enter user story name"
                    required
                />
                <br />

                {/* Select Project */}
                <label htmlFor="projectSelect">Select Project:</label>
                <select
                    id="projectSelect"
                    value={projectId}
                    onChange={(e) => {
                        const selectedProject = projects.find((proj) => proj._id === e.target.value);
                        setProjectId(e.target.value);
                        setProjectName(selectedProject?.proj_name || '');
                    }}
                    required
                >
                    <option value="" disabled>
                        Select a project
                    </option>
                    {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                            {project.proj_name}
                        </option>
                    ))}
                </select>
                <br />

                {/* Description */}
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    required
                />
                <br />

                {/* Priority */}
                <label htmlFor="prioritySelect">Priority:</label>
                <select
                    id="prioritySelect"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                >
                    {[0, 1, 2, 3, 4, 5].map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
                <br />

                <button type="submit">{existingStory ? 'Save Changes' : 'Create User Story'}</button>
            </form>
        </div>
    );
};

export default UserStory;
