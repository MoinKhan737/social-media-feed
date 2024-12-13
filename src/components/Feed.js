import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  
  const fetchAllPosts = async () => {
    try {
      setLoading(true);

      const { data: posts, error, status } = await supabase
        .from("posts")
        .select("*") 
        .order("timestamp", { ascending: false }); 
      if (error) {
        throw new Error(`Error fetching posts: ${error.message}`);
      }
      console.log(posts, 'posts')
      setPosts(posts);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      setPage(page + 1);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");  
  };

  useEffect(() => {
    fetchAllPosts();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">

      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Feed</h1>


        <div className="space-y-6">
         
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold text-gray-700 mb-2">{post.user_name}</h3>

              <p className="text-gray-600 mb-4">{post.content}</p>

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
                        className="snap-center object-cover w-full h-[400px]"
                      />
                    ))}
                  </div>

                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full">
                    {JSON.parse(post.media_urls).length > 1 && (
                      <p> 1/{JSON.parse(post.media_urls).length}</p>
                    )}
                  </div>

                </div>
              )}
            </div>
          ))}


          {loading && <p className="text-center text-gray-500">Loading...</p>}
         
        </div>
      </div>
    </div>
  );
};

export default Feed;
