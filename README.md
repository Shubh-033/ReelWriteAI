# Overview

ReelWrite AI is a modern web application that helps content creators generate engaging social media scripts using AI-powered technology. The platform provides users with a comprehensive script generation tool that creates viral-ready content with attention-grabbing hooks, compelling body content, and effective call-to-actions. Built as a full-stack TypeScript application, it combines the power of React with Express.js and leverages Hugging Face's AI models for intelligent content generation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built with **React 18** and **TypeScript**, utilizing a modern component-based architecture. The UI framework is **Tailwind CSS** combined with **shadcn/ui** components for consistent design patterns. **Framer Motion** provides smooth animations and transitions throughout the application. The frontend follows a page-based routing system using **Wouter** for lightweight navigation.

Key architectural decisions:
- **Component Structure**: Organized into reusable UI components, page components, and feature-specific components
- **State Management**: Uses React Context for authentication state and TanStack Query for server state management
- **Styling Approach**: Utility-first CSS with Tailwind, enhanced by custom CSS variables for brand colors (electric blue, neon pink, lime green)
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

## Backend Architecture
The server is built with **Express.js** and **TypeScript**, implementing a RESTful API architecture. The application uses a middleware-based approach with JWT authentication for secure user sessions. The server handles script generation through integration with Hugging Face AI models and provides comprehensive CRUD operations for user scripts.

Key architectural decisions:
- **API Design**: RESTful endpoints with consistent response formats
- **Authentication**: JWT-based stateless authentication with bcrypt password hashing
- **AI Integration**: Hugging Face API integration for natural language processing and script generation
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

## Data Storage Solutions
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations. The schema is designed to support user management, script storage, and community features. Database migrations are managed through Drizzle Kit.

Database schema design:
- **Users Table**: Stores user credentials and profile information
- **Scripts Table**: Contains generated scripts with metadata (niche, content type, tone, etc.)
- **Community Scripts Table**: Enables sharing scripts with the community with engagement metrics

For development and testing, the application includes an in-memory storage implementation that mirrors the database interface, allowing for rapid prototyping without database dependencies.

## Authentication and Authorization
The system implements **JWT-based authentication** with secure password hashing using bcryptjs. The authentication flow includes signup, login, and token-based session management. Protected routes require valid JWT tokens, and the frontend maintains authentication state through React Context.

Security features:
- Password hashing with bcrypt
- JWT token expiration and validation
- Protected API endpoints with middleware authentication
- Secure cookie handling for session management

# External Dependencies

## AI Services
- **Hugging Face API**: Primary AI service for natural language processing and script generation using models like T5 and GPT-J
- **API Key Management**: Environment-based configuration for secure API access

## Database Services
- **Neon Database**: Serverless PostgreSQL database for production deployment
- **PostgreSQL**: Primary database technology with connection pooling support

## UI and Design
- **Radix UI**: Comprehensive component library providing accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Framer Motion**: Animation library for smooth user interactions
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Build tool and development server with hot module replacement
- **TypeScript**: Type safety across the entire application stack
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Fast JavaScript bundler for production builds

## Deployment and Hosting
- **Replit**: Development environment with integrated deployment capabilities
- **Node.js**: Runtime environment for the Express.js server
- **Environment Variables**: Secure configuration management for API keys and database connections