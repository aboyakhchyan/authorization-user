"use client"

import axios from "axios";
import Link from "next/link";


interface IProps {
    children: React.ReactNode;
}

export default  function Layout({ children }: IProps) {

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
            <nav className="bg-gray-800 shadow-lg">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-purple-400 text-2xl font-bold">
                        MyApp
                    </div>
                    
                    <ul className="flex space-x-6">
                        <li className="hover:text-purple-300 transition-colors">
                            <a href="/profile">Profile</a>
                        </li>
                        <li className="hover:text-purple-300 transition-colors">
                            <a href="/settings">Settings</a>
                        </li>
                        <li className="hover:text-purple-300 transition-colors">
                            <a href="/photos">Photos</a>
                        </li>
                        <li className="hover:text-purple-300 transition-colors">
                            <a href="/posts">Posts</a>
                        </li>
                        <li className="hover:text-purple-300 transition-colors">
                            <a href="/more">More</a>
                        </li>
                        <li>
                            <Link 
                                className="hover:text-purple-300 transition-colors"
                                href='/login'
                                onClick={() => axios.delete(`http://localhost:3000/api/user`)}
                            >Logout</Link>
                        </li>
                    </ul>
                    
                    <div className="flex items-center space-x-4">
                        <img
                            className="w-10 h-10 rounded-full border-2 border-purple-500"
                            src="https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-256.png"
                            alt="User Profile"
                        />
                        <span className="hidden sm:inline-block text-gray-300 font-medium">
                            John Doe
                        </span>
                    </div>
                </div>
            </nav>
            
            <main className="flex-1 container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
