import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

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
const loader =  document.querySelector('.loader');
// Get the element with the id "edit-btn"
const editBtn = document.getElementById('edit-btn');
loader.style.display = 'block';
// Check if the user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        
        loader.style.display = 'none';
    } else {
        // User is not logged in, destroy the "edit-btn"
        console.log('User is not logged in');
        if(editBtn != null){
            editBtn.parentNode.removeChild(editBtn);
        }else
        {
            window.location.href = "/";
        }
        loader.style.display = 'none';
    }
});