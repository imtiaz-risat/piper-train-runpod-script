# Project Overview: Piper TTS RunPod Training GUI

This document outlines the current state of the Piper TTS Training project and the roadmap for converting the manual CLI/RunPod-UI workflow into a user-friendly GUI application.

## 1. Current System (Legacy)

The current system relies on manual interaction with the RunPod interface and bash scripts running inside the pod.
(See `README.md` for full details of the legacy flow).

## 2. Target Architecture: Client-Only Web App

We have selected a **Serverless / Client-Only Architecture** to minimize complexity and maintenance.

### **Technical Stack**

- **Framework**: **React** or **Svelte** (Single Page Application).
- **Networking**: **Direct REST API** calls from the Browser to RunPod (`https://rest.runpod.io/v1`).
- **Security**: **In-Memory Secrets Only**.
  - API and HF Tokens are stored in the application state (Ram) only.
  - If the page is refreshed, the user must re-enter credentials.
  - **No** keys are ever stored in `localStorage`, `cookies`, or sent to a custom backend.
- **Deployment**: Static HTML/JS files served via **Nginx** on a Cloud VM (AWS/GCP).

### **Core Responsibilities**

1.  **Session Management**:
    - Prompt user for RunPod Key + HF Tokens on startup.
    - Pass these tokens to the internal API client for authenticated requests.
2.  **Job Configuration**:
    - UI Wizard to select datasets, hyperparameters (Epochs, Batch Size), and hardware (GPU type).
3.  **Orchestration**:
    - The browser client constructs the complex JSON payload required by RunPod.
    - The browser client injects the "Bootstrap Command" (the large bash script) directly into the JSON.
    - The browser sends the `POST /pods` request.

### **Guides & References**

- **React Implementation**: [`docs/dev/REACT-CLIENT-GUIDE.md`](./docs/dev/REACT-CLIENT-GUIDE.md)
- **Svelte Implementation**: [`docs/dev/SVELTE-CLIENT-GUIDE.md`](./docs/dev/SVELTE-CLIENT-GUIDE.md) (Recommended for simplicity)
- **API Reference**: RunPod REST API (See `docs/runpod-api/`)
- **AI Design Prompt**: [`docs/design-prompt.md`](./docs/design-prompt.md) (For generating the UI with AI tools)
