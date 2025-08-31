# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Next.js project for TLabs (@midday/website) that follows modern web development patterns inspired by Midday's design system. The project uses a standard Next.js App Router structure:

- **Main App**: `src/app/` contains Next.js App Router pages and layouts
- **Components**: Reusable UI components using CVA (Class Variance Authority) for styling
- **Styling**: Custom Tailwind CSS v4 configuration with modern design patterns
- **Actions**: Server actions for form handling and API interactions
- **Theming**: Advanced theme system with dark/light mode support

## Development Commands

### Local Development (from project root)
```bash
npm run dev        # Start development server on port 3000
npm run build      # Build production bundle (with NODE_ENV=production)
npm run start      # Start production server
npm run lint       # Run Biome linter/formatter checks
npm run format     # Format code with Biome
npm run typecheck  # Run TypeScript type checking
npm run clean      # Clean .next and node_modules directories
```

## UI/UX Design Patterns & Implementation Guide

This project follows production-grade UI/UX patterns inspired by modern design systems like Midday. All components should follow these established patterns for consistency, accessibility, and maintainability.

### Design System Foundation

#### Core Utility Function
Always use the `cn()` utility function for className composition:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This ensures:
- Intelligent Tailwind class merging
- Conditional class handling
- Prevention of class conflicts
- Component style overrides

#### Component Architecture Template
Every component should follow this consistent pattern:

```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

// 1. Define variants with CVA
const componentVariants = cva(
  "base-classes-always-applied", // Base styles
  {
    variants: {
      variant: {
        default: "default-variant-styles",
        secondary: "secondary-variant-styles",
      },
      size: {
        default: "default-size-styles",
        sm: "small-size-styles",
        lg: "large-size-styles",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// 2. Define props interface
export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  asChild?: boolean; // Polymorphic behavior
}

// 3. Component implementation with forwardRef
const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
  
    return (
      <Comp
        className={cn(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

// 4. Always set displayName for debugging
Component.displayName = "Component";

export { Component, componentVariants };
```

### Color System & Theming

#### CSS Custom Properties Strategy
Use HSL values without `hsl()` wrapper for maximum flexibility:

```css
:root {
  --background: 0, 0%, 100%;
  --foreground: 0, 0%, 7%;
  --primary: 240 5.9% 10%;
  --secondary: 40, 11%, 89%;
  --muted: 40, 11%, 89%;
  --border: 45, 5%, 85%;
  --accent: 40, 11%, 89%;
  --destructive: 0 84.2% 60.2%;
}

.dark {
  --background: 0, 0%, 7%;
  --foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --secondary: 0 0% 15%;
}
```

#### Semantic Color Usage
```typescript
const semanticColors = {
  muted: "text-[#878787]", // Secondary text
  subtle: "text-[#606060]", // Card descriptions
  border: "text-[#666666]", // Table headers
  
  // Background variations
  lightToast: "bg-[#F6F6F3]",
  lightSheet: "bg-[#FAFAF9]",
  darkSheet: "dark:bg-[#121212]",
  darkBadge: "dark:bg-[#1D1D1D]",
  
  // Functional colors
  success: "#00C969", // Income/positive actions
  income: "text-[#00C969]",
  expense: "text-red-500",
};
```

### Typography System

```typescript
const fonts = {
  primary: "Geist Sans", // UI text, optimal readability from geist package
  mono: "Geist Mono",    // Code, data, numbers from geist package
  custom: "Tobias",      // Custom brand font from public/fonts/
};

const textSizes = {
  xs: "text-xs",     // 12px - Labels, captions
  sm: "text-sm",     // 14px - Body text, descriptions
  base: "text-base", // 16px - Main content
  lg: "text-lg",     // 18px - Headings, emphasis
  xl: "text-xl",     // 20px - Page titles
};
```

### Button Component Pattern

Buttons should use this comprehensive variant system:

```typescript
const buttonVariants = cva(
  // Base styles - always applied
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Form System Architecture

#### Form Field Context Pattern
Use React Hook Form with proper context:

```typescript
// Form field composition with context
const FormField = <TFieldValues, TName>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

// Usage pattern
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="Enter email" {...field} />
      </FormControl>
      <FormDescription>
        We'll use this to send you updates.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### Submit Button with Loading State
