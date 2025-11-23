import { useEffect, useState } from 'react';

export default function AddToHomeScreenPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleAdd = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {
                setVisible(false);
                setDeferredPrompt(null);
            });
        }
    };

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                right: '20px',
                background: '#333',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '8px',
                textAlign: 'center',
                zIndex: 1000,
            }}
        >
            <span>Add Nkwabiz to your home screen?</span>
            <button
                style={{
                    marginLeft: '10px',
                    background: '#fff',
                    color: '#333',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
                onClick={handleAdd}
            >
                Add
            </button>
        </div>
    );
}

// Define the BeforeInstallPromptEvent type if not in your TS setup
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}
