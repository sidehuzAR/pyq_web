# `papersvitc` — Minimalist Architecture & Specification

> **Project Name**: `papersvitc` (Papers VIT Chennai / Papers VITC)  
> **Design Theme**: HackClub Cyber-Crimson Dark Mode Aesthetic  
> **Architecture Model**: **Dual-Portal System** (Public Student Portal + Lean 2-Feature Admin Dashboard)

---

## 🎯 Architectural Principles

1. **Ultra-Clean Public Website (`papersvitc`)**: Fast, zero-login search, filtering, viewer, and paper upload modal.
2. **Lean Admin Dashboard (`/admin`)**: Focused exclusively on **2 core features**:
   - **Feature 1: Accept / Approve Pending Papers** (Review & push live).
   - **Feature 2: Add New Subjects & Course Codes** (Expand course registry).
3. **Inspect-Element Decoupling**: Admin routes and API logic are server-side only; inspecting the public site's DevTools code reveals **zero** admin links or endpoints.
4. **Anti-Bombing Defense**: Rate limiting on `/api/upload` (e.g. max 5 uploads per IP per hour) to stop spam script floods.

---

## 🎨 Design System: HackClub Cyber-Crimson Theme

Both public and admin interfaces use the **HackClub Cyber-Crimson Dark Mode** tokens from `hackclub_vit_theme.md`:

```css
:root {
  --background: #020000;         /* Pitch-black canvas */
  --surface: #120202;            /* Dark blood-maroon base card */
  --secondary: #370b09;          /* Dark mahogany container */
  --primary: #720907;            /* Deep crimson primary buttons */
  --accent: #ac120c;             /* Fiery red active states & highlights */
  --highlight: #d07d22;          /* Warm glowing amber accents */
  --text: #f4ede4;               /* Warm off-white / cream text */
  --text-muted: #bfa8a2;         /* Muted rose-grey captions */
  --border: #2a0d0d;             /* Dark maroon border */
}
```

---

## 🌐 PORTAL 1: PUBLIC MAIN WEBSITE (`papersvitc`)

Built for general students to search, view, download, and upload exam papers without requiring a login.

### 1.1 Layout & Navigation
- **Public Header**: Glowing brand logo (`papersvitc`), instant search input, theme toggle, and `Upload Paper` CTA button (no login button).
- **Home & Search (`/`)**: Search by Course Code (e.g. `BPHY101L`) or Subject Name (*Engineering Physics*). Includes **Pinned Subjects** shortcuts.
- **Catalogue & Filtering (`/catalogue`)**:
  - Filter Sidebar: Answer Key filter, Exam types (CAT-1, CAT-2, FAT), Timetable Slots, Academic Years (`2025-26`), Semesters.
  - Batch Header: `Select All`, `Deselect All`, `Download Selected ZIP`.
- **Paper Viewer (`/paper/:id`)**: Canvas with right floating dock for Zoom In (+), Zoom Out (-), Fullscreen / Expand, Download, and Share link.

### 1.2 Student Upload Modal
Clicking `Upload Paper` opens a modal requiring:
1. **Linked Course Code & Subject Name**: Auto-linking lookup (typing code auto-fills name).
2. **Exam Category**: `CAT-1`, `CAT-2`, `FAT`.
3. **Timetable Slot Tag**:
   - **Theory**: `A1`–`G2`
   - **Tutorial**: `TA1`–`TG2`
   - **Lab**: `L1+L2`, `L3+L4`, `L5+L6`, `L31+L32`, `L33+L34`, `L35+L36`, `L59+L60`
4. **Academic Year**: `2025-26`, `2024-25`, `2023-24`, etc.
5. **Semester Category**: `Fall Sem`, `Winter Sem`, `Others`.
6. **File Dropzone**: Drag-and-drop `.pdf`, `.jpg`, `.png` (Max 10 MB).

---

## 🔒 PORTAL 2: LEAN ADMIN DASHBOARD (`/admin`)

Protected by password authentication. Contains **only two tabs/features**:

```
┌────────────────────────────────────────────────────────────────────────┐
│  ADMIN DASHBOARD (`/admin`)                                            │
├────────────────────────────────────────────────────────────────────────┤
│  [ TAB 1: ACCEPT PAPERS QUEUE (3 Pending) ]   [ TAB 2: ADD SUBJECT ]   │
└────────────────────────────────────────────────────────────────────────┘
```

### 📋 Feature 1: Accept Uploaded Papers
- **Staging List**: Displays student submissions marked `status = 'pending'`.
- **Quick Preview**: Shows the uploaded image/PDF side-by-side with submitted tags (Code, Exam, Slot, Year, Semester).
- **Actions**:
  - **`Accept / Approve`**: Changes status to `approved`. The paper is pushed live onto the public website search engine immediately.
  - **`Reject`**: Deletes the submission and file.

### ➕ Feature 2: Add New Subject / Course Code
- **Add Subject Form**:
  - `Course Code`: e.g. `BCSE202L`
  - `Subject Name`: e.g. *Data Structures and Algorithms*
- **Action**: Clicking `Add Subject` saves it to the database registry. It becomes instantly available in the student upload dropdowns and catalogue search.

---

## 🛡️ Anti-Bombing & Inspect-Element Protection

1. **DevTools / Inspect-Element Separation**:
   - Admin routes and API code are server-side isolated and **never bundled** into the public JavaScript file.
   - Inspecting public page code reveals zero admin routes or admin API endpoints.
2. **Upload Rate Limiting**:
   - Middleware caps uploads on `/api/upload` (e.g. max **5 uploads per IP per hour**) to stop script bombing.
   - Restricts files to `.pdf`, `.jpg`, `.png` under 10 MB.

---

## 📊 Database Schema (PostgreSQL / SQLite)

```sql
-- Course Registry (Managed by Admin Feature 2)
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'BPHY101L'
    subject_name VARCHAR(255) NOT NULL       -- e.g., 'Engineering Physics'
);

-- Main Papers Table (Managed by Admin Feature 1)
CREATE TABLE papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code VARCHAR(20) REFERENCES courses(course_code),
    exam_type VARCHAR(10) NOT NULL,       -- 'CAT-1', 'CAT-2', 'FAT'
    slot_tag VARCHAR(15) NOT NULL,        -- 'A1', 'TA1', 'E2', 'L1+L2'
    academic_year VARCHAR(10) NOT NULL,   -- '2025-26'
    semester VARCHAR(20) NOT NULL,        -- 'Fall Sem', 'Winter Sem', 'Others'
    file_url TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
