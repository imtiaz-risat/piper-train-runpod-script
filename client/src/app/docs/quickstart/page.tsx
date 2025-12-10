import Link from "next/link";
import { TableOfContents } from "@/components/table-of-contents";
import { ArrowRight, ArrowLeft } from "lucide-react";

const tocHeadings = [
  { id: "prerequisites", text: "Prerequisites", level: 2 },
  { id: "step-1", text: "Step 1: Prepare Dataset", level: 2 },
  { id: "step-2", text: "Step 2: Upload to HF", level: 2 },
  { id: "step-3", text: "Step 3: Deploy Pod", level: 2 },
  { id: "next-steps", text: "Next Steps", level: 2 },
];

export default function QuickstartPage() {
  return (
    <div className="flex">
      <article className="flex-1 py-8 px-6 lg:px-8 min-w-0">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Quick Start</h1>
        <p className="text-lg text-slate-600 mb-8">
          Get your first Piper TTS model training in under 5 minutes.
        </p>

        {/* Prerequisites */}
        <section className="mb-10">
          <h2
            id="prerequisites"
            className="text-2xl font-bold text-slate-900 mb-4"
          >
            Prerequisites
          </h2>
          <p className="text-slate-600 mb-4">
            Before you begin, make sure you have:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-600">
            <li>
              A{" "}
              <a
                href="https://huggingface.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                Hugging Face
              </a>{" "}
              account
            </li>
            <li>
              Audio recordings of the voice you want to clone (WAV format,
              22050Hz, mono)
            </li>
            <li>Transcriptions for each audio file</li>
            <li>
              A{" "}
              <a
                href="https://runpod.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                RunPod
              </a>{" "}
              account with API key
            </li>
          </ul>
        </section>

        {/* Step 1: Prepare Dataset */}
        <section className="mb-10">
          <h2 id="step-1" className="text-2xl font-bold text-slate-900 mb-4">
            Step 1: Prepare Your Dataset
          </h2>
          <p className="text-slate-600 mb-4">
            Create a folder structure like this:
          </p>
          <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 mb-4 overflow-x-auto">
            <code>{`your-dataset/
├── wavs/
│   ├── 001.wav
│   ├── 002.wav
│   └── ...
└── metadata.csv`}</code>
          </pre>
          <p className="text-slate-600 mb-4">
            Your{" "}
            <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
              metadata.csv
            </code>{" "}
            should use pipe (
            <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
              |
            </code>
            ) as separator:
          </p>
          <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 mb-4 overflow-x-auto">
            <code>{`001.wav|This is the transcription for the first audio.
002.wav|This is the transcription for the second audio.`}</code>
          </pre>
          <Link
            href="/docs/dataset-preparation"
            className="text-purple-600 hover:underline inline-flex items-center gap-1"
          >
            Learn more about dataset preparation{" "}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Step 2: Upload to HF */}
        <section className="mb-10">
          <h2 id="step-2" className="text-2xl font-bold text-slate-900 mb-4">
            Step 2: Upload to Hugging Face
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-600 mb-4">
            <li>
              Go to{" "}
              <a
                href="https://huggingface.co/new-dataset"
                target="_blank"
                className="text-purple-600 hover:underline"
              >
                huggingface.co/new-dataset
              </a>
            </li>
            <li>Create a new dataset repository</li>
            <li>
              Upload your{" "}
              <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                wavs/
              </code>{" "}
              folder and{" "}
              <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                metadata.csv
              </code>
            </li>
            <li>Generate access tokens from Settings → Access Tokens</li>
          </ol>
          <Link
            href="/docs/huggingface-upload"
            className="text-purple-600 hover:underline inline-flex items-center gap-1"
          >
            Detailed upload instructions <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Step 3: Deploy Pod */}
        <section className="mb-10">
          <h2 id="step-3" className="text-2xl font-bold text-slate-900 mb-4">
            Step 3: Deploy Training Pod
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-600 mb-4">
            <li>
              Go to the{" "}
              <Link href="/train" className="text-purple-600 hover:underline">
                Training Dashboard
              </Link>
            </li>
            <li>Login with your credentials</li>
            <li>Fill in the training form with your Hugging Face details</li>
            <li>
              Click{" "}
              <strong className="font-semibold text-slate-800">
                Deploy Training Pod
              </strong>
            </li>
          </ol>
          <p className="text-slate-600">
            Your training will start automatically. Checkpoints will be uploaded
            to Hugging Face periodically.
          </p>
        </section>

        {/* Next Steps */}
        <section className="mb-10">
          <h2
            id="next-steps"
            className="text-2xl font-bold text-slate-900 mb-4"
          >
            Next Steps
          </h2>
          <p className="text-slate-600 mb-4">After deployment, you can:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-600">
            <li>Monitor your pod status in the dashboard</li>
            <li>View training logs in RunPod console</li>
            <li>Download checkpoints from your Hugging Face repo</li>
            <li>Resume training from any checkpoint</li>
          </ul>
        </section>

        {/* Navigation */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Introduction
          </Link>
          <Link
            href="/docs/environment-variables"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            Environment Variables <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </article>

      <TableOfContents headings={tocHeadings} />
    </div>
  );
}
