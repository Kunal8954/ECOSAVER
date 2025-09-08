import express from 'express';
import multer from 'multer';
import cors from 'cors';
import vision from '@google-cloud/vision';
import path from 'path';
import fs from 'fs';

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());

// Google Vision client
const client = new vision.ImageAnnotatorClient();

// POST /verify-image
app.post('/verify-image', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  try {
    const filePath = path.resolve(req.file.path);
    const [result] = await client.labelDetection(filePath);
    const labels = result.labelAnnotations.map(l => l.description.toLowerCase());
    // Example: check for recycling task
    const { task } = req.body;
    let verified = false;
    let reason = '';
    if (task === 'recycle') {
      verified = labels.includes('recycling bin') || labels.includes('recycle') || labels.includes('plastic bottle');
      reason = verified ? 'Recycling-related object detected.' : 'No recycling object found.';
    } else if (task === 'plant') {
      verified = labels.includes('plant') || labels.includes('tree') || labels.includes('seedling');
      reason = verified ? 'Plant-related object detected.' : 'No plant object found.';
    } else {
      verified = labels.length > 0;
      reason = verified ? 'Object detected.' : 'No recognizable object.';
    }
    fs.unlinkSync(filePath); // Clean up
    res.json({ verified, labels, reason });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('AI Image backend running on port 3001');
});
