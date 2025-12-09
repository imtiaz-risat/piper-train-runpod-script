import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Image
            src="/onlylogo.png"
            alt="FirstTrain Logo"
            width={1000}
            height={1000}
            className="h-12 w-auto"
          />
          <span className="text-2xl font-bold text-purple-600">FirstTrain</span>
        </div>
        <Link href="/train">
          <button className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
            Get Started
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section
        className="px-6 md:px-12 py-20 md:py-32 text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900">
            Built for Interns, <br /> by the Interns.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8">
            Train AI models like you never thought possible
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/train">
              <button className="px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition shadow-lg">
                Start Training Now
              </button>
            </Link>
            <a
              href="https://github.com/imtiaz-risat/piper-train-runpod-script"
              target="_blank"
            >
              <button className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-full font-semibold hover:bg-purple-50 transition">
                View on GitHub
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 md:px-12 py-20 bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 text-center text-white">
            {[
              { stat: "99.9%", label: "Uptime" },
              { stat: "0.7s", label: "Setup Time" },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {item.stat}
                </div>
                <p className="text-purple-100">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Now even an Intern can train models
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          Join thousands of Interns who are building the future of AI.
        </p>
        <Link href="/train">
          <button className="px-10 py-4 bg-purple-600 text-white rounded-full font-bold text-lg hover:bg-purple-700 transition shadow-lg">
            Get Started for Free
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 bg-purple-600 text-purple-100 text-center">
        <p>© 2025 FirstTrain. All rights reserved.</p>
      </footer>
    </div>
  );
}
