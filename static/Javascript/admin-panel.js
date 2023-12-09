const imageSection = document.getElementById('imageSection');
const settingsSection = document.getElementById('settingsSection');
let isImageSectionVisible = false;
let isSettingsSectionVisible = false;
var projType;
function toggleImageSection() {
  imageSection.style.display = 'block';
  settingsSection.style.display = 'none';
}

function toggleSettingsSection() {
  settingsSection.style.display = 'block';
  imageSection.style.display = 'none';
}


async function fetchImages() {
  try {
    const response = await fetch('/images');
    if (response.ok) {
      const imageData = await response.json();
      console.log("Received! Image data =", imageData);
      return imageData || [];
    } else {
      console.error('Failed to fetch images:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

function displayImages(images) {
  try {
    const existingImagesContainer = document.getElementById('existingImagesContainer');
    console.log('existingImagesContainer:', existingImagesContainer);

    // Clear the existing images container
    existingImagesContainer.innerHTML = '';

    // Display each existing image with a remove button
    images.forEach((imageUrl) => {
      console.log('Appending image:', imageUrl);

      const imageElement = document.createElement('img');
      imageElement.src = imageUrl;
      imageElement.classList.add('client-image'); // Add a class for styling

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.classList.add('removeButton'); // Add a class for styling
      removeButton.addEventListener('click', () => removeImage(imageUrl));

      const imageContainer = document.createElement('div');
      imageContainer.classList.add('imageContainer'); // Add a class for styling
      imageContainer.appendChild(imageElement);
      imageContainer.appendChild(removeButton);

      console.log('Created image container:', imageContainer);

      existingImagesContainer.appendChild(imageContainer);
    });
  } catch (error) {
    console.error('Error displaying existing images:', error);
  }
}

async function init() {
  try {
    const existingImages = await fetchImages();
    console.log('existingImages:', existingImages);

    displayImages(existingImages);
  } catch (error) {
    console.error('Error initializing page:', error);
  }
}

document.addEventListener('DOMContentLoaded', init);

async function removeImage(imageUrl) {
  
  try {
    document.querySelector('.loader').style.display = 'block';
    const response = await fetch('/remove-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (response.ok) {
      console.log('Image removed successfully!');
      document.querySelector('.loader').style.display = 'none';
      // Refresh the existing images after removal
      init();
    } else {
      console.error('Failed to remove image:', response.statusText);
    }
  } catch (error) {
    console.error('Error removing image:', error);
    document.querySelector('.loader').style.display = 'none';
  }
}
async function uploadProject() {
  try {
    showLoadingScreen();
      const bannerImage = document.getElementById('bannerImageInput').files[0];
      const comments = document.getElementById('comments').value;
      const images = document.getElementById('imagesInput').files;
      const siteType = document.getElementById('siteType').value;
      const projectName = document.getElementById('projectName').value;

      const formData = new FormData();
      formData.append('banner', bannerImage);
      formData.append('comments', comments);
      formData.append('projectType', siteType);
      formData.append('projectName',projectName);

      for (const image of images) {
          formData.append('images', image);
      }

      const response = await fetch('/upload-project', {
          method: 'POST',
          body: formData,
      });

      if (response.ok) {
        hideLoadingScreen();
        showMessage("Your Project Have Been Added!", true);
          console.log('Project added successfully!');
          init();
          initProjectManagement(); // Refresh the existing projects after adding a new one
      } else {
          console.error('Failed to add project:', response.statusText);
          showMessage("Your Project Couldn't Be added \n " + response.statusText, false);
        
      }
  } catch (error) {
      console.error('Error uploading project:', error);
      showMessage("Your Project Couldn't Be added \n " + error, false);
  }
}

function showLoadingScreen() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'flex';
  }
}

function hideLoadingScreen() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
  }
}

function showMessage(message, isSuccess) {
  const messageOverlay = document.getElementById('messageOverlay');
  if (messageOverlay) {
    messageOverlay.innerText = message;

    if (isSuccess) {
      messageOverlay.classList.add('success');
      messageOverlay.classList.remove('error');
    } else {
      messageOverlay.classList.add('error');
      messageOverlay.classList.remove('success');
    }

    messageOverlay.style.display = 'flex';

    // Close button event
    messageOverlay.addEventListener('click', () => {
      messageOverlay.style.display = 'none';
      hideLoadingScreen();
    });
  }
}
// Fetch projects and initialize the page
async function initProjectManagement() {
  try {
    const projects = await fetchProjects();
    displayProjectList(projects);
  } catch (error) {
    console.error('Error initializing project management:', error);
  }
}

