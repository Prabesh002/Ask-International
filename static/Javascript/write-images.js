async function uploadImage() {
    const form = document.getElementById('uploadForm');
    const photoFile = document.getElementById("imageInput").files[0];
    const formData = new FormData();
    formData.append("upimg", photoFile);

    try {
        document.querySelector('.loader').style.display = 'block';
        const response = await fetch('/write-image', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Image uploaded successfully!');
            document.querySelector('.loader').style.display = 'none';
        } else {
            alert('Error uploading image. Please try again.');
            document.querySelector('.loader').style.display = 'none';
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        document.querySelector('.loader').style.display = 'none';
        alert('An error occurred. Please try again later.');
    }
}