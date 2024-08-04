import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  userLikes: [{ type: String, required: true }], // Array of emails of users who liked this response
  content: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  userImgUrl: { type: String, required: true },
}, { timestamps: true });

const ResponseSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userImgUrl: { type: String, required: true },
  userLikes: [{ type: String, required: true }], // Array of emails of users who liked this response
  content: { type: String, required: true },
  replies: [replySchema], // Array of reply subdocuments
}, { timestamps: true });

export default mongoose.models.Response || mongoose.model('Response', ResponseSchema);