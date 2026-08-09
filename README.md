<p align="center">
  <img src="public/sofo_Pm.png" alt="SOFO ProjectOS Round Logo" width="120" height="120" style="border-radius: 50%;" />
</p>

<h1 align="center">SOFO ProjectOS — Enterprise Project Operating System 🚀</h1>

<p align="center">
  <i>"Don't just manage work. Solve problems."</i>
</p>

<p align="center">
  <a href="https://sofo-projectos.onrender.com">
    <img src="https://img.shields.io/badge/Live_App-sofo--projectos.onrender.com-39FF14?style=for-the-badge&logo=render&logoColor=black" alt="Live Application" />
  </a>
  <a href="https://sofo-projectos.onrender.com/login">
    <img src="https://img.shields.io/badge/Login_Portal-Online-blue?style=for-the-badge&logo=auth0&logoColor=white" alt="Login Portal" />
  </a>
</p>

---

## 🌐 Live Application URLs

- 🚀 **Live Production Application:** [https://sofo-projectos.onrender.com](https://sofo-projectos.onrender.com)
- 🔐 **SSO Employee Login Portal:** [https://sofo-projectos.onrender.com/login](https://sofo-projectos.onrender.com/login)

---

## 🌟 Highlights & Key System Features

- **🔐 Pjsofonic ERP SSO Authentication:**
  - Integrated with live Pjsofonic ERP backend (`https://erp-backend-1-02lc.onrender.com`).
  - Strict employee verification (`isErpVerified: true`). Public registration is disabled and managed exclusively via Pjsofonic ERP Central Administration.

- **🗄️ CockroachDB Cloud PostgreSQL Database:**
  - Production-ready schema powered by Prisma ORM connected to CockroachDB Cloud PostgreSQL (`sofo_proje_manag`).

- **📁 Mandatory Project Deliverable Docs Module:**
  - Step 6 in Project Creation Wizard requires 4 mandatory deliverable documents before finalizing project creation:
    1. **Implementation Plan File / Link**
    2. **Walkthrough Document / Link**
    3. **Project Logo Image / Link**
    4. **Presentation / Pitch Deck (PPT) File / Link**
  - Dedicated Deliverables Repository on Project Workspace page (`/projects/[id]`).

- **🛠️ Systemic Problem Resolution OS & Scope Selection:**
  - Problem Creation modal with Environment Scope selection:
    - 🖥️ **Terminal**
    - 🖥️ **Server**
    - ⚙️ **Backend**
    - 🎨 **Frontend**
    - 💻 **Localhost**
  - 5-Whys Root Cause Traversal workspace (`/problems/[id]`).
  - Interactive **"Solution Execution Steps & Resolution Summary" ("Kya Kya Kra")** action log.
  - Automated **Systemic Problem Resolution Audit Report Generator** supporting instant PDF printing (`window.print()`) and Markdown (`.md`) download.

- **🎨 Neon Glassmorphism UI & Responsive Viewport System:**
  - Futuristic **Neon Parrot Green (`#39FF14`)** hover glow effects and developer workspace background image (`/code_bg.jpg`).
  - **Glassmorphism Motion Backdrop Blur (`backdrop-blur-xl bg-zinc-950/75 border border-zinc-800/80 shadow-2xl`)** on all cards, panels, and sidebars.
  - Collapsible **Right-Side Slide-Over Navigation Drawer ([RightSidebar.jsx](file:///home/mr_coder_04/Documents/PROJECT/components/layout/RightSidebar.jsx))**.
  - Perfect Round Circle Logo (`/public/sofo_Pm.png`).
  - Fluid viewport auto-fit configuration (`export const viewport` in `app/layout.js`) self-adjusting to all device screen sizes.

---

## 🌐 Live Render.com Deployment Guide

This repository is **100% pre-configured for automated Render.com deployment** via `render.yaml` Blueprint.

### Step-by-Step Render.com Deployment:

1. **Log in to Render.com:**
   Go to [dashboard.render.com](https://dashboard.render.com) and log in.

2. **Create New Web Service:**
   - Click **"New +"** → **"Web Service"** (or **"Blueprint"**).
   - Connect your GitHub repository: **`mrCoderPj04/Sofo_projectOS`**.

3. **Build & Start Settings (Auto-Detected):**
   - **Environment:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`
   - **Node.js Version:** `20.18.0`

4. **Environment Variables Configuration:**
   In Render Dashboard (**Environment** section), add the following:

   | Variable Name | Value | Description |
   |---|---|---|
   | `DATABASE_URL` | `postgresql://mr_coder_04:Ye2aw8Dp2QNFtbkUC3GyYw@sofo-projectmang-31597.j77.aws-ap-south-1.cockroachlabs.cloud:26257/sofo_proje_manag?sslmode=verify-full&schema=public` | CockroachDB Cloud PostgreSQL Connection |
   | `ERP_BACKEND_URL` | `https://erp-backend-1-02lc.onrender.com` | Live Pjsofonic ERP Backend API |
   | `JWT_SECRET` | `sofo_projectos_production_secret_key_2026` | Production Auth Token Secret |

5. **Deploy Service:**
   Click **"Create Web Service"**. Render will build the Next.js 15 app, generate the Prisma client, and deploy your live application at **`https://sofo-projectos.onrender.com`**!

---

## 💻 Local Development Setup

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run local development server
npm run dev
```

App will be live at **http://localhost:3000**.

---

## 📜 License

Distributed under the MIT License. See [LICENSE](file:///home/mr_coder_04/Documents/PROJECT/LICENSE) for details.

© 2026 **Pjsofonic / mrCoderPj04**. All Rights Reserved.
