import Link from "next/link";
import { TableOfContents } from "@/components/table-of-contents";
import { ArrowRight, ArrowLeft } from "lucide-react";

const tocHeadings = [
  { id: "required", text: "Required Variables", level: 2 },
  { id: "checkpoint", text: "Checkpoint Variables", level: 2 },
  { id: "hyperparameters", text: "Training Hyperparameters", level: 2 },
];

export default function EnvironmentVariablesPage() {
  return (
    <div className="flex">
      <article className="flex-1 py-8 px-6 lg:px-8 min-w-0">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Environment Variables
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Configure your training job using these environment variables. They
          are passed to the RunPod instance.
        </p>

        {/* Required Variables */}
        <section className="mb-10">
          <h2 id="required" className="text-2xl font-bold text-slate-900 mb-4">
            Required Variables
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b">
                    Variable
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      HF_DATASET_REPO_ID
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Your Hugging Face dataset repository ID (e.g.,
                    &quot;username/dataset-name&quot;)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      HF_DATASET_TOKEN
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Read access token for downloading your dataset
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      HF_UPLOAD_REPO_ID
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Target repository for uploading trained checkpoints & models
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      HF_UPLOAD_TOKEN
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Write access token for uploading models
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      HF_UPLOAD_SESSION_ID
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Unique session identifier for organizing outputs (e.g.,
                    &quot;voicename-v1&quot;)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Checkpoint Variables */}
        <section className="mb-10">
          <h2
            id="checkpoint"
            className="text-2xl font-bold text-slate-900 mb-4"
          >
            Checkpoint Variables
          </h2>
          <p className="text-slate-600 mb-4">
            Use these to resume training from an existing checkpoint.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b">
                    Variable
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      HF_CHECKPOINT_NAME
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Filename (e.g., &quot;epoch=6189-step=1646826.ckpt&quot;)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      HF_CHECKPOINT_URL
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Direct download URL for the checkpoint file
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      HF_CHECKPOINT_TOKEN
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Access token for downloading (if private)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Hyperparameters */}
        <section className="mb-10">
          <h2
            id="hyperparameters"
            className="text-2xl font-bold text-slate-900 mb-4"
          >
            Training Hyperparameters
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b">
                    Variable
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b">
                    Default
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      MAX_EPOCHS
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-500">-</td>
                  <td className="px-4 py-3 text-slate-600">
                    Maximum training epochs from checkpoint
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      CHECKPOINT_EPOCHS
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-500">25</td>
                  <td className="px-4 py-3 text-slate-600">
                    Save checkpoint every N epochs
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      BATCH_SIZE
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-500">16</td>
                  <td className="px-4 py-3 text-slate-600">
                    Training batch size
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      PRECISION
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-500">16</td>
                  <td className="px-4 py-3 text-slate-600">
                    16 for fp16, 32 for fp32
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      QUALITY
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-500">medium</td>
                  <td className="px-4 py-3 text-slate-600">
                    low, medium, or high
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      KEEP_LAST_K
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-500">2</td>
                  <td className="px-4 py-3 text-slate-600">
                    Number of recent checkpoints to keep
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      LANGUAGE
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-500">bn</td>
                  <td className="px-4 py-3 text-slate-600">
                    Language code for eSpeak
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      MAX_WORKERS
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-500">1</td>
                  <td className="px-4 py-3 text-slate-600">
                    CPU workers for preprocessing
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Navigation */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between">
          <Link
            href="/docs/quickstart"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Quick Start
          </Link>
          <Link
            href="/docs/dataset-preparation"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            Dataset Preparation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </article>

      <TableOfContents headings={tocHeadings} />
    </div>
  );
}
