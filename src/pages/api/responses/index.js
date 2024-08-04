import dbConnect from '@/utils/mongooseClient';
import Response from '@/models/Response';

export default async function handler(req, res) {
  await dbConnect();
  
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Fetch all responses
        const responses = await Response.find({});
        res.status(200).json({ success: true, data: {responses} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        const { userName, userImgUrl, userEmail, content } = req.body;
        // Create a new response
        const response = await Response.create({ userLikes: [], content, userName, userImgUrl, userEmail, replies: [] });
        res.status(201).json({ success: true, data: {response} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}