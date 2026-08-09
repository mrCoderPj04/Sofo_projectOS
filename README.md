# SOFO ProjectOS — Enterprise Project Operating System 🚀

> *"Don't just manage work. Solve problems."*

**SOFO ProjectOS** is an enterprise-grade Project Operating System built for engineering teams, project managers, and administrators. It integrates live **Pjsofonic ERP Single Sign-On (SSO)**, **CockroachDB Cloud PostgreSQL**, **5-Whys Root Cause Analysis (RCA)**, **Mandatory Deliverable Uploads**, **Systemic Problem Resolution Audit Reports (PDF & Markdown)**, and a **Neon Glassmorphic Motion UI**.

---

## 🌐 Live Netlify Deployment Guide

This repository is **100% pre-configured for automated Netlify deployment** via `netlify.toml` and `@netlify/plugin-nextjs`.

### Step-by-Step Netlify Deployment:

1. **Log in to Netlify:**
   Go to [app.netlify.com](https://app.netlify.com) and log in.

2. **Import Existing Project:**
   - Click **"Add new site"** → **"Import an existing project"**.
   - Select **GitHub** and authorize access.
   - Select repository: **`mrCoderPj04/Sofo_projectOS`**.

3. **Build Settings (Auto-Detected):**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next`
   - **Node.js Version:** `20`

4. **Environment Variables Configuration:**
   In Netlify Site Settings (**Site Configuration** → **Environment Variables**), add the following:

   | Variable Name | Value | Description |
   |---|---|---|
   | `DATABASE_URL` | `postgresql://mr_coder_04:Ye2aw8Dp2QNFtbkUC3GyYw@sofo-projectmang-31597.j77.aws-ap-south-1.cockroachlabs.cloud:26257/sofo_proje_manag?sslmode=verify-full&schema=public` | CockroachDB Cloud PostgreSQL Connection |
   | `ERP_BACKEND_URL` | `https://erp-backend-1-02lc.onrender.com` | Live Pjsofonic ERP Backend API |
   | `JWT_SECRET` | `sofo_projectos_production_secret_key_2026` | Production Auth Token Secret |

5. **Deploy Site:**
   Click **"Deploy Site"**. Netlify will automatically build, generate Prisma Client, and deploy your live Next.js 15 application!

---

## 🌟 Key System Features

- **🔐 Pjsofonic ERP SSO Authentication:**
  - Integrated with live Pjsofonic ERP backend (`https://erp-backend-1-02lc.onrender.com`).
  - Strict employee verification (`isErpVerified: true`). Public registration is disabled.

- **🗄️ CockroachDB Cloud PostgreSQL Database:**
  - Production-ready schema powered by Prisma ORM connected to CockroachDB Cloud PostgreSQL (`sofo_proje_manag`).

- **📁 Mandatory Project Deliverable Docs Module:**
  - Required deliverable documents before finalizing project creation:
    1. **Implementation Plan File / Link**
    2. **Walkthrough Document / Link**
    3. **Project Logo Image / Link**
    4. **Presentation / Pitch Deck (PPT) File / Link**

- **🛠️ Systemic Problem Resolution OS & Scope Selection:**
  - Problem Creation modal with Environment Scope selection (Terminal, Server, Backend, Frontend, Localhost).
  - 5-Whys Root Cause Traversal workspace (`/problems/[id]`).
  - Action log for resolution steps ("Kya Kya Kra").
  - Automated Resolution Audit Report Generator (PDF & Markdown).

- **🎨 Neon Glassmorphism UI & Responsive Viewport System:**
  - **Neon Parrot Green (`#39FF14`)** hover glow effects.
  - **Glassmorphism Motion Backdrop Blur** styling.
  - Collapsible **Right-Side Slide-Over Navigation Drawer ([RightSidebar.jsx](file:///home/mr_coder_04/Documents/PROJECT/components/layout/RightSidebar.jsx))**.
  - Perfect Round Circle Logo (`/public/sofo_Pm.png`).

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
