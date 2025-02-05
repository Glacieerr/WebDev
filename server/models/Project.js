import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    proj_name: { type: String, required: true },
    proj_desc: { type: String, required: true },
    prod_owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    mgr_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: false }
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
