document.addEventListener('DOMContentLoaded', () => {
    const clientsDiv = document.querySelector('.image-clients');

    // Create a loading message with a dot animation
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Fetching images';
    clientsDiv.appendChild(loadingMessage);

    // Function to animate the dot
    const animateDot = () => {
        setTimeout(() => {
            if (loadingMessage.textContent.endsWith('...')) {
                loadingMessage.textContent = 'Fetching images';
            } else {
                loadingMessage.textContent += '.';
            }
            animateDot();
        }, 500); // Change animation speed as needed
    };

    animateDot();

    // Fetch image URLs from the server
    fetch('/images')
        .then(response => response.json())
        .then(data => {
            // Remove the loading message
            clientsDiv.removeChild(loadingMessage);

            // Loop through the image URLs and add them to the "clients" div
            data.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.classList.add('hidden'); // Add the "hidden" class
                clientsDiv.appendChild(img);
            });

            // Register the Intersection Observer after adding images to the DOM
            const hiddenElements = document.querySelectorAll('.hidden');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('hidden');
                        entry.target.classList.add('show');
                    }else
                    {
                        entry.target.classList.remove('show');
                        entry.target.classList.add('hidden');
                    }
                });
            });

            hiddenElements.forEach((el) => observer.observe(el));
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });
});
