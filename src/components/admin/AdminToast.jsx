import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
};

const colors = {
    success: 'border-emerald-500/30 bg-emerald-500/5',
    error: 'border-red-500/30 bg-red-500/5',
    info: 'border-blue-500/30 bg-blue-500/5',
};

const AdminToast = ({ toasts, removeToast }) => (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
        <AnimatePresence>
            {toasts.map(t => (
                <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 30, x: 30 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-xl shadow-2xl min-w-[300px] max-w-md ${colors[t.type] || colors.info}`}
                >
                    {icons[t.type] || icons.info}
                    <span className="text-sm font-medium text-white flex-1">{t.message}</span>
                    <button onClick={() => removeToast(t.id)} className="text-gray-400 hover:text-white shrink-0">
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
);

export default AdminToast;
