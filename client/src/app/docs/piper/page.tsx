import Link from "next/link";
import { TableOfContents } from "@/components/table-of-contents";
import {
  Rocket,
  BookOpen,
  Settings,
  Database,
  Upload,
  ArrowRight,
} from "lucide-react";

const tocHeadings = [
  { id: "welcome", text: "Welcome", level: 2 },
  { id: "features", text: "Features", level: 2 },
  { id: "getting-started", text: "Getting Started", level: 2 },
];

export default function DocsPage() {
  return (
    <div className="flex">
      <article className="flex-1 py-8 px-6 lg:px-8 min-w-0">
        {/* Hero */}
        <div className="mb-12">
          <h1 id="welcome" className="text-4xl font-bold text-slate-900 mb-4">
            FirstTrain Documentation
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Everything you need to know about training your Piper TTS model
            using FirstTrain and RunPod.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <QuickLink
            href="/docs/piper/quickstart"
            icon={Rocket}
            title="Quick Start"
            description="Get up and running in under 5 minutes"
          />
          <QuickLink
            href="/docs/piper/environment-variables"
            icon={Settings}
            title="Environment Variables"
            description="Configure your training parameters"
          />
          <QuickLink
            href="/docs/piper/dataset-preparation"
            icon={Database}
            title="Dataset Preparation"
            description="Prepare your audio dataset"
          />
          <QuickLink
            href="/docs/piper/huggingface-upload"
            icon={Upload}
            title="Upload to Hugging Face"
            description="Host your dataset on Hugging Face"
          />
        </div>

        {/* Features Section */}
        <section className="mb-12">
          <h2 id="features" className="text-2xl font-bold text-slate-900 mb-4">
            Features
          </h2>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-semibold">
                ✓
              </span>
              <span>
                <strong>One-Click Deployment</strong> — Deploy training pods to
                RunPod with a single click
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-semibold">
                ✓
              </span>
              <span>
                <strong>Automatic Checkpoints</strong> — Checkpoints are
                automatically uploaded to Hugging Face
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-semibold">
                ✓
              </span>
              <span>
                <strong>Resume Training</strong> — Continue training from any
                checkpoint
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-semibold">
                ✓
              </span>
              <span>
                <strong>Auto Pod Termination</strong> — Pods automatically
                terminate after training completes
              </span>
            </li>
          </ul>
        </section>

        {/* Getting Started */}
        <section className="mb-12">
          <h2
            id="getting-started"
            className="text-2xl font-bold text-slate-900 mb-4"
          >
            Getting Started
          </h2>
          <p className="text-slate-600 mb-4">
            Follow these steps to train your first Piper TTS model:
          </p>
          <ol className="space-y-4 text-slate-600 list-decimal list-inside">
            <li>
              <strong>Prepare your dataset</strong> — Create audio files and a
              metadata.csv file following the LJSpeech format.
              <Link
                href="/docs/piper/dataset-preparation"
                className="text-purple-600 hover:underline ml-1"
              >
                Learn more →
              </Link>
            </li>
            <li>
              <strong>Upload to Hugging Face</strong> — Create a dataset
              repository and upload your files.
              <Link
                href="/docs/piper/huggingface-upload"
                className="text-purple-600 hover:underline ml-1"
              >
                Learn more →
              </Link>
            </li>
            <li>
              <strong>Configure your training</strong> — Set up environment
              variables and hyperparameters.
              <Link
                href="/docs/piper/environment-variables"
                className="text-purple-600 hover:underline ml-1"
              >
                Learn more →
              </Link>
            </li>
            <li>
              <strong>Deploy and train</strong> — Start your training job from
              the dashboard.
              <Link
                href="/train/piper"
                className="text-purple-600 hover:underline ml-1"
              >
                Go to Dashboard →
              </Link>
            </li>
          </ol>
        </section>

        {/* CTA */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white">
          <h3 className="text-xl font-bold mb-2">Ready to start training?</h3>
          <p className="text-purple-100 mb-4">
            Head to the dashboard to deploy your first training pod.
          </p>
          <Link
            href="/train/piper"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </article>

      <TableOfContents headings={tocHeadings} />
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group p-4 border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 group-hover:text-purple-600 transition">
            {title}
          </h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}
