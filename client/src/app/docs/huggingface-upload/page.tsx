import Link from "next/link";
import { TableOfContents } from "@/components/table-of-contents";
import { ArrowRight, ArrowLeft } from "lucide-react";

const tocHeadings = [
  { id: "create-repo", text: "Create Repository", level: 2 },
  { id: "upload-files", text: "Upload Files", level: 2 },
  { id: "access-tokens", text: "Generate Tokens", level: 2 },
  { id: "start-training", text: "Start Training", level: 2 },
];

export default function HuggingFaceUploadPage() {
  return (
    <div className="flex">
      <article className="flex-1 py-8 px-6 lg:px-8 min-w-0">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Uploading to Hugging Face
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Follow these steps to upload your prepared dataset to Hugging Face.
        </p>

        {/* Step 1 */}
        <section className="mb-8">
          <div className="flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-xl">
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
              1
            </span>
            <div>
              <h2
                id="create-repo"
                className="text-xl font-semibold text-slate-900 mb-2"
              >
                Create a Dataset Repository
              </h2>
              <p className="text-slate-600 mb-3">
                Go to{" "}
                <a
                  href="https://huggingface.co/new-dataset"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  huggingface.co/new-dataset
                </a>{" "}
                and create a new dataset repository.
              </p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>
                  • Choose a descriptive name (e.g.,
                  &quot;bn-robi-08-12-25&quot;)
                </li>
                <li>• Set visibility to private if needed</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="mb-8">
          <div className="flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-xl">
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
              2
            </span>
            <div>
              <h2
                id="upload-files"
                className="text-xl font-semibold text-slate-900 mb-2"
              >
                Upload Your Files
              </h2>
              <p className="text-slate-600 mb-3">
                Upload your dataset files maintaining the folder structure:
              </p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>
                  • Upload the entire{" "}
                  <code className="bg-slate-100 px-1 rounded">wavs/</code>{" "}
                  folder with all audio files
                </li>
                <li>
                  • Upload{" "}
                  <code className="bg-slate-100 px-1 rounded">
                    metadata.csv
                  </code>{" "}
                  to the root
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="mb-8">
          <div className="flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-xl">
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
              3
            </span>
            <div>
              <h2
                id="access-tokens"
                className="text-xl font-semibold text-slate-900 mb-2"
              >
                Generate Access Tokens
              </h2>
              <p className="text-slate-600 mb-3">
                Go to{" "}
                <a
                  href="https://huggingface.co/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  Settings → Access Tokens
                </a>{" "}
                and create tokens:
              </p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>
                  • <strong>Read token:</strong> For downloading dataset
                  (HF_DATASET_TOKEN)
                </li>
                <li>
                  • <strong>Write token:</strong> For uploading models
                  (HF_UPLOAD_TOKEN)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 4 */}
        <section className="mb-8">
          <div className="flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-xl">
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
              4
            </span>
            <div>
              <h2
                id="start-training"
                className="text-xl font-semibold text-slate-900 mb-2"
              >
                Start Training
              </h2>
              <p className="text-slate-600">
                Head to the{" "}
                <Link href="/train" className="text-purple-600 hover:underline">
                  Training Dashboard
                </Link>{" "}
                and fill in your configuration to start training!
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white">
          <h3 className="text-xl font-bold mb-2">Ready to Train Your Model?</h3>
          <p className="text-purple-100 mb-4">
            Start training your custom Piper TTS model in minutes.
          </p>
          <Link
            href="/train"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
          >
            Start Training Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between">
          <Link
            href="/docs/dataset-preparation"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Dataset Preparation
          </Link>
          <Link
            href="/train"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            Training Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </article>

      <TableOfContents headings={tocHeadings} />
    </div>
  );
}
