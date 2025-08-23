"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import {
  Pencil,
  Share2,
  Users2,
  Sparkles,
  Github,
  Download,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

function App() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <nav className="relative border-b border-gray-800/50 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <Pencil className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-semibold">Ninja Sketch</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Features
              </Button>
              <Button variant="ghost" size="sm">
                Pricing
              </Button>
              <Button variant="ghost" size="sm">
                Docs
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="px-1 py-1 hover:bg-neutral-900"
                onClick={() => router.push("/signin")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <header className="relative">
        <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 text-sm text-gray-300 mb-8">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Now with AI-powered shape recognition</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Collaborative
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Whiteboarding
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Create, collaborate, and share beautiful diagrams and sketches
              with our intuitive drawing tool.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-1"
              >
                Start Drawing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto px-1"
              >
                View Examples
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                collaborate
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful features designed for teams that move fast and think
              visually.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:bg-gray-800/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Share2 className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Real-time Collaboration
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Work together with your team in real-time. Share your drawings
                instantly with a simple link.
              </p>
            </Card>

            <Card className="p-8 hover:bg-gray-800/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users2 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Multiplayer Editing
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Multiple users can edit the same canvas simultaneously. See
                who's drawing what in real-time.
              </p>
            </Card>

            <Card className="p-8 hover:bg-gray-800/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Smart Drawing
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Intelligent shape recognition and drawing assistance helps you
                create perfect diagrams.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">1M+</div>
              <div className="text-gray-400">Drawings Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-400">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
            <div className="relative p-12 sm:p-20 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
                Ready to start
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {" "}
                  creating
                </span>
                ?
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Join thousands of users who are already creating amazing
                diagrams and sketches with our platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-1"
                >
                  Open Canvas
                  <Pencil className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-1"
                >
                  View Gallery
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <footer className="border-t border-gray-800/50">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <Pencil className="w-3 h-3 text-black" />
              </div>
              <span className="text-gray-400">
                © 2024 Whiteboard. All rights reserved.
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com/SinghaAnirban005"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Download className="h-5 w-5" />
              </a>
              <Button variant="ghost" size="sm">
                Privacy
              </Button>
              <Button variant="ghost" size="sm">
                Terms
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
