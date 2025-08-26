'use client';
import React from "react";
import { Camera, Edit3, Settings } from "lucide-react";
import Image from "next/image";

export default function ProfileCard() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-md p-8 border border-gray-200">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/150?img=32"
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg hover:scale-105 transform transition-all duration-300"
            />
            <button className="absolute bottom-2 right-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">John Doe</h2>
          <p className="text-gray-500 text-sm">Product Designer @ Startup</p>
        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <p className="text-gray-500">Email</p>
            <p className="font-medium text-gray-800">johndoe@email.com</p>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <p className="text-gray-500">Location</p>
            <p className="font-medium text-gray-800">San Francisco, CA</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-500">Joined</p>
            <p className="font-medium text-gray-800">Jan 2024</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-2 px-4 rounded-xl shadow-lg hover:opacity-90 flex items-center justify-center gap-2 transition">
            <Edit3 size={16} /> Edit Profile
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl shadow-md hover:bg-gray-200 flex items-center justify-center gap-2 transition">
            <Settings size={16} /> Settings
          </button>
        </div>
      </div>
    </div>
  );
}
