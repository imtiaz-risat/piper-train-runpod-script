**Role**: You are an expert Frontend Architect and UI Designer.

**Goal**: Build a **Client-Only Dashboard** for training Piper TTS models on RunPod. The application must be beautiful, modern (shadcn/ui style), and completely functional using Mock Data for now.

**Tech Stack**: React, TailwindCSS, Lucide Icons, Shadcn/UI (or compatible), TypeScript.

### 1. Functional Requirements

The app has two main states: "Locked" (No API Keys) and "Active" (Dashboard).

#### A. Authentication Overlay (Locked State)

- **Concept**: Since we do not want to store dangerous GPU cloud API keys in the browser, the user must enter them _every time_ they refresh.
- **UI**: A centered, glassmorphism modal/card.
- **Fields**:
  - `RunPod API Key` (Password field, eye toggle)
  - `HuggingFace Write Token` (For uploads)
  - `HuggingFace Read Token` (For datasets)
- **Action**: "Enter Dashboard". This saves the keys to **React State/Context Only** (not localStorage).

#### B. Main Dashboard (Active State)

A polished dashboard layout with a Sidebar (or Top Nav) and Main Content Area.

**Section 1: Active Pods (Home)**

- Display a grid of "Active Training Jobs".
- Each card shows: `Pod Name`, `Status` (Running/Exited), `GPU Type`, `Cost/Hr`.
- **Actions**: "Terminate Pod" (Destructive button).
- **Mock Data**: Create an `api-client.ts` that returns a list of fake running pods.

**Section 2: New Training Job (Wizard Form)**
A multi-step or long-form wizard to configure a training session.

- **Step 1: Resource Config**:
  - Pod Name (Auto-generated timestamped name).
  - GPU Type (Dropdown: RTX 3090, RTX 4090, A6000, A100).
  - Cloud Type (Secure vs Community).
- **Step 2: Dataset & Tokens**:
  - Dataset Repository (e.g., `user/dataset`).
  - Upload Repository (e.g., `user/checkpoints`).
- **Step 3: Hyperparameters**:
  - Batch Size (Slider/Input: 8-128).
  - Epochs (Input: 10-10000).
  - Quality (Select: Low, Medium, High).
- **Action**: "Deploy Training Job".
  - This should call `api-client.ts` -> `createPod(config)`.
  - Show a "Deploying..." toast/spinner.

### 2. Architecture & Code Structure

**`api-client.ts`**
Create this file to handle all data fetching. It should have a `mockMode` flag.

```typescript
interface Pod {
  id: string;
  name: string;
  status: string;
  cost: number;
}

export const apiClient = {
  getPods: async (apiKey: string): Promise<Pod[]> => {
    // Return mock data for now
    return [
      { id: "pod-1", name: "piper-bn-train-01", status: "RUNNING", cost: 0.74 },
      { id: "pod-2", name: "piper-en-train-02", status: "EXITED", cost: 0.74 },
    ];
  },
  createPod: async (apiKey: string, config: any) => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 2000));
    return { success: true, id: "pod-new-123" };
  },
  terminatePod: async (apiKey: string, podId: string) => {
    // Simulate delete
    return { success: true };
  },
};
```

### 3. Visual Style

- **Theme**: Dark Mode default. Sleek, "Cyberpunk" or "SaaS" aesthetic.
- **Colors**: Deep purples/blues for primary actions, subtle organzes for warnings.
- **Feedback**: Use Toasts (Sonner/Radix) for every action.
- **Layout**: Responsive, but optimized for Desktop.

**Prompt**: Please verify you understand the requirements and generate the project structure and key components (AuthModal, Dashboard, JobForm, API Client).
