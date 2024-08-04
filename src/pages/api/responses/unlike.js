import dbConnect from "@/utils/mongooseClient";
import Response from "@/models/Response";

export default async function handler(req, res) {
  await dbConnect();
  
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const { responseId, userEmail, isReply, replyIndex } = req.body;
        // Find the response
        const response = await Response.findById(responseId);
        if (!response) {
          return res.status(404).json({ success: false, error: 'Response not found' });
        }
        if (isReply && replyIndex !== undefined) {
          // Unlike a nested reply
          const likeIndex = response.replies[replyIndex].userLikes.indexOf(userEmail);
          if (likeIndex > -1) {
            response.replies[replyIndex].userLikes.splice(likeIndex, 1);
          }
        } else {
          // Unlike the response
          const likeIndex = response.userLikes.indexOf(userEmail);
          if (likeIndex > -1) {
            response.userLikes.splice(likeIndex, 1);
          }
        }
        await response.save();
        res.status(200).json({ success: true, data: response });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}