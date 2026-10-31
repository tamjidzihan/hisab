# Security Checklist

- [ ] Passwords use bcrypt/bcryptjs or Argon2; never custom reversible/plaintext storage.
- [ ] No fallback production secrets.
- [ ] Secrets only in environment variables or a secret manager.
- [ ] `.env`, logs, uploads, and generated reports are ignored by Git.
- [ ] Login, registration, password reset, and email verification are rate-limited.
- [ ] Cookie flags configured for deployment; production cookies use Secure and HttpOnly.
- [ ] CSRF strategy and origin validation in place for cookie-authenticated mutations.
- [ ] CORS allowlist contains only expected origins.
- [ ] Every user-owned resource query is scoped to authenticated user.
- [ ] Inputs and uploaded files validated server-side.
- [ ] Uploads have size limits, content verification, generated storage names, and private access.
- [ ] SQL/ORM queries use safe parameters and validated sort fields.
- [ ] Transfers and other multi-row financial operations use database transactions.
- [ ] Migrations tested before deployment; no production sync-alter.
- [ ] Database user follows least privilege.
- [ ] Backup and restore process tested.
- [ ] Tests cover auth, ownership, analytics, transfers, refunds, date boundaries, and decimal/minor-unit calculations.
