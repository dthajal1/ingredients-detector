// src/pages/api/localize.js
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import formidable from 'formidable';
import { v4 as uuidv4 } from 'uuid';

require('dotenv').config();

const client = new ImageAnnotatorClient({
  keyFilename: path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS),
});

const storage = new Storage({
  keyFilename: path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS),
});

const bucketName = process.env.GCS_BUCKET_NAME;

// Helper function to parse form data
export const config = {
    api: {
      bodyParser: false,
    },
};

const parseForm = async (req) => {
    return new Promise((resolve, reject) => {
        const form = formidable();
        form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
        });
    });
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
      // Parse the form data
      const { files } = await parseForm(req);

      // Get the file
      const file = files.file[0]; // Assuming 'file' is the field name from the frontend
  
      if (!file || !file.filepath) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      // Generate a unique file name for Google Cloud Storage
      const fileName = uuidv4() + path.extname(file.originalFilename);
      const bucket = storage.bucket(bucketName);
      const gcsFile = bucket.file(fileName);
  
      // Upload the file to Google Cloud Storage
      await bucket.upload(file.filepath, {
        destination: gcsFile,
        metadata: {
          contentType: file.mimetype,
        },
      });
    
      // Create the request object for Google Cloud Vision
      const gcsUri = `gs://${bucketName}/${fileName}`;
      const publicUrl = gcsUri.replace('gs://', 'https://storage.googleapis.com/');
      const [result] = await client.objectLocalization(gcsUri);
      const objects = result.localizedObjectAnnotations;
      res.status(200).json({ objects, imgUrl: publicUrl });
    } catch (error) {
      console.error('Error handling file upload and processing:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}