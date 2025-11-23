import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, AlertCircle } from "lucide-react";
import { apiFetch } from "../utils/api";
import Button from "../components/Button";

interface BlogPost {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    created_at: string;
    published: boolean;
}

const AdminBlogDashboard = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        checkAdminAndFetchPosts();
    }, []);

    async function checkAdminAndFetchPosts() {
        try {
            // Check if user is admin
            const userData = await apiFetch("/security/user-info", {}, true);

            if (userData.role !== "admin") {
                navigate("/dashboard");
                return;
            }

            setIsAdmin(true);

            // Fetch all blog posts
            const postsData = await apiFetch("/blog/posts/all", {}, true);
            setPosts(postsData.posts || []);
        } catch (err: any) {
            setError(err.message || "Failed to load blog posts");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(postId: number) {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await apiFetch(`/blog/posts/${postId}`, {
                method: "DELETE",
            }, true);

            setPosts(posts.filter((post) => post.id !== postId));
        } catch (err: any) {
            alert(err.message || "Failed to delete post");
        }
    }

    async function togglePublish(postId: number, currentStatus: boolean) {
        try {
            await apiFetch(`/blog/posts/${postId}/publish`, {
                method: "PUT",
                body: JSON.stringify({ published: !currentStatus }),
            }, true);

            setPosts(
                posts.map((post) =>
                    post.id === postId ? { ...post, published: !currentStatus } : post
                )
            );
        } catch (err: any) {
            alert(err.message || "Failed to update post status");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Blog Administration</h1>
                            <p className="mt-2 text-gray-600">Manage your blog posts</p>
                        </div>
                        <Button
                            onClick={() => navigate("/admin/blog/new")}
                            className="flex items-center bg-blue-600 text-white hover:bg-blue-700"
                        >
                            <Plus size={20} className="mr-2" />
                            New Post
                        </Button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-center">
                        <AlertCircle className="text-red-600 mr-2" size={20} />
                        <span className="text-red-700">{error}</span>
                    </div>
                )}

                {/* Posts List */}
                {posts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-500 text-lg">No blog posts yet.</p>
                        <Button
                            onClick={() => navigate("/admin/blog/new")}
                            className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Create your first post
                        </Button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Post
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Author
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {post.title}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate max-w-md">
                                                {post.excerpt}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{post.author}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => togglePublish(post.id, post.published)}
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${post.published
                                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                    }`}
                                            >
                                                {post.published ? "Published" : "Draft"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => navigate(`/blog/${post.id}`)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
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

export default AdminBlogDashboard;