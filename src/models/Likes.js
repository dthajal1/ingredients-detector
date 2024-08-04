import mongoose from 'mongoose';

const LikesSchema = new mongoose.Schema({
  userLikes: [{ type: String, required: true }], // Array of emails of users who liked the app
});

export default mongoose.models.Likes || mongoose.model('Likes', LikesSchema);