import React, { useState, useRef } from 'react';
import { Upload, Link2, Loader2, ImageIcon, X } from 'lucide-react';
import { uploadImage } from '../../utils/imageUpload';

/**
 * Reusable Image Upload/Link field for admin forms.
 * @param {string} value - Current image URL
 * @param {function} onChange - Callback with new URL
 * @param {string} folder - Cloudinary folder (e.g., 'projects', 'tools')
 * @param {string} label - Field label
 * @param {function} showToast - Toast notification function
 * @param {'cover'|'contain'} previewMode - How to display the preview image
 * @param {string} previewClass - Additional CSS classes for preview
 */
const ImageUploadField = ({ value, onChange, folder = 'general', label = 'Image', showToast, previewMode = 'cover', previewClass = '' }) => {
    const [mode, setMode] = useState('upload');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef(null);

    const handleUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        setProgress(0);
        try {
            const url = await uploadImage(file, folder, (p) => setProgress(p));
            onChange(url);
            if (showToast) showToast('Image uploaded! 📸', 'success');
        } catch (err) {
            if (showToast) showToast(err.message || 'Upload failed', 'error');
        }
        setUploading(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 ml-1">{label}</label>

            {/* Upload / Link Toggle */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
                <button type="button" onClick={() => setMode('upload')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mode === 'upload' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Upload className="w-3.5 h-3.5" /> Upload
                </button>
                <button type="button" onClick={() => setMode('link')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mode === 'link' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Link2 className="w-3.5 h-3.5" /> Link
                </button>
            </div>

            {mode === 'upload' ? (
                <div
                    onClick={() => !uploading && fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragOver ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'} ${uploading ? 'pointer-events-none opacity-70' : ''}`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                            <p className="text-sm font-medium text-gray-600">Uploading... {progress}%</p>
                            <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-brand-primary to-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-brand-primary" />
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Click to upload or drag & drop</p>
                            <p className="text-xs text-gray-400">JPG, PNG, WebP — Max 5MB</p>
                        </div>
                    )}
                    <input type="file" ref={fileRef} onChange={(e) => { if (e.target.files[0]) handleUpload(e.target.files[0]); }} accept="image/*" className="hidden" />
                </div>
            ) : (
                <input type="url" value={value || ''} onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-brand-primary transition-colors text-sm" placeholder="https://example.com/image.jpg" />
            )}

            {/* Preview */}
            {value && (
                <div className={`relative group mt-2 inline-block ${previewClass}`}>
                    <img src={value} alt="Preview"
                        className={`rounded-xl border border-gray-200 ${previewMode === 'contain' ? 'w-16 h-16 object-contain p-2 bg-white' : 'w-full h-28 object-cover'}`}
                        onError={e => e.target.style.display = 'none'} />
                    <button type="button" onClick={() => onChange('')}
                        className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                        <X className="w-2.5 h-2.5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUploadField;
