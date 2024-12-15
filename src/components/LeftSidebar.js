import React, { useState } from "react";
import Feed from "./Feed";
import CreatePost from "./CreatePost";
import UserProfile from "./UserProfile";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const LeftSidebar = () => {
    const navigate = useNavigate();
    const [showPages, setShowPages] = useState("Feed");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const logout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div
                className={`fixed sm:static sm:block bg-gray-800 text-white p-4 z-20 h-full min-w-[200px] max-w-[240px] transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } sm:translate-x-0`}
                style={{ borderRight: "1px solid red" }}
            >
                <button
                    className="sm:hidden absolute top-4 right-4 text-white"
                    onClick={() => setSidebarOpen(false)}
                >
                    ✖
                </button>
                <ul>
                    <li className="mb-4" onClick={() => setShowPages("Feed")}>
                        <a
                            href="#"
                            className="flex items-center p-2 hover:bg-gray-700 rounded-lg"
                        >
                            <i className="fas fa-home mr-3"></i>
                            <span>Feed</span>
                        </a>
                    </li>
                    <li className="mb-4" onClick={() => setShowPages("Create")}>
                        <a
                            href="#"
                            className="flex items-center p-2 hover:bg-gray-700 rounded-lg"
                        >
                            <i className="fas fa-user mr-3"></i>
                            <span>Add Feed</span>
                        </a>
                    </li>
                    <li className="mb-4" onClick={() => setShowPages("Profile")}>
                        <a
                            href="#"
                            className="flex items-center p-2 hover:bg-gray-700 rounded-lg"
                        >
                            <i className="fas fa-bell mr-3"></i>
                            <span>Profile Page</span>
                        </a>
                    </li>
                    <li className="mb-4" onClick={() => logout()}>
                        <a
                            href="#"
                            className="flex items-center p-2 hover:bg-gray-700 rounded-lg"
                        >
                            <i className="fas fa-cogs mr-3"></i>
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </div>


            {/* Hamburger Menu */}
            <button
                className="sm:hidden fixed top-4 left-4 text-white bg-gray-800 p-2 rounded-lg z-30"
                onClick={() => setSidebarOpen(true)}
            >
                ☰
            </button>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                {showPages === "Feed" ? (
                    <Feed />
                ) : showPages === "Create" ? (
                    <CreatePost />
                ) : showPages === "Profile" ? (
                    <UserProfile />
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};

export default LeftSidebar;
