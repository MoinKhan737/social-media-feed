import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupFields, setShowSignupFields] = useState(false);
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    setLoading(true); 
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false); 

    if (error) {
      alert(error.message);
      return;
    }

    alert("Verification code sent to your registered email. Please verify your email address.");
    if (!user) {
      console.error("No user returned after sign-up");
      return;
    }

    console.log("User signed up successfully!");
    navigate("/");
  };

  const signIn = async () => {
    setLoading(true); 
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false); 

    if (error) alert(error.message);
    else {
      navigate("/");
    }
  };

  const googleSignIn = async () => {
    setLoading(true); 
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    setLoading(false); 

    if (error) alert(error.message);
    else {
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Welcome</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">Please sign up or sign in to continue</p>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password input with toggle */}
        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Submit button */}
        <button
          onClick={() => signUp()}
          className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition mb-4"
        >
          {loading ? (
            <div className="animate-spin border-t-2 border-blue-500 border-solid rounded-full w-6 h-6 mx-auto"></div>
          ) : (
            "Sign Up"
          )}
        </button>

        <div className="flex flex-col space-y-4 mt-4">
          {/* Sign In button */}
          <button
            onClick={signIn}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? (
              <div className="animate-spin border-t-2 border-white border-solid rounded-full w-6 h-6 mx-auto"></div>
            ) : (
              "Sign In"
            )}
          </button>
          {/* Google Sign In button */}
          <button
            onClick={googleSignIn}
            className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            {loading ? (
              <div className="animate-spin border-t-2 border-white border-solid rounded-full w-6 h-6 mx-auto"></div>
            ) : (
              "Sign in with Google"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
