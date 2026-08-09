# `papersvitc` (PYARCHIVE) — Comprehensive Feature Specification & Requirements

> **Document Purpose**: Complete functional specification of all data schemas, features, options, filters, admin controls, viewer mechanisms, and business logic required for the UI revamp.

---

## 📑 1. Core Domain Entities & Data Schemas

### 1.1 Course Registry Entity (`Course`)
Represents registered subjects offered in the university catalog.

| Field Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `course_code` | `String` (Unique, Uppercase) | Official VIT course code | `"BPHY101L"`, `"BCSE202L"` |
| `subject_name` | `String` | Full title of the course | `"Engineering Physics"`, `"Data Structures and Algorithms"` |

* **Functional Behavior**:
  * Bidirectional auto-completion: Typing/selecting `course_code` automatically populates `subject_name` and vice-versa.
  * Dynamically updated when an admin adds a new course or approves a paper with a new course code.

---

### 1.2 Question Paper Entity (`Paper`)
Represents an uploaded exam paper scan and its associated metadata.

| Field Name | Type | Options / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` / `UUID` | Unique Identifier | `"paper-101"`, `"paper_1723180000"` |
| `course_code` | `String` | Linked to Course Registry | `"BPHY101L"` |
| `subject_name` | `String` | Linked to Course Registry | `"Engineering Physics"` |
| `exam_type` | `Enum` | `CAT-1`, `CAT-2`, `FAT` | Continuous assessment or final test |
| `slot_tag` | `Enum` | Theory (`A1`-`G2`), Tutorial (`TA1`-`TG2`), Lab (`L1+L2`, etc.) | Timetable slot tag |
| `academic_year` | `Enum` | `2025-26`, `2024-25`, `2023-24`, `2022-23` | Academic year of exam |
| `semester` | `Enum` | `Fall Sem`, `Winter Sem`, `Others` | Academic term |
| `has_answer_key` | `Boolean` | `true`, `false` | Indicates if verified solution key is included |
| `file_url` | `String` (URL/Blob) | File path / ObjectURL | Image preview or PDF scan link |
| `status` | `Enum` | `approved`, `pending`, `rejected` | Moderation state |
| `created_at` | `Timestamp` | ISO 8601 String | Upload timestamp |
| `uploaded_by` | `String` | Optional string metadata | Uploader IP / Student ID stamp |
| `description` | `String` | Optional text note | Additional context/notes |

---

### 1.3 Tag Correction / Issue Report Entity (`Report`)
Generated when a student flags an approved paper for inaccurate tags or scan quality issues.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `paper_id` | `String` | Target paper ID being reported |
| `report_comment` | `Text` | User's explanation of the issue (e.g. wrong slot, wrong exam type) |
| `student_email` | `String` | Contact email of the student submitting the report |
| `created_at` | `Timestamp` | Submission timestamp |

---

## 🎛️ 2. Complete Option Lists & Enumerations

### 2.1 Exam Categories (`EXAM_TYPES`)
* `CAT-1`: Continuous Assessment Test 1
* `CAT-2`: Continuous Assessment Test 2
* `FAT`: Final Assessment Test

---

### 2.2 Timetable Slots (`AVAILABLE_SLOTS`)

#### A. Theory Slots (14 Options)
* `A1`, `A2`
* `B1`, `B2`
* `C1`, `C2`
* `D1`, `D2`
* `E1`, `E2`
* `F1`, `F2`
* `G1`, `G2`

#### B. Tutorial Slots (14 Options)
* `TA1`, `TA2`
* `TB1`, `TB2`
* `TC1`, `TC2`
* `TD1`, `TD2`
* `TE1`, `TE2`
* `TF1`, `TF2`
* `TG1`, `TG2`

#### C. Lab Slots (7 Options)
* `L1+L2`
* `L3+L4`
* `L5+L6`
* `L31+L32`
* `L33+L34`
* `L35+L36`
* `L59+L60`

---

### 2.3 Academic Years (`ACADEMIC_YEARS`)
* `2025-26`
* `2024-25`
* `2023-24`
* `2022-23`
*(Extensible for older/newer years)*

---

### 2.4 Semesters (`SEMESTERS`)
* `Fall Sem`
* `Winter Sem`
* `Others` (Summer / Weekend / Special)

---

### 2.5 Paper Status (`STATUS`)
* `pending`: Uploaded by student, awaiting admin moderation. Not visible in public search.
* `approved`: Verified by admin. Indexed and publicly searchable/viewable.
* `rejected`: Denied by admin. Discarded/deleted from system.

---

## 🌐 3. Public Student Portal Features

### 3.1 Global Search & Autocomplete Engine
* **Instant Search Input**: Real-time matching against `course_code` and `subject_name`.
* **Live Autocomplete Dropdown**:
  * Displays matching registered courses as user types.
  * Shows course code pill, full subject name, and matching count.
  * Clicking an item directly navigates to that course's **Dedicated Subject Detail Page**.
  * Quick-clear button to reset search term.

---

### 3.2 Main Catalogue & Multi-Faceted Filter Deck
* **Filter Capabilities**:
  * **Exam Type Filter**: Multi-select pills (`CAT-1`, `CAT-2`, `FAT`).
  * **Slot Tag Filter**: Multi-select chips grouped into Theory, Tutorial, and Lab slots.
  * **Academic Year Filter**: Multi-select chips (`2025-26`, `2024-25`, etc.).
  * **Semester Filter**: Multi-select chips (`Fall Sem`, `Winter Sem`, `Others`).
  * **Answer Key Quick-Toggle**: Checkbox filter to show **only** papers containing solution keys (`has_answer_key == true`).
  * **Console Collapse/Expand**: Toggle button to show or hide the filter options console.
* **Sorting Capabilities**:
  * `YEAR (NEW TO OLD)`: Descending order by academic year.
  * `YEAR (OLD TO NEW)`: Ascending order by academic year.
  * `COURSE CODE`: Alphabetical by course code.

---

### 3.3 Batch Operations & ZIP Archive Bundle Generator
* **Individual Card Checkbox Selection**: Select/deselect individual paper cards across the catalogue.
* **Batch Controls**:
  * `Select All`: Selects all currently filtered paper cards.
  * `Deselect All`: Clears current paper selection.
  * `Download Selected (ZIP)`: Compiles all checked papers into a single `.zip` file using `JSZip` client-side, dynamically named `pyarchive_bundle_[timestamp].zip`.

---

### 3.4 Dedicated Subject Detail View Page (`/catalogue/:course_code`)
Activated when a student clicks on a specific course badge or selects a course from search.
* **Course Header Banner**:
  * Large course code pill & full subject name.
  * Total papers uploaded counter badge for that course.
  * Direct CTA: `Download All Subject Papers ZIP`.
* **Dynamic Subject Filter Console**:
  * **Smart Slot Filtering**: Automatically extracts and displays **ONLY** the timetable slots, exam categories, academic years, and semesters that ACTUALLY exist in the uploaded papers for this specific subject.
* **Breadcrumb Navigation**: `Back to Main Catalogue` action.

---

### 3.5 High-Resolution Paper Viewer Modal (`/paper/:id`)
Opened when clicking any paper card or "View Full Paper" button.
* **Canvas Display**: Displays high-res scan image / PDF page.
* **Interactive Floating Toolbar / Dock**:
  * `Zoom In (+)`: Increases canvas scale (up to 3x).
  * `Zoom Out (-)`: Decreases canvas scale (down to 0.5x).
  * `Reset Zoom`: Resets canvas to 1.0x.
  * `Fullscreen / Expand`: Toggles full viewport modal overlay.
  * `Direct Download`: Downloads image file (`[course_code]_[exam_type]_[slot_tag].jpg`).
  * `Share Link`: Copies deep link (`/#paper=[id]`) to user clipboard with confirmation feedback.
