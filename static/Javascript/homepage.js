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

        const projectsGrid = document.getElementById('projectsGrid');

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
  const projectDiv = document.createElement('div');
  projectDiv.classList.add('project-item');

  const bannerDiv = document.createElement('div');
  bannerDiv.classList.add('banner-container');
  bannerDiv.style.backgroundImage = `url('${project.banner}')`;
  bannerDiv.addEventListener('click', () => openProjectDetails(project));
  projectDiv.appendChild(bannerDiv);

  const projectName = document.createElement('p');
  projectName.textContent = project.projectName || `Project ${index + 1}`;
  projectDiv.appendChild(projectName);

  return projectDiv;
}

function openProjectDetails(project) {
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.addEventListener('click', closeProjectDetails);

  // Create modal element
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.addEventListener('click', (event) => event.stopPropagation());

  // Create close button
  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close-btn');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', closeProjectDetails);

  // Create project name element
  const projectName = document.createElement('h2');
  projectName.innerText = project.projectName || 'Project Name';

  // Create project status element
  const projectStatus = document.createElement('p');
  projectStatus.innerText = `Status: ${project.projectType}`;

  // Create project images container
  const projectImages = document.createElement('div');
  projectImages.id = 'projectImages';
  project.images.forEach(image => {
    const img = document.createElement('img');
    img.src = image;
    img.alt = 'Project Image';
    projectImages.appendChild(img);
  });

  // Create project comments element
  const projectComments = document.createElement('p');
  projectComments.innerText = project.comments;

  // Append elements to modal
  modal.appendChild(closeBtn);
  modal.appendChild(projectName);
  modal.appendChild(projectStatus);
  modal.appendChild(projectImages);
  modal.appendChild(projectComments);

  // Append modal to overlay
  overlay.appendChild(modal);

  // Append overlay to body
  document.body.appendChild(overlay);
}

function closeProjectDetails() {
  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.remove();
  }
}


// Load projects immediately after the script is executed
document.addEventListener('DOMContentLoaded', displayProjects);
