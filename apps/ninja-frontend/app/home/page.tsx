"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import axios from "axios";
import { HTTP_URL } from "@/config";
import { useRouter } from "next/navigation";

interface Room {
  id: number;
  slug: string;
  createdAt: string;
  adminId: string;
}

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);

      const authToken = localStorage.getItem("authToken") ?? "";

      const response = await axios.get(`${HTTP_URL}/rooms`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(response);

      const userRooms = response.data;

      setRooms(userRooms.rooms);
    } catch (err) {
      setError("Failed to load rooms");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleJoinRoom = (roomId: number) => {
    console.log("Joining room:", roomId);
  };

  const handleCreateRoom = () => {
    console.log("Creating new room");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
                 linear-gradient(cyan 1px, transparent 1px),
                 linear-gradient(90deg, cyan 1px, transparent 1px)
               `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Drawing Rooms
              </h1>
              <p className="text-gray-400 text-lg">
                Manage and explore your creative spaces
              </p>
            </div>

            <Button
              variant="primary"
              onClick={handleCreateRoom}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            >
              + Create Room
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-cyan-900/20 to-gray-900/50 hover:from-cyan-900/30 hover:to-gray-900/60 transition-all duration-300">
              <div className="text-cyan-400 text-2xl font-bold">
                {rooms.length}
              </div>
              <div className="text-gray-300 text-sm">Total Rooms</div>
            </Card>
            <Card className="p-6 border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-gray-900/50 hover:from-purple-900/30 hover:to-gray-900/60 transition-all duration-300">
              <div className="text-purple-400 text-2xl font-bold">
                {
                  rooms.filter(
                    (room) =>
                      new Date(room.createdAt) >
                      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                  ).length
                }
              </div>
              <div className="text-gray-300 text-sm">This Week</div>
            </Card>
            <Card className="p-6 border-pink-500/20 bg-gradient-to-br from-pink-900/20 to-gray-900/50 hover:from-pink-900/30 hover:to-gray-900/60 transition-all duration-300">
              <div className="text-pink-400 text-2xl font-bold">Active</div>
              <div className="text-gray-300 text-sm">Status</div>
            </Card>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse delay-150"></div>
              <div className="w-4 h-4 bg-pink-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        )}

        {error && (
          <Card className="p-8 text-center border-red-500/20 bg-red-900/20">
            <div className="text-red-400 text-lg mb-2">Error</div>
            <div className="text-gray-300">{error}</div>
            <Button
              variant="outline"
              onClick={fetchRooms}
              className="mt-4 border-red-500/50 text-red-400 hover:bg-red-900/20"
            >
              Try Again
            </Button>
          </Card>
        )}

        {!isLoading && !error && (
          <>
            {rooms.length === 0 ? (
              <Card className="p-12 text-center border-gray-700/50">
                <div className="text-gray-400 text-lg mb-4">No rooms yet</div>
                <div className="text-gray-500 mb-6">
                  Create your first drawing room to get started
                </div>
                <Button variant="primary" onClick={handleCreateRoom}>
                  Create Your First Room
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <Card
                    key={room.id}
                    className="group p-6 hover:border-cyan-500/40 hover:bg-gray-800/60 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
                    onClick={() => handleJoinRoom(room.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                        #{room.id}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                      {room.slug}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Created {formatDate(room.createdAt)}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:border-cyan-500/50 group-hover:text-cyan-400 group-hover:bg-cyan-900/20 transition-all duration-300"
                      onClick={() => router.push(`/canvas/${room.id}`)}
                    >
                      Enter Room
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-8 right-8 md:hidden">
        <Button
          variant="primary"
          onClick={handleCreateRoom}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
