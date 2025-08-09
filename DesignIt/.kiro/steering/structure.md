# Project Structure

## Root Directory Organization

```text
vst3-interface-designer/
├── src/                          # Source code
│   ├── components/               # React components
│   │   ├── canvas/              # Canvas-related components
│   │   ├── palette/             # Component palette
│   │   ├── properties/          # Properties panel
│   │   ├── ai/                  # AI assistant components
│   │   └── common/              # Shared UI components
│   ├── engine/                  # Core engine logic
│   │   ├── canvas/              # Canvas engine (Konva.js)
│   │   ├── components/          # VST3 component library
│   │   ├── export/              # Code export engine
│   │   └── ai/                  # AI integration
│   ├── services/                # External services
│   │   ├── auth/                # Google OAuth
│   │   ├── storage/             # Storage abstraction
│   │   └── api/                 # API clients
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   ├── hooks/                   # Custom React hooks
│   └── stores/                  # State management (Zustand)
├── electron/                    # Electron-specific code
├── public/                      # Static assets
├── tests/                       # Test files
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── e2e/                     # End-to-end tests
├── docs/                        # Documentation
└── .kiro/                       # Kiro configuration
    ├── specs/                   # Project specifications
    └── steering/                # AI steering rules
```

## Key Directories

### `/src/components/`

React components organized by feature area:

- **canvas/**: Main design canvas, selection tools, zoom controls
- **palette/**: Component library browser, drag-and-drop interface
- **properties/**: Dynamic property editors, style panels
- **ai/**: AI assistant interface, suggestion panels
- **common/**: Reusable UI components, buttons, modals

### `/src/engine/`

Core application logic separated from UI:

- **canvas/**: Konva.js integration, canvas operations, rendering
- **components/**: VST3 component definitions, property validation
- **export/**: Code generation for JUCE, iPlug2, and other frameworks
- **ai/**: OpenAI integration, design analysis, pattern recognition

### `/src/services/`

External service integrations:

- **auth/**: Google OAuth flow, session management
- **storage/**: Local and cloud storage abstraction
- **api/**: HTTP clients, API wrappers

### `/src/types/`

TypeScript definitions for:

- VST3 components and properties
- Canvas state and operations
- Project structure and metadata
- Export formats and configurations

## File Naming Conventions

- **Components**: PascalCase (e.g., `DesignCanvas.tsx`, `ComponentPalette.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useCanvasState.ts`, `useAIAssistant.ts`)
- **Services**: camelCase (e.g., `authService.ts`, `storageService.ts`)
- **Types**: PascalCase with descriptive names (e.g., `VST3Component.ts`, `CanvasState.ts`)
- **Utils**: camelCase (e.g., `colorUtils.ts`, `exportUtils.ts`)

## Import Organization

Follow this import order:

1. React and external libraries
2. Internal components and hooks
3. Services and utilities
4. Types and interfaces
5. Relative imports

```typescript
// External libraries
import React from 'react';
import { Stage, Layer } from 'react-konva';

// Internal components
import { ComponentPalette } from '../palette/ComponentPalette';
import { PropertiesPanel } from '../properties/PropertiesPanel';

// Services
import { canvasService } from '../../services/canvas';

// Types
import type { VST3Component, CanvasState } from '../../types';

// Relative imports
import './DesignCanvas.css';
```

## Configuration Files

- **package.json**: Dependencies, scripts, and project metadata
- **tsconfig.json**: TypeScript configuration
- **vite.config.ts**: Vite build configuration
- **electron.config.js**: Electron packaging configuration
- **tailwind.config.js**: Tailwind CSS customization
- **.eslintrc.js**: ESLint rules and configuration
