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

      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        throw new Error(`Error fetching posts: ${error.message}`);
      }

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Feed
        </h1>

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-2">
                {post.user_name}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 mb-4">
                {post.content}
              </p>

              {post.media_urls && post.media_urls.length > 0 && (
                <div className="relative">
                  <div
                    className="flex gap-2 overflow-x-auto snap-x snap-mandatory"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {JSON.parse(post.media_urls).map((media, index) => (
                      <img
                        key={index}
                        src={media}
                        alt={`Post media ${index + 1}`}
                        className="snap-center object-cover w-full flex-1 h-auto max-h-[400px] rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && <p className="text-center text-gray-500">Loading...</p>}

          {!loading && hasMore && (
            <button
              onClick={loadMorePosts}
              className="block mx-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
