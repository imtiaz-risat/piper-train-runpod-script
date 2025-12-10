import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ArrowRight, Github, Zap, Shield, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-purple-100 selection:text-purple-700">
      {/* Navigation */}
      <Navbar activePage="home" />

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-slate-50/90 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center -mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            v1.0 is now live
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Built for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Interns
            </span>
            ,<br />
            by the Interns.
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Even Interns can train AI models
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/train">
              <button className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2 text-lg">
                Start Training Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <a
              href="https://github.com/imtiaz-risat/piper-train-runpod-script"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 hover:border-purple-200 hover:text-purple-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2 text-lg">
                <Github className="w-5 h-5" />
                View on GitHub
              </button>
            </a>
          </div>

          {/* Feature Badge/Pill */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 shadow-sm">
              <div className="p-1 rounded-full bg-green-100 text-green-600">
                <Zap className="w-3 h-3" />
              </div>
              Instant Deployment
            </div>
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 shadow-sm">
              <div className="p-1 rounded-full bg-purple-100 text-purple-600">
                <TrendingUp className="w-3 h-3" />
              </div>
              Auto-Scaling
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© 2025 FirstTrain. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/docs" className="hover:text-purple-600 transition">
              Documentation
            </Link>
            <a href="#" className="hover:text-purple-600 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-purple-600 transition">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
