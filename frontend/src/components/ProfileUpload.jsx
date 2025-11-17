import { useState } from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';

const ProfileUpload = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadedUser, setUploadedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const API_URL = 'https://profile-upload-app.onrender.com/api';


    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {

            if (file.size > 5 * 1024 * 1024) {
                setError('File size should be less than 5MB');
                return;
            }

            // file types
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setError('Only image files are allowed (jpeg, jpg, png, gif, webp)');
                return;
            }

            setSelectedFile(file);
            setError('');

            // preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // delete selected image
    const handleDeleteImage = () => {
        setSelectedFile(null);
        setPreview(null);
        setError('');

        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';
    };

    // edit image
    const handleEditImage = () => {
        const fileInput = document.getElementById('file-upload');
        if (fileInput) {
            fileInput.click();
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.email || !selectedFile) {
            setError('Please fill all fields and select an image');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email');
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('profilePicture', selectedFile);

            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Upload failed');
            }

            setSuccess('Profile picture uploaded successfully!');
            setUploadedUser(result.user);
            setFormData({ name: '', email: '' });
            setSelectedFile(null);
            setPreview(null);

            const fileInput = document.getElementById('file-upload');
            if (fileInput) fileInput.value = '';

            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to upload profile picture');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Profile Picture Upload
                    </h1>
                    <p className="text-gray-600">Upload your profile picture and create your account</p>
                </div>

                {/* Changed from grid to flex */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column - Upload Form */}
                    <div className="flex-1 bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Details</h2>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Picture
                                </label>

                                {!preview ? (
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition duration-200 bg-gray-50 hover:bg-blue-50"
                                        >
                                            <div className="text-center">
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <p className="mt-2 text-sm text-gray-600">
                                                    Click to upload image
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                            </div>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                            id="file-upload"
                                        />

                                        <div className="flex justify-center">
                                            <div className="relative group">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 rounded-full transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                                                    <button
                                                        type="button"
                                                        onClick={handleEditImage}
                                                        className="bg-white text-blue-600 p-2.5 rounded-full shadow-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-110"
                                                        title="Change image"
                                                    >
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleDeleteImage}
                                                        className="bg-white text-red-600 p-2.5 rounded-full shadow-lg hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                                                        title="Remove image"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 truncate px-4">
                                                {selectedFile?.name}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                                    <X className="w-5 h-5 mt-0.5" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2">
                                    <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm">{success}</span>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin h-5 w-5 mr-3"
                                            viewBox="0 0 24 24"
                                        >
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
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Uploading...
                                    </span>
                                ) : (
                                    'Upload Profile Picture'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Profile Preview */}
                    <div className="flex-1 bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Preview</h2>

                        {uploadedUser ? (
                            <div className="space-y-6">
                                <div className="flex justify-center">
                                    <img
                                        src={uploadedUser.profilePicture}
                                        alt={uploadedUser.name}
                                        className="w-48 h-48 rounded-full object-cover border-4 border-blue-500 shadow-2xl"
                                    />
                                </div>

                                <div className="from-blue-50 to-purple-50 rounded-xl p-6 space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Name</p>
                                        <p className="text-xl text-gray-900 font-semibold">{uploadedUser.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Email</p>
                                        <p className="text-lg text-gray-900">{uploadedUser.email}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <div className="bg-gray-100 rounded-full p-6 mb-4">
                                    <svg
                                        className="w-20 h-20 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Profile Yet</h3>
                                <p className="text-gray-500">Upload your profile picture to see it here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUpload;