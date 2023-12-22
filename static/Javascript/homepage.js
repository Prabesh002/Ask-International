function Redirect() {
  window.location.href = "/contact";
}

function editButtonClick() {
  window.location.href = "/monitor";
}

function displayProjects() {
  try {
    fetch('/projects')
      .then(response => response.json())
      .then(projectsData => {
        console.log(projectsData); // Log the response to check its structure

        const projectsGrid = document.getElementById('portfolio-items isotope');

        if (projectsData && projectsData.length > 0) {
          displayProjectsGrid(projectsGrid, projectsData);
        } else {
          console.log('No projects found.');
        }
      })
      .catch(error => console.error('Error fetching projects:', error));
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
}

function displayProjectsGrid(parentDiv, projects) {
  projects.forEach((project, index) => {
    const projectDiv = createProjectDiv(project, index);
    parentDiv.appendChild(projectDiv);
  });
}

function createProjectDiv(project, index) {
  // Create the main container for the project item
  const projectItem = document.createElement('div');
  projectItem.classList.add('col-sm-6', 'col-md-4', 'col-lg-4', project.category);

  // Create the portfolio-item container
  const portfolioItem = document.createElement('div');
  portfolioItem.classList.add('portfolio-item');

  // Create the hover-bg container
  const hoverBg = document.createElement('div');
  hoverBg.classList.add('hover-bg');

  // Create the hover-text container
  const hoverText = document.createElement('div');
  hoverText.classList.add('hover-text');

  // Create the project name element
  const projectName = document.createElement('h4');
  projectName.innerText = project.projectName || `Project ${index + 1}`;

  // Create the project image
  const projectImage = document.createElement('img');
  projectImage.src = project.banner; // Assuming 'banner' contains the image URL
  projectImage.alt = project.projectName || `Project ${index + 1}`;
  projectImage.classList.add('img-responsive');

  // Append elements to construct the project item
  hoverText.appendChild(projectName);
  hoverBg.appendChild(hoverText);
  hoverBg.appendChild(projectImage);
  portfolioItem.appendChild(hoverBg);
  projectItem.appendChild(portfolioItem);

  // Add click event to open project details
  projectItem.addEventListener('click', () => openProjectDetails(project));

  return projectItem;
}


function openProjectDetails(project) {
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.classList.add('overlay2');
  overlay.addEventListener('click', closeProjectDetails);

  // Create modal element
  const modal = document.createElement('div');
  modal.classList.add('modal2');
  modal.addEventListener('click', (event) => event.stopPropagation());

  // Create close button
  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close-btn');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', closeProjectDetails);

  // Create modal header
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header');

  // Create project name element
  const projectName = document.createElement('h2');
  projectName.innerText = project.projectName || 'Project Name';

  // Create project status element
  const projectStatus = document.createElement('p');
  projectStatus.innerText = `Status: ${project.projectType}`;

  // Append project name and status to modal header
  modalHeader.appendChild(projectName);
  modalHeader.appendChild(projectStatus);

  // Create project images container
  const projectImages = document.createElement('div');
  projectImages.id = 'projectImages';
  project.images.forEach((image, imageIndex) => {
    const img = document.createElement('img');
    img.src = image;
    img.alt = `Project Image ${imageIndex + 1}`;
    img.classList.add('img-responsive', 'project-image'); // Add class for styling
    projectImages.appendChild(img);
  });

  // Create project comments element
  const projectComments = document.createElement('p');
  projectComments.classList.add('modal-bottom-text');
  projectComments.innerText = project.comments;

  // Append elements to modal
  modal.appendChild(closeBtn);
  modal.appendChild(modalHeader);
  modal.appendChild(projectImages);
  modal.appendChild(projectComments);

  // Append modal to overlay
  overlay.appendChild(modal);

  // Append overlay to body
  document.body.appendChild(overlay);
}

function closeProjectDetails() {
  const overlay = document.querySelector('.overlay2');
  if (overlay) {
    overlay.remove();
  }
}


// Load projects immediately after the script is executed
document.addEventListener('DOMContentLoaded', displayProjects);
