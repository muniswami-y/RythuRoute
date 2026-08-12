# 🚀 RythuRoute Permanent Deployment Guide

This guide explains how to deploy **RythuRoute** online so it stays **live 24/7** and all your data (users, products, orders, addresses, payments) is **permanently saved**.

---

## 💡 Why Does Data Disappear on Free Cloud Hosts?

Free cloud hosting platforms (like Render, Railway, Fly.io, Heroku) use **ephemeral filesystems**. When the server goes to sleep or redeploys, local files like `database.sqlite` and local uploaded photos get reset.

### ✅ The Permanent Solution: Cloud Database
RythuRoute has **built-in dual database support**:
- If `DATABASE_URL` is set, it automatically connects to a **Cloud PostgreSQL database** (data is permanently saved forever).
- If not set, it defaults to local SQLite.

---

## 🌟 Method 1: Render + Free Neon PostgreSQL (Recommended - 100% Free)

### Step 1: Create a Free Permanent Cloud PostgreSQL Database
1. Go to **[Neon.tech](https://neon.tech)** (or **[Supabase.com](https://supabase.com)**) and sign up for free.
2. Click **Create Project** (e.g. name it `rythuroute-db`).
3. Under **Connection Details**, copy the **Postgres Connection URI** string:
   ```text
   postgresql://username:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

---

### Step 2: Push Your Code to GitHub
Ensure all your latest changes are pushed to your GitHub repository:
```powershell
git add .
git commit -m "Configure permanent deployment with cloud database"
git push origin main
```

---

### Step 3: Deploy on Render
1. Go to **[Render Dashboard](https://dashboard.render.com/)** and log in.
2. Click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** → connect `RythuRoute` (`muniswami-y/RythuRoute`).
4. Fill in the deployment settings:
   - **Name**: `rythuroute` (or your preferred name)
   - **Region**: Closest to your users (e.g., *Singapore*, *Frankfurt*, or *Ohio*)
   - **Branch**: `main`
   - **Root Directory**: *(Leave empty)*
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. Scroll down to **Environment Variables** and add:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables production mode & SPA routing |
   | `DATABASE_URL` | `postgresql://...` | Paste your Neon/Supabase PostgreSQL connection string |
   | `JWT_SECRET` | *(Generate or type a random 32-char string)* | For secure user login tokens |
   | `JWT_EXPIRES_IN` | `7d` | Login token expiry |
   | `RAZORPAY_KEY_ID` | `rzp_test_...` | *(Optional: From your Razorpay Dashboard)* |
   | `RAZORPAY_KEY_SECRET` | `your_razorpay_secret` | *(Optional: From your Razorpay Dashboard)* |

6. Click **Deploy Web Service**.

---

### Step 4: Verify Deployment
- Render will install dependencies, build the React frontend bundle, and run `backend/seed.js` to automatically initialize all database tables.
- Once the log shows `Server running on port 10000 in production mode`, click your Render URL:
  `https://rythuroute-xxxx.onrender.com`

**Default Admin Credentials:**
- **Email**: `admin@rythuroute.com`
- **Password**: `admin123`

---

## 🚂 Method 2: Railway.app Deployment (Alternative)

1. Go to **[Railway.app](https://railway.app)** and log in with GitHub.
2. Click **New Project** → **Provision PostgreSQL**.
3. In the same project, click **New** → **GitHub Repo** → select `RythuRoute`.
4. Add environment variables in the service settings:
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}` (Railway links this automatically)
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `your_random_jwt_secret_key`
5. Go to **Settings** → **Generate Domain** to get your live URL.

---

## 💻 Method 3: Self-Hosting from Your PC with Cloudflare Tunnel (100% Zero-Cost Local Host)

If you prefer to host from your own computer where SQLite and images are stored directly on your hard drive:

1. Double-click `host-my-own.bat` in the project folder to start the server at `http://localhost:5000`.
2. Install [Cloudflare Tunnel (`cloudflared`)](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-remote-tunnel/):
   ```powershell
   cloudflared tunnel --url http://localhost:5000
   ```
3. Cloudflare gives you a permanent, free public HTTPS URL (`https://your-tunnel-name.trycloudflare.com`) pointing to your PC.

---

## 🔒 Security & Best Practices Checklist

- [x] Change the default admin password after initial login (`admin@rythuroute.com`).
- [x] Add your live `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` when moving to live payments.
- [x] Cloud PostgreSQL stores all records securely with automatic SSL encryption.
- [x] Keep your `JWT_SECRET` confidential in the cloud host's Environment Variables dashboard.
