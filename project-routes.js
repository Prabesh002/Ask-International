const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();


const jsonFilePath = path.join(__dirname, 'JSON-datas', 'projects.json');
const { uploadImageToCloudinary } = require('./clients-grabber');

// Middleware to read project data from JSON file
function readProjects() {
  const rawData = fs.readFileSync(jsonFilePath);
  return JSON.parse(rawData);
}

// Middleware to write project data to JSON file
function writeProjects(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(jsonFilePath, jsonData);
}


router.get('/projects', (req, res) => {
  try {
    const projects = readProjects();

    // Extract project details with additional info (project name)
    const projectDetails = Object.entries(projects.services).flatMap(([projectType, projectsList]) => {
      return projectsList.map((project, index) => {
        return {
          projectType: projectType,
          projectName: project.projectName,
          banner: project.banner,
          images: project.images,
          comments: project.comments,
        };
      });
    });

    res.json(projectDetails);
  } catch (error) {
    console.error('Error fetching project data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New route to handle project upload
router.post('/upload-project', async (req, res) => {
  try {
    const { comments, projectType, projectName } = req.body;
    const bannerImage = req.files.banner;
    const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

    // Process the banner image
    const bannerImagePath = path.join(__dirname, "uploads", `client_${Date.now()}_banner.png`);
    console.log("The Directoy is (dir path) == " +bannerImagePath);
    await bannerImage.mv(bannerImagePath);
    const bannerUrl = await uploadImageToCloudinary(bannerImagePath);
    fs.unlinkSync(bannerImagePath);

    // Process each image file
    const imageUrls = [];
    for (const image of images) {
      const imagePath = path.join(__dirname, "uploads", `client_${Date.now()}_image.png`);
      console.log("The Directoy is (img path) == " + imagePath);
      await image.mv(imagePath);
      const imageUrl = await uploadImageToCloudinary(imagePath);
      fs.unlinkSync(imagePath);
      imageUrls.push(imageUrl.secure_url);
    }

    const projects = readProjects();
    projects.services[projectType].push({
      banner: bannerUrl.secure_url,
      images: imageUrls,
      comments: comments.split('\n'),
      projectName: projectName,
    });

    writeProjects(projects);

    res.json({ message: 'Project uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a route to get project details by name
router.get('/project-details/:projectType/:projectName', (req, res) => {
  try {
    const projects = readProjects();
    const projectType = req.params.projectType;
    const projectName = req.params.projectName;

    // Find the project by name
    const project = projects.services[projectType].find(project => project.projectName === projectName);

    if (project) {
      // Return project details
      res.json({
        projectType: projectType,
        projectName: project.projectName,
        banner: project.banner,
        images: project.images,
        comments: project.comments,
      });
    } else {
      res.status(404).json({ error: 'Project not found.' });
    }
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/edit-project/:projectType/:projectName', async (req, res) => {
  try {
    const { comments , editedProjectType} = req.body;
  // Use editedProjectType as the new type
    const projectName = req.params.projectName;
    const bannerImage = req.files.banner;
    const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    console.log(req.body);
    // Process the banner image
    const bannerImagePath = path.join(__dirname, "uploads", `client_${Date.now()}_banner.png`);
    await bannerImage.mv(bannerImagePath);
    const bannerUrl = await uploadImageToCloudinary(bannerImagePath);
    fs.unlinkSync(bannerImagePath);

    // Process each image file
    const imageUrls = [];
    for (const image of images) {
      const imagePath = path.join(__dirname, "uploads", `client_${Date.now()}_image.png`);
      await image.mv(imagePath);
      const imageUrl = await uploadImageToCloudinary(imagePath);
      fs.unlinkSync(imagePath);
      imageUrls.push(imageUrl.secure_url);
    }

    const projects = readProjects();

    // Find the project by name and update it
    const projectToUpdate = projects.services[req.params.projectType].find(project => project.projectName === projectName);
    if (projectToUpdate) {
      // Remove the project from the current type
      projects.services[req.params.projectType] = projects.services[req.params.projectType].filter(project => project.projectName !== projectName);
      console.log(projects.services);
      
      projects.services[editedProjectType] = projects.services[editedProjectType] || [];
      // Add the project to the new type
      projects.services[editedProjectType].push({
        banner: bannerUrl.secure_url,
        images: imageUrls,
        comments: comments,
        projectName: projectName,
      });

      writeProjects(projects);

      res.json({ message: 'Project updated successfully.' });
    } else {
      res.status(404).json({ error: 'Project not found.' });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add a route to delete a project
router.delete('/delete-project/:projectType/:projectName', (req, res) => {
  try {
    const projects = readProjects();
    const projectType = req.params.projectType;
    const projectName = req.params.projectName;

    // Remove the project by name
    projects.services[projectType] = projects.services[projectType].filter(project => project.projectName !== projectName);

    writeProjects(projects);

    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
