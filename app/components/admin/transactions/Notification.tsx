import { X } from 'lucide-react';

interface NotificationProps {
    message: { text: string; type: 'success' | 'error' };
    onClose: () => void;
}

export default function Notification({ message, onClose }: NotificationProps) {
    return (
        <div className={`p-4 mb-6 rounded-xl flex justify-between items-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
            <span>{message.text}</span>
            <button onClick={onClose}><X className="w-4 h-4" /></button>
        </div>
    );
}