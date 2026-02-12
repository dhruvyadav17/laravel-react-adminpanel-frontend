========================================================
TEXTUTILS ADMIN PANEL – FULL BACKEND SETUP GUIDE
Laravel Enterprise API (API v1)
========================================================

========================================================
1. TECHNOLOGY STACK
========================================================

Backend Framework:
- Laravel 12

Authentication:
- Laravel Sanctum (API tokens)

RBAC:
- Spatie Laravel Permission

Database:
- MySQL 8+

Architecture:
- Service Layer Pattern
- API Response Standardization
- API Versioning
- Feature Flags
- Soft Deletes
- Token Rotation System

API Style:
- JSON only
- Standard response structure
- Meta support for pagination

========================================================
2. REQUIRED SOFTWARE
========================================================

Install these first:

1. PHP >= 8.1
2. Composer
3. MySQL
4. Node.js (optional for mail templates)
5. Git

Check versions:

php -v
composer -V
mysql --version

========================================================
3. CREATE PROJECT
========================================================

composer create-project laravel/laravel textutils-laravel
cd textutils-laravel

========================================================
4. INSTALL REQUIRED PACKAGES
========================================================

# Sanctum (API Authentication)
composer require laravel/sanctum

# Publish Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Spatie Permission (RBAC)
composer require spatie/laravel-permission

# Publish Spatie Config + Migration
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

========================================================
5. DATABASE SETUP
========================================================

Open .env and configure:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=textutils
DB_USERNAME=root
DB_PASSWORD=

Create database manually in MySQL:

CREATE DATABASE textutils;

Run migrations:

php artisan migrate

========================================================
6. ENABLE SANCTUM IN USER MODEL
========================================================

Open app/Models/User.php

Add:

use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
}

========================================================
7. ADD SANCTUM MIDDLEWARE
========================================================

In app/Http/Kernel.php inside api middleware group:

'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],

========================================================
8. STANDARD API RESPONSE SYSTEM
========================================================

Create file:
app/Traits/ApiResponse.php

All responses follow format:

{
  "success": true,
  "message": "Action successful",
  "data": {},
  "meta": {}
}

Benefits:
- Predictable frontend integration
- Clean error handling
- Professional API standard

========================================================
9. GLOBAL EXCEPTION HANDLER
========================================================

Modify:
app/Exceptions/Handler.php

Purpose:
- Convert all errors to JSON
- Handle validation errors
- Handle HTTP exceptions
- Prevent HTML error pages

Benefits:
- Frontend safe
- Consistent error format

========================================================
10. FEATURE FLAGS
========================================================

Create config/features.php

Features:

'refresh_token'        => false,
'email_verification'   => false,
'password_reset'       => true,
'audit_logs'           => true,
'login_rate_limit'     => true,
'password_expiry'      => true,

Benefits:
- Enable/disable features without code change
- Safer production deployment

========================================================
11. RBAC SYSTEM (SPATIE)
========================================================

User model:

use HasRoles;

protected $guard_name = 'api';

Benefits:
- Role-based permissions
- Middleware protection
- Cached permission system
- Enterprise-grade access control

========================================================
12. ROLE MIDDLEWARE
========================================================

Custom middleware:
app/Http/Middleware/RoleMiddleware.php

Purpose:
- Route-level role protection
- Clean access control

========================================================
13. SERVICE LAYER ARCHITECTURE
========================================================

All business logic lives inside:

app/Services/

Examples:
- LoginService
- RefreshTokenService
- UserService
- RoleService
- PermissionService
- SidebarService

Benefits:
- Clean controllers
- Testable logic
- Scalable architecture
- Enterprise-ready

========================================================
14. SOFT DELETE SYSTEM
========================================================

In models:

use SoftDeletes;

Benefits:
- Safe deletion
- Restore possible
- Audit-friendly

========================================================
15. SIDEBAR CONFIG SYSTEM
========================================================

config/sidebar.php

Backend controls menu visibility based on:

- permission
- role

Benefits:
- No frontend hardcoding
- Secure menu rendering
- Fully dynamic navigation

