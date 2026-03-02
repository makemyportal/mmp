import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tools, setTools] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    // ─── Realtime Listeners ───
    useEffect(() => {
        const unsubs = [];

        // Clients
        unsubs.push(onSnapshot(collection(db, 'clients'), (snap) => {
            const data = [];
            snap.forEach(d => data.push({ id: d.id, ...d.data() }));
            setClients(data);
        }));

        // Projects
        unsubs.push(onSnapshot(collection(db, 'projects'), (snap) => {
            const data = [];
            snap.forEach(d => data.push({ id: d.id, ...d.data() }));
            setProjects(data);
        }));

        // Tools
        unsubs.push(onSnapshot(collection(db, 'tools'), (snap) => {
            const data = [];
            snap.forEach(d => data.push({ id: d.id, ...d.data() }));
            setTools(data);
        }));

        // Testimonials
        unsubs.push(onSnapshot(collection(db, 'testimonials'), (snap) => {
            const data = [];
            snap.forEach(d => data.push({ id: d.id, ...d.data() }));
            setTestimonials(data);
            setLoading(false);
        }));

        return () => unsubs.forEach(u => u());
    }, []);

    // ─── Clients CRUD ───
    const addClient = async (data) => {
        await addDoc(collection(db, 'clients'), { ...data, createdAt: serverTimestamp() });
    };
    const updateClient = async (id, data) => {
        await updateDoc(doc(db, 'clients', id), data);
    };
    const deleteClient = async (id) => {
        await deleteDoc(doc(db, 'clients', id));
    };

    // ─── Projects CRUD ───
    const addProject = async (data) => {
        await addDoc(collection(db, 'projects'), { ...data, createdAt: serverTimestamp() });
    };
    const updateProject = async (id, data) => {
        await updateDoc(doc(db, 'projects', id), data);
    };
    const deleteProject = async (id) => {
        await deleteDoc(doc(db, 'projects', id));
    };

    // ─── Tools CRUD ───
    const addTool = async (data) => {
        await addDoc(collection(db, 'tools'), { ...data, createdAt: serverTimestamp() });
    };
    const updateTool = async (id, data) => {
        await updateDoc(doc(db, 'tools', id), data);
    };
    const deleteTool = async (id) => {
        await deleteDoc(doc(db, 'tools', id));
    };

    // ─── Testimonials CRUD ───
    const addTestimonial = async (data) => {
        await addDoc(collection(db, 'testimonials'), { ...data, createdAt: serverTimestamp() });
    };
    const updateTestimonial = async (id, data) => {
        await updateDoc(doc(db, 'testimonials', id), data);
    };
    const deleteTestimonial = async (id) => {
        await deleteDoc(doc(db, 'testimonials', id));
    };

    const value = {
        clients, projects, tools, testimonials, loading,
        addClient, updateClient, deleteClient,
        addProject, updateProject, deleteProject,
        addTool, updateTool, deleteTool,
        addTestimonial, updateTestimonial, deleteTestimonial,
    };

    return (
        <PortfolioContext.Provider value={value}>
            {children}
        </PortfolioContext.Provider>
    );
};

