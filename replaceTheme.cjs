const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Background replacements
    content = content.replace(/bg-dark-900([^\/])/g, 'bg-white$1');
    content = content.replace(/bg-dark-900\/(\d+)/g, 'bg-white/$1');

    content = content.replace(/bg-dark-800([^\/])/g, 'bg-gray-50$1');
    content = content.replace(/bg-dark-800\/(\d+)/g, 'bg-gray-50/$1');

    content = content.replace(/bg-dark-700([^\/])/g, 'bg-gray-100$1');
    content = content.replace(/bg-dark-700\/(\d+)/g, 'bg-gray-100/$1');
    content = content.replace(/bg-dark-900/g, 'bg-white');
    content = content.replace(/bg-dark-800/g, 'bg-gray-50');

    // Gradient replacements
    content = content.replace(/from-dark-900/g, 'from-white');
    content = content.replace(/to-dark-900/g, 'to-white');
    content = content.replace(/via-dark-900/g, 'via-white');

    content = content.replace(/from-dark-800/g, 'from-gray-50');
    content = content.replace(/to-dark-800/g, 'to-gray-50');
    content = content.replace(/via-dark-800/g, 'via-gray-50');

    // Border replacements
    content = content.replace(/border-white\/[0-9]+/g, 'border-gray-200');
    content = content.replace(/border-white/g, 'border-gray-200');

    // Text colors
    content = content.replace(/text-gray-400/g, 'text-gray-500');
    content = content.replace(/text-gray-300/g, 'text-gray-600');
    content = content.replace(/text-white/g, 'text-gray-900');

    // Restore true text-white cases
    content = content.replace(/bg-brand-primary text-gray-900/g, 'bg-brand-primary text-white');
    content = content.replace(/bg-brand-secondary text-gray-900/g, 'bg-brand-secondary text-white');
    content = content.replace(/from-brand-primary to-brand-secondary text-gray-900/g, 'from-brand-primary to-brand-secondary text-white');
    content = content.replace(/bg-emerald-500 text-gray-900/g, 'bg-emerald-500 text-white');
    content = content.replace(/bg-red-500 text-gray-900/g, 'bg-red-500 text-white');
    content = content.replace(/text-gray-900 px-5/g, 'text-white px-5'); // common button

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

walkDir(path.join(__dirname, 'src'), processFile);
console.log('Theme replacement complete.');
