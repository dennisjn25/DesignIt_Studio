# Technology Stack

## Frontend Framework

- **React 18+** with TypeScript for type safety and modern development
- **React-Konva** for declarative canvas operations and high-performance rendering
- **Tailwind CSS** for utility-first styling and rapid UI development
- **Framer Motion** for smooth animations and transitions

## Desktop Application

- **Electron** for cross-platform desktop deployment
- Native file system access for enhanced performance
- System integration capabilities (file associations, drag-and-drop)

## Canvas and Graphics

- **Konva.js** as the primary 2D canvas library for shape manipulation
- **React-Konva** for React integration and declarative canvas programming
- Custom VST3 component library built on top of Konva primitives

## State Management

- **Zustand** for lightweight, scalable state management
- **React Query** for server state management and caching
- **Immer** for immutable state updates

## Authentication and Storage

- **Google OAuth 2.0** for user authentication
- **Google Drive API** for cloud storage and synchronization
- **IndexedDB** for local web storage
- Native file system for desktop application

## AI Integration

- **OpenAI API** for design suggestions and automated layout
- Custom prompt engineering for VST3-specific design patterns
- Image analysis for reference-based design generation

## Build System

- **Vite** for fast development and optimized builds
- **TypeScript** for type safety across the entire codebase
- **ESLint** and **Prettier** for code quality and formatting

## Common Commands

### Development

```bash
# Install dependencies
npm install

# Start development server (web)
npm run dev

# Start development server (desktop)
npm run electron:dev

# Type checking
npm run type-check
```

### Building

```bash
# Build web application
npm run build

# Build desktop application
npm run electron:build

# Build for all platforms
npm run build:all
```

### Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```
