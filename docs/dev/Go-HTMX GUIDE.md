# Implementation Guide: Piper Training GUI (Go + HTMX)

This guide outlines the steps to build the local GUI application for managing Piper TTS training on RunPod.

## Phase 1: Go Project Setup & Server

**Goal**: Get a basic Go server running that serves HTML templates.

1.  **Initialize Go Module**:
    ```bash
    go mod init piper-gui
    ```
2.  **Directory Structure**:
    ```text
    /cmd
      /server
        main.go
    /internal
      /config    (Config structs, env loading)
      /runpod    (RunPod API client)
    /templates   (HTML templates)
      index.html
      config.html
    /static      (CSS, images)
    ```
3.  **Dependencies**:
    - `github.com/go-chi/chi/v5` (Router) - Lightweight.
    - `html/template` (Standard lib) - For rendering.

## Phase 2: Configuration & State Management

**Goal**: Allow users to save their "Profiles" (API Keys + Defaults) so they don't type them every time.

1.  **Data Model**:
    - Create a struct `AppConfig` to hold:
      - `RunPodAPIKey`
      - `HuggingFaceReadToken`
      - `HuggingFaceWriteToken`
    - Create a struct `TrainingJob` to hold:
      - `DatasetRepo`
      - `OutputRepo`
      - `Hyperparameters` (Batch size, etc.)
2.  **Persistence**:
    - Use a simple JSON file store (`config.json`) in the app directory for MVP.
    - Load on startup, save on form submit.

## Phase 3: The UI (HTMX)

**Goal**: Create a reactive form without writing React.

1.  **Layout**:
    - **Sidebar**: "Settings" (API Keys), "New Job", "History".
    - **Main Content**: Forms.
2.  **Settings Page**:
    - Input fields for API Keys.
    - `HTMX` attribute `hx-post="/save-settings"` to save without refresh.
3.  **Job Page**:
    - Form fields mapping to the `ENVIRONMENT VARIABLES` required by `piper_train_runpod.sh`.
    - Dropdowns for Enums (Quality: Low/Medium/High).

## Phase 4: RunPod Integration

**Goal**: "Click Button" -> "Pod Starts".

1.  **RunPod Client**:
    - Implement `CreatePod(config JobConfig)` function in Go.
    - This function must construct the **Mutation** or **REST Payload**.
    - **Crucial Step**: It must automatically generate the `docker_args` or `container_start_command`.
      - _Logic_: The Go app will have the "Bash Script Template" key-coded. It will inject the necessary values if needed, or simply pass the static curl-loader script.
    - **Env Var Injection**: Map the Go struct `TrainingJob` to the `env` list in the RunPod payload.
2.  **Deploy Action**:
    - Button `hx-post="/deploy"`.
    - Server calling RunPod API.
    - Return success message / Pod ID.

## Phase 5: Refinement

1.  **Validation**: Ensure tokens look valid before sending.
2.  **Feedback**: Show "Deploying..." spinner using HTMX `hx-indicator`.
3.  **Links**: Display links to the created Pod URL or HuggingFace repo after success.

---

## Technical constraints & Decisions

- **Language**: Go (Latest)
- **Frontend**: Plain HTML + HTMX + TailwindCSS (CDN for dev, embedded for release).
- **Deployment**: `go build`.
