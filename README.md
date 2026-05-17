# Social Networking Platform

A full-stack social networking application built with NestJS microservices backend and Angular frontend.

## Project Overview

This project consists of:
- **Backend**: NestJS monorepo with multiple microservices
  - API Gateway
  - Authentication Service
  - User Service
  - Post Service
  - Media Service
  - Follow Service
- **Frontend**: Angular 21 application

---

## Prerequisites

Make sure you have the following installed on your system:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
4. **Git** (for version control) - [Download](https://git-scm.com/)

---

## Project Setup

### Step 1: Clone the Repository

```bash
git clone <your-github-repo-url>
cd "Social Networking"
```

### Step 2: Database Setup

#### Create PostgreSQL Database

1. Open PostgreSQL CLI or use pgAdmin
2. Create a new database named `social-website`:

```sql
CREATE DATABASE "social-website";
```

3. Default PostgreSQL credentials used in the project:
   - **Username**: `postgres`
   - **Password**: `9561591238`
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: `social-website`

> **Note**: These credentials are configured in the backend services. Update them in `backend/apps/*/src/config.ts` if your PostgreSQL credentials are different.

---

## Backend Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Database Configuration

The database connection is configured in each service's `config.ts` file:
- `backend/apps/auth/src/config.ts`
- `backend/apps/user/src/config.ts`
- `backend/apps/follow/src/config.ts`
- `backend/apps/post/src/config.ts`
- `backend/apps/media/src/config.ts`

Update the credentials if needed (DB_USERNAME, DB_PASSWORD, DB_PORT, DB_DATABASE).

### Step 3: Run Backend Services

The backend uses a NestJS monorepo with multiple services. You can run them individually or together.

#### Option A: Run All Services in Watch Mode (Development)

```bash
npm run start:dev
```

#### Option B: Run Individual Services

Open separate terminal windows and run each service:

**Terminal 1 - API Gateway** (Port 4000):
```bash
npm run start:api-gateway
```

**Terminal 2 - Auth Service**:
```bash
npm run start:auth
```

**Terminal 3 - User Service**:
```bash
npm run start:user
```

**Terminal 4 - Media Service**:
```bash
npm run start:media
```

**Terminal 5 - Post Service**:
```bash
npm run start:post
```

**Terminal 6 - Follow Service**:
```bash
npm run start:follow
```

#### Option C: Production Build

```bash
npm run build
npm run start:prod
```

### Backend Services Ports

| Service | Port | Command |
|---------|------|---------|
| API Gateway | 4000 | `npm run start:api-gateway` |
| Auth | 3001 | `npm run start:auth` |
| User | 3002 | `npm run start:user` |
| Media | 3003 | `npm run start:media` |
| Post | 3004 | `npm run start:post` |
| Follow | 3005 | `npm run start:follow` |

---

## Frontend Setup

### Step 1: Install Frontend Dependencies

```bash
cd frontend-angular
npm install
```

### Step 2: Run Frontend Development Server

```bash
npm start
```

This will start the Angular development server at `http://localhost:4200`

The frontend is pre-configured to connect to the backend API Gateway at `http://localhost:4000`

### Frontend Build

For production build:

```bash
npm run build
```

---

## Complete Startup Guide

### First Time Setup

1. **Open Terminal 1** - Start PostgreSQL (if not already running)
   ```bash
   # On Windows:
   net start PostgreSQL-x64-15  # (or your version)
   
   # On macOS:
   brew services start postgresql
   
   # On Linux:
   sudo systemctl start postgresql
   ```

2. **Create Database** (if not already created):
   ```bash
   psql -U postgres -c "CREATE DATABASE \"social-website\";"
   ```

3. **Open Terminal 2** - Start Backend (API Gateway):
   ```bash
   cd backend
   npm install  # (if not done)
   npm run start:api-gateway
   ```

4. **Open Terminal 3** - Start Other Backend Services:
   ```bash
   cd backend
   npm run start:auth
   ```

5. **Open Terminal 4+** - Start Remaining Services (repeat for each):
   ```bash
   npm run start:user
   npm run start:media
   npm run start:post
   npm run start:follow
   ```

6. **Open Terminal (Final)** - Start Frontend:
   ```bash
   cd frontend-angular
   npm install  # (if not done)
   npm start
   ```

7. **Access Application**:
   - Frontend: `http://localhost:4200`
   - API Gateway: `http://localhost:4000`

---

## Available Scripts

### Backend Scripts

```bash
# Development
npm run start             # Start all services
npm run start:dev        # Start in watch mode
npm run start:debug      # Start with debugger

# Individual Services
npm run start:api-gateway
npm run start:auth
npm run start:user
npm run start:media
npm run start:post
npm run start:follow

# Linting & Testing
npm run lint             # Lint and fix code
npm run test             # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:cov        # Run tests with coverage
npm run test:e2e        # Run end-to-end tests

# Production
npm run build            # Build for production
npm run start:prod       # Start production build
```

### Frontend Scripts

```bash
npm start                # Start development server
npm run build            # Build for production
npm run watch            # Build in watch mode
npm test                 # Run tests
```

---

## Environment Configuration

### Backend Configuration Files

Update the following files with your database credentials if they differ:

- `backend/apps/auth/src/config.ts`
- `backend/apps/user/src/config.ts`
- `backend/apps/follow/src/config.ts`
- `backend/apps/post/src/config.ts`
- `backend/apps/media/src/config.ts`

```typescript
export const DB_PORT = 5432;
export const DB_USERNAME = 'postgres';
export const DB_PASSWORD = 'your-password';
export const DB_DATABASE = 'social-website';
export const JWT_SECRET = 'Secret-key';
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:4000` (API Gateway) with CORS enabled.

---

## API Documentation

The API Gateway is accessible at:
- **Base URL**: `http://localhost:4000/api`

Main endpoints:
- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/posts/*` - Post operations
- `/api/media/*` - Media uploads
- `/api/follow/*` - Follow/Unfollow operations

---

## Troubleshooting

### Issue: PostgreSQL Connection Error

**Solution**:
- Ensure PostgreSQL is running
- Verify credentials in `config.ts` files
- Check if database `social-website` exists
- Verify port 5432 is accessible

### Issue: Port Already in Use

**Solution**:
- Check which process is using the port:
  ```bash
  # Windows
  netstat -ano | findstr :4000
  
  # macOS/Linux
  lsof -i :4000
  ```
- Kill the process or use a different port

### Issue: CORS Errors

**Solution**:
- Ensure frontend is running on `http://localhost:4200`
- CORS is pre-configured for this URL in the API Gateway
- Update CORS settings in `backend/apps/api-gateway/src/main.ts` if needed

### Issue: Module Not Found Errors

**Solution**:
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## Project Structure

```
Social Networking/
├── backend/
│   ├── apps/
│   │   ├── api-gateway/      # API Gateway microservice
│   │   ├── auth/             # Authentication service
│   │   ├── user/             # User management service
│   │   ├── post/             # Post management service
│   │   ├── media/            # Media upload/storage service
│   │   └── follow/           # Follow functionality service
│   ├── uploads/              # Uploaded files storage
│   ├── package.json
│   └── nest-cli.json
├── frontend-angular/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── angular.json
└── README.md
```

---

## Technologies Used

### Backend
- **Framework**: NestJS 11
- **Database**: PostgreSQL
- **Authentication**: JWT (Passport)
- **ORM**: TypeORM
- **Runtime**: Node.js
- **Package Manager**: npm

### Frontend
- **Framework**: Angular 21
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Build Tool**: Angular CLI
- **Testing**: Vitest

---

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## License

This project is licensed under the UNLICENSED license.

---

## Support

For issues or questions, please open an issue in the repository.

---

## Notes

- Ensure all backend services are running before accessing the frontend
- The API Gateway acts as the main entry point for all API calls
- File uploads are stored in the `backend/uploads/` directory
- JWT tokens are used for authentication (default secret: 'Secret-key')

Happy coding! 🚀
