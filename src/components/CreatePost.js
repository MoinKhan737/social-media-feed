import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setMediaPreviews(previews);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    let mediaUrls = [];

    // Upload media files
    for (const file of mediaFiles) {
        const fileType = file.type.startsWith("image/") ? "images" : "videos";
        const filePath = `${fileType}/${Date.now()}_${file.name}`;

        const { data, error } = await supabase.storage
            .from("post-images")
            .upload(filePath, file);

        if (error) {
            alert("Error uploading file: " + error.message);
            return;
        }

        const { data: publicUrlData, error: publicUrlError } = supabase.storage
            .from("post-images")
            .getPublicUrl(filePath);

        if (publicUrlError) {
            alert("Error generating public URL: " + publicUrlError.message);
            return;
        }

        mediaUrls.push(publicUrlData.publicUrl);
    }

    // Fetch authenticated user details
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
        alert("You must be logged in to post.");
        return;
    }

    // Fetch user_name from users table
    const { data: userDetails, error: userDetailsError } = await supabase
        .from("users")
        .select("user_name")
        .eq("id", userData.user.id)
        .single();

    if (userDetailsError || !userDetails) {
        alert("Error fetching user details: " + userDetailsError?.message || "User not found.");
        return;
    }

    // Create the post
    const { error: postError } = await supabase.from("posts").insert([
        {
            content,
            media_urls: mediaUrls,
            user_id: userData.user.id,
            user_name: userDetails.user_name, // Use the user_name from the users table
        },
    ]);

    if (postError) {
        alert("Error posting: " + postError.message);
    } else {
        setContent("");
        setMediaFiles([]);
        setMediaPreviews([]);
        alert("Post created successfully!");
        navigate("/");
    }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Create a Post</h2>
        <form onSubmit={handlePostSubmit} className="space-y-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            rows="4"
          ></textarea>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2">Select Media (images/videos)</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              accept="image/*,video/*"
            />
          </div>

          {mediaPreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Selected media ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaFiles((prev) => prev.filter((_, i) => i !== index));
                      setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
