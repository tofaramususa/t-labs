# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Next.js project called "linear" (despite the repo name "horizon-agency") that appears to be building a Linear-inspired interface. The main application code is located in `horizon/horizon/` directory with a nested structure:

- **Main App**: `horizon/horizon/` contains the Next.js application
- **Components**: Reusable UI components using CVA (Class Variance Authority) for styling
- **Styling**: Custom Tailwind configuration with Linear-inspired design system
- **Docker**: Containerized development environment with Docker Compose

## Development Commands

### Local Development (in horizon/horizon/ directory)
```bash
npm run dev      # Start development server on port 3000
npm run build    # Build production bundle
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Docker Development (from project root)
```bash
make start       # Start Docker containers with docker compose up -d --build
make clean       # Stop and remove containers
make prune       # Clean up Docker system
make bash CONTAINER=frontend  # Access container shell
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
  primary: "Geist Sans", // UI text, optimal readability
  mono: "Geist Mono",    // Code, data, numbers
  serif: "Lora",         // Editorial content, emphasis
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
horizon/horizon/
├── components/
│   ├── ui/             # Basic UI primitives (Button, Input, etc.)
│   ├── forms/          # Form-specific components
│   ├── layout/         # Layout components (Header, Sidebar)
│   └── feature/        # Feature-specific components
├── lib/                # Utility functions (cn, validators)
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
└── app/                # Next.js app router pages
```

#### Component Export Pattern
```typescript
// Named exports for flexibility
export { Button, buttonVariants };
export type { ButtonProps };

// components/ui/index.ts - Centralized exports
export { Button, buttonVariants } from "./button";
export type { ButtonProps } from "./button";

// Usage - clean imports
import { Button, Input, type ButtonProps } from "@/components/ui";
```

## Architecture Details

### Component System
- Uses **Class Variance Authority (CVA)** for component variants and styling
- All components follow the Midday-inspired architecture template
- Polymorphic components with `asChild` prop support using Radix Slot
- TypeScript with strict configuration and path aliases (`@/*` points to root)
- Comprehensive accessibility support with ARIA patterns

### Styling System
- **Tailwind CSS** with extensive custom configuration
- CSS custom properties for theming support
- Semantic color system with consistent usage patterns
- Custom spacing scale (0.4rem increments) and typography scale
- Animation keyframes integrated with Tailwind
- SF Pro Display font family with fallbacks

### Form System
- React Hook Form integration with Zod validation
- Reusable form field components with context
- Auto-save functionality with debouncing
- Loading states and error handling
- Accessible form patterns

### Development Environment
- Dockerized with Ubuntu focal base image and current Node.js
- Volume mounting for live development
- Container exposes port 3000
- TSConfig with strict mode and Next.js plugin

## Dependencies to Install

When adding new functionality, install these dependencies as needed:

```bash
# Core UI dependencies
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge

# Form handling
npm install react-hook-form @hookform/resolvers zod

# Animations
npm install framer-motion

# Additional Radix UI components (as needed)
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-accordion
```

## Key Files to Know
- `horizon/horizon/package.json`: Dependencies and scripts
- `horizon/horizon/tailwind.config.ts`: Custom design system configuration  
- `horizon/horizon/components/button.tsx`: Example of CVA component pattern
- `horizon/horizon/lib/utils.ts`: Core utility functions (cn function)
- `docker-compose.yml`: Development environment setup
- `Makefile`: Docker command shortcuts

## Implementation Principles

1. **Consistency over Customization**: Establish patterns and stick to them
2. **Composition over Configuration**: Build complex UIs from simple, focused components  
3. **Accessibility-First**: Build inclusive experiences from the ground up
4. **Performance-Conscious**: Optimize for real-world usage patterns
5. **Type Safety**: Comprehensive TypeScript coverage with proper constraints
6. **Predictable Patterns**: Consistent APIs and interfaces across components