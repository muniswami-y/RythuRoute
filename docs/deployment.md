# 🚀 RythuRoute Permanent Self-Hosting & Cloudflare Tunnel Guide

This guide shows how to run **RythuRoute** on your Windows PC and make it publicly available across the internet **24/7 with a permanent HTTPS domain** — with **zero hosting cost** and **100% permanent data storage**.

---

## 🌟 Why Self-Hosting with Cloudflare Tunnel is the Best Choice

| Feature | Cloudflare Tunnel Self-Hosting | Free Cloud Hosts (Render, Heroku, etc.) |
|---|---|---|
| **Cost** | **100% Free Forever** | Often paid / sleep after inactivity |
| **Data Safety** | **100% Permanent on your Hard Drive** | Ephemeral (erased on restarts/sleeps) |
| **Image Uploads** | **Saved permanently in `/uploads`** | Deleted on redeploy |
| **Public HTTPS URL** | **Yes (Cloudflare SSL included)** | Yes |
| **Setup Time** | **1 Double-Click (`start-online.bat`)** | Multiple signup steps |

---

## ⚡ Option 1: Instant 1-Click Launch (Quick Tunnel)

1. Navigate to your project folder: `D:\RythuRoute`
2. **Double-click `start-online.bat`**.
3. It will:
   - Compile the React frontend and verify the SQLite database.
   - Start the RythuRoute Node.js server on port 5000.
   - Open a secure Cloudflare Tunnel and output your public URL:
     ```text
     +--------------------------------------------------------------------------------------------+
     |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
     |  https://random-words-here.trycloudflare.com                                               |
     +--------------------------------------------------------------------------------------------+
     ```
4. **Copy the `https://...trycloudflare.com` URL** and open it on your phone, laptop, or share it with anyone!

---

## 🌐 Option 2: Permanent Custom Domain (Zero Trust Tunnel)

If you want a **fixed permanent domain name** (e.g. `market.yourdomain.com`) that never changes:

1. Create a free account at **[Cloudflare Dashboard](https://dash.cloudflare.com/)**.
2. Go to **Zero Trust** → **Networks** → **Tunnels** → click **Create a Tunnel**.
3. Name your tunnel (e.g. `rythuroute`) and click **Save Tunnel**.
4. Choose **Windows** environment and copy the install command shown on screen:
   ```powershell
   cloudflared.exe service install <YOUR_TOKEN>
   ```
5. Open PowerShell as Administrator and run the command.
6. Under the **Public Hostname** tab in Cloudflare:
   - **Service Type**: `HTTP`
   - **URL**: `localhost:5000`
7. Click **Save Hostname**.

Your site will now be live on your custom domain 24/7, and Cloudflare will automatically keep the connection alive even if your PC restarts!

---

## 🔄 Running the Server 24/7 in Background (PM2)

To keep the Node.js server running in the background without keeping a Command Prompt window open:

1. Install PM2 globally:
   ```powershell
   npm install -g pm2
   ```
2. Start RythuRoute with PM2:
   ```powershell
   pm2 start backend/src/server.js --name "rythuroute"
   ```
3. Save the process so it restarts if your computer reboots:
   ```powershell
   pm2 save
   ```

---

## 🔑 Default Admin Account
- **Email**: `admin@rythuroute.com`
- **Password**: `admin123`
