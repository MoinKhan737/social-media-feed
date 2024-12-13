import React, { useState } from "react";
import Feed from "./Feed";
import CreatePost from "./CreatePost";
import UserProfile from "./UserProfile";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const LeftSidebar = () => {
    const navigate = useNavigate()
    const [showPages, setShowPages] = useState("Feed")

    const logout = async () => {
        await supabase.auth.signOut();
        navigate("/login")
    };

    return (
        <div className="flex h-screen">
            <div className="w-64 bg-gray-800 text-white p-4" style={{ overflow: "hidden", borderRight: "1px solid red" }}>
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
                            <span>logout</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                {showPages === "Feed" ?
                    <Feed />
                    :
                    showPages === "Create" ?
                        <CreatePost />
                        :
                        showPages === "Profile" ?
                            <UserProfile />
                            :
                            ""
                }
            </div>
        </div>
    );
};

export default LeftSidebar;
