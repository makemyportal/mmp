import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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

    const value = {
        currentUser,
        userData,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
