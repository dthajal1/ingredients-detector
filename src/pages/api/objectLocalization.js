// src/pages/api/objectLocalization.js

import { ImageAnnotatorClient } from '@google-cloud/vision';
import path from 'path';
import { promises as fs } from 'fs';

// Load environment variables
require('dotenv').config();

// Creates a client with credentials from the environment variable
const client = new ImageAnnotatorClient({
  keyFilename: path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get the file name from the request body
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ message: 'File name is required' });
  }

  // Construct the absolute file path
  const filePath = path.join(process.cwd(), 'public', 'images', fileName + '.png');

  try {
    // Check if the file exists
    await fs.access(filePath);

    // Read the image file
    const imageContent = await fs.readFile(filePath);

    // Create the request object
    const request = {
      image: { content: imageContent },
    };

    // Performs object localization on the image file
    const [result] = await client.objectLocalization(request);
    const objects = result.localizedObjectAnnotations;

    // Respond with the objects
    res.status(200).json({ objects });
  } catch (error) {
    console.error('Error performing object localization:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}