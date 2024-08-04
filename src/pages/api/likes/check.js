import dbConnect from '@/utils/mongooseClient';
import Likes from '@/models/Likes';

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { userEmail } = req.body;
        // Find the likes document
        const likes = await Likes.findOne({});
        if (!likes) {
          return res.status(200).json({ success: true, data: {hasLiked: false} });
        }
        const hasLiked = likes.userLikes.includes(userEmail);
        res.status(200).json({ success: true, data: { hasLiked } });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