* **Metadata Bar**: Displays course code, title, exam type badge, slot tag badge, year badge, semester badge, and answer key status.
* **Tag Correction Reporting Modal**:
  * Allows students to report incorrect tags or unreadable scans.
  * Input fields: `Issue Details` (textarea) + `Student Email` (email input).
  * Submits notification toast upon completion.

---

## 📤 4. Student Paper Upload System

Accessible via the `Upload Paper` CTA button on the public header.

### 4.1 Required Input Fields & Controls
1. **Course Code** (`Text Input`): Linked to Subject Name.
2. **Subject Name** (`Text Input`): Linked to Course Code.
3. **Exam Category** (`Select Dropdown`): Options: `CAT-1`, `CAT-2`, `FAT`.
4. **Timetable Slot Tag** (`Select Dropdown with Option Groups`):
   * *Theory*: `A1`–`G2`
   * *Tutorial*: `TA1`–`TG2`
   * *Lab*: `L1+L2`, `L3+L4`, `L5+L6`, `L31+L32`, `L33+L34`, `L35+L36`, `L59+L60`
5. **Academic Year** (`Select Dropdown`): `2025-26`, `2024-25`, `2023-24`, `2022-23`.
6. **Semester Category** (`Select Dropdown`): `Fall Sem`, `Winter Sem`, `Others`.
7. **Includes Answer Key Toggle** (`Checkbox`): Checkbox indicating presence of verified solution.
8. **File Dropzone**:
   * Supports Drag-and-Drop and File Picker.
   * Allowed file formats: `.pdf`, `.jpg`, `.jpeg`, `.png`, `.webp`.
   * File size constraint: Maximum **10 MB**.

