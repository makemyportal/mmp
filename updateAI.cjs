const fs = require('fs');

let widgetContent = fs.readFileSync('src/components/AIAssistantWidget.jsx', 'utf8');

// Replace Aura AI with Nova AI
widgetContent = widgetContent.replace(/Aura AI/g, 'Nova AI');
widgetContent = widgetContent.replace(/Aura Concierge/g, 'Nova AI');

// Replace Sparkles with Atom
widgetContent = widgetContent.replace(/Sparkles/g, 'Atom');

fs.writeFileSync('src/components/AIAssistantWidget.jsx', widgetContent);

console.log('Done replacing AI names and icons');
