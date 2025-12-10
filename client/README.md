# FirstTrain - Piper TTS Training

A modern web interface for deploying and managing Piper TTS training jobs on RunPod.

## Features

- One-click training job deployment to RunPod
- Comprehensive documentation for dataset preparation
- Docker support for easy deployment

---

## Quick Start

### Prerequisites

- Node.js 22+ (for local development without docker)
- Docker and Docker Compose (for containerized deployment)
- RunPod API Key with read/write permissions

### Environment Setup

1. Copy the environment template:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your values:

```env
RUNPOD_API_KEY=your_runpod_api_key
AUTH_USERNAME=your_username
AUTH_PASSWORD=your_password
```

---

## Running Locally

### Development Mode

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start the container
docker compose up --build -d

# View logs
docker compose logs firsttrain

# Stop the container
docker compose down
```

### Using Docker Directly

```bash
# Build the image
docker build -t firsttrain-client .

# Run the container
docker run -d \
  -p 3000:3000 \
  -e RUNPOD_API_KEY=your_key \
  -e AUTH_USERNAME=your_username \
  -e AUTH_PASSWORD=your_password \
  --name firsttrain \
  firsttrain-client
```

---

## Environment Variables

| Variable         | Required | Default | Description                                |
| ---------------- | -------- | ------- | ------------------------------------------ |
| `RUNPOD_API_KEY` | Yes      | -       | Your RunPod API key with read/write access |
| `AUTH_USERNAME`  | No       | \_      | Login username for the dashboard           |
| `AUTH_PASSWORD`  | No       | \_      | Login password for the dashboard           |

---

## Project Structure

```
client/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes (server-side)
│   │   ├── docs/         # Documentation page
│   │   ├── train/        # Training dashboard
│   │   └── page.tsx      # Landing page
│   ├── components/       # React components
│   └── lib/              # Utilities and API client
├── public/               # Static assets
├── Dockerfile            # Docker build configuration
├── docker-compose.yml    # Docker Compose setup
└── .env.example          # Environment template
```

---

## API Routes

| Endpoint                    | Method | Description         |
| --------------------------- | ------ | ------------------- |
| `/api/v1/auth/login`        | POST   | User authentication |
| `/api/v1/pods`              | GET    | List all pods       |
| `/api/v1/pods`              | POST   | Create a new pod    |
| `/api/v1/pods/[podId]`      | GET    | Get pod details     |
| `/api/v1/pods/[podId]`      | DELETE | Terminate a pod     |
| `/api/v1/pods/[podId]/stop` | POST   | Stop a pod          |

---

## Documentation

Visit `/docs` in the application for comprehensive guides on:

- Environment variables for training
- Dataset preparation (LJSpeech format)
- Hugging Face upload instructions

---

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Language**: TypeScript
