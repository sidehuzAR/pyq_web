# PYArchive — Monorepo

Two fully independent Vite apps sharing one GitHub repository.

## Structure

```
apps/
  user-site/   → Public user frontend (deployed to your main domain)
  admin-site/  → Admin dashboard (deployed to a separate, unlisted domain)
```

## Local Development

```bash
# User site
cd apps/user-site
npm run dev       # runs at http://localhost:5173

# Admin site (in a new terminal)
cd apps/admin-site
npm run dev       # runs at http://localhost:5174
```

## Netlify Deployment

### Site 1 — Public User App
| Setting | Value |
|---|---|
| Base directory | `apps/user-site` |
| Build command | `npm run build` |
| Publish directory | `apps/user-site/dist` |

### Site 2 — Admin Dashboard
| Setting | Value |
|---|---|
| Base directory | `apps/admin-site` |
| Build command | `npm run build` |
| Publish directory | `apps/admin-site/dist` |

> **Security**: The admin site's URL should be kept private. Consider enabling Netlify Password Protection on the admin site for an extra layer of access control.
