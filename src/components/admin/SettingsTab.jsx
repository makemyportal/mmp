import React, { useState } from 'react';
import { LogOut, Globe, Phone, Mail, MapPin, Save, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const InputField = ({ label, icon: Icon, value, onChange, type = 'text', placeholder }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-600 ml-1 flex items-center gap-2">
            {Icon && <Icon className="w-3.5 h-3.5 text-gray-500" />} {label}
        </label>
        <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all" />
    </div>
);

const SettingsTab = ({ showToast, siteSettings, setSiteSettings }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const { setSettings: setGlobalSettings } = useSettings();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [localSettings, setLocalSettings] = useState(siteSettings);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Try Firestore first
            await setDoc(doc(db, 'settings', 'website'), localSettings, { merge: true });
            setSiteSettings(localSettings);
            setGlobalSettings(prev => ({ ...prev, ...localSettings }));
            localStorage.setItem('makemyportal_settings', JSON.stringify(localSettings));
            showToast('Settings saved successfully!', 'success');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.warn('Firestore save failed, saving to localStorage:', err);
            localStorage.setItem('makemyportal_settings', JSON.stringify(localSettings));
            setSiteSettings(localSettings);
            setGlobalSettings(prev => ({ ...prev, ...localSettings }));
            showToast('Saved locally (update Firestore rules for cloud save)', 'info');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        setSaving(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (e) {
            console.error("Logout failed:", e);
        }
    };

    const update = (key, value) => setLocalSettings(prev => ({ ...prev, [key]: value }));

    return (
        <div className="space-y-8 max-w-3xl">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900 font-heading">Settings</h2>
                {saved && <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Saved!</span>}
            </div>

            {/* Business Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Business Name" icon={Globe} value={localSettings.businessName} onChange={v => update('businessName', v)} placeholder="MakeMyPortal" />
                    <InputField label="Tagline" icon={ExternalLink} value={localSettings.tagline} onChange={v => update('tagline', v)} placeholder="Premium Digital Solutions" />
                    <InputField label="Contact Email" icon={Mail} value={localSettings.contactEmail} onChange={v => update('contactEmail', v)} placeholder="hello@makemyportal.in" />
                    <InputField label="Phone" icon={Phone} value={localSettings.phone} onChange={v => update('phone', v)} placeholder="+91 98765 43210" />
                    <InputField label="Address" icon={MapPin} value={localSettings.address} onChange={v => update('address', v)} placeholder="Mumbai, India" />
                    <InputField label="WhatsApp Number" icon={Phone} value={localSettings.whatsapp} onChange={v => update('whatsapp', v)} placeholder="919876543210" />
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Instagram" value={localSettings.instagram} onChange={v => update('instagram', v)} placeholder="https://instagram.com/yourpage" />
                    <InputField label="Facebook" value={localSettings.facebook} onChange={v => update('facebook', v)} placeholder="https://facebook.com/yourpage" />
                    <InputField label="LinkedIn" value={localSettings.linkedin} onChange={v => update('linkedin', v)} placeholder="https://linkedin.com/yourpage" />
                    <InputField label="YouTube" value={localSettings.youtube} onChange={v => update('youtube', v)} placeholder="https://youtube.com/yourpage" />
                </div>
            </div>

            {/* Preferences */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Preferences</h3>
                {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Get notified for new orders via email' },
                    { key: 'soundAlerts', label: 'Sound Alerts', desc: 'Play sound on new notifications' },
                    { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Show maintenance page to visitors' },
                ].map(pref => (
                    <div key={pref.key} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                        <div>
                            <p className="text-sm font-bold text-gray-900">{pref.label}</p>
                            <p className="text-xs text-gray-500">{pref.desc}</p>
                        </div>
                        <button onClick={() => update(pref.key, !localSettings[pref.key])}
                            className={`w-12 h-7 rounded-full relative transition-all ${localSettings[pref.key] ? 'bg-brand-primary' : 'bg-gray-700'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${localSettings[pref.key] ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
                <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 text-gray-900 font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-xl shadow-brand-primary/20">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save All Settings'}
                </button>
                <button onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>
        </div>
    );
};

export default SettingsTab;
