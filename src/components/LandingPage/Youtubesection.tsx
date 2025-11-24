import React, { useState } from 'react';
import { Play, Youtube, ExternalLink } from 'lucide-react';

const YouTubeSection = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const channelUrl = "https://www.youtube.com/@nkwabiz";
    const videoId = "7ye9Q_2v1PA"; // Extracted from the URL

    const videos = [
        {
            id: videoId,
            title: "Getting Started with NkwaBiz - Complete Tutorial for New Users",
            description: "Learn how to set up and use NkwaBiz to manage your business inventory, track sales, and grow your business. Perfect for beginners!",
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        }
    ];

    return (
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-16 sm:py-24 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                        <Youtube className="w-6 h-6 text-red-500" />
                        <span className="text-white font-semibold">Video Tutorial</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                        How to Get Started
                        <br />
                        <span className="text-yellow-300">with NkwaBiz</span>
                    </h2>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Watch our step-by-step tutorial and start managing your business like a pro in minutes
                    </p>
                </div>

                {/* Featured Video */}
                <div className="max-w-5xl mx-auto">
                    {videos.map((video) => (
                        <div key={video.id} className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300">
                            {/* Video Player */}
                            <div className="relative aspect-video bg-black group">
                                {!isPlaying ? (
                                    <>
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                                            <button
                                                onClick={() => setIsPlaying(true)}
                                                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-6 transform group-hover:scale-110 transition-all duration-300 shadow-2xl"
                                            >
                                                <Play className="w-16 h-16 fill-white" />
                                            </button>
                                        </div>
                                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                            <Play className="w-4 h-4 fill-white" />
                                            Tutorial
                                        </div>
                                    </>
                                ) : (
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </div>

                            {/* Video Info */}
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {video.title}
                                </h3>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    {video.description}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4">
                                    <a
                                        href={`https://www.youtube.com/shorts/${video.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        Watch on YouTube
                                    </a>

                                    <a
                                        href={channelUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <Youtube className="w-5 h-5" />
                                        Subscribe to Our Channel
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coming Soon Section (for when you add more videos) */}
                <div className="mt-12 text-center">
                    <p className="text-gray-400 text-lg">
                        More tutorials coming soon! Subscribe to stay updated.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default YouTubeSection;