========================================================
16. API VERSIONING
========================================================

routes/api.php

Route::prefix('v1')->group(
    base_path('routes/api/v1.php')
);

Benefits:
- Future-proof
- Backward compatibility
- Mobile API ready

========================================================
17. PASSWORD RESET SYSTEM
========================================================

Uses:
- Laravel Password Broker
- Custom API notification

Benefits:
- SPA friendly reset flow
- Secure token system

========================================================
18. RATE LIMITING
========================================================

In AppServiceProvider:

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60);
});

Benefits:
- Protect login endpoint
- Prevent brute force attacks

========================================================
19. SECURITY FEATURES INCLUDED
========================================================

- Sanctum API tokens
- Permission middleware
- Role middleware
- Soft deletes
- Validation via FormRequest
- Standard API error handling
- Feature toggles
- Super Admin override
- Refresh token rotation (optional)

========================================================
20. RUN SERVER
========================================================

php artisan serve

API Base URL:

http://127.0.0.1:8000/api/v1

========================================================
21. MAIN FEATURES IMPLEMENTED
========================================================

AUTH:
- Register
- Login
- Logout
- Profile
- Email verification
- Refresh token
- Forgot password
- Reset password

ADMIN:
- Dashboard stats
- User CRUD
- Soft delete + restore
- Assign roles
- Assign permissions
- Role CRUD
- Permission CRUD
- Sidebar dynamic API

SYSTEM:
- Feature flags
- API versioning
- Global JSON error handling
- Standard API response
- Rate limiting
- Super Admin override

========================================================
END OF BACKEND SETUP GUIDE
========================================================
========================================================
TEXTUTILS ADMIN PANEL – FULL FRONTEND SETUP GUIDE
React + TypeScript Enterprise Admin Panel
========================================================

========================================================
1. TECHNOLOGY STACK
========================================================

Frontend Framework:
- React 18+

Build Tool:
- Vite 5+

Language:
- TypeScript

Routing:
- React Router DOM v6+

State Management:
- Redux Toolkit
- RTK Query

Authentication:
- JWT Token (Laravel Sanctum backend)

HTTP Client:
- Axios (Auth APIs)
- RTK Query (Protected APIs)

UI Framework:
- Bootstrap 5
- AdminLTE 4
- FontAwesome

Notifications:
- React Toastify

Architecture Style:
- Feature-first modular structure
- Centralized modal system
- Service-based API layer
- URL-synced pagination
- RBAC integration

========================================================
2. REQUIRED SOFTWARE
========================================================

Install these first:

1. Node.js >= 18
2. npm or yarn
3. Git

Check versions:

node -v
npm -v

========================================================
3. CREATE PROJECT
========================================================

npm create vite@latest textutils-react -- --template react-ts
cd textutils-react
npm install

========================================================
4. INSTALL REQUIRED PACKAGES
========================================================

# Routing
npm install react-router-dom

# State Management
npm install @reduxjs/toolkit react-redux

# HTTP Client
npm install axios

# Toast Notifications
npm install react-toastify

# UI Framework
npm install bootstrap
npm install admin-lte
npm install @fortawesome/fontawesome-free

========================================================
5. PROJECT STRUCTURE (ENTERPRISE STYLE)
========================================================

src/
 ├── admin/             (Admin module)
 ├── auth/              (Authentication module)
 ├── user/              (User module)
 ├── components/        (Reusable UI)
 ├── context/           (Modal system)
 ├── guards/            (Route guards)
 ├── hooks/             (Reusable hooks)
 ├── services/          (Axios services)
 ├── store/             (Redux + RTK Query)
 ├── routes/            (Route configuration)
 ├── utils/             (Helpers)
 ├── constants/         (RBAC + config)
 ├── types/             (TypeScript types)
 └── main.tsx           (Entry point)

Benefits:
- Scalable
- Clean separation
- Enterprise-ready
- Easy maintenance

========================================================
6. GLOBAL CSS IMPORT (IMPORTANT)
========================================================

