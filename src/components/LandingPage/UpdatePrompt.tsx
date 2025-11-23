import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function UpdatePrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        // Check if service worker is supported
        if ('serviceWorker' in navigator) {
            // Listen for service worker updates
            navigator.serviceWorker.ready.then((reg) => {
                setRegistration(reg);

                // Check for updates every 60 seconds
                setInterval(() => {
                    reg.update();
                }, 60000);

                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;

                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker is installed but waiting
                                setShowPrompt(true);
                            }
                        });
                    }
                });
            });

            // Listen for controller change (when new SW takes over)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });
        }
    }, []);

    const handleUpdate = () => {
        if (registration && registration.waiting) {
            // Tell the waiting service worker to skip waiting
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    };

    const handleClose = () => {
        setShowPrompt(false);
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-2xl z-50 max-w-sm w-full mx-4 animate-slide-down">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <RefreshCw className="mt-0.5 flex-shrink-0" size={20} />
                    <div>
                        <h3 className="font-semibold text-sm">New Version Available!</h3>
                        <p className="text-xs text-blue-100 mt-1">
                            Update now to get the latest features and improvements
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex space-x-2 mt-3">
                <button
                    onClick={handleUpdate}
                    className="flex-1 bg-white text-blue-600 font-semibold py-2 px-4 rounded-md text-sm hover:bg-blue-50 transition-colors"
                >
                    Update Now
                </button>
                <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm text-blue-100 hover:text-white transition-colors"
                >
                    Later
                </button>
            </div>
        </div>
    );
}