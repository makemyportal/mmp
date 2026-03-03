import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // We are not throwing an error here if the config is empty so the UI can still render
    // while we wait for the user to provide their own keys.

    useEffect(() => {
        try {
            const unsubscribe = onAuthStateChanged(auth, async user => {
                setCurrentUser(user);
                if (user) {
                    try {
                        const userDoc = await getDoc(doc(db, 'users', user.uid));
                        if (userDoc.exists()) {
                            setUserData(userDoc.data());
                        } else {
                            setUserData({ role: 'customer' });
                        }
                    } catch (err) {
                        console.error("Error fetching user data:", err);
                        setUserData({ role: 'customer' });
                    }
                } else {
                    setUserData(null);
                }
                setLoading(false);
            });
            return unsubscribe;
        } catch (_e) {
            // Firebase not configured yet
            setCurrentUser(null);
            setUserData(null);
            setLoading(false);
        }
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const googleLogin = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        // Create user doc if doesn't exist
        const userRef = doc(db, 'users', result.user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                name: result.user.displayName || '',
                email: result.user.email,
                role: 'customer',
                createdAt: serverTimestamp()
            });
        }
        return result;
    };

    const refreshUserData = async () => {
        if (currentUser) {
            try {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } catch (err) {
                console.error("Error refreshing user data:", err);
            }
        }
    };

    const value = {
        currentUser,
        userData,
        login,
        signup,
        logout,
        googleLogin,
        refreshUserData
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
