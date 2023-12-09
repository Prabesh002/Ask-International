const fs = require('fs');
const path = require('path');
const cloudinary = require("cloudinary").v2;
// Define the path to the JSON file
const jsonFilePath = path.join(__dirname, 'JSON-datas', 'images.json');
console.log("Image JSON File Path = " + jsonFilePath);

cloudinary.config({
  cloud_name: "dxdry321q",
  api_key: "694884547599971",
  api_secret: "EzpoyWggcY8Ln_eNgr4XeFz4mH8",
});

async function UploadToServer(req, res) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    console.log(req.files);

    const upimg = req.files.upimg;
    const uniqueFileName = `client_${Date.now()}.png`;
    const imagePath = path.join(__dirname, "uploads", uniqueFileName);
    console.log("the img path == " + imagePath);

    await upimg.mv(imagePath);

    // You can do additional processing here if needed
    const cloudinaryResult = await uploadImageToCloudinary(imagePath);
    fs.unlinkSync(imagePath);
    const newURL = cloudinaryResult.secure_url;
    writeImages(newURL);
    return res.status(200).send('File uploaded!');
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).send('Internal Server Error');
  }
}

function grabImages() {
  try {
    const imageData = JSON.parse(fs.readFileSync(jsonFilePath));
    return imageData.imageLinks;
  } catch (error) {
    console.error('Error reading images.json:', error);
    return [];
  }
}

function writeImages(newImageLinks) {
  try {
    // Read the existing imageLinks from the file
    const existingImageData = JSON.parse(fs.readFileSync(jsonFilePath));
    const existingImageLinks = existingImageData.imageLinks || [];

    // Merge the new image links with the existing ones
    const updatedImageLinks = existingImageLinks.concat(newImageLinks);

    // Write the updated image links back to the file
    const updatedImageData = { imageLinks: updatedImageLinks };
    fs.writeFileSync(jsonFilePath, JSON.stringify(updatedImageData, null, 2));

    return true;
  } catch (error) {
    console.error('Error writing images.json:', error);
    return false;
  }
}


async function uploadImageToCloudinary(imagePath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imagePath,
      { folder: "restaurant_images/" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}
function removeImage(imageUrl) {
  try {
    // Read the existing imageLinks from the file
    const existingImageData = JSON.parse(fs.readFileSync(jsonFilePath));
    const existingImageLinks = existingImageData.imageLinks || [];

    // Check if the image URL exists in the array
    const indexToRemove = existingImageLinks.indexOf(imageUrl);

    if (indexToRemove !== -1) {
      // Remove the image URL from the array
      existingImageLinks.splice(indexToRemove, 1);

      // Write the updated image links back to the file
      const updatedImageData = { imageLinks: existingImageLinks };
      fs.writeFileSync(jsonFilePath, JSON.stringify(updatedImageData, null, 2));

      return true;
    } else {
      return false; // Image URL not found
    }
  } catch (error) {
    console.error('Error removing image:', error);
    return false;
  }
}


module.exports = {
  grabImages,
  writeImages,
  UploadToServer,
  removeImage,
  uploadImageToCloudinary
};
