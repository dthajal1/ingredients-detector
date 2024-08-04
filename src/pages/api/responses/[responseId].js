import dbConnect from "@/utils/mongooseClient";
import Response from "@/models/Response";

export default async function handler(req, res) {
  await dbConnect();
  
  const {
    query: { responseId },
    method,
  } = req;

  switch (method) {
    case 'PUT':
      try {
        const { content, parentId } = req.body;

        if (parentId) { // Update a nested reply
          const response = await Response.findOne({ "replies._id": responseId });
          if (!response) {
            return res.status(404).json({ success: false, error: 'Response reply not found' });
          }
          const reply = response.replies.id(responseId);
          reply.content = content;
          await response.save();
          res.status(200).json({ success: true, data: {response} });
        } else { // Update a top-level response
          const response = await Response.findByIdAndUpdate(responseId, { content }, {
            new: true,
            runValidators: true,
          });
          if (!response) {
            return res.status(404).json({ success: false, error: 'Response not found' });
          }
          res.status(200).json({ success: true, data: {response} });
        }
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'DELETE':
      try {
        const { parentId } = req.body;
        if (parentId) { // Delete a nested reply
          const response = await Response.findOne({ "replies._id": responseId });
          if (!response) {
            return res.status(404).json({ success: false, error: 'Response reply not found' });
          }
          response.replies.pull(responseId);
          await response.save();
          res.status(200).json({ success: true, data: {} });
        } else { // Delete a top-level response
          const response = await Response.findById(responseId);
          if (!response) {
            return res.status(404).json({ success: false, error: 'Response not found' });
          }
          if (response.replies && response.replies.length > 0) {
            return res.status(400).json({ success: false, error: 'Cannot delete a response with replies' });
          }
          await response.deleteOne();
          res.status(200).json({ success: true, data: {} });
        }
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}