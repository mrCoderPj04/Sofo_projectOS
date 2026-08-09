# SOFO ProjectOS — Enterprise Project Operating System 🚀

> *"Don't just manage work. Solve problems."*

**SOFO ProjectOS** is an enterprise-grade Project Operating System built for engineering teams, project managers, and administrators. It integrates live **Pjsofonic ERP Single Sign-On (SSO)**, **CockroachDB Cloud PostgreSQL**, **5-Whys Root Cause Analysis (RCA)**, **Mandatory Deliverable Uploads**, **Systemic Problem Resolution Audit Reports (PDF & Markdown)**, and a **Neon Glassmorphic Motion UI**.

---

## 🌟 Highlights & Key Features

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm / yarn / pnpm

### Environment Configuration (`.env`)

Create a `.env` file in the project root:

```env
# Database Connection (CockroachDB Cloud PostgreSQL)
DATABASE_URL="postgresql://mr_coder_04:Ye2aw8Dp2QNFtbkUC3GyYw@sofo-projectos-31597.j77.aws-ap-south-1.cockroachlabs.cloud:26257/sofo_proje_manag?sslmode=verify-full&schema=public"

# Pjsofonic ERP Live API Backend
ERP_BACKEND_URL="https://erp-backend-1-02lc.onrender.com"

# Session Secret
JWT_SECRET="sofo_projectos_production_secret_key_2026"
```

### Installation & Local Development

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run local development server
npm run dev
```

App will be available at **http://localhost:3000**.

### Production Build

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

---

## 📂 Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/               # Pjsofonic ERP SSO Login Portal
│   │   └── register/            # Redirects to Login (Registration disabled)
│   ├── (dashboard)/
│   │   ├── dashboard/           # Master Dashboard & Analytics Overview
│   │   ├── projects/            # Project Management & Deliverables Repository
│   │   │   ├── new/             # 8-Step Wizard with Mandatory Deliverables Module
│   │   │   └── [id]/            # Project Workspace with Deliverables Tab
│   │   ├── problems/            # Problem Resolution OS
│   │   │   └── [id]/            # 5-Whys Workspace, Action Log & Report Generator
│   │   └── layout.js            # Responsive Layout Wrapper
│   ├── api/                     # Next.js App Router API Routes
│   │   ├── auth/                # Live ERP Authentication API
│   │   ├── projects/            # Project & Deliverables API
│   │   ├── problems/            # Problem & 5-Whys RCA API
│   │   └── solutions/           # Solution Evaluation API
│   ├── globals.css              # Glassmorphism & Neon Parrot Green Styling
│   ├── layout.js                # Fluid Viewport Root Layout
│   └── not-found.js             # 404 Handler
├── components/
│   ├── layout/
│   │   ├── Header.jsx           # Ultra-Sleek Glassmorphic Enterprise Header
│   │   ├── Sidebar.jsx          # Left Persistent Workspace Navigation
│   │   ├── RightSidebar.jsx     # Right-Side Collapsible Slide-Over Drawer
│   │   └── CommandPalette.jsx   # ⌘K Command Search Palette
│   ├── projects/
│   │   └── ProjectArtifactsSection.jsx # 4 Deliverables Upload Component
│   └── ui/                      # Reusable UI Components (Card, Badge, Button)
├── prisma/
│   └── schema.prisma            # CockroachDB PostgreSQL Prisma Schema
└── public/
    ├── sofo_Pm.png              # Round Circle Logo Image
    └── code_bg.jpg              # Software Engineering Background Image
```

---

## 📜 License

Distributed under the MIT License. See [LICENSE](file:///home/mr_coder_04/Documents/PROJECT/LICENSE) for details.

© 2026 **Pjsofonic / mrCoderPj04**. All Rights Reserved.
