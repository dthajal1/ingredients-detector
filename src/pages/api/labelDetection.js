// src/pages/api/labelDetection.js

import { ImageAnnotatorClient } from '@google-cloud/vision';
import path from 'path';
import { promises as fs } from 'fs';

// Load environment variables
require('dotenv').config();

const client = new ImageAnnotatorClient({
    keyFilename: path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS),
});

export default async function handler(req, res) {
  // Check if the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get the file name from the request body
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ message: 'File name is required' });
  }

  // Construct the absolute file path
  const filePath = path.join(process.cwd(), 'public', 'images', fileName);

  try {
    // Check if the file exists
    await fs.access(filePath);

    // Performs label detection on the local file
    const [result] = await client.labelDetection(filePath);
    const labels = result.labelAnnotations;

    // Respond with the labels
    res.status(200).json({ labels });
  } catch (error) {
    console.error('Error performing label detection:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}