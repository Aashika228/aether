// src/firebaseConfig.js
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// You can find this in your Firebase project settings (Project Overview -> Settings icon -> Project settings -> Your apps -> Web app)
const firebaseConfig = {
  apiKey: "AIzaSyCDQFaOzKJ-9s_nfNFGFabZ0rI_IgM_vvo",
  authDomain: "login-a7415.firebaseapp.com",
  projectId: "login-a7415",
  storageBucket: "login-a7415.appspot.com",
  messagingSenderId: "978859366763",
  appId: "1:978859366763:android:f0ab1c4ee52b4b26ec542e"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
