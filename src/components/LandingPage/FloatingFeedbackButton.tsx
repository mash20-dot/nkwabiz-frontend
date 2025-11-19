import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowDown } from 'lucide-react';

const FloatingFeedbackButton = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            // Get the feedback section element
            const feedbackSection = document.getElementById('feedback-section');

            if (feedbackSection) {
                const rect = feedbackSection.getBoundingClientRect();
                const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;

                // Hide button when feedback section is in view
                setIsVisible(!isInView);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToFeedback = () => {
        const feedbackSection = document.getElementById('feedback-section');
        if (feedbackSection) {
            feedbackSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToFeedback}
            className="fixed bottom-24 left-6 z-40 group"
            aria-label="Give feedback"
        >
            {/* Animated arrow pointing down */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-bounce">
                <ArrowDown className="w-6 h-6 text-orange-500" />
            </div>

            {/* Pulse rings */}
            <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75"></span>
            <span className="absolute inset-0 rounded-full bg-orange-400 animate-pulse"></span>

            {/* Main button */}
            <div className="relative bg-orange-500 hover:bg-orange-600 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110">
                <MessageSquare className="w-8 h-8 text-white" />
            </div>

            {/* Label tooltip */}
            <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-gray-900 text-white px-4 py-2 rounded-lg whitespace-nowrap text-sm font-semibold shadow-lg">
                    Give us feedback!
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2">
                        <div className="border-8 border-transparent border-r-gray-900"></div>
                    </div>
                </div>
            </div>
        </button>
    );
};

export default FloatingFeedbackButton;