import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

const defaultSettings = {
    businessName: 'MakeMyPortal',
    tagline: 'Premium Digital Solutions',
    phone: '',
    contactEmail: '',
    address: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(defaultSettings);

    useEffect(() => {
        // Realtime listener on Firestore settings document
        const unsubscribe = onSnapshot(doc(db, 'settings', 'website'), (snap) => {
            if (snap.exists()) {
                setSettings(prev => ({ ...prev, ...snap.data() }));
            }
        }, (err) => {
            console.warn('Firestore settings listener error:', err);
        });

        return () => unsubscribe();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
