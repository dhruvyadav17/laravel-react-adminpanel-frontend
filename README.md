# Full Stack Admin Panel
## Laravel API + React (Vite) Admin Panel

A **production-ready full stack admin panel** with:
- Laravel (API backend)
- React + TypeScript (Vite frontend)
- Role & Permission based access control (RBAC)
- Secure authentication
- Enterprise-grade architecture

---

## 🧰 Tech Stack

### Backend
- Laravel 10+
- Laravel Sanctum
- Spatie Laravel Permission
- MySQL

### Frontend
- React 18
- Vite
- TypeScript
- Redux Toolkit + RTK Query
- React Router v6
- Axios
- Bootstrap 5

---

# ⚙️ INSTALLATION GUIDE

---

# 🟢 PART 1: Laravel Backend (API)

## ✅ Prerequisites

Make sure these are installed:

- PHP **8.1+**
- Composer
- MySQL / MariaDB
- Git

Check versions:
```bash
php -v
composer -v




1️⃣ Clone Backend Repository
git clone <backend-repo-url>
cd laravel-backend

2️⃣ Install PHP Dependencies
composer install

3️⃣ Environment Setup
cp .env.example .env
php artisan key:generate


Edit .env file:

APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=admin_panel
DB_USERNAME=root
DB_PASSWORD=

4️⃣ Database Migration & Seeders
php artisan migrate
php artisan db:seed


This will create:

Users

Roles

Permissions

Super Admin user

5️⃣ Clear Cache (Recommended)
php artisan optimize:clear
php artisan permission:cache-reset

6️⃣ Run Backend Server
php artisan serve


Backend runs on:

http://localhost:8000

7️⃣ Test Login API (Optional)
POST http://localhost:8000/api/login

🟢 PART 2: React Admin Panel (Frontend)
✅ Prerequisites

Node.js 18+

npm

Check:

node -v
npm -v

1️⃣ Clone Frontend Repository
git clone <frontend-repo-url>
cd react-admin-panel

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create .env file in project root:

VITE_API_URL=http://localhost:8000/api


⚠️ This must match Laravel API URL

4️⃣ Run Frontend Dev Server
npm run dev


Frontend runs on:

http://localhost:5173

5️⃣ Default Login Credentials

(From database seeder)

Email: superadmin@test.com
Password: password

🔁 HOW FRONTEND & BACKEND CONNECT
React (5173)  --->  Laravel API (8000)
          Axios + Bearer Token


Login returns token, roles, permissions

Auth stored in Redux + localStorage

Routes & menus auto-guarded

Multi-tab logout supported

🔐 COMMON ISSUES & FIXES
❌ CORS Error
php artisan install:api


or update config/cors.php

❌ 401 Unauthorized

Check token in browser → Application → LocalStorage

Verify API URL in .env

❌ Permissions Not Updating
php artisan permission:cache-reset
php artisan optimize:clear

🚀 PRODUCTION NOTES (SHORT)
Laravel
APP_ENV=production
APP_DEBUG=false
php artisan optimize

React
npm run build


Serve dist/ using Nginx or Apache.