---

### 4.2 Anti-Spam Rate Limiting Engine
* **Rate Limit Policy**: Maximum **5 uploads per hour per user/IP**.
* **Enforcement**: Checks `upload_count` record against timestamp window.
* **User Feedback**: Blocks submission and shows cooldown timer if limit is exceeded (e.g. *"Rate limit reached. Please try again in 42 minute(s)."*).

---

## 🔒 5. Admin Moderation Portal (`/admin`)

Protected gateway requiring master password authentication (`admin123`). Contains **two core management tabs**:

```
┌────────────────────────────────────────────────────────────────────────┐
│  ADMIN DASHBOARD (`/admin`)                                            │
├────────────────────────────────────────────────────────────────────────┤
│  [ TAB 1: ACCEPT PAPERS QUEUE (N Pending) ]  [ TAB 2: ADD SUBJECT ]    │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.1 Tab 1: Moderation & Acceptance Queue (`status == 'pending'`)
* **Pending Submissions List**: Displays all student paper uploads awaiting verification.
* **Card Metadata Display**: Shows uploaded file scan thumbnail, submitted tags (Course Code, Subject Name, Exam Type, Slot, Year, Semester, Answer Key status), and uploader IP stamp.
* **Side-by-Side Quick Inspector**: Modal window allowing admins to zoom and inspect the full paper scan next to submitted metadata before approving.
* **Moderation Actions**:
  * **`Accept & Push Live`**:
    * Updates paper status from `pending` to `approved`.
    * Makes paper immediately searchable and visible on the public site.
    * Automatically adds course code & subject name to the Course Registry if not already present.
  * **`Reject`**:
    * Deletes submission permanently from the pending queue.
* **Pending Counter Badge**: Tab displays live count of pending items needing review.

---

### 5.2 Tab 2: Course Registry Management (`Add Subject`)
* **Add Subject Form**:
  * `Course Code` (e.g. `BCSE301L`).
  * `Subject Name` (e.g. `Software Engineering`).
  * Action: Saves course to database registry. Instantly populates student upload dropdowns and catalogue search autocomplete.
* **Active Registry Viewer**:
  * Displays total registered subjects count.
  * Searchable/Scrollable list of all registered course codes and names.

---

## 🛠️ 6. System Architecture & Persistence Requirements

### 6.1 LocalStorage Data Keys
* `pyarchive_courses_v1`: JSON array of registered courses.
* `pyarchive_approved_papers_v1`: JSON array of approved public papers.
* `pyarchive_pending_papers_v1`: JSON array of pending upload queue items.
* `pyarchive_upload_count_v1`: Object tracking timestamp & hourly upload quota.

---

### 6.2 Security & Code Isolation Requirements
* **Inspect-Element Separation**: Admin authentication, approval routes, and admin database mutations must be isolated on the server/backend API so that DevTools inspection on public pages reveals zero admin endpoints or credentials.
* **Anti-Bombing Safeguards**: Server-side payload validation, MIME type checks, and 10 MB payload limits.

---

### 6.3 Notification Toast Engine
* System-wide notification stack for feedback across actions:
  * Paper link copied.
  * ZIP download initiated / completed.
  * Paper submitted for verification.
  * Moderation actions (paper approved/rejected).
  * Rate limit warnings.
  * Form validation warnings.
