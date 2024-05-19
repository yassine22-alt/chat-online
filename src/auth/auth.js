import { auth } from '@/firebase/config.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from 'firebase/auth'

const register = async (email, password) => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Registration failed:", error);  }
};

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Registration failed:", error);  }
};

const logout = async () => {
  await auth.signOut();
};

export { register, login, logout };
