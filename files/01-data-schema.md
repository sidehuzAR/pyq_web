# Data Schema

## Entities

### Course
| Field | Type | Notes |
|---|---|---|
| course_code | string, unique, uppercase | e.g. `BCSE202L` |
| subject_name | string | e.g. `Data Structures and Algorithms` |

Behavior: course_code and subject_name are bidirectionally linked everywhere they appear in a form (typing one autocompletes the other). Registry updates whenever an admin adds a course, or a pending paper with a new course_code gets approved.

### Paper
| Field | Type | Notes |
|---|---|---|
| id | string/uuid | `paper_${Date.now()}` is fine |
| course_code | string | FK to Course |
| subject_name | string | FK to Course |
| exam_type | enum | `CAT-1`, `CAT-2`, `FAT` |
| slot_tag | enum | see Slot Tags below |
| academic_year | enum | `2025-26`, `2024-25`, `2023-24`, `2022-23`, extensible |
| semester | enum | `Fall Sem`, `Winter Sem`, `Others` |
| has_answer_key | boolean | |
| file_url | string | blob URL / object URL for this build |
| status | enum | `approved`, `pending`, `rejected` |
| created_at | ISO timestamp | |
| uploaded_by | string, optional | IP/student id stamp |
| description | string, optional | |

### Report (tag correction / issue flag)
| Field | Type | Notes |
|---|---|---|
| paper_id | string | target paper |
| report_comment | text | |
| student_email | string | |
| created_at | ISO timestamp | |

## Enums

**Exam types:** `CAT-1`, `CAT-2`, `FAT`

**Slot tags:**
- Theory (14): A1, A2, B1, B2, C1, C2, D1, D2, E1, E2, F1, F2, G1, G2
- Tutorial (14): TA1, TA2, TB1, TB2, TC1, TC2, TD1, TD2, TE1, TE2, TF1, TF2, TG1, TG2
- Lab (7): L1+L2, L3+L4, L5+L6, L31+L32, L33+L34, L35+L36, L59+L60

**Academic years:** 2025-26, 2024-25, 2023-24, 2022-23 (array, extensible — don't hardcode a dropdown length assumption)

**Semesters:** Fall Sem, Winter Sem, Others

**Status:** pending (invisible to public), approved (public + indexed), rejected (deleted, not soft-deleted)

## Storage keys (localStorage)
- `pyarchive_courses_v1` — array of Course
- `pyarchive_approved_papers_v1` — array of Paper where status=approved
- `pyarchive_pending_papers_v1` — array of Paper where status=pending
- `pyarchive_upload_count_v1` — object tracking per-user/IP upload timestamps for rate limiting

Keep pending and approved in separate keys (not one array filtered by status) — makes the "public bundle never sees pending" requirement structurally enforced rather than relying on every query remembering to filter.
