/**
 * Upload an image file to Cloudinary and return the URL.
 * @param {File} file - The image file to upload
 * @param {string} folder - Cloudinary folder name (e.g., 'projects', 'tools')
 * @param {function} onProgress - Optional callback with progress percentage (0-100)
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadImage = (file, folder = 'general', onProgress) => {
    return new Promise((resolve, reject) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            reject(new Error('Please select a valid image file (JPG, PNG, WebP, etc.)'));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            reject(new Error('Image must be under 5MB'));
            return;
        }

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        console.log('Cloud Name:', cloudName);
        console.log('Upload Preset:', uploadPreset);

        if (!cloudName || !uploadPreset) {
            reject(new Error('Cloudinary configuration missing'));
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', `makemyportal/${folder}`);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

        // Track upload progress
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                const progress = Math.round((e.loaded / e.total) * 100);
                onProgress(progress);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                resolve(response.secure_url);
            } else {
                console.error('Cloudinary upload failed:', xhr.responseText);
                reject(new Error('Failed to upload image. Please try again.'));
            }
        };

        xhr.onerror = () => {
            reject(new Error('Network error. Please check your connection and try again.'));
        };

        xhr.send(formData);
    });
};
