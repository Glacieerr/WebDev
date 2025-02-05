import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    team_name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of user references
});

const Team = mongoose.model('Team', teamSchema);
export default Team;
