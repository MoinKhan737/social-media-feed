// import { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";
// import { useNavigate } from "react-router-dom";
// import { formatDistanceToNow, parseISO } from 'date-fns';

// const UserProfile = () => {
//     const navigate = useNavigate();
//     const [userDetails, setUserDetails] = useState(null);
//     const [posts, setPosts] = useState([]);
//     const [isEditing, setIsEditing] = useState(false);
//     const [newUserName, setNewUserName] = useState("");
//     const [newBio, setNewBio] = useState("");
//     const [newProfilePic, setNewProfilePic] = useState(null);
//     const [newDob, setNewDob] = useState("");
//     const [name, setName] = useState("")
//     const [user, setUser] = useState(null);
//     const [previewImage, setPreviewImage] = useState(userDetails.profile_picture);

//     useEffect(() => {
//         const fetchUser = async () => {
//             const { data: { user }, error } = await supabase.auth.getUser();
//             if (error) {
//                 console.error("Error fetching user:", error.message);
//                 return;
//             }
//             setUser(user);
//         };
//         fetchUser();
//         if (user) {
//             fetchUserPosts();
//             fetchUserDetails();
//         }
//     }, [user]);

//     const fetchUserDetails = async () => {
//         const { data, error } = await supabase
//             .from("users")
//             .select("*")
//             .eq("id", user.id);

//         if (error) {
//             console.error("Error fetching user details:", error.message);
//         } else if (data && data.length === 1) {
//             setUserDetails(data[0]);
//             setNewUserName(data[0].user_name || "");
//             setNewBio(data[0].bio || "");
//             setNewProfilePic(data[0].profile_picture || "");
//         } else {
//             console.error("No rows found");
//         }
//     };

//     const fetchUserPosts = async () => {
//         const { data, error } = await supabase
//             .from("posts")
//             .select("*")
//             .eq("user_id", user.id)
//             .order("timestamp", { ascending: false });

//         if (error) {
//             console.error("Error fetching user posts:", error.message);
//         } else {
//             setPosts(data);
//         }
//     };

//     // const handleProfileUpdate = async () => {
//     //     if (!user) return;

//     //     const newRecord = {
//     //         id: user.id,
//     //         user_name: newUserName,
//     //         bio: newBio,
//     //         profile_picture: newProfilePic,
//     //         email: user.email,
//     //         name: name
//     //     };

//     //     const { error } = await supabase.from("users").insert([newRecord]);

//     //     if (error) {
//     //         alert("Error updating profile: " + error.message);
//     //     } else {
//     //         alert("Profile updated successfully!");
//     //         setIsEditing(false);
//     //         fetchUserDetails(); // Refetch user details to show updated information
//     //     }
//     // };

//     const handleProfileUpdate = async () => {
//         if (!user) return;

//         const file = newProfilePic;
//         if (file) {
//             const fileName = `${Date.now()}_${file.name}`;
//             const filePath = `profile-pictures/${fileName}`;
//             try {
//                 const { data, error: uploadError } = await supabase.storage
//                     .from("post-images")
//                     .upload(filePath, file);

//                 if (uploadError) {
//                     throw new Error(`Error uploading profile picture: ${uploadError.message}`);
//                 }

//                 const { data: publicUrlData, error: urlError } = supabase.storage
//                     .from("post-images")
//                     .getPublicUrl(filePath);

//                 if (urlError) {
//                     throw new Error(`Error getting public URL: ${urlError.message}`);
//                 }

//                 const publicURL = publicUrlData.publicUrl;

//                 console.log('Public URL:', publicURL);
//                 const newRecord = {
//                     id: user.id,
//                     user_name: newUserName,
//                     bio: newBio,
//                     profile_picture: publicURL,
//                     email: user.email,
//                     name: name,
//                 };

//                 const { error } = await supabase.from("users").insert([newRecord]);

//                 if (error) {
//                     alert("Error creating user profile: " + error.message);
//                 } else {
//                     alert("Profile created successfully!");
//                     setIsEditing(false);
//                     fetchUserDetails();
//                 }
//             } catch (error) {
//                 console.error(error.message);
//                 alert(error.message);
//             }
//         }
//     };


//     const formatDate = (timestamp) => {
//         if (!timestamp) {
//             return "No timestamp available";
//         }

//         const date = new Date(timestamp * 1000);

//         if (isNaN(date.getTime())) {
//             console.log("Invalid timestamp:", timestamp);
//             return "Invalid Date";
//         }
//         return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
//     };

//     const handleProfilePicChange = async (event) => {
//         const file = event.target.files[0];

//         if (file) {
//             const objectUrl = URL.createObjectURL(file);
//             setPreviewImage(objectUrl);
//             setNewProfilePic(file);

