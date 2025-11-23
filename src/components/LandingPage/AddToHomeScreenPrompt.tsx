import { useEffect, useState } from 'react';
import { Share, X, Smartphone } from 'lucide-react';

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
            const dismissedTime = localStorage.getItem('ios-pwa-prompt-dismissed-time');

            // Show prompt again after 7 days
            const sevenDays = 7 * 24 * 60 * 60 * 1000;
            const shouldShowAgain = dismissedTime && (Date.now() - parseInt(dismissedTime)) > sevenDays;

            if (!iosDismissed || shouldShowAgain) {
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
        localStorage.setItem('ios-pwa-prompt-dismissed-time', Date.now().toString());
    };

    // Android/Chrome Prompt
    if (showAndroidPrompt) {
        return (
            <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg shadow-2xl z-50 animate-slide-up">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">Install Nkwabiz App</h3>
                        <p className="text-sm text-blue-100">Get the full app experience on your device</p>
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

    // iOS Safari Prompt - More app-focused messaging
    if (showIOSPrompt) {
        return (
            <div className="fixed bottom-20 left-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 rounded-xl shadow-2xl z-50 animate-slide-up">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Smartphone size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">Install Nkwabiz App</h3>
                            <p className="text-sm text-blue-100">
                                Experience the full power of Nkwabiz as a native app
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleIOSDismiss}
                        className="ml-2 text-blue-100 hover:text-white flex-shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4">
                    <p className="text-white font-semibold text-sm mb-3">Quick Install Guide:</p>

                    <div className="space-y-3">
                        {/* Step 1 */}
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                1
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-white">Tap the</span>
                                    <div className="flex items-center bg-white/30 px-2 py-1 rounded border border-white/20">
                                        <Share size={14} className="text-white" />
                                    </div>
                                    <span className="text-sm text-white font-semibold">Share</span>
                                    <span className="text-sm text-white">button below</span>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                2
                            </div>
                            <div className="flex-1">
                                <span className="text-sm text-white">
                                    Scroll down and tap <span className="font-bold">"Add to Home Screen"</span>
                                </span>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                3
                            </div>
                            <div className="flex-1">
                                <span className="text-sm text-white">
                                    Tap <span className="font-bold">"Add"</span> to install the app
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20">
                    <div className="flex items-center space-x-2 text-xs text-blue-100">
                        <span>✓</span>
                        <span>Works offline</span>
                        <span>•</span>
                        <span>✓</span>
                        <span>Faster performance</span>
                        <span>•</span>
                        <span>✓</span>
                        <span>Native app feel</span>
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