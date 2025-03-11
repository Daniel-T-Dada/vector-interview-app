# Vector Interview - Frontend Authentication System

A modern authentication system built with Next.js, NextAuth.js, and Tailwind CSS for Vector Interview.

![Vector Interview Screenshot](./public/images/Preview.png)

## 🌐 Live Demo

The application is live and accessible at: [https://vector-interview-app.vercel.app](https://vector-interview-app.vercel.app)

**Quick Access**: You can immediately try the application by:

- Signing in with your Google account (recommended)
- Using the demo credentials listed in the [Mock Users](#-mock-users) section

## 🚀 Features

- **Google OAuth Authentication**: Sign in with your existing Google account - no registration needed!
- **Email/Password Authentication**: Traditional login with form validation
- **Admin Dashboard**: Comprehensive admin interface with summary cards and recent activity
- **User Dashboard**: Separate dashboard for regular users with personalized content
- **Interview Management**: View, sort, filter, and paginate through interview data
- **User Management**: View and manage user accounts with detailed statistics
- **Settings Panel**: Customizable user preferences with tabs for different settings categories
- **Responsive Design**: Mobile-first approach for all screen sizes
- **Dark/Light Mode**: Theme toggle with system preference detection
- **Form Validation**: Client-side validation using Yup and React Hook Form
- **Protected Routes**: Middleware-based route protection
- **Modern UI**: Built with Tailwind CSS and ShadCN components
- **Skeleton Loading**: Enhanced user experience with skeleton loading states
- **Conditional Navigation**: Smart navigation that adapts based on user role and context

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/Daniel-T-Dada/vector-interview-app.git
cd vector-interview-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000  # Use your deployment URL in production
NEXTAUTH_SECRET=your-secret-key-change-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

To get Google OAuth credentials:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Create an OAuth 2.0 Client ID
5. Add the following as authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local development)
   - `https://vector-interview-app.vercel.app/api/auth/callback/google` (for production)

> **Note**: For the live application at https://vector-interview-app.vercel.app, the OAuth credentials have already been configured.

## 🚀 Running the Application

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
/vector-interview
│── public/               # Static assets
│── app/                  # Next.js App Router
│   ├── layout.jsx        # Root layout (includes providers)
│   ├── page.jsx          # Homepage (redirects based on auth)
│   ├── auth/             # Authentication pages
│   │   ├── login/        # Login page
│   │   │   ├── page.jsx
│   │   ├── signup/       # Signup page with validation
│   │   │   ├── page.jsx
│   ├── dashboard/        # Admin dashboard pages
│   │   ├── layout.jsx    # Admin dashboard layout
│   │   ├── page.jsx      # Admin dashboard page
│   │   ├── interviews/   # Interview management
│   │   │   ├── page.jsx  # Interview list page
│   │   ├── settings/     # Settings page
│   │   │   ├── page.jsx  # Settings configuration
│   ├── user-dashboard/   # User dashboard pages
│   │   ├── layout.jsx    # User dashboard layout
│   │   ├── page.jsx      # User dashboard page
│   │   ├── users/        # User management
│   │   │   ├── page.jsx  # User list page
│   ├── api/              # API routes
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.js  # NextAuth.js API route
│   │   ├── users/        # User API routes
│   │   │   ├── route.js  # User data API
│── components/           # Reusable UI components
│   ├── ui/               # ShadCN UI components
│   │   ├── button.jsx    # Button component
│   │   ├── card.jsx      # Card component
│   │   ├── input.jsx     # Input component
│   │   ├── label.jsx     # Label component
│   │   ├── alert.jsx     # Alert component
│   │   ├── spinner.jsx   # Loading spinner component
│   │   ├── skeleton.jsx  # Skeleton loading component
│   ├── admin/            # Admin-specific components
│   │   ├── sidebar.jsx   # Admin sidebar navigation
│   │   ├── interview-table.jsx # Interview data table
│   ├── skeletons/        # Skeleton loading components
│   │   ├── dashboard-skeleton.jsx  # Dashboard loading skeleton
│   │   ├── interviews-skeleton.jsx # Interviews loading skeleton
│   │   ├── settings-skeleton.jsx   # Settings loading skeleton
│   │   ├── users-skeleton.jsx      # Users loading skeleton
│   ├── conditional-navbar.jsx # Conditional navigation bar
│   ├── Navbar.jsx        # Navigation bar
│   ├── theme-provider.jsx # Theme provider for dark/light mode
│   ├── auth-provider.jsx  # Authentication provider
│── lib/                  # Utility functions
│   ├── utils.js          # Helper functions
│   ├── data/             # Mock data
│   │   ├── interviews.js # Mock interview data
│   ├── services/         # Service functions
│   │   ├── interview-service.js # Interview data services
│   ├── types/            # Type definitions
│   │   ├── interview.js  # Interview type definitions
│── middleware.js         # NextAuth.js middleware for route protection
│── tailwind.config.js    # Tailwind CSS configuration
```

## 🔒 Authentication Flow

1. **Google OAuth** (Recommended):

   - Click "Sign in with Google" for the fastest login experience
   - You'll be redirected to Google's secure consent screen
   - After approval, you're automatically redirected back to the application
   - No need to remember another password!

2. **Email/Password**:
   - User enters email and password
   - Client-side validation with Yup
   - Credentials are verified against the mock database
   - If valid, NextAuth.js creates a session

## 👤 Mock Users

For demonstration purposes, the application comes with pre-configured mock users:

| Name      | Email               | Password    |
| --------- | ------------------- | ----------- |
| Demo User | user@example.com    | password123 |
| Double D  | double_d@vector.com | password123 |

You can use these credentials to log in and test the application without creating a new account.

The mock user data is stored in-memory and is defined in `lib/users.js`. In a production environment, you would replace this with a proper database connection.

## 🎨 UI Components

The project uses a combination of custom components and ShadCN UI components:

- **Button**: Primary, secondary, outline, and ghost variants
- **Card**: For login and signup forms
- **Input**: Form input fields with validation
- **Alert**: For success and error messages
- **Spinner**: Loading indicators
- **Skeleton**: Loading state placeholders
- **Navbar**: Responsive navigation with mobile menu
- **Sidebar**: Collapsible sidebar for dashboard navigation
- **Tabs**: Tabbed interface for settings and other multi-view components

## 🔄 Loading States

The application implements skeleton loading states to enhance user experience:

- **Dashboard Skeleton**: Shows a placeholder layout while dashboard data loads
- **Interviews Skeleton**: Displays a table-like structure while interview data loads
- **Settings Skeleton**: Shows a placeholder for settings panels during loading
- **Users Skeleton**: Displays a placeholder for user data during loading

These skeletons provide visual feedback to users during data fetching, making the application feel more responsive.

## 🔐 Route Protection

Protected routes are implemented using NextAuth.js middleware:

- `/auth/*` routes are accessible only to unauthenticated users
- `/dashboard/*` routes are accessible only to authenticated users with admin privileges
- `/user-dashboard/*` routes are accessible only to authenticated users
- Authenticated users are redirected to the appropriate dashboard based on their role
- Unauthenticated users are redirected to the login page when trying to access protected pages

## 🌙 Dark/Light Mode

The application supports dark and light modes:

- Automatic detection of system preference
- Manual toggle via the theme toggle button
- Theme persistence using localStorage

## 📱 Responsive Design

The UI is fully responsive across all device sizes:

- Mobile-first approach
- Responsive navigation with hamburger menu on small screens
- Collapsible sidebar for dashboard navigation on mobile
- Optimized layouts for different screen sizes
- Accessible on touch devices

## 🧪 Future Improvements

- Add email verification
- Implement password reset functionality
- Add additional social login providers (GitHub, Twitter, etc.)
- Connect to a real database for user management
- Add user profile management
- Implement role-based access control
- Add real-time notifications
- Implement data visualization with charts
- Add export functionality for data tables

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Yup](https://github.com/jquense/yup)
