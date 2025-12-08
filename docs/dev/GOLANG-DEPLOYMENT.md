# Deployment Guide: Go + HTMX on Cloud VMs (AWS/GCP)

This guide explains how to deploy your **Go + HTMX** application to a cloud Virtual Machine (like AWS EC2 or Google Compute Engine).

## Why is Go great for Cloud Deployment?

Unlike Node.js/Next.js, Go compiles into a **single, standalone binary file**.

- **No dependencies**: You don't need to install `npm`, `node`, `python`, or `ruby` on the server.
- **No complex build**: You build it once on your machine, upload the file, and run it.

---

## Step 1: Build for Linux (Cross-Compilation)

Even if you are on Windows or Mac, you can build a binary for the Linux Cloud VM.

In your local project folder:

```powershell
$env:GOOS = "linux"
$env:GOARCH = "amd64"
go build -o piper-server
```

_(This creates a file named `piper-server` that is executable on Linux)_

## Step 2: Set up the VM (AWS EC2 / GCP)

1.  **Create an Instance**:
    - **OS**: Ubuntu 22.04 LTS (Recommended) or Debian.
    - **Firewall/Security Group**: Allow **HTTP (80)** and **SSH (22)**.
2.  **Connect**: SSH into your server.
    ```bash
    ssh -i key.pem ubuntu@your-server-ip
    ```

## Step 3: Upload the Application

Use `scp` to copy the binary and your assets (templates) to the server.

```bash
# Run this from your LOCAL machine
scp -i key.pem piper-server ubuntu@your-server-ip:~/
scp -i key.pem -r templates/ ubuntu@your-server-ip:~/
scp -i key.pem -r static/ ubuntu@your-server-ip:~/
```

## Step 4: Run as a Service (Systemd)

To ensure the app starts automatically and restarts if it crashes, use `systemd`.

1.  **Move files to a permanent location**:

    ```bash
    sudo mkdir -p /opt/piper-gui
    sudo mv ~/piper-server /opt/piper-gui/
    sudo mv ~/templates /opt/piper-gui/
    sudo mv ~/static /opt/piper-gui/
    sudo chmod +x /opt/piper-gui/piper-server
    ```

2.  **Create Service File**:

    ```bash
    sudo nano /etc/systemd/system/piper-gui.service
    ```

    Paste this content:

    ```ini
    [Unit]
    Description=Piper TTS GUI
    After=network.target

    [Service]
    User=ubuntu
    WorkingDirectory=/opt/piper-gui
    # Run slightly unprivileged or use authbind for port 80,
    # but for simplicity we often run on 8080 and proxy with Nginx.
    ExecStart=/opt/piper-gui/piper-server
    Restart=always

    [Install]
    WantedBy=multi-user.target
    ```

3.  **Start and Enable**:
    ```bash
    sudo systemctl daemon-reload
    sudo systemctl start piper-gui
    sudo systemctl enable piper-gui
    ```

## Step 5: Expose via Nginx (Reverse Proxy)

This is best practice to handle SSL (HTTPS) and port forwarding easily.

1.  **Install Nginx**:
    ```bash
    sudo apt update
    sudo apt install nginx -y
    ```
2.  **Configure**:

    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```

    Replace `location / { ... }` with:

    ```nginx
    server {
        listen 80;
        server_name _;

        location / {
            proxy_pass http://localhost:8080; # Assuming your Go app runs on 8080
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
    ```

3.  **Restart Nginx**:
    ```bash
    sudo systemctl restart nginx
    ```

## Summary

Your Go app is now running at `http://your-server-ip`.
To update it in the future:

1. `go build` locally.
2. `scp` the new binary.
3. `sudo systemctl restart piper-gui`.
