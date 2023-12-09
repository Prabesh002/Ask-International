const express = require("express");
const { grabImages, writeImages, UploadToServer,removeImage  } = require('../../clients-grabber');
const router = express.Router();


router.get('/images', (req, res) => {
  const imageLinks = grabImages();
  res.json(imageLinks);
});

router.post('/write-image', async (req, res) => {
  try {
    await UploadToServer(req, res); // Await the completion of UploadToServer
  } catch (error) {
    // Handle errors appropriately
    console.error('Error handling image write request:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/remove-image', (req, res) => {
  try {
    const imageUrlToRemove = req.body.imageUrl;

    // Call the removeImage function to remove the image
    const removed = removeImage(imageUrlToRemove);

    if (removed) {
      res.status(200).send('Image removed successfully!');
    } else {
      res.status(404).send('Image not found or failed to remove.');
    }
  } catch (error) {
    console.error('Error removing image:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/add-image', (req, res) => {
  const imageUrl = req.body.imageUrl;

  if (imageUrl) {
    const imageLinks = grabImages();

    imageLinks.push(imageUrl);

    if (writeImages(imageLinks)) {
      res.json({ message: 'Image URL added successfully.' });
    } else {
      res.status(500).json({ error: 'Failed to write image data.' });
    }
  } else {
    res.status(400).json({ error: 'Invalid image URL.' });
  }
});

module.exports = router;