//             const fileName = `${Date.now()}_${file.name}`;
//             const filePath = `profile-pictures/${fileName}`;

//             try {
//                 const { data, error } = await supabase.storage
//                     .from("post-images")
//                     .upload(filePath, file);

//                 if (error) {
//                     throw new Error(`Error uploading profile picture: ${error.message}`);
//                 }

//                 const { data: publicUrlData, error: urlError } = supabase.storage
//                     .from("post-images")
//                     .getPublicUrl(filePath);

//                 if (urlError) {
//                     throw new Error(`Error getting public URL: ${urlError.message}`);
//                 }

//                 const publicURL = publicUrlData.publicUrl;

//                 console.log('Public URL:', publicURL);
//                 const { data: updateData, error: updateError } = await supabase
//                     .from("users")
//                     .update({ profile_picture: publicURL })
//                     .eq("id", user.id);

//                 if (updateError) {
//                     throw new Error(`Error updating user profile: ${updateError.message}`);
//                 }

//                 console.log('Update Data:', updateData);

//                 alert("Profile picture updated successfully!");
//                 setUserDetails((prevDetails) => ({
//                     ...prevDetails,
//                     profile_picture: publicURL,
//                 }));
//             } catch (error) {
//                 console.error(error.message);
//                 alert(error.message);
//             }
//         }
//     };

//     return (
//         <div className="max-w-5xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-xl">
//             <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">My Profile</h1>
//             {console.log(userDetails, 'userDetails')}
//             {userDetails ? (

//                 < div className="flex flex-col md:flex-row items-center mb-6 bg-gray-50 p-6 rounded-lg shadow-md">
//                     <div
//                         onClick={() => document.getElementById("profilePicInput").click()}
//                         className="flex justify-center items-center w-1/3 mb-4 md:mb-0 cursor-pointer"
//                     >
//                         <img
//                             src={previewImage || userDetails.profile_picture}
//                             alt="Profile"
//                             className="w-40 h-40 rounded-full border-4 border-indigo-600 shadow-lg"
//                         />
//                     </div>

//                     <input
//                         type="file"
//                         id="profilePicInput"
//                         accept="image/*"
//                         onChange={handleProfilePicChange}
//                         className="hidden"
//                     />

//                     <div className="w-full md:w-2/3 md:ml-8">
//                         <h2 className="text-3xl font-semibold text-gray-800">{userDetails.user_name}</h2>
//                         <p className="text-lg text-gray-600 mt-2">{userDetails.bio}</p>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
//                     <div className="mb-4">
//                         <label className="block text-lg font-semibold text-gray-700 mb-2">Name</label>
//                         <input
//                             type="text"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             className="w-full px-4 py-3 border rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600"
//                             placeholder="Enter your Name"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-lg font-semibold text-gray-700 mb-2">Username</label>
//                         <input
//                             type="text"
//                             value={newUserName}
//                             onChange={(e) => setNewUserName(e.target.value)}
//                             className="w-full px-4 py-3 border rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600"
//                             placeholder="Enter your username"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-lg font-semibold text-gray-700 mb-2">Bio</label>
//                         <textarea
//                             value={newBio}
//                             onChange={(e) => setNewBio(e.target.value)}
//                             className="w-full px-4 py-3 border rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600"
//                             placeholder="Enter your bio"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-lg font-semibold text-gray-700 mb-2">Date of Birth</label>
//                         <input
//                             type="date"
//                             value={newDob}
//                             onChange={(e) => setNewDob(e.target.value)}
//                             className="w-full px-4 py-3 border rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-lg font-semibold text-gray-700 mb-2">Profile Picture</label>
//                         <input
//                             type="file"
//                             onChange={(e) => setNewProfilePic(e.target.files[0])}
//                             className="w-full px-4 py-3 border rounded-lg shadow-md focus:ring-2 focus:ring-indigo-600"
//                         />
//                     </div>
//                     <button
//                         onClick={handleProfileUpdate}
//                         className="w-full py-3 mt-6 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 focus:outline-none transition ease-in-out duration-300"
//                     >
//                         Save Changes
//                     </button>
//                 </div>
//             )
//             }

//             <div className="mt-12">
//                 <h2 className="text-3xl font-semibold text-gray-800 mb-4">My Posts</h2>
//                 {posts.length === 0 ? (
//                     <p className="text-gray-500">No posts to display</p>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {posts.map((post) => (
//                             <div key={post.id} className="bg-white shadow-md rounded-lg p-4 mb-4 w-full">
//                                 <h3 className="text-sm font-semibold text-gray-700 mb-2">{post.user_name}</h3>
//                                 <p className="text-gray-600 text-sm mb-2">{post.content}</p>
//                                 {post.media_urls && post.media_urls.length > 0 && (
//                                     <div className="relative">
//                                         <div
//                                             style={{
//                                                 overflowX: "scroll",
//                                                 scrollbarWidth: "none",
//                                                 msOverflowStyle: "none",
//                                             }}
//                                             className="flex snap-x snap-mandatory"
//                                         >
//                                             {JSON.parse(post.media_urls).map((media, index) => (
//                                                 <img
//                                                     key={index}
//                                                     src={media}
//                                                     alt={`Post media ${index + 1}`}
//                                                     className="snap-center object-cover w-full h-[200px] mr-2"
//                                                 />
//                                             ))}
//                                         </div>

