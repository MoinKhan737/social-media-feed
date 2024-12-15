import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";

const UserProfile = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newUserName, setNewUserName] = useState("");
    const [newBio, setNewBio] = useState("");
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [name, setName] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Fetch user on mount
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user:", error.message);
            } else {
                setUser(user);
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            setLoading(true);
            const { data, error } = await supabase.from("users").select("*").eq("id", user.id);
            if (error) console.error("Error fetching user details:", error.message);
            else if (data && data.length === 1) setUserDetails(data[0]);

            const { data: postsData, error: postsError } = await supabase
                .from("posts")
                .select("*")
                .eq("user_id", user.id)
                .order("timestamp", { ascending: false });
            if (postsError) console.error("Error fetching user posts:", postsError.message);
            else setPosts(postsData);

            setLoading(false);
        };

        fetchData();
    }, [user]);

    const handleProfileUpdate = async () => {
        if (!user) return;

        setSubmitting(true);
        const file = newProfilePic;
        if (file) {
            const fileName = `${Date.now()}_${file.name}`;
            const filePath = `profile-pictures/${fileName}`;
            try {
                const { error: uploadError } = await supabase.storage
                    .from("post-images")
                    .upload(filePath, file);

                if (uploadError) throw new Error(`Error uploading profile picture: ${uploadError.message}`);

                const { data: publicUrlData, error: urlError } = supabase.storage
                    .from("post-images")
                    .getPublicUrl(filePath);

                if (urlError) throw new Error(`Error getting public URL: ${urlError.message}`);

                const publicURL = publicUrlData.publicUrl;

                const newRecord = {
                    id: user.id,
                    user_name: newUserName,
                    bio: newBio,
                    profile_picture: publicURL,
                    email: user.email,
                    name: name,
                };

                const { error } = await supabase.from("users").insert([newRecord]);

                if (error) alert("Error creating user profile: " + error.message);
                else {
                    alert("Profile created successfully!");
                    setUserDetails({ ...newRecord });
                }
            } catch (error) {
                console.error(error.message);
                alert(error.message);
            }
        }
        setSubmitting(false);
    };

    const handleProfilePicChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
            setNewProfilePic(file);
        }
    };

    // Render loading spinner
    if (loading) {
        return (
            <p className="text-center text-gray-500">Loading...</p>
        );
    }

    if (!user) {
        navigate("/login")
        return <div>You are not logged in. Please log in to see your profile.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto mt-10 p-4 sm:p-6 lg:p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">My Profile</h1>

            {userDetails ? (
                <div className="flex flex-col md:flex-row items-center mb-6 bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
                    <div
                        onClick={() => document.getElementById("profilePicInput").click()}
                        className="flex justify-center items-center w-full md:w-1/3 mb-4 md:mb-0 cursor-pointer"
                    >
                        <img
                            src={previewImage || userDetails.profile_picture}
                            alt="Profile"
                            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-indigo-600 shadow-lg"
                        />
                    </div>
                    <input
                        type="file"
                        id="profilePicInput"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="hidden"
                    />
                    <div className="w-full md:w-2/3 md:ml-8 text-center md:text-left">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">{userDetails.user_name}</h2>
                        <p className="text-lg text-gray-600 mt-2">{userDetails.bio}</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-8">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4">Create Your Profile</h2>

                    <div className="mb-4">
                        <label className="block text-lg font-semibold text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600"
                            placeholder="Enter your Name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-semibold text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-semibold text-gray-700 mb-2">Bio</label>
                        <textarea
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600"
                            placeholder="Enter your bio"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-lg font-semibold text-gray-700 mb-2">Profile Picture</label>
                        <input
                            type="file"
                            onChange={(e) => setNewProfilePic(e.target.files[0])}
                            className="w-full px-4 py-3 border rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>
                    <button
                        onClick={handleProfileUpdate}
                        className="w-full py-3 mt-6 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 focus:outline-none transition ease-in-out duration-300"
                    >
                        Save Profile
                    </button>
                </div>
            )}
            {submitting && (
                <div className="flex items-center justify-center mb-6">
                    <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full text-green-600"></div>
                    <p className="ml-2 text-green-600">Saving profile...</p>
                </div>
            )}

            <div className="mt-12">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">My Posts</h2>
                {posts.length === 0 ? (
                    <p className="text-gray-500">No posts to display</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white shadow-md rounded-lg p-4 w-full">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">{post.user_name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{post.content}</p>
                                {post.media_urls && post.media_urls.length > 0 && (
                                    <div className="flex overflow-x-auto space-x-4 mt-2 scrollbar-hide" style={{
                                        scrollbarWidth: "none",
                                        msOverflowStyle: "none",
                                    }}>
                                        {JSON.parse(post.media_urls).map((media, index) => (
                                            <img
                                                key={index}
                                                src={media}
                                                alt={`Post media ${index + 1}`}
                                                className="w-32 h-32 object-cover rounded-lg shadow-sm"
                                            />
                                        ))}
                                    </div>
                                )}
                                <p className="text-gray-500 text-xs mt-2">
                                    {formatDistanceToNow(parseISO(post.timestamp))} ago
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