```typescript
export function SubmitButton({ 
  children, 
  isSubmitting, 
  disabled, 
  ...props 
}: {
  children: React.ReactNode;
  isSubmitting: boolean;
  disabled?: boolean;
} & ButtonProps) {
  return (
    <Button 
      disabled={isSubmitting || disabled} 
      {...props} 
      className={cn(props.className, "relative")}
    >
      <span style={{ visibility: isSubmitting ? "hidden" : "visible" }}>
        {children}
      </span>
      {isSubmitting && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Spinner />
        </span>
      )}
    </Button>
  );
}
```

### Modal and Sheet System

#### Dialog with Animations
```typescript
const DialogContent = React.forwardRef<...>(({ 
  className, 
  children, 
  hideClose, 
  ...props 
}, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Base dialog styles
        "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200",
        // Responsive sizing
        "sm:rounded-lg md:w-full",
        // Animation states
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
      {!hideClose && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
```

### Animation System

#### CSS Keyframes and Tailwind Integration
Add these to `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fade-in 1000ms var(--animation-delay, 0) ease forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
};
```

### Accessibility Requirements

#### ARIA Patterns and Keyboard Navigation
All interactive components must include:

```typescript
// Enhanced keyboard navigation for tables
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!containerRef.current?.contains(document.activeElement)) return;
  
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        // Navigate to next item
        break;
      case "ArrowUp":
        event.preventDefault();
        // Navigate to previous item
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        // Activate current item
        break;
      case "Escape":
        // Close/cancel current action
        break;
    }
  };
  
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, []);
```

#### Screen Reader Support
Always include:
- Proper semantic HTML elements
- ARIA labels and descriptions
- Live regions for dynamic content
- Skip navigation links
- Proper heading hierarchy

### Performance Patterns

#### Component Memoization
Use strategic memoization for expensive components:

```typescript
const ExpensiveComponent = memo(({ 
  data, 
  formatter, 
  className 
}: ComponentProps) => {
  const formattedData = useMemo(() => formatter(data), [data, formatter]);
  
  return (
    <div className={className}>
      {formattedData}
    </div>
  );
});
```

#### Loading States and Skeletons
Provide consistent loading experiences:

```typescript
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, j) => (
          <div
            key={j}
            className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-shimmer bg-[length:200%_100%]"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </div>
    ))}
  </div>
);
```

### Form Management with Validation

#### Custom Form Hook with Zod
```typescript
export function useZodForm<T extends z.ZodType<any, any>>(
  schema: T,
  defaultValues?: Partial<z.infer<T>>,
  options?: UseFormProps<z.infer<T>>
) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
    ...options,
  });

  return {
    ...form,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
  };
}
```

### Development Best Practices

#### File Organization
```
src/
├── app/                # Next.js App Router pages and layouts
│   ├── about/          # About page
│   ├── contact/        # Contact page
│   ├── layout.tsx      # Root layout with theme provider
│   └── page.tsx        # Home page
├── components/
│   ├── ui/             # Basic UI primitives (Button, etc.)
│   ├── about/          # About page specific components
│   ├── contact/        # Contact page specific components
│   ├── home/           # Home page components (Hero, Sections)
│   ├── theme/          # Theme switching components
│   ├── header.tsx      # Main navigation header
│   ├── footer.tsx      # Site footer
│   └── navigation-header.tsx  # Navigation component
├── actions/            # Server actions for forms and API calls
├── lib/                # Utility functions and providers
├── styles/             # Global CSS styles
└── utils/              # Additional utility functions
```

#### Component Export Pattern
```typescript
// Named exports for flexibility
export { Button, buttonVariants };
export type { ButtonProps };

// components/ui/index.ts - Centralized exports
export { Button, buttonVariants } from "./button";
export type { ButtonProps } from "./button";

// Usage - clean imports with @ alias pointing to src/
import { Button, type ButtonProps } from "@/components/ui";
import { cn } from "@/lib/utils";
```

## Architecture Details

### Component System
- Uses **Class Variance Authority (CVA)** for component variants and styling
- All components follow the Midday-inspired architecture template
- Polymorphic components with `asChild` prop support using Radix Slot
- TypeScript with strict configuration and path aliases (`@/*` points to root)
- Comprehensive accessibility support with ARIA patterns

