import Link from "next/link";
import { TableOfContents } from "@/components/table-of-contents";
import { ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";

const tocHeadings = [
  { id: "audio-requirements", text: "Audio Requirements", level: 2 },
  { id: "folder-structure", text: "Folder Structure", level: 2 },
  { id: "metadata-format", text: "Metadata Format", level: 2 },
  { id: "naming-convention", text: "Naming Convention", level: 2 },
];

export default function DatasetPreparationPage() {
  return (
    <div className="flex">
      <article className="flex-1 py-8 px-6 lg:px-8 min-w-0">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Dataset Preparation
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Your dataset should follow the LJSpeech format. Here are the
          requirements for preparing your audio files and metadata.
        </p>

        {/* Audio Requirements */}
        <section className="mb-10">
          <h2
            id="audio-requirements"
            className="text-2xl font-bold text-slate-900 mb-4"
          >
            Audio File Requirements
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold">
                  1
                </span>
                <div>
                  <span className="font-semibold text-slate-900">Format:</span>
                  <span className="text-slate-600 ml-2">WAV files only</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold">
                  2
                </span>
                <div>
                  <span className="font-semibold text-slate-900">
                    Channels:
                  </span>
                  <span className="text-slate-600 ml-2">
                    Mono (single channel)
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold">
                  3
                </span>
                <div>
                  <span className="font-semibold text-slate-900">
                    Sample Rate:
                  </span>
                  <span className="text-slate-600 ml-2">22050 Hz</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold">
                  4
                </span>
                <div>
                  <span className="font-semibold text-slate-900">
                    Duration:
                  </span>
                  <span className="text-slate-600 ml-2">
                    10-14 seconds per file (recommended)
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Folder Structure */}
        <section className="mb-10">
          <h2
            id="folder-structure"
            className="text-2xl font-bold text-slate-900 mb-4"
          >
            Dataset Folder Structure
          </h2>
          <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto">
            <code>{`your-dataset/
├── wavs/
│   ├── 000001.wav
│   ├── 000002.wav
│   ├── 000003.wav
│   └── ...
└── metadata.csv`}</code>
          </pre>
        </section>

        {/* Metadata Format */}
        <section className="mb-10">
          <h2
            id="metadata-format"
            className="text-2xl font-bold text-slate-900 mb-4"
          >
            Metadata CSV Format
          </h2>
          <p className="text-slate-600 mb-4">
            The metadata file uses a pipe (
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">
              |
            </code>
            ) as the separator between filename and transcription.
          </p>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800">Important</p>
              <p className="text-yellow-700 text-sm">
                Do NOT use commas in the transcription text. Use semicolons (;)
                to indicate pauses or separate clauses.
              </p>
            </div>
          </div>

          <p className="text-slate-600 mb-3 font-medium">Example:</p>
          <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm">
            <code>{`000001.wav|আপনি জানতে চাইছেন এই প্রক্রিয়াটি কিভাবে কাজ করে?
000002.wav|আপনি রবি সিম রিপ্লেসমেন্ট সম্পর্কে জানতে চাচ্ছেন; অনুগ্রহ করে বলুন।
000003.wav|আপনি রবির সিইও সম্পর্কে জানতে চাচ্ছেন?
000004.wav|আপনি কি রবির সিইও; অর্থাৎ চিফ অপারেটিং অফিসার সম্পর্কে জানতে চাইছেন?
000005.wav|আপনি কি নিশ্চিত করতে চাইছেন যে আমি আপনার প্রশ্নের উত্তর সঠিকভাবে দিয়েছি?`}</code>
          </pre>
        </section>

        {/* Naming Convention */}
        <section className="mb-10">
          <h2
            id="naming-convention"
            className="text-2xl font-bold text-slate-900 mb-4"
          >
            File Naming Convention
          </h2>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Use zero-padded numbers (optional) - e.g., 000001.wav, 000002.wav
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Keep filenames consistent between wavs folder and metadata.csv
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Avoid spaces and special characters in filenames
            </li>
          </ul>
        </section>

        {/* Navigation */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between">
          <Link
            href="/docs/environment-variables"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Environment Variables
          </Link>
          <Link
            href="/docs/huggingface-upload"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            Upload to Hugging Face <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </article>

      <TableOfContents headings={tocHeadings} />
    </div>
  );
}