In src/main.tsx add:

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "admin-lte/dist/css/adminlte.min.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "admin-lte/dist/js/adminlte.min.js";

Purpose:
- Prevent sidebar CSS late loading
- Avoid layout flicker
- Clean first render

========================================================
7. ROUTING SYSTEM
========================================================

Uses route object structure:

- authRoutes
- adminRoutes
- userRoutes
- errorRoutes

Benefits:
- Nested layouts
- Clean structure
- Scalable routing
- No JSX route mess

========================================================
8. STATE MANAGEMENT (REDUX TOOLKIT)
========================================================

Store includes:

- authSlice
- baseApi (RTK Query)

Benefits:
- Global authentication state
- Clean async handling
- Built-in caching
- Tag-based invalidation

========================================================
9. RTK QUERY API LAYER
========================================================

Files:

store/api/
 ├── baseApi.ts
 ├── admin.api.ts
 ├── auth.api.ts
 └── user.api.ts

Benefits:
- Centralized API handling
- Auto caching
- Auto refetch
- Loading state built-in
- Error state built-in

========================================================
10. AUTHENTICATION SYSTEM
========================================================

Flow:

Login → Save token → Fetch profile → Save permissions → Redirect

Includes:
- Token storage
- Refresh token logic
- Multi-tab logout sync

Benefits:
- Secure
- Professional
- No random logout
- Enterprise ready

========================================================
11. RBAC SYSTEM
========================================================

constants/rbac.ts

useAuth() hook provides:

- isAdmin
- isSuperAdmin
- can(permission)

Benefits:
- Central permission control
- Clean UI restriction
- Secure frontend behavior

========================================================
12. ADMIN LAYOUT SYSTEM
========================================================

AdminLayout includes:

- Navbar
- Sidebar
- Outlet
- ModalHost

Benefits:
- Clean layout separation
- Reusable structure
- Scalable design

========================================================
13. CENTRALIZED MODAL SYSTEM
========================================================

Context-based modal control:

AppModalContext
ModalHost

Benefits:
- No local modal chaos
- One global system
- Type-safe modal data
- Clean management

========================================================
14. CRUD FORM SYSTEM
========================================================

useCrudForm hook handles:

- create
- update
- delete
- loading
- success toast
- error mapping

Benefits:
- No duplicate logic
- Reusable across modules
- Clean code

========================================================
15. DATA TABLE SYSTEM
========================================================

Components:

- AdminTablePage
- AdminCard
- DataTable
- RowActions

Principle:
Single Responsibility

Benefits:
- Clean separation
- Easy modification
- Reusable system

========================================================
16. PAGINATION SYSTEM
========================================================

usePagination hook uses:

useSearchParams()

Benefits:
- URL synced pagination
- Refresh safe
- Shareable links
- Back button works

========================================================
17. SOFT DELETE SUPPORT
========================================================

UI adapts based on:

deleted_at field

Benefits:
- Restore button
- Archive support
- Enterprise behavior

========================================================
18. ERROR HANDLING
========================================================

- ErrorBoundary
- Toast notifications
- Central execute() helper

Benefits:
- Clean user feedback
- No crash screen
- Consistent UX

========================================================
19. MULTI TAB LOGOUT SYNC
========================================================

Uses:

window.addEventListener("storage")

Benefits:
- Secure logout
- Professional behavior
- Session sync

========================================================
20. BUILD PROJECT
========================================================

Development:

npm run dev

Production Build:

npm run build

Preview Production:

npm run preview

========================================================
21. MAIN FEATURES IMPLEMENTED
========================================================

AUTH:
- Login
- Register
- Forgot password
- Reset password
- Email verification
- Refresh token
- Multi-tab logout

ADMIN:
- Dashboard
- User CRUD
- Role CRUD
- Permission CRUD
- Assign roles
- Assign permissions
- Soft delete
- Sidebar dynamic loading

SYSTEM:
- RBAC control
- Centralized modal
- URL pagination
- Token refresh lock
- Clean architecture

========================================================
END OF FRONTEND SETUP GUIDE
========================================================
