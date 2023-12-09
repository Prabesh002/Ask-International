document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact_form");
    const loadingPanel = document.getElementById("loading-panel");
    loadingPanel.style.display = "none";


    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the default form submission behavior
      loadingPanel.style.display = "block";

      // Get form values
      const name = document.getElementById("name_input").value;
      const email = document.getElementById("email_input").value;
      const telephone = document.getElementById("telephone_input").value;
      const subject = document.getElementById("subject_input").value;
      const message = document.getElementById("message_input").value;
      console.log("Name: " + name);
      console.log("Email: " + email);
      console.log("Number: " + telephone);
      console.log("Subject: " + subject);
      console.log("Message: " + message);

      // Create an object with the form data
      const formData = {
        receiver: email,
        topic: subject,
        message: `
          <html>
            <head>
              <style>
                /* Add your CSS styles here */
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 20px;
                }
                .container {
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #333;
                }
                p {
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Contact Form Submission</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Number:</strong> ${telephone}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
              </div>
            </body>
          </html>
        `
      };
      

      fetch("/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      .then((response) => {
        if (response.ok) {
          loadingPanel.style.display = "none";
          alert("Sucessful! Please wait for us to contact!")
          return response.json(); 
          
        } else {
          alert("Failed! Please Try again!")
          throw new Error("Request failed with status: " + response.status);
        }
      })
      
    });
  });

