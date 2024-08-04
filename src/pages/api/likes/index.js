import dbConnect from '@/utils/mongooseClient';
import Likes from '@/models/Likes';

export default async function handler(req, res) {
  await dbConnect();
  
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Fetch all likes for the app
        const likes = await Likes.findOne({});
        const totalLikes = likes ? likes.userLikes.length : 0;        
        res.status(200).json({ success: true, data: {totalLikes} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        const { userEmail, hasLiked } = req.body;
        // Find the likes document or create a new one
        let likes = await Likes.findOne({});
        if (!likes) {
          likes = await Likes.create({ userLikes: hasLiked ? [userEmail] : [] });
        } else {
          if (hasLiked) {
            if (!likes.userLikes.includes(userEmail)) {
              likes.userLikes.push(userEmail);
            }
          } else {
            likes.userLikes = likes.userLikes.filter(email => email !== userEmail);
          }
          await likes.save();
        }
        const totalLikes = likes.userLikes.length;
        res.status(201).json({ success: true, data: {totalLikes} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}