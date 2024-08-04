import dbConnect from "@/utils/mongooseClient";
import Response from "@/models/Response";

export default async function handler(req, res) {
  await dbConnect();
  
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { parentId, userName, userEmail, userImgUrl, content } = req.body;
        // Find the parent response
        const parentResponse = await Response.findById(parentId);
        if (!parentResponse) {
          return res.status(404).json({ success: false, error: 'Parent response not found' });
        }
        // Add the reply to the parent's replies array
        const newReply = { userLikes: [], userName, userImgUrl, userEmail, content };
        parentResponse.replies.push(newReply);
        await parentResponse.save();
        res.status(201).json({ success: true, data: {parentResponse} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
