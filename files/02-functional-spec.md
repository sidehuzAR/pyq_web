# Functional Spec

Pure logic/behavior. No UI styling decisions here — those live entirely in `03-design-system-bauhaus.md`.

## 1. Search & autocomplete
- Real-time match against `course_code` and `subject_name` as the user types.
- Dropdown shows: course code, full subject name, count of matching papers.
- Clicking a result navigates to `/catalogue/:course_code`.
- Clear button resets the search term.

## 2. Main catalogue + filters
Multi-select filters, all combinable (AND across filter groups, OR within a group):
- Exam type
- Slot tag (grouped: Theory / Tutorial / Lab)
- Academic year
- Semester
- Answer-key-only toggle (boolean, shows only `has_answer_key == true`)

Filter console can collapse/expand.

Sort options:
- Year, new → old
- Year, old → new
- Course code, alphabetical

## 3. Batch download
- Each paper card has a selection checkbox.
- Select All (selects currently *filtered* set, not the global set).
- Deselect All.
- Download Selected: bundles selected papers into a zip via JSZip, client-side, named `pyarchive_bundle_${timestamp}.zip`.

## 4. Subject detail page — `/catalogue/:course_code`
- Header: course code, subject name, total paper count, "Download All" CTA (zips every approved paper for that course).
- Filter console on this page is *smart* — it only shows filter options that actually exist among this subject's papers (e.g. don't show a Winter Sem filter if no Winter Sem paper exists for this course).
- Breadcrumb back to main catalogue.

## 5. Paper viewer — `/paper/:id`
- Displays the scan (image or PDF page) on a canvas.
- Toolbar: zoom in (max 3x), zoom out (min 0.5x), reset zoom, fullscreen toggle, direct download (filename pattern `[course_code]_[exam_type]_[slot_tag].jpg`), share link (copies `/#paper=[id]` to clipboard, shows confirmation toast).
- Metadata bar: course code, title, exam type badge, slot badge, year badge, semester badge, answer-key status.
- Report modal: textarea for issue details + email input, submits a `Report`, shows confirmation toast.

## 6. Upload flow
Fields: course code, subject name (bidirectionally linked), exam category (select), slot tag (select w/ optgroups: Theory/Tutorial/Lab), academic year (select), semester (select), has-answer-key (checkbox), file dropzone.

File constraints: `.pdf .jpg .jpeg .png .webp`, max 10MB, drag-and-drop + picker.

On submit: paper is written to `pyarchive_pending_papers_v1` with `status: 'pending'`. Never touches the approved list directly.

**Rate limit:** 5 uploads/hour per user/IP. Check `upload_count` timestamps in the rolling window before accepting. On block, show remaining cooldown, e.g. "Rate limit reached. Try again in 42 minute(s)."

## 7. Admin portal — `/admin`
Gated by a master password (`admin123` for this build — flag in code as a placeholder, not production auth).

**Tab 1 — Moderation queue** (pending count badge in tab label)
- List every pending paper: thumbnail, all submitted metadata, uploader stamp.
- Inspector modal: zoomable scan next to metadata, side by side.
- Accept & Push Live: status → approved, moves paper from pending key to approved key, and if `course_code` isn't already in the registry, auto-adds it (with `subject_name`).
- Reject: hard delete from pending, no soft-delete/trash.

**Tab 2 — Course registry management**
- Add subject form (course_code, subject_name) → writes to `pyarchive_courses_v1`, instantly available in upload dropdowns and search autocomplete.
- Registry viewer: total count + searchable list of all registered courses.

## 8. Notifications
Global toast stack for: link copied, zip download started/done, paper submitted, paper approved/rejected, rate limit hit, form validation errors.

## 9. Security notes (for this build)
- Structurally separate admin logic (auth check, moderation mutations) into its own module/route so it's not trivially bundled into the public entrypoint — this is a code-organization mitigation, not real security, since there's no backend. Say so in a code comment; don't imply this is production-safe.
- File upload: validate MIME type and size client-side before accepting into the dropzone, in addition to the `accept` attribute (which users can bypass).
