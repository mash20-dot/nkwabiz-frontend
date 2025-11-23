import { useEffect, useState } from 'react';
import { Share, X } from 'lucide-react';

export default function AddToHomeScreenPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
    const [showIOSPrompt, setShowIOSPrompt] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return; // Already installed, don't show prompt
        }

        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;

        // Show iOS prompt if on iOS Safari and not installed
        if (isIOS && !isInStandaloneMode) {
            // Check if user has dismissed the prompt before
            const iosDismissed = localStorage.getItem('ios-pwa-prompt-dismissed');
            if (!iosDismissed) {
                // Show after 2 seconds delay
                setTimeout(() => setShowIOSPrompt(true), 2000);
            }
        }

        // Android/Chrome beforeinstallprompt event
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowAndroidPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleAndroidAdd = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {
                setShowAndroidPrompt(false);
                setDeferredPrompt(null);
            });
        }
    };

    const handleIOSDismiss = () => {
        setShowIOSPrompt(false);
        localStorage.setItem('ios-pwa-prompt-dismissed', 'true');
    };

    // Android/Chrome Prompt
    if (showAndroidPrompt) {
        return (
            <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg shadow-2xl z-50 animate-slide-up">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">Install Nkwabiz</h3>
                        <p className="text-sm text-blue-100">Add to your home screen for quick access</p>
                    </div>
                    <button
                        onClick={() => setShowAndroidPrompt(false)}
                        className="ml-2 text-blue-100 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>
                <button
                    onClick={handleAndroidAdd}
                    className="mt-3 w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-md hover:bg-blue-50 transition-colors"
                >
                    Install App
                </button>
            </div>
        );
    }

    // iOS Safari Prompt
    if (showIOSPrompt) {
        return (
            <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg shadow-2xl z-50 animate-slide-up">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">Install Nkwabiz</h3>
                        <p className="text-sm text-blue-100">Add to your home screen for the best experience</p>
                    </div>
                    <button
                        onClick={handleIOSDismiss}
                        className="ml-2 text-blue-100 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 text-sm">
                        <span className="text-blue-100">1. Tap the</span>
                        <div className="flex items-center bg-white/20 px-2 py-1 rounded">
                            <Share size={16} />
                        </div>
                        <span className="text-blue-100">Share button</span>
                    </div>
                    <div className="mt-2 text-sm text-blue-100">
                        2. Scroll and tap <strong>"Add to Home Screen"</strong>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

// Define the BeforeInstallPromptEvent type
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}