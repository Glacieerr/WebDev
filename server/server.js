import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';
import Project from './models/Project.js';
import Team from './models/Team.js';
import User from './models/User.js';
import AssignedStory from './models/AssignedStories.js';
import UserStory from './models/UserStory.js';

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URI
const uri = 'mongodb+srv://“your link”';

// JWT Secret
const JWT_SECRET = 'your-jwt-secret';

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const db = mongoose.connection.db;
        const user = await db.collection('cye').findOne({ username, password });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Signup Route
app.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Signup failed' });
    }
});

// Create Project Route
app.post('/createProject', async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get Projects Route
app.get('/getProjects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Failed to fetch projects' });
    }
});

// Create Team Route
app.post('/createTeam', async (req, res) => {
    try {
        const team = new Team(req.body);
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get Teams Route
app.get('/getTeams', async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get Users from "cye" Collection
app.get('/getUsers', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const userList = await db.collection('cye')
            .find({}, { projection: { username: 1, firstName: 1, lastName: 1, _id: 1 } })
            .toArray();
        res.status(200).json(userList);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
});

// Get Assigned User Stories
app.get('/getAssignedUserStories', async (req, res) => {
    const { user_id } = req.query;
    try {
        const assignedStories = await AssignedStory.find({ user_id }).populate('user_story_id');
        res.status(200).json(assignedStories.map((story) => story.user_story_id));
    } catch (error) {
        console.error('Error fetching assigned user stories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add Members to Team
app.post('/addMembersToTeam', async (req, res) => {
  try {
    const { teamId, memberIds } = req.body;

    console.log('Received request to add members to a team');
    console.log('Received Team ID:', teamId);
    console.log('Received Member IDs:', memberIds);

    // Validate input
    if (!teamId || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ message: 'Team ID and member IDs are required.' });
    }

    // Check if the team exists
    console.log('Checking if the team exists...');
    const team = await Team.findById(teamId);
    if (!team) {
      console.error('Team not found for ID:', teamId);
      return res.status(404).json({ message: 'Team not found.' });
    }

    // Validate member IDs against the "cye" collection
    console.log('Validating member IDs in the cye collection...');
    const db = mongoose.connection.db; // Access the database connection
    const validMembers = await db.collection('cye').find({ _id: { $in: memberIds.map(id => new mongoose.Types.ObjectId(id)) } }).toArray();

    // Debugging: Log found and provided member IDs
    console.log('Valid Members Found:', validMembers.map(member => member._id.toString()));
    console.log('Provided Member IDs:', memberIds);

    if (validMembers.length !== memberIds.length) {
      console.error('Some members not found in the cye collection. Provided IDs:', memberIds);
      return res.status(404).json({ message: 'Some members not found in the cye collection.' });
    }

    // Add members to the team
    console.log('Adding members to the team...');
    team.members = [...new Set([...team.members, ...memberIds])]; // Avoid duplicates
    await team.save();

    console.log('Members successfully added to the team:', team);
    res.status(200).json({ message: 'Members successfully added to the team.', team });
  } catch (error) {
    console.error('Error adding members to the team:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/createUserStory', async (req, res) => {
    try {
        const { story_name, proj_name, description, priority, project_id } = req.body;

        if (!story_name || !proj_name || !description || !project_id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const userStory = new UserStory({
            story_name,
            proj_name,
            description,
            priority,
            project_id,
        });

        await userStory.save();
        res.status(201).json({ message: 'User story created successfully', userStory });
    } catch (error) {
        console.error('Error creating user story:', error);
        res.status(500).json({ message: 'Failed to create user story' });
    }
});

app.put('/updateUserStory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { story_name, proj_name, description, priority, project_id } = req.body;

        if (!story_name || !proj_name || !description || !project_id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const updatedStory = await UserStory.findByIdAndUpdate(
            id,
            { story_name, proj_name, description, priority, project_id },
            { new: true }
        );

        if (!updatedStory) {
            return res.status(404).json({ message: 'User story not found' });
        }

        res.status(200).json({ message: 'User story updated successfully', updatedStory });
    } catch (error) {
        console.error('Error updating user story:', error);
        res.status(500).json({ message: 'Failed to update user story' });
    }
});

app.get('/getUnassignedUserStories/:teamId', async (req, res) => {
    try {
      const { teamId } = req.params;
  
      // Debugging log: Check if teamId is received correctly
      console.log('Fetching unassigned stories for Team ID:', teamId);
  
      // Fetch unassigned stories for the given team
      const unassignedStories = await UserStory.find({ 
        project_id: teamId,  // Match the team/project ID
        assigned_to: null    // Ensure the story is unassigned
      });
  
      // Debugging log: Check the fetched unassigned stories
      console.log('Fetched Unassigned Stories:', unassignedStories);
  
      if (unassignedStories.length === 0) {
        return res.status(200).json({ success: true, data: [], message: 'No unassigned stories found.' });
      }
  
      res.status(200).json({ success: true, data: unassignedStories });
    } catch (error) {
      console.error('Error fetching unassigned stories:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch unassigned stories.' });
    }
});  

app.get('/getUnassignedUserStories', async (req, res) => {
    const { teamId } = req.query;
  
    try {
      if (!teamId) {
        return res.status(400).json({ success: false, message: 'Team ID is required.' });
      }
  
      // Fetch unassigned user stories for the given team
      const unassignedStories = await UserStory.find({
        project_id: teamId,
        assigned_to: null,
      });
  
      res.status(200).json({ success: true, data: unassignedStories });
    } catch (error) {
      console.error('Error fetching unassigned user stories:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch unassigned user stories.' });
    }
});  

app.post('/assignUserStory', async (req, res) => {
    const { user_story_id, user_id } = req.body;
  
    try {
      // Update the UserStory document to assign the user
      const updatedStory = await UserStory.findByIdAndUpdate(
        user_story_id,
        { assigned_to: user_id },
        { new: true }
      );
  
      if (!updatedStory) {
        return res.status(404).json({ success: false, message: 'User story not found.' });
      }
  
      // Create an entry in AssignedStories table
      const assignedStory = new AssignedStory({ user_story_id, user_id });
      await assignedStory.save();
  
      res.status(200).json({ success: true, message: 'User story assigned successfully.' });
    } catch (error) {
      console.error('Error assigning user story:', error);
      res.status(500).json({ success: false, message: 'Failed to assign user story.' });
    }
});

app.get('/getProjects', async (req, res) => {
    try {
      const projects = await Project.find()
        .populate('product_owner', 'name') // Assuming there's a product_owner field
        .populate('manager', 'name') // Assuming there's a manager field
        .populate('team', 'team_name'); // Assuming there's a team field
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Failed to fetch projects.' });
    }
});  

app.get('/getUserStories', async (req, res) => {
    const { project_id } = req.query;
    try {
      const stories = await UserStory.find({ project_id });
      res.status(200).json(stories);
    } catch (error) {
      console.error('Error fetching user stories:', error);
      res.status(500).json({ message: 'Failed to fetch user stories.' });
    }
});

app.delete('/deleteProject/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await Project.findByIdAndDelete(id);
      res.status(200).json({ message: 'Project deleted successfully.' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ message: 'Failed to delete project.' });
    }
});

app.put('/updateProject/:id', async (req, res) => {
    const { id } = req.params;
    const { proj_name, description, product_owner, manager, team } = req.body;
  
    try {
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { proj_name, description, product_owner, manager, team },
        { new: true }
      );
      res.status(200).json({ message: 'Project updated successfully.', data: updatedProject });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ message: 'Failed to update project.' });
    }
});

app.put('/editProject/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const result = await Project.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!result) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      res.status(200).json({ message: 'Project updated successfully', data: result });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ message: 'Error updating project' });
    }
});

app.get('/getTeamsForUser', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const teams = await Team.find({ members: user_id });
        res.status(200).json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch teams' });
    }
});

app.get('/getProjects', async (req, res) => {
    try {
        const { teamIds } = req.query; // Receive team IDs as an array
        if (!teamIds || !teamIds.length) {
            return res.status(400).json({ success: false, message: 'Team IDs are required' });
        }

        const projects = await Project.find({ team: { $in: teamIds } });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch projects' });
    }
});

app.get('/getAssignedUserStories', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const stories = await UserStory.find({ assigned_to: user_id });
        res.status(200).json(stories);
    } catch (error) {
        console.error('Error fetching user stories:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user stories' });
    }
});















// Start the Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
