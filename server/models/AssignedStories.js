import mongoose from 'mongoose';

const AssignedStorySchema = new mongoose.Schema({
  user_story_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserStory', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const AssignedStory = mongoose.model('AssignedStory', AssignedStorySchema, 'assignedstories');
export default AssignedStory;