### Styling System
- **Tailwind CSS v4** with PostCSS integration
- CSS custom properties for theming support
- Semantic color system with consistent usage patterns
- Modern spacing and typography scales
- Animation keyframes integrated with Tailwind
- Geist font family (Sans & Mono) with custom Tobias font for branding

### Theme System
- Advanced dark/light mode support with system preference detection
- Server-side theme handling to prevent hydration mismatches
- Theme persistence with preferences store
- Theme-aware component variants
- Custom theme switching components

#### Theme Architecture
```typescript
// Theme providers in src/lib/preferences-provider.tsx
export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  // Handles theme state management
  // Provides theme context to all components
  // Manages theme persistence and system preferences
}

// Theme utilities in src/lib/theme-utils.ts and src/lib/server-theme-utils.ts
// Server-side theme detection and handling
```

### Form System
- Server Actions for form handling
- Zod schemas for validation (see `src/actions/schema.ts`)
- Type-safe action patterns for contact forms and subscriptions
- Safe action wrapper with proper error handling
- Loading states and error handling
- Accessible form patterns with proper ARIA support

#### Server Action Pattern
```typescript
// Example from src/actions/send-support-action.ts
import { z } from "zod";
import { sendSupportSchema } from "./schema";

export async function sendSupportAction(input: z.infer<typeof sendSupportSchema>) {
  // Validate input with Zod schema
  // Handle form submission server-side
  // Return success/error states
}
```

### Development Environment
- Node.js with Next.js 15.5.2 and React 19
- TypeScript with strict configuration
- Biome for fast linting and formatting (replaces ESLint/Prettier)
- PostCSS with Tailwind CSS v4 and Autoprefixer
- Development server on port 3000

## Current Dependencies

The project uses these key dependencies:

```bash
# Core Framework
next@15.5.2            # Next.js framework with App Router
react@19.1.1           # React 19 with concurrent features
react-dom@19.1.1       # React DOM for web

# Styling & UI
class-variance-authority@^0.7.1  # CVA for component variants
clsx@^2.1.1                     # Conditional class utilities
tailwind-merge@^3.3.1           # Intelligent Tailwind class merging
tailwindcss@^4.1.12             # Tailwind CSS v4
framer-motion@^12.23.12         # Animation library

# Typography & Fonts
geist@^1.4.2           # Geist font family (Sans & Mono)

# Development Tools
@biomejs/biome@2.2.2   # Fast linter and formatter
typescript@^5.9.2      # TypeScript compiler
sharp@0.34.3          # Image optimization

# Utilities
date-fns@^4.1.0       # Date manipulation utilities
server-only@^0.0.1    # Server-side only code markers

# Validation (via server actions)
zod                   # Schema validation for forms and server actions
```

## Key Files to Know
- `package.json`: Dependencies, scripts, and project configuration
- `tailwind.config.ts`: Custom design system configuration with Tailwind v4
- `src/components/ui/button.tsx`: Example of CVA component pattern
- `src/lib/utils.ts`: Core utility functions (cn function for class merging)
- `src/app/layout.tsx`: Root layout with theme providers and metadata
- `src/lib/preferences-provider.tsx`: Theme state management and context
- `src/lib/theme-utils.ts` & `src/lib/server-theme-utils.ts`: Theme utilities
- `src/actions/schema.ts`: Zod validation schemas for forms
- `src/actions/`: Server actions for form handling and API interactions
- `src/components/theme/theme-switcher.tsx`: Theme toggle component
- `src/styles/globals.css`: Global styles with CSS custom properties
- `postcss.config.cjs`: PostCSS configuration for Tailwind processing
- `tsconfig.json`: TypeScript configuration with path aliases (@/* → src/)

## Implementation Principles

1. **Consistency over Customization**: Establish patterns and stick to them
2. **Composition over Configuration**: Build complex UIs from simple, focused components  
3. **Accessibility-First**: Build inclusive experiences from the ground up
4. **Performance-Conscious**: Optimize for real-world usage patterns
5. **Type Safety**: Comprehensive TypeScript coverage with proper constraints
6. **Predictable Patterns**: Consistent APIs and interfaces across components