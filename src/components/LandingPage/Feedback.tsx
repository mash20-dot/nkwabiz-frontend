import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle, Mail, User } from 'lucide-react';

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        feedbackType: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('https://formspree.io/f/mjklgqed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    'feedback-type': formData.feedbackType,
                    message: formData.message
                })
            });

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({
                    name: '',
                    email: '',
                    feedbackType: '',
                    message: ''
                });

                setTimeout(() => {
                    setIsSubmitted(false);
                }, 5000);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div id="feedback-section" className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            <span className="text-blue-600 font-semibold text-sm">We Value Your Opinion</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                            Share Your Feedback
                        </h2>
                        <p className="text-xl text-gray-600">
                            Help us improve NkwaBiz! Tell us what you think, suggest features, or report any issues you've encountered.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {isSubmitted ? (
                            // Success Message
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Thank You!
                                </h3>
                                <p className="text-gray-600 text-lg">
                                    Your feedback has been received. We'll review it and get back to you if needed.
                                </p>
                            </div>
                        ) : (
                            // Feedback Form
                            <div className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Your Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Feedback Type */}
                                <div>
                                    <label htmlFor="feedbackType" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Feedback Type
                                    </label>
                                    <select
                                        id="feedbackType"
                                        name="feedbackType"
                                        value={formData.feedbackType}
                                        onChange={handleChange}
                                        required
                                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="">Select a type...</option>
                                        <option value="general">General Feedback</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="bug">Bug Report</option>
                                        <option value="suggestion">Suggestion</option>
                                        <option value="compliment">Compliment</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Your Feedback
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                        placeholder="Tell us what's on your mind..."
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Feedback
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Privacy Note */}
                                <p className="text-sm text-gray-500 text-center">
                                    We respect your privacy. Your information will only be used to respond to your feedback.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            You can also reach us directly at{' '}
                            <a href="mailto:support@nkwabiz.com" className="text-blue-600 hover:text-blue-700 font-semibold">
                                support@nkwabiz.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;