import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
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
        const loadSettings = async () => {
            // Try Firestore first
            try {
                const snap = await getDoc(doc(db, 'settings', 'website'));
                if (snap.exists()) {
                    setSettings(prev => ({ ...prev, ...snap.data() }));
                    return;
                }
            } catch (err) {
                console.warn('Firestore settings load failed:', err);
            }
            // Fallback: localStorage
            try {
                const local = localStorage.getItem('makemyportal_settings');
                if (local) setSettings(prev => ({ ...prev, ...JSON.parse(local) }));
            } catch (_) { }
        };
        loadSettings();

        // Listen for localStorage changes from admin panel (same tab)
        const handleStorage = () => {
            try {
                const local = localStorage.getItem('makemyportal_settings');
                if (local) setSettings(prev => ({ ...prev, ...JSON.parse(local) }));
            } catch (_) { }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
