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

const mockResult = [
    {
        "mid": "/m/0k4j",
        "languageCode": "",
        "name": "Car",
        "score": 0.935891330242157,
        "boundingPoly": {
            "vertices": [],
            "normalizedVertices": [
                {
                    "x": 0.08251953125,
                    "y": 0.70703125
                },
                {
                    "x": 0.298828125,
                    "y": 0.70703125
                },
                {
                    "x": 0.298828125,
                    "y": 0.8671875
                },
                {
                    "x": 0.08251953125,
                    "y": 0.8671875
                }
            ]
        }
    },
    {
        "mid": "/m/0k4j",
        "languageCode": "",
        "name": "Car",
        "score": 0.9321158528327942,
        "boundingPoly": {
            "vertices": [],
            "normalizedVertices": [
                {
                    "x": 0.5546875,
                    "y": 0.72265625
                },
                {
                    "x": 0.7265625,
                    "y": 0.72265625
                },
                {
                    "x": 0.7265625,
                    "y": 0.890625
                },
                {
                    "x": 0.5546875,
                    "y": 0.890625
                }
            ]
        }
    },
    {
        "mid": "/m/0k4j",
        "languageCode": "",
        "name": "Car",
        "score": 0.9145321249961853,
        "boundingPoly": {
            "vertices": [],
            "normalizedVertices": [
                {
                    "x": 0.236328125,
                    "y": 0.71875
                },
                {
                    "x": 0.56640625,
                    "y": 0.71875
                },
                {
                    "x": 0.56640625,
                    "y": 0.98046875
                },
                {
                    "x": 0.236328125,
                    "y": 0.98046875
                }
            ]
        }
    },
    {
        "mid": "/m/0k4j",
        "languageCode": "",
        "name": "Car",
        "score": 0.9008339047431946,
        "boundingPoly": {
            "vertices": [],
            "normalizedVertices": [
                {
                    "x": 0.7265625,
                    "y": 0.7265625
                },
                {
                    "x": 0.92578125,
                    "y": 0.7265625
                },
                {
                    "x": 0.92578125,
                    "y": 0.94921875
                },
                {
                    "x": 0.7265625,
                    "y": 0.94921875
                }
            ]
        }
    },
    {
        "mid": "/m/0cgh4",
        "languageCode": "",
        "name": "Building",
        "score": 0.7122846841812134,
        "boundingPoly": {
            "vertices": [],
            "normalizedVertices": [
                {
                    "x": 0.369140625,
                    "y": 0.00360107421875
                },
                {
                    "x": 0.73046875,
                    "y": 0.00360107421875
                },
                {
                    "x": 0.73046875,
                    "y": 0.7890625
                },
                {
                    "x": 0.369140625,
                    "y": 0.7890625
                }
            ]
        }
    },
    {
        "mid": "/m/0cgh4",
        "languageCode": "",
        "name": "Building",
        "score": 0.6636589765548706,
        "boundingPoly": {
            "vertices": [],
            "normalizedVertices": [
                {
                    "x": 0.003387451171875,
                    "y": 0.00016307830810546875
                },
                {
                    "x": 0.40625,
                    "y": 0.00016307830810546875
                },
                {
                    "x": 0.40625,
                    "y": 0.8515625
                },
                {
                    "x": 0.003387451171875,
                    "y": 0.8515625
                }
            ]
        }
    },
    {
        "mid": "/m/0cgh4",
        "languageCode": "",
        "name": "Building",
        "score": 0.6468669772148132,
        "boundingPoly": {
            "vertices": [],
            "normalizedVertices": [
                {
                    "x": 0.7265625,
                    "y": 0.302734375
                },
                {
                    "x": 0.8359375,
                    "y": 0.302734375
                },
                {
                    "x": 0.8359375,
                    "y": 0.7265625
                },
                {
                    "x": 0.7265625,
                    "y": 0.7265625
                }
            ]
        }
    },
    {
        "mid": "/m/0cgh4",
        "languageCode": "",
        "name": "Building",
        "score": 0.5953302383422852,
        "boundingPoly": {
            "vertices": [],
            "normalizedVertices": [
                {
                    "x": 0.83203125,
                    "y": 0.44921875
                },
                {
                    "x": 0.96875,
                    "y": 0.44921875
                },
                {
                    "x": 0.96875,
                    "y": 0.7265625
                },
                {
                    "x": 0.83203125,
                    "y": 0.7265625
                }
            ]
        }
    },
    {
        "mid": "/m/0cgh4",
        "languageCode": "",
        "name": "Building",
        "score": 0.5598708987236023,
        "boundingPoly": {
            "vertices": [],
            "normalizedVertices": [
                {
                    "x": 0.7734375,
                    "y": 0.1533203125
                },
                {
                    "x": 0.8359375,
                    "y": 0.1533203125
                },
                {
                    "x": 0.8359375,
                    "y": 0.451171875
                },
                {
                    "x": 0.7734375,
                    "y": 0.451171875
                }
            ]
        }
    }
]

export default async function handler(req, res) {
  // return mock data for now
//     console.log("hello world!")
//   try {
//     res.status(200).json({ objects: mockResult });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to read mock data' });
//   }

//   return




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