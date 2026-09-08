// Client-side file type and size validator for paper uploads

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp'
];

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validatePaperFile(file) {
  if (!file) {
    return { valid: false, error: 'Please select or drop a paper file scan.' };
  }

  // Size Check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File exceeds maximum size limit of 10 MB.' };
  }

  // Extension & MIME Check
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  const mimeValid = ALLOWED_MIME_TYPES.includes(file.type);
  const extValid = ALLOWED_EXTENSIONS.includes(ext);

  if (!mimeValid && !extValid) {
    return { valid: false, error: 'Invalid file format. Accepted formats: PDF, JPG, PNG, WEBP.' };
  }

  return { valid: true };
}
