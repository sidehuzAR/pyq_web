# Component & Route Architecture

## Routes
| Path | Page | Notes |
|---|---|---|
| `/` | Home | Hero + search, recent papers, browse by subject |
| `/catalogue` | Main catalogue | Full filter deck, sort, batch select/download |
| `/catalogue/:course_code` | Subject detail | Smart filters scoped to that subject's actual papers |
| `/paper/:id` | Paper viewer | Also reachable via `/#paper=[id]` deep link from share |
| `/upload` | Upload flow | Rate-limited submission form |
| `/admin` | Admin gate | Password prompt, then dashboard |
| `/admin/dashboard` | Admin dashboard | Tab 1: moderation queue, Tab 2: course registry — gate this route in code, don't just hide it in the nav |

## Folder structure
```
src/
  components/
    layout/
      Header.jsx
      Navigation.jsx
      Footer.jsx
    search/
      SearchBar.jsx
      AutocompleteDropdown.jsx
    catalogue/
      FilterBar.jsx
      SortControl.jsx
      PaperCard.jsx
      SubjectCard.jsx
      BatchSelectionBar.jsx
    viewer/
      PaperCanvas.jsx
      ViewerToolbar.jsx
      MetadataBar.jsx
      ReportModal.jsx
    upload/
      UploadForm.jsx
      Dropzone.jsx
      SlotSelect.jsx
    admin/
      AdminGate.jsx
      ModerationQueue.jsx
      InspectorModal.jsx
      CourseRegistryForm.jsx
      RegistryViewer.jsx
    shared/
      Button.jsx
      Badge.jsx
      SectionHeading.jsx
      GeometricDecoration.jsx
      Toast.jsx
      ToastStack.jsx
  pages/
    HomePage.jsx
    CataloguePage.jsx
    SubjectPage.jsx
    ViewerPage.jsx
    UploadPage.jsx
    AdminPage.jsx
  lib/
    storage.js        # localStorage read/write for all 4 keys
    filters.js         # filter/sort logic, pure functions
    zip.js              # JSZip bundling helper
    rateLimit.js       # upload_count check/update
    validators.js      # file type/size, form validation
  hooks/
    useCourses.js
    usePapers.js
    useToast.js
  constants/
    enums.js           # EXAM_TYPES, SLOT_TAGS, ACADEMIC_YEARS, SEMESTERS
  styles/
    tailwind.config.js  # bauhaus token colors live here
```

## Data flow notes
- `lib/storage.js` is the only module that touches `localStorage` directly. Everything else goes through it. Makes swapping to a real backend later a one-file change.
- `usePapers.js` should expose separate `useApprovedPapers()` and `usePendingPapers()` rather than one hook with a status filter — keeps the "public never sees pending" rule structural, matching the two-key storage split in `01-data-schema.md`.
- Admin mutations (accept/reject) live in a module not imported by any public page component, to keep the code-separation intent from the functional spec's security section.

## Component notes tied to the design system
- `Button.jsx` takes a `variant` prop (`primary | secondary | tertiary | outline`) mapping directly to the Bauhaus color rules — don't hardcode colors per call site.
- `PaperCard.jsx` needs the year to be the visually largest element in the card per the design doc's "year should be prominent" rule.
- `GeometricDecoration.jsx` is a reusable SVG/CSS shape composer (circle/square/triangle) used on the homepage hero and section dividers — build it once, reuse everywhere, don't hand-roll shapes per page.
- `SectionHeading.jsx` should support the `01 SUBJECTS` numbered-heading pattern as a prop, not a one-off per page.
