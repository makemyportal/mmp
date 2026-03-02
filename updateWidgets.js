const fs = require('fs');

let widgetContent = fs.readFileSync('src/components/AIAssistantWidget.jsx', 'utf8');

widgetContent = widgetContent.replace(/fixed bottom-6 left-6/g, 'fixed bottom-[84px] md:bottom-6 left-4 md:left-6');
widgetContent = widgetContent.replace(/AI Concierge/g, 'Aura AI');
widgetContent = widgetContent.replace(/<Bot /g, '<Sparkles ');

fs.writeFileSync('src/components/AIAssistantWidget.jsx', widgetContent);

let floatContent = fs.readFileSync('src/components/WhatsAppFloat.jsx', 'utf8');
floatContent = floatContent.replace(/fixed bottom-6 right-6/g, 'fixed bottom-[84px] md:bottom-6 right-4 md:right-6');
fs.writeFileSync('src/components/WhatsAppFloat.jsx', floatContent);

console.log('Done positioning and text updates');
