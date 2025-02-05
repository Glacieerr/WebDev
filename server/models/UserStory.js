import mongoose from 'mongoose';

const userStorySchema = new mongoose.Schema({
    story_name: { type: String, required: true, trim: true }, // User story name
    proj_name: { type: String, required: true, trim: true }, // Project name
    description: { type: String, required: true, trim: true }, // Description
    priority: { type: Number, default: 0, min: 0, max: 5 }, // Priority level
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Associated project
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Assigned user
});

const UserStory = mongoose.model('UserStory', userStorySchema, 'userstories');

export default UserStory;
