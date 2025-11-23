import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { apiFetch } from "../utils/api";
import Button from "../components/Button";

const AdminBlogEditor = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const isEditMode = !!postId;

    const [form, setForm] = useState({
        title: "",
        content: "",
        excerpt: "",
        image: "",
        published: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        checkAdminAndLoadPost();
    }, [postId]);

    async function checkAdminAndLoadPost() {
        try {
            // Check if user is admin
            const userData = await apiFetch("/security/user-info", {}, true);

            if (userData.role !== "admin") {
                navigate("/dashboard");
                return;
            }

            setIsAdmin(true);

            // Load existing post if in edit mode
            if (isEditMode) {
                const postData = await apiFetch(`/blog/posts/${postId}`, {}, true);
                setForm({
                    title: postData.title,
                    content: postData.content,
                    excerpt: postData.excerpt,
                    image: postData.image || "",
                    published: postData.published,
                });
            }
        } catch (err: any) {
            setError(err.message || "Failed to load post");
        } finally {
            setInitialLoading(false);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError("");
    }

    function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, published: e.target.checked });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (form.title.trim().length < 5) {
            setError("Title must be at least 5 characters long");
            return;
        }

        if (form.content.trim().length < 50) {
            setError("Content must be at least 50 characters long");
            return;
        }

        if (form.excerpt.trim().length < 20) {
            setError("Excerpt must be at least 20 characters long");
            return;
        }

        // Validate image URL if provided
        if (form.image.trim() && !isValidUrl(form.image.trim())) {
            setError("Please enter a valid image URL");
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (isEditMode) {
                await apiFetch(`/blog/posts/${postId}`, {
                    method: "PUT",
                    body: JSON.stringify(form),
                }, true);
            } else {
                await apiFetch("/blog/posts", {
                    method: "POST",
                    body: JSON.stringify(form),
                }, true);
            }

            navigate("/admin/blog");
        } catch (err: any) {
            setError(err.message || "Failed to save post");
        } finally {
            setLoading(false);
        }
    }

    function isValidUrl(string: string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    if (initialLoading) {
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
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/admin/blog")}
                        className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Blog Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEditMode ? "Edit Post" : "Create New Post"}
                    </h1>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title *
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                placeholder="Enter post title"
                                value={form.title}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Featured Image URL (optional)
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <ImageIcon size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="image"
                                    name="image"
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={form.image}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Enter the full URL of an image (e.g., from Imgur, Cloudinary, or direct link)
                            </p>

                            {/* Image Preview */}
                            {form.image && isValidUrl(form.image) && (
                                <div className="mt-3">
                                    <p className="text-xs font-medium text-gray-700 mb-2">Preview:</p>
                                    <img
                                        src={form.image}
                                        alt="Preview"
                                        className="max-w-full h-48 object-cover rounded-md border border-gray-300"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                                Excerpt (Short Summary) *
                            </label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                rows={2}
                                required
                                placeholder="Brief summary of the post (shown in previews)"
                                value={form.excerpt}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                {form.excerpt.length} characters (minimum 20)
                            </p>
                        </div>

                        {/* Content */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                Content *
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                rows={15}
                                required
                                placeholder="Write your blog post content here..."
                                value={form.content}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                {form.content.length} characters (minimum 50)
                            </p>
                        </div>

                        {/* Published Checkbox */}
                        <div className="flex items-center">
                            <input
                                id="published"
                                name="published"
                                type="checkbox"
                                checked={form.published}
                                onChange={handleCheckbox}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                                Publish immediately (uncheck to save as draft)
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                onClick={() => navigate("/admin/blog")}
                                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex items-center bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <Save size={18} className="mr-2" />
                                        {isEditMode ? "Update Post" : "Create Post"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

function Spinner() {
    return (
        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
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

export default AdminBlogEditor;