// Function to fetch projects
async function fetchProjects() {
  try {
    const response = await fetch('/projects');
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to fetch projects:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Function to display the project list
function displayProjectList(projects) {
  const projectListContainer = document.getElementById('projectList');
  projectListContainer.innerHTML = '';

  projects.forEach(project => {
    const projectItem = document.createElement('div');
    projectItem.classList.add('project-item');
    projectItem.innerHTML = `
      <h4>${project.projectName}</h4>
      <button onclick="openEditPanel('${project.projectType}', '${project.projectName}')">Edit</button>
      <button onclick="deleteProject('${project.projectType}', '${project.projectName}')">Delete</button>
    `;
    projectListContainer.appendChild(projectItem);
  });
}

async function openEditPanel(projectType, projectName) {
  try {
    showLoadingScreen();
    // Fetch project details for editing
    const projectDetails = await fetchProjectDetails(projectType, projectName);
    console.warn(projectDetails)
    projType = projectDetails.projectType;
   
    // Get the overlay container
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    // Create the edit panel
    const editPanel = document.createElement('div');
    editPanel.classList.add('edit-panel');

    // Add content to the edit panel
    editPanel.innerHTML = `
    <h2>Edit Project</h2>
    <label for="projectType">Project Type:</label>
    <select id="projectType">
      <option value="ongoing">ongoing</option>
      <option value = "completed"> completed </option>
      
    </select>
    <label for="comments">Comments:</label>
    <textarea id="comment">${projectDetails.comments}</textarea>
    <label for="bannerImage" class="drop-container">
      <span class="drop-title">Drop banner image here</span>
      or
      <input type="file" id="bannerImageInput2" accept="image/*" required>
    </label>
    <label for="images" class="drop-container">
      <span class="drop-title">Drop additional images here</span>
      or
      <input type="file" id="imagesInput2" accept="image/*" multiple>
    </label>
    <!-- Add other fields as needed -->
    <button id="saveButton" disabled onclick="saveProject('${projType}', '${projectDetails.projectName}')">Save</button>
    <button id="deleteButton" onclick="deleteProject('${projType}', '${projectDetails.projectName}')">Delete</button>
    <button id="closeButton" onclick="closeOverlay()">Close</button>
  `;
  

    // Populate input fields with project details
    const commentsInput = editPanel.querySelector('#comment');
    const bannerImageInput = editPanel.querySelector('#bannerImageInput2');
    const imagesInput = editPanel.querySelector('#imagesInput2');
    
    // Add event listeners for changes in input fields
    commentsInput.addEventListener('input', () => handleInputChange(projectDetails, commentsInput));
    bannerImageInput.addEventListener('change', () => handleInputChange(projectDetails, bannerImageInput));
    imagesInput.addEventListener('change', () => handleInputChange(projectDetails, imagesInput))

    // Add the overlay to the document body
    document.body.appendChild(overlay);
    overlay.appendChild(editPanel);
    hideLoadingScreen();
  } catch (error) {
    console.error('Error opening edit panel:', error);
    showMessage("Error Constructing Edit Panel. Request Denied.",false );
  }
}


function handleInputChange(projectDetails, commentsInput) {
  const saveButton = document.getElementById('saveButton');

  // Enable the "Save" button if there are changes in comments
  saveButton.disabled = commentsInput.value === projectDetails.comments;
}
// Function to fetch project details for editing
async function fetchProjectDetails(projectType, projectName) {
  try {
    showLoadingScreen();
    const response = await fetch(`/project-details/${projectType}/${projectName}`);
    if (response.ok) {
      hideLoadingScreen();
      return await response.json();
    } else {
      console.error('Failed to fetch project details:', response.statusText);
      showMessage("Error, Unable to fetch project details. " + response.statusText);
      return {};
    }
  } catch (error) {
    showMessage("Error, Unable to fetch project details. " + error);
    console.error('Error fetching project details:', error);
    return {};
  }
}

// Function to delete a project
async function deleteProject(projectType, projectName) {
  // Show a confirmation dialog
  const isConfirmed = confirm(`Are you sure you want to delete the project "${projectName}"?`);
 showLoadingScreen();
  if (isConfirmed) {
    try {
      const response = await fetch(`/delete-project/${projectType}/${projectName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Project deleted successfully:', projectName);
        // Refresh the project list
        initProjectManagement();
        showMessage("Sucessfully deleted Your Project \n Response = " + response.statusText,true);
      } else { 
        console.error('Failed to delete project:', response.statusText);
        showMessage("Error deleting Your Project." + response.statusText,true);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }
}

// Function to save/update a project
async function saveProject(projectType, projectName) {
  try {
    showLoadingScreen();
    const bannerImage = document.getElementById('bannerImageInput2').files[0];
    const images = document.getElementById('imagesInput2').files;
    
    const comments = document.getElementById('comment').value
     console.log(comments);
    // Add other fields as needed
    const projectTypeOriginal = projType;
    const updatedProjectType = document.getElementById('projectType').value;
    console.log(updatedProjectType);
    const formData = new FormData();
    formData.append('comments', comments);
    formData.append('editedProjectType', updatedProjectType);
    formData.append('projectType', projectTypeOriginal)
    formData.append('banner', bannerImage);
    for (const image of images) {
      formData.append('images', image);
  }

    
    // Send the update request to the server
    const response = await fetch(`/edit-project/${projectTypeOriginal}/${projectName}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      console.log('Project saved successfully:', projectName);
      showMessage("Sucessfully Saved Your Project." + response.statusText + "  " + projectName,true);
      // Refresh the project list
      initProjectManagement();
    } else {
      showMessage("failed saving  Your Project." + response.statusText,true);
      console.error('Failed to save project:', response.statusText);
    }

    // Close the overlay after saving
    closeOverlay();
  } catch (error) {
    console.error('Error saving project:', error);
    showMessage("Unknown error? " + error)
  }
}


// Function to close the overlay
function closeOverlay() {
  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.remove();
  }
}

// Initialize the project management on page load
document.addEventListener('DOMContentLoaded', initProjectManagement);
