"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { HTTP_URL } from "@/config";

interface AuthPageProps {
  isSignin: boolean;
}

export function AuthPage({ isSignin }: AuthPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isSignin ? "/signin" : "/signup";
      const payload = isSignin
        ? { email, password }
        : { email, password, name };

      const response = await axios.post(`${HTTP_URL}${endpoint}`, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (response) {
        if (isSignin) {
          localStorage.setItem("authToken", data.token);
          setSuccess("Signed in successfully!");
        } else {
          setSuccess("Account created successfully!");
        }
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    resetForm();
  }, [isSignin]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-50">
      <div className="p-8 m-2 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignin ? "Sign In" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {isLoading ? "Processing..." : isSignin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">
            {isSignin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            type="button"
            onClick={() =>
              (window.location.href = isSignin ? "/signup" : "/signin")
            }
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            {isSignin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
