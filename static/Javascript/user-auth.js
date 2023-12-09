import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAdxGsJNeXdY2vHUuWkgXFMrtUY9JerZ7M",
    authDomain: "khane-ho.firebaseapp.com",
    projectId: "khane-ho",
    storageBucket: "khane-ho.appspot.com",
    messagingSenderId: "808035616011",
    appId: "1:808035616011:web:639c584e6f0819b4a10e0e",
    measurementId: "G-76C8MGTB29"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}
checkForParameters();
function checkForParameters() {
    const usernameParam = getParameterByName('username');
    const passwordParam = getParameterByName('password');

    if (usernameParam && passwordParam) {
        // If parameters exist, populate the form
        document.getElementById('username').value = decodeURIComponent(usernameParam);
        document.getElementById('password').value = decodeURIComponent(passwordParam);
    }
}
function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const currentDomain = window.location.origin;
    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    const loginLink = `${currentDomain}/login?username=${encodedUsername}&password=${encodedPassword}`;
    console.log(loginLink);
    try {
        // Display the loading screen
        document.querySelector('.loader').style.display = 'block';

        const userCredential = await loginUser(username, password);

        alert("Login sucessful!");
        window.location.href = "/";
        // Hide the loading screen after successful login
        document.querySelector('.loader').style.display = 'none';
    } catch (error) {
        console.error('Login failed:', error.message);

        // Hide the loading screen if login fails
        document.querySelector('.loader').style.display = 'none';
        alert("Login Failed! " + error.message)
    }
});