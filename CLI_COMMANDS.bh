# CLI_COMMANDS.bh
# Monthly Finance Tracker — command reference
# This is a documentation file, not a shell script. Run commands from the indicated directory.
# Assumption: frontend/ and backend/ folders at the repository root.
# Verify package versions and official documentation if a command differs in your installed toolchain.

## 0. Prerequisites
node --version
npm --version
git --version
mysql --version

## 1. Create repository
mkdir monthly-finance-tracker
cd monthly-finance-tracker
git init
mkdir docs

## 2. Create React + TypeScript + Vite frontend
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

## 3. Frontend runtime dependencies
npm install react-router-dom axios @tanstack/react-query
npm install date-fns recharts lucide-react
npm install react-hook-form zod @hookform/resolvers
npm install sonner clsx tailwind-merge
npm install @tanstack/react-table

## 4. Tailwind CSS
# For a new project, follow the current Tailwind CSS + Vite guide.
# Tailwind CSS v4 commonly uses:
npm install tailwindcss @tailwindcss/vite
# Then configure @tailwindcss/vite in vite.config.ts and import Tailwind in src/index.css.
# Do not blindly combine Tailwind v3 and v4 configuration instructions.

## 5. Optional UI components
# Install shadcn/ui only if you want its component workflow:
npx shadcn@latest init
# Add only components you need, for example:
npx shadcn@latest add button card dialog dropdown-menu input label select sheet table tooltip
# Review generated files and theme before applying.

## 6. Frontend scripts
npm run dev
npm run build
npm run preview
# Add lint/type-check scripts if they are not already present in package.json.
# Run commands from frontend/.

## 7. Create backend
# From repository root:
mkdir backend
cd backend
npm init -y

## 8. Backend runtime dependencies
npm install compression cookie-parser cors date-fns dotenv express express-validator morgan multer mysql2 sequelize nodemailer helmet express-rate-limit bcryptjs jsonwebtoken
# Alternative: use opaque cookie sessions with hashed tokens stored in the DB instead of JWT.
# Choose one authentication strategy; do not install/use both without a reason.

## 9. Backend development dependencies
npm install --save-dev nodemon sequelize-cli
npm install --save-dev eslint
# Optional test tools:
npm install --save-dev vitest supertest
# Confirm the chosen test runner works with the CommonJS/ESM setup before adding scripts.

## 10. Initialize Sequelize CLI
npx sequelize-cli init
# This creates config/, models/, migrations/, seeders/ by default.
# Adapt configuration to use environment variables and the desired src/ structure.
# Never put real production secrets in config/config.json.
# Create migrations with:
npx sequelize-cli migration:generate --name create-users
npx sequelize-cli migration:generate --name create-accounts
npx sequelize-cli migration:generate --name create-categories
npx sequelize-cli migration:generate --name create-transactions
npx sequelize-cli migration:generate --name create-budgets
npx sequelize-cli migration:generate --name create-recurring-transactions
npx sequelize-cli migration:generate --name create-savings-goals
# Run / revert:
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo:all

## 11. Suggested backend package scripts
# Add these to backend/package.json:
# "dev": "nodemon src/server.js"
# "start": "node src/server.js"
# "db:migrate": "sequelize-cli db:migrate"
# "db:migrate:undo": "sequelize-cli db:migrate:undo"
# "db:seed": "sequelize-cli db:seed:all"
# "test": "node --test"
# If using Vitest, set the test script to the matching Vitest command.

## 12. MySQL database
# Create the database using your local MySQL client/admin tool:
# CREATE DATABASE monthly_finance_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# Create a least-privilege application user instead of using root/admin in the app.
# Configure DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD in backend/.env.
# Never commit actual credentials.

## 13. Example environment files
# backend/.env.example:
# NODE_ENV=development
# PORT=5000
# FRONTEND_ORIGIN=http://localhost:5173
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_NAME=monthly_finance_tracker
# DB_USER=finance_app
# DB_PASSWORD=replace_me
# SESSION_COOKIE_NAME=finance_session
# AUTH_SECRET=replace_with_a_long_random_secret
# COOKIE_SECURE=false
# COOKIE_SAME_SITE=lax
# SMTP_HOST=
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASSWORD=
# MAIL_FROM=
# MAX_RECEIPT_SIZE_MB=5
#
# frontend/.env.example:
# VITE_API_BASE_URL=http://localhost:5000/api/v1
#
# Copy examples to .env locally; never commit .env.

## 14. Useful Git commands
git status
git add .
git commit -m "chore: initialize monthly finance tracker"
git switch -c feat/authentication
git diff
git log --oneline --decorate -10

## 15. Before every commit
# From frontend:
npm run build
# Run the configured backend test/lint commands from backend.
# Check:
git status
git diff --check
# Ensure .env, uploads, logs, node_modules, build output, and secrets are ignored.