//                                         <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full">
//                                             {JSON.parse(post.media_urls).length > 1 && (
//                                                 <p className="text-xs">1/{JSON.parse(post.media_urls).length}</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}

//                                 <p className="text-xs text-gray-500 mt-2">{formatDistanceToNow(parseISO(post.timestamp), { addSuffix: true })}</p>
//                             </div>
//                         ))}
//                     </div>

//                 )}
//             </div>
//         </div >
//     );
// };

// export default UserProfile;


import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from 'date-fns';

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
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user:", error.message);
                setLoading(false);
                return;
            }
            setUser(user);
            setLoading(false);
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchUserDetails = async () => {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id);

            if (error) {
                console.error("Error fetching user details:", error.message);
            } else if (data && data.length === 1) {
                setUserDetails(data[0]);
            } else {
                console.error("No rows found");
            }
        };

        const fetchUserPosts = async () => {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .eq("user_id", user.id)
                .order("timestamp", { ascending: false });

            if (error) {
                console.error("Error fetching user posts:", error.message);
            } else {
                setPosts(data);
            }
        };

        fetchUserDetails();
        fetchUserPosts();
    }, [user]);

    const handleProfileUpdate = async () => {
        if (!user) return;

        const file = newProfilePic;
        if (file) {
            const fileName = `${Date.now()}_${file.name}`;
            const filePath = `profile-pictures/${fileName}`;
            try {
                const { data, error: uploadError } = await supabase.storage
                    .from("post-images")
                    .upload(filePath, file);

                if (uploadError) {
                    throw new Error(`Error uploading profile picture: ${uploadError.message}`);
                }

                const { data: publicUrlData, error: urlError } = supabase.storage
                    .from("post-images")
                    .getPublicUrl(filePath);

                if (urlError) {
                    throw new Error(`Error getting public URL: ${urlError.message}`);
                }

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

                if (error) {
                    alert("Error creating user profile: " + error.message);
                } else {
                    alert("Profile created successfully!");
                    setUserDetails({ ...newRecord });
                }
            } catch (error) {
                console.error(error.message);
                alert(error.message);
            }
        }
    };

    const handleProfilePicChange = async (event) => {
        const file = event.target.files[0];

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
            setNewProfilePic(file);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>You are not logged in. Please log in to see your profile.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-xl">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">My Profile</h1>

            {userDetails ? (
                <div className="flex flex-col md:flex-row items-center mb-6 bg-gray-50 p-6 rounded-lg shadow-md">
                    <div
                        onClick={() => document.getElementById("profilePicInput").click()}
                        className="flex justify-center items-center w-1/3 mb-4 md:mb-0 cursor-pointer"
                    >
                        <img
                            src={previewImage || userDetails.profile_picture}
                            alt="Profile"
                            className="w-40 h-40 rounded-full border-4 border-indigo-600 shadow-lg"
                        />
                    </div>

                    <input
                        type="file"
                        id="profilePicInput"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="hidden"
                    />

                    <div className="w-full md:w-2/3 md:ml-8">
                        <h2 className="text-3xl font-semibold text-gray-800">{userDetails.user_name}</h2>
                        <p className="text-lg text-gray-600 mt-2">{userDetails.bio}</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <h2 className="text-3xl font-semibold text-gray-700 mb-6">Create Your Profile</h2>

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

            <div className="mt-12">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">My Posts</h2>
                {posts.length === 0 ? (
                    <p className="text-gray-500">No posts to display</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white shadow-md rounded-lg p-4 mb-4 w-full">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">{post.user_name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{post.content}</p>
                                {post.media_urls && post.media_urls.length > 0 && (
                                    <div className="relative">
                                        <div
                                            style={{
                                                overflowX: "scroll",
                                                scrollbarWidth: "none",
                                                msOverflowStyle: "none",
                                            }}
                                            className="flex snap-x snap-mandatory"
                                        >
                                            {JSON.parse(post.media_urls).map((media, index) => (
                                                <img
                                                    key={index}
                                                    src={media}
                                                    alt={`Post media ${index + 1}`}
                                                    className="snap-center object-cover w-full h-64 rounded-md mb-4"
                                                />
                                            ))}
                                        </div>
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

