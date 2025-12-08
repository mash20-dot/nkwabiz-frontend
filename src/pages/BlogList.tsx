import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, User, ArrowRight, Image as ImageIcon } from "lucide-react";
import { apiFetch } from "../utils/api";

interface BlogPost {
    id: number;
    topic: string;
    excerpt: string;
    author: string;
    image?: string;
    created_at: string;
}

const BlogList = () => {

    const navigate = useNavigate();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            const data = await apiFetch("/blog/posts");
            console.log("=== BLOG LIST DEBUG ===");
            console.log("Full API response:", data);
            console.log("Posts array:", data.posts);
            if (data.posts && data.posts.length > 0) {
                console.log("First post:", data.posts[0]);
                console.log("First post topic:", data.posts[0].topic);
                console.log("First post image:", data.posts[0].image);
            }
            console.log("======================");
            setPosts(data.posts || []);
        } catch (err: any) {
            setError(err.message || "Failed to load blog posts");
        } finally {
            setLoading(false);
        }
    }


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-gray-600">Loading blog posts...</p>
                </div>
            </div>
        );
    }




    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        NkwaBiz Blog
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Tips, insights, and guides for managing your business better
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <span className="text-red-700">{error}</span>
                    </div>
                )}

                {/* No Posts */}
                {!loading && posts.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-500 text-lg">No blog posts available yet.</p>
                    </div>
                )}

                {/* Posts Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => {
                        // Fix Imgur URLs
                        let imageUrl = post.image;
                        if (imageUrl && imageUrl.includes('imgur.com/') && !imageUrl.includes('i.imgur.com')) {
                            const imgurId = imageUrl.split('imgur.com/')[1].split(/[?#.]/)[0];
                            imageUrl = `https://i.imgur.com/${imgurId}.jpg`;
                        }


                        return (
                            <article
                                key={post.id}
                                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigate(`/blog/${post.id}`)}
                            >
                                {/* Featured Image */}
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    {imageUrl && imageUrl.trim() !== "" ? (
                                        <img
                                            src={imageUrl}
                                            alt={post.topic || "Blog post image"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const parent = e.currentTarget.parentElement;
                                                if (parent) {
                                                    parent.innerHTML = `
                                                        <div class="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
                                                            <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <p class="text-xs text-gray-500 text-center">Image failed to load</p>
                                                        </div>
                                                    `;
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon size={48} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Topic */}
                                    <h2
                                        className="text-xl font-semibold text-gray-900 mb-2"
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            minHeight: '3.5rem'
                                        }}
                                    >
                                        {post.topic || "No Topic"}
                                    </h2>


                                    {/* Excerpt */}
                                    <p
                                        className="text-gray-600 mb-4"
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {post.excerpt || "No description available."}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap gap-4">
                                        <div className="flex items-center">
                                            <User size={16} className="mr-1" />
                                            <span>{post.author || "Anonymous"}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar size={16} className="mr-1" />
                                            <span>
                                                {post.created_at
                                                    ? new Date(post.created_at).toLocaleDateString()
                                                    : "No date"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Read More Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/blog/${post.id}`);
                                        }}
                                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Read more
                                        <ArrowRight size={16} className="ml-1" />
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

function Spinner() {
    return (
        <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" viewBox="0 0 24 24">
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
            />
        </svg>
    );
}

export default BlogList;