import Link from "next/link";
import Image from "next/image";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-white shadow-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/onlylogo.png"
            alt="FirstTrain Logo"
            width={1000}
            height={1000}
            className="h-12 w-auto"
          />
          <span className="text-2xl font-bold text-purple-600">FirstTrain</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center text-xs sm:text-sm font-medium text-purple-700 bg-purple-100 px-3 py-1.5 rounded-full border border-purple-200 shadow-sm">
            Documentation
          </span>
          <Link href="/train">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
              Training Dashboard
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-12 md:py-16 bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-lg md:text-xl text-purple-100">
            Everything you need to know about training your Piper TTS model
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        {/* Table of Contents */}
        <nav className="mb-12 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Quick Navigation
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="#environment-variables"
                className="text-purple-600 hover:text-purple-700 hover:underline"
              >
                Environment Variables
              </a>
            </li>
            <li>
              <a
                href="#dataset-preparation"
                className="text-purple-600 hover:text-purple-700 hover:underline"
              >
                Dataset Preparation
              </a>
            </li>
            <li>
              <a
                href="#huggingface-upload"
                className="text-purple-600 hover:text-purple-700 hover:underline"
              >
                Uploading to Hugging Face
              </a>
            </li>
          </ul>
        </nav>

        {/* Environment Variables Section */}
        <section id="environment-variables" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              Environment Variables
            </h2>
          </div>

          <p className="text-slate-600 mb-6">
            These environment variables are used to configure your training job.
            They are passed to the RunPod instance and used by the training
            script.
          </p>

          {/* Required Variables */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">
              Required Variables
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-sm border border-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 border-b">
                      Variable
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 border-b">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        HF_DATASET_REPO_ID
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Your Hugging Face dataset repository ID (e.g.,
                      &quot;username/dataset-name&quot;)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        HF_DATASET_TOKEN
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Read access token for downloading your dataset from
                      Hugging Face
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        HF_UPLOAD_REPO_ID
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Target Hugging Face model repository for uploading trained
                      checkpoints & models
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        HF_UPLOAD_TOKEN
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Write access token for uploading models to Hugging Face
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        HF_UPLOAD_SESSION_ID
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Unique session identifier for organizing training outputs
                      (e.g., &quot;voicename-v1&quot;)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Checkpoint Variables */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">
              Checkpoint Variables
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-sm border border-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 border-b">
                      Variable
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 border-b">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        HF_CHECKPOINT_NAME
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Filename for the checkpoint to resume from (e.g.,
                      &quot;epoch=6189-step=1646826.ckpt&quot;)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        HF_CHECKPOINT_URL
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Direct download URL for the checkpoint file
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        HF_CHECKPOINT_TOKEN
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Access token for downloading the checkpoint (if private)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Training Hyperparameters */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">
              Training Hyperparameters
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-sm border border-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 border-b">
                      Variable
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 border-b">
                      Default
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 border-b">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        MAX_EPOCHS
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">-</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Maximum training epochs we want to train from the previous
                      checkpoint
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        CHECKPOINT_EPOCHS
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">25</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Save checkpoint every N epochs
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        BATCH_SIZE
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">16</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Training batch size (adjust based on GPU memory)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        PRECISION
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">16</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Training precision (16 for fp16; 32 for fp32)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        QUALITY
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">medium</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Model quality (low; medium; high)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        KEEP_LAST_K
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">2</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Number of recent checkpoints to keep
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        LANGUAGE
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">bn</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Language code for eSpeak phonemization (e.g., bn for
                      Bengali)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        MAX_WORKERS
                      </code>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">1</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      Number of CPU workers for data preprocessing (e.g., for
                      small datasets use 1)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Dataset Preparation Section */}
        <section id="dataset-preparation" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              Dataset Preparation
            </h2>
          </div>

          <p className="text-slate-600 mb-6">
            Your dataset should follow the LJSpeech format. Here are the
            requirements for preparing your audio files and metadata.
          </p>

          {/* Audio Requirements */}
          <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">
              Audio File Requirements
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <div>
                  <span className="font-medium text-slate-700">Format:</span>
                  <span className="text-slate-600 ml-2">WAV files only</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <div>
                  <span className="font-medium text-slate-700">Channels:</span>
                  <span className="text-slate-600 ml-2">
                    Mono (single channel)
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <div>
                  <span className="font-medium text-slate-700">
                    Sample Rate:
                  </span>
                  <span className="text-slate-600 ml-2">22050 Hz</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold">
                  4
                </span>
                <div>
                  <span className="font-medium text-slate-700">Duration:</span>
                  <span className="text-slate-600 ml-2">
                    10-14 seconds per file (recommended)
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Folder Structure */}
          <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">
              Dataset Folder Structure
            </h3>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`your-dataset/
├── wavs/
│   ├── 000001.wav
│   ├── 000002.wav
│   ├── 000003.wav
│   └── ...
└── metadata.csv`}</code>
            </pre>
          </div>

          {/* Metadata Format */}
          <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">
              Metadata CSV Format
            </h3>
            <p className="text-slate-600 mb-4">
              The metadata file uses a pipe (
              <code className="bg-slate-100 px-1 rounded">|</code>) as the
              separator between filename and transcription.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-yellow-800">Important:</p>
                  <p className="text-yellow-700 text-sm">
                    Do NOT use commas in the transcription text. Use semicolons
                    (;) to indicate pauses or separate clauses.
                  </p>
                </div>
              </div>
            </div>

            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`000001.wav|আপনি জানতে চাইছেন এই প্রক্রিয়াটি কিভাবে কাজ করে এবং এটা বুঝতে আপনার অসুবিধা হচ্ছে?
000002.wav|আপনি রবি সিম রিপ্লেসমেন্ট বা এমএনপি সার্ভিস সম্পর্কে জানতে চাচ্ছেন; অনুগ্রহ করে বিষয়টি আরেকটু স্পষ্ট করে বলুন।
000003.wav|আপনি রবির সিইও সম্পর্কে জানতে চাচ্ছেন?
000004.wav|আপনি কি রবির সিইও; অর্থাৎ চিফ অপারেটিং অফিসার সম্পর্কে জানতে চাইছেন?
000005.wav|আপনি কি নিশ্চিত করতে চাইছেন যে আমি আপনার প্রশ্নের উত্তর সঠিকভাবে দিয়েছি?`}</code>
            </pre>
          </div>

          {/* Naming Convention */}
          <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-700 mb-4">
              File Naming Convention
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Use zero-padded numbers - Optional (e.g., 000001.wav;
                000002.wav)
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Keep filenames consistent between wavs folder and metadata.csv
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Avoid spaces and special characters in filenames
              </li>
            </ul>
          </div>
        </section>

        {/* Hugging Face Upload Section */}
        <section id="huggingface-upload" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              Uploading to Hugging Face
            </h2>
          </div>

          <p className="text-slate-600 mb-6">
            Follow these steps to upload your prepared dataset to Hugging Face.
          </p>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  1
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Create a Dataset Repository
                  </h3>
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
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Upload Your Files
                  </h3>
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
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Generate Access Token
                  </h3>
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
            </div>

            {/* Step 4 */}
            <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  4
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Start Training
                  </h3>
                  <p className="text-slate-600">
                    Head to the{" "}
                    <Link
                      href="/train"
                      className="text-purple-600 hover:underline"
                    >
                      Training Dashboard
                    </Link>{" "}
                    and fill in your configuration to start training!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center p-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Train Your Model?
          </h2>
          <p className="text-purple-100 mb-6">
            Start training your custom Piper TTS model in minutes.
          </p>
          <Link href="/train">
            <button className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition shadow-lg">
              Start Training Now
            </button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 bg-purple-600 text-purple-100 text-center">
        <p>© 2025 FirstTrain. All rights reserved.</p>
      </footer>
    </div>
  );
}
