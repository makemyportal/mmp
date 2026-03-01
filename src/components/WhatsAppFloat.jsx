import React, { useState } from 'react';
import { X } from 'lucide-react';

const WhatsAppFloat = () => {
    const [open, setOpen] = useState(false);

    const numbers = [
        { name: 'Sales & Enquiry', number: '918077162909' },
        { name: 'Support & Booking', number: '917017978807' },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Popup */}
            {open && (
                <div className="absolute bottom-16 right-0 bg-dark-800 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-4 w-72 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-heading font-semibold text-sm">Book on WhatsApp</h3>
                        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-gray-400 text-xs mb-3">Tap a number below to start a chat:</p>
                    <div className="space-y-2">
                        {numbers.map((item) => (
                            <a
                                key={item.number}
                                href={`https://wa.me/${item.number}?text=Hi%20MakeMyPortal!%20I%20want%20to%20book%20a%20service.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-green-600/10 border border-green-500/20 rounded-xl px-4 py-3 hover:bg-green-600/20 transition-all group"
                            >
                                <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold text-sm">{item.name[0]}</span>
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium">{item.name}</p>
                                    <p className="text-gray-400 text-xs">{item.number.slice(2)}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Float Button */}
            <button
                onClick={() => setOpen(!open)}
                className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center shadow-lg shadow-green-600/30 hover:shadow-green-600/50 transition-all duration-300 hover:scale-110"
                aria-label="WhatsApp"
            >
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </button>
        </div>
    );
};

export default WhatsAppFloat;
