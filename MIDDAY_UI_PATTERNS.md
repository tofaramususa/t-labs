# Midday UI/UX Design Patterns & Implementation Guide

This document extracts the key design patterns, architectural decisions, and implementation details from the Midday codebase to serve as a comprehensive reference for building clean, consistent, and beautiful frontend UIs.

## Table of Contents

1. [Design System Foundation](#design-system-foundation)
2. [Core Component Patterns](#core-component-patterns)
3. [Advanced UI Patterns](#advanced-ui-patterns)
4. [Application Architecture](#application-architecture)
5. [Performance &amp; Accessibility](#performance--accessibility)
6. [Development Patterns](#development-patterns)

---

## Design System Foundation

### Architecture Philosophy

Midday's design system is built on the principle of **composability over configuration**. They use a layered approach:

- **Radix UI**: Unstyled, accessible primitives
- **TailwindCSS**: Utility-first styling with design tokens
- **CVA (Class Variance Authority)**: Type-safe component variants
- **Custom utilities**: Enhanced developer experience

### Core Utility Function

```typescript
// The foundation of their styling system
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Why this matters:**

- Merges Tailwind classes intelligently (twMerge)
- Handles conditional classes elegantly (clsx)
- Prevents class conflicts and duplicates
- Enables component style overrides

### Color System & Design Tokens

#### CSS Custom Properties Strategy

```css
:root {
  /* HSL values without hsl() wrapper for maximum flexibility */
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
  /* Dark mode overrides */
}
```

#### Consistent Color Usage Patterns

```typescript
// Semantic color classes for consistent usage
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
// Font configuration with semantic meaning
const fonts = {
  primary: "Geist Sans", // UI text, optimal readability
  mono: "Geist Mono",    // Code, data, numbers
  serif: "Lora",         // Editorial content, emphasis
};

// Consistent size scale
const textSizes = {
  xs: "text-xs",     // 12px - Labels, captions
  sm: "text-sm",     // 14px - Body text, descriptions
  base: "text-base", // 16px - Main content
  lg: "text-lg",     // 18px - Headings, emphasis
  xl: "text-xl",     // 20px - Page titles
};
```

---

## Core Component Patterns

### Component Architecture Template

Every Midday component follows this consistent pattern:

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

### Button Component Pattern

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

// Custom hook for accessing form field state
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  
  const fieldState = getFieldState(fieldContext.name, formState);
  
  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
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

#### Specialized Input Components

```typescript
// Currency input with formatting
export function CurrencyInput({ 
  thousandSeparator = true, 
  ...props 
}: NumericFormatProps) {
  return (
    <NumericFormat
      thousandSeparator={thousandSeparator}
      customInput={Input}
      {...props}
    />
  );
}

// Submit button with loading state
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

### Icon System Implementation

```typescript
// Centralized icon management
import { MdClose, MdSearch, MdArrowBack } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { FiGithub } from "react-icons/fi";

// Custom SVG wrapper for consistency
const SVGIcon: React.FC<SVGIconProps> = ({
  size = 20,
  stroke = "currentColor",
  fill = "currentColor",
  strokeWidth = 0.25,
  className,
  children,
  viewBox,
}) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox || `0 0 20 20`}
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

// Exported icon mapping for consistency
export const Icons = {
  // External icons
  Close: MdClose,
  Search: MdSearch,
  ArrowBack: MdArrowBack,
  Twitter: FaXTwitter,
  GitHub: FiGithub,
  
  // Custom SVG icons
  LogoSmall: (props: SVGIconProps) => (
    <SVGIcon size={28} {...props} viewBox="0 0 28 28">
      <path fill="currentColor" d="..." />
    </SVGIcon>
  ),
  
  // Financial specific icons
  Income: (props: SVGIconProps) => (
    <SVGIcon {...props} className="text-[#00C969]">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </SVGIcon>
  ),
};
```

---

## Advanced UI Patterns

### Data Table Architecture

#### Sophisticated Table Implementation

```typescript
// Advanced table with sticky columns and infinite scroll
const TransactionTable = () => {
  const [rowSelection, setRowSelection] = useTransactionsStore(
    (state) => [state.rowSelection, state.setRowSelection]
  );
  
  const table = useReactTable({
    data: tableData,
    columns,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
      columnVisibility,
    },
    meta: {
      updateTransaction: (data) => updateMutation.mutate(data),
      onDeleteTransaction: (id) => deleteMutation.mutate([id]),
    },
  });

  return (
    <div className="relative">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    // Sticky column classes
                    header.column.getCanPin() && "sticky left-0 bg-background",
                    header.column.id === "select" && "w-12",
                    header.column.id === "actions" && "sticky right-0 bg-background"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())
                  }
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
      
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-muted/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      // Consistent cell styling
                      cell.column.getCanPin() && "sticky left-0 bg-background",
                      cell.column.id === "actions" && "sticky right-0 bg-background"
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    
      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-1" />
    </div>
  );
};
```

#### Keyboard Navigation Pattern

```typescript
// Enhanced keyboard navigation for tables
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!containerRef.current?.contains(document.activeElement)) return;
  
    const rows = table.getRowModel().rows;
    const currentIndex = selectedRowIndex;
  
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (currentIndex < rows.length - 1) {
          setSelectedRowIndex(currentIndex + 1);
        }
        break;
      
      case "ArrowUp":
        event.preventDefault();
        if (currentIndex > 0) {
          setSelectedRowIndex(currentIndex - 1);
        }
        break;
      
      case "Enter":
        event.preventDefault();
        if (rows[currentIndex]) {
          onRowAction(rows[currentIndex].original);
        }
        break;
      
      case " ":
        event.preventDefault();
        if (rows[currentIndex]) {
          rows[currentIndex].toggleSelected();
        }
        break;
    }
  };
  
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [selectedRowIndex, table]);
```

### Navigation Sidebar Pattern

```typescript
// Expandable sidebar with smooth animations
const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-[70px] border-r bg-background transition-all duration-200 ease-in-out",
        isExpanded && "w-64"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <nav className="flex h-full flex-col px-3 py-4">
        <div className="mb-8">
          <Logo className={cn("transition-all duration-200", isExpanded && "ml-2")} />
        </div>
      
        <ul className="space-y-1">
          {navigationItems.map((item, index) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === item.href && "bg-accent"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span
                  className={cn(
                    "ml-3 transition-all duration-200",
                    !isExpanded && "opacity-0 -translate-x-2"
                  )}
                  style={{
                    transitionDelay: isExpanded ? `${index * 20}ms` : "0ms"
                  }}
                >
                  {item.label}
                </span>
              </Link>
            
              {/* Child items with staggered animation */}
              {item.children && isExpanded && (
                <ul className="ml-8 mt-1 space-y-1">
                  {item.children.map((child, childIndex) => (
                    <li
                      key={child.href}
                      style={{
                        animationDelay: `${(index + childIndex) * 30}ms`
                      }}
                      className="animate-fade-in"
                    >
                      <Link
                        href={child.href}
                        className="flex items-center rounded-lg px-3 py-1 text-xs hover:bg-accent"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
```

### Complex Combobox Pattern

```typescript
// Searchable combobox with create functionality
export const Combobox = ({ 
  options, 
  placeholder, 
  value, 
  onSelect, 
  onCreate,
  CreateComponent,
  className,
  ...props 
}) => {
  const [inputValue, setInputValue] = useState<string>(value?.name || "");
  const [selected, setSelected] = useState<Option | undefined>(value);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectOption = useCallback((selectedOption: Option) => {
    setInputValue(selectedOption.name);
    setSelected(selectedOption);
    onSelect?.(selectedOption);
  
    // Auto-close after selection
    setTimeout(() => {
      inputRef?.current?.blur();
    }, 0);
  }, [onSelect]);

  const handleOnValueChange = useCallback((search: string) => {
    setInputValue(search);
    setSelected(undefined);
  
    if (search.length > 0) {
      setIsOpen(true);
    }
  }, []);

  return (
    <CommandPrimitive className="w-full">
      <div className="flex items-center w-full relative">
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={handleOnValueChange}
          onBlur={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={className}
          {...props}
        />
        {isLoading && (
          <Spinner className="absolute right-2 h-4 w-4" />
        )}
      </div>
    
      <CommandList hidden={!isOpen}>
        <CommandGroup>
          {options?.map(({ component: Component, ...option }) => (
            <CommandItem
              key={option.id}
              value={`${option.name}_${option.id}`}
              onSelect={() => handleSelectOption(option)}
              className="cursor-pointer"
            >
              {Component ? <Component /> : option.name}
            </CommandItem>
          ))}
        
          {/* Create new option */}
          {onCreate && inputValue && !options?.find(
            o => o.name.toLowerCase() === inputValue.toLowerCase()
          ) && (
            <CommandItem onSelect={() => onCreate(inputValue)}>
              {CreateComponent ? (
                <CreateComponent value={inputValue} />
              ) : (
                <span>Create "{inputValue}"</span>
              )}
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </CommandPrimitive>
  );
};
```

### Modal and Sheet System

```typescript
// Dialog with entrance/exit animations
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
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      {children}
      {!hideClose && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));

// Sheet component for mobile-friendly drawers
const SheetContent = React.forwardRef<...>(({ 
  side = "right", 
  className, 
  children, 
  ...props 
}, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        // Base sheet styles
        "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
        // Side-specific positioning and animations
        sheetVariants({ side }),
        className
      )}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));

// Sheet variants for different sides
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);
```

---

## Application Architecture

### Layout Composition Strategy

```typescript
// Main application layout with provider composition
export default function RootLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn("antialiased", GeistSans.className)}>
        <TRPCReactProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <HydrateClient>
                <div className="relative min-h-screen">
                  {/* Navigation */}
                  <Sidebar />
                
                  {/* Main content area */}
                  <div className="md:ml-[70px] pb-8">
                    <Header />
                    <main className="px-6">
                      {children}
                    </main>
                  </div>
                
                  {/* Global UI elements */}
                  <ExportStatus />
                  <GlobalSheets />
                  <Toaster />
                
                  {/* Context providers */}
                  <GlobalTimerProvider />
                  <TimezoneDetector />
                </div>
              </HydrateClient>
            </TooltipProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
```

### Data Fetching Patterns

#### Server-Side Prefetching with tRPC

```typescript
// Page-level data prefetching
export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const api = createCallerFactory(appRouter)({
    // Server-side context
  });

  // Prefetch critical data on server
  await Promise.all([
    api.transactions.list.prefetch({
      filter: searchParams.filter as string,
      page: 1,
    }),
    api.bank.accounts.prefetch(),
    api.transactions.summary.prefetch(),
  ]);

  return (
    <HydrateClient>
      <div className="space-y-6">
        <TransactionsHeader />
        <TransactionsTable searchParams={searchParams} />
        <TransactionsPagination />
      </div>
    </HydrateClient>
  );
}
```

#### Client-Side Data Management

```typescript
// Smart data fetching with React Query
const useTransactions = (params: TransactionParams) => {
  return api.transactions.list.useInfiniteQuery(
    {
      limit: 50,
      ...params,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    }
  );
};

// Optimistic updates pattern
const useUpdateTransaction = () => {
  const utils = api.useUtils();
  
  return api.transactions.update.useMutation({
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await utils.transactions.list.cancel();
    
      // Snapshot previous value
      const previousData = utils.transactions.list.getInfiniteData();
    
      // Optimistically update
      utils.transactions.list.setInfiniteData(
        params,
        (old) => updateTransactionInPages(old, newData)
      );
    
      return { previousData };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      utils.transactions.list.setInfiniteData(
        params,
        context?.previousData
      );
    },
    onSettled: () => {
      // Refetch to ensure consistency
      utils.transactions.list.invalidate();
    },
  });
};
```

### State Management Architecture

#### URL State as Single Source of Truth

```typescript
// URL-driven filter state with nuqs
export const useTransactionFilters = () => {
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("")
  );
  
  const [categories, setCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  
  const [dateRange, setDateRange] = useQueryState(
    "date",
    parseAsString.withDefault("")
  );
  
  const [accounts, setAccounts] = useQueryState(
    "accounts", 
    parseAsArrayOf(parseAsString).withDefault([])
  );

  return {
    filters: { search, categories, dateRange, accounts },
    setFilters: { setSearch, setCategories, setDateRange, setAccounts },
  };
};
```

#### Global State with Zustand

```typescript
// Focused global state for UI concerns
interface TransactionsState {
  rowSelection: Record<string, boolean>;
  setRowSelection: (updater: Updater<Record<string, boolean>>) => void;
  
  columnVisibility: VisibilityState;
  setColumnVisibility: (updater: Updater<VisibilityState>) => void;
  
  isExporting: boolean;
  setIsExporting: (isExporting: boolean) => void;
}

export const useTransactionsStore = create<TransactionsState>()((set) => ({
  rowSelection: {},
  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection: typeof updater === "function" 
        ? updater(state.rowSelection) 
        : updater,
    })),
  
  columnVisibility: defaultColumnVisibility,
  setColumnVisibility: (updater) =>
    set((state) => ({
      columnVisibility: typeof updater === "function"
        ? updater(state.columnVisibility)
        : updater,
    })),
  
  isExporting: false,
  setIsExporting: (isExporting) => set({ isExporting }),
}));
```

### Form Management Patterns

#### Custom Form Hook with Validation

```typescript
// Enhanced form hook with Zod validation
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
    // Helper methods
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
  };
}

// Usage in components
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  amount: z.number().positive("Amount must be positive"),
});

const MyForm = () => {
  const form = useZodForm(formSchema, {
    name: "",
    email: "",
    amount: 0,
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await submitMutation.mutateAsync(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      
        <SubmitButton isSubmitting={form.isSubmitting}>
          Submit
        </SubmitButton>
      </form>
    </Form>
  );
};
```

#### Auto-save Form Pattern

```typescript
// Auto-save form with debouncing
const useAutoSave = <T>(
  values: T,
  onSave: (values: T) => void,
  delay: number = 1000
) => {
  const [debouncedValues] = useDebounceValue(values, delay);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }
  
    onSave(debouncedValues);
  }, [debouncedValues, isInitialized, onSave]);
};

// Implementation in form component
const DraftForm = () => {
  const form = useForm();
  const saveDraftMutation = api.drafts.save.useMutation();
  
  // Auto-save form data
  useAutoSave(
    form.watch(),
    (data) => {
      if (form.formState.isDirty) {
        saveDraftMutation.mutate(data);
      }
    },
    500
  );

  return (
    <Form {...form}>
      {/* Form fields */}
      {saveDraftMutation.isPending && (
        <div className="text-xs text-muted-foreground">
          Saving draft...
        </div>
      )}
    </Form>
  );
};
```

---

## Performance & Accessibility

### Animation System

#### CSS Keyframes and Tailwind Integration

```css
/* Custom keyframes in tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      keyframes: {
        // Loading animations
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      
        // UI micro-interactions
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      
        // Modal animations
        "dialog-content-show": {
          from: {
            opacity: 0,
            transform: "translate(-50%, -50%) scale(0.97)",
          },
          to: {
            opacity: 1,
            transform: "translate(-50%, -50%) scale(1)",
          },
        },
      
        // Slide animations
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
      
        // Accordion animations
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
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "dialog-content-show": "dialog-content-show 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
};
```

#### Framer Motion Patterns

```typescript
// Animated size container with resize observer
const AnimatedSizeContainer = forwardRef<HTMLDivElement, AnimatedSizeContainerProps>(
  ({ width = false, height = false, className, transition, children, ...rest }, forwardedRef) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const resizeObserverEntry = useResizeObserver(containerRef);

    return (
      <motion.div
        ref={forwardedRef}
        className={cn("overflow-hidden", className)}
        animate={{
          width: width ? (resizeObserverEntry?.contentRect?.width ?? "auto") : "auto",
          height: height ? (resizeObserverEntry?.contentRect?.height ?? "auto") : "auto",
        }}
        transition={transition ?? { type: "spring", duration: 0.3, bounce: 0 }}
        {...rest}
      >
        <div ref={containerRef} className={cn(height && "h-max", width && "w-max")}>
          {children}
        </div>
      </motion.div>
    );
  }
);

// Staggered list animations
const StaggeredList = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};
```

### Loading States and Skeletons

```typescript
// Consistent skeleton components
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

export const CardSkeleton = () => (
  <div className="border rounded-lg p-6 space-y-4">
    <div className="h-4 bg-muted rounded w-1/4 animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
      <div className="h-4 bg-muted rounded w-5/6 animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
    </div>
  </div>
);

// Loading state pattern in components
const DataDisplay = () => {
  const { data, isLoading, error } = useQuery();
  
  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorBoundary error={error} />;
  
  return <DataTable data={data} />;
};
```

### Accessibility Implementation

#### ARIA Patterns and Keyboard Navigation

```typescript
// Comprehensive accessibility in components
const AccessibleTable = () => {
  const [selectedRow, setSelectedRow] = useState<number>(-1);
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedRow((prev) => Math.min(prev + 1, data.length - 1));
        break;
      
      case "ArrowUp":
        event.preventDefault();
        setSelectedRow((prev) => Math.max(prev - 1, 0));
        break;
      
      case "Enter":
      case " ":
        event.preventDefault();
        if (selectedRow >= 0) {
          onRowAction(data[selectedRow]);
        }
        break;
      
      case "Escape":
        setSelectedRow(-1);
        break;
    }
  };

  return (
    <div
      role="grid"
      aria-label="Transactions table"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <div role="row" className="sr-only">
        <div role="columnheader">Date</div>
        <div role="columnheader">Description</div>
        <div role="columnheader">Amount</div>
        <div role="columnheader">Actions</div>
      </div>
    
      {data.map((row, index) => (
        <div
          key={row.id}
          role="row"
          aria-rowindex={index + 1}
          aria-selected={selectedRow === index}
          className={cn(
            "grid grid-cols-4 gap-4 p-2 border-b",
            selectedRow === index && "bg-muted",
            "focus:bg-muted focus:outline-none"
          )}
          tabIndex={selectedRow === index ? 0 : -1}
        >
          <div role="gridcell" aria-describedby={`date-${row.id}`}>
            {formatDate(row.date)}
          </div>
          <div role="gridcell" aria-describedby={`desc-${row.id}`}>
            {row.description}
          </div>
          <div role="gridcell" aria-describedby={`amount-${row.id}`}>
            <span className={cn(
              row.amount > 0 ? "text-green-600" : "text-red-600"
            )}>
              {formatCurrency(row.amount)}
            </span>
          </div>
          <div role="gridcell">
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Edit transaction ${row.description}`}
              onClick={() => onEdit(row)}
            >
              Edit
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
```

#### Screen Reader Optimizations

```typescript
// Enhanced screen reader support
const ScreenReaderSupport = () => {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  
  const announce = useCallback((message: string) => {
    setAnnouncements(prev => [...prev, message]);
  
    // Clear announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 1000);
  }, []);

  return (
    <>
      {/* Live region for announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements[0]}
      </div>
    
      {/* Skip navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background border rounded px-3 py-2 z-50"
      >
        Skip to main content
      </a>
    
      {/* Main content with proper landmarks */}
      <main id="main-content" role="main">
        {/* Page content */}
      </main>
    </>
  );
};
```

### Performance Optimizations

#### Component Memoization Patterns

```typescript
// Strategic memoization for expensive components
const ExpensiveTableCell = memo(({ 
  value, 
  formatter, 
  className 
}: {
  value: any;
  formatter: (value: any) => string;
  className?: string;
}) => {
  const formattedValue = useMemo(() => formatter(value), [value, formatter]);
  
  return (
    <div className={className}>
      {formattedValue}
    </div>
  );
});

// Memoized table row with shallow comparison
const TableRow = memo(({ 
  row, 
  onSelect, 
  isSelected 
}: TableRowProps) => {
  return (
    <div className={cn("table-row", isSelected && "selected")}>
      {row.cells.map((cell, index) => (
        <ExpensiveTableCell
          key={index}
          value={cell.value}
          formatter={cell.formatter}
          className={cell.className}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.row.id === nextProps.row.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.row.updatedAt === nextProps.row.updatedAt
  );
});

// Virtual scrolling for large lists
const VirtualizedList = ({ items, height = 400 }: VirtualizedListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  const itemHeight = 50;
  const containerHeight = height;
  const totalHeight = items.length * itemHeight;
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  
  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: "100%",
            }}
          >
            <ListItem item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## Development Patterns

### Custom Hooks

#### Media Query Hook

```typescript
export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

// Usage
const isMobile = useMediaQuery("(max-width: 768px)");
const isDesktop = useMediaQuery("(min-width: 1024px)");
```

#### Local Storage Hook with SSR Safety

```typescript
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
  
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}
```

#### Enter to Submit Hook

```typescript
export function useEnterSubmit(): {
  formRef: RefObject<HTMLFormElement>;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
} {
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      formRef.current?.requestSubmit();
      event.preventDefault();
    }
  };

  return { formRef, onKeyDown: handleKeyDown };
}

// Usage in forms
const ChatForm = () => {
  const { formRef, onKeyDown } = useEnterSubmit();
  
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <textarea
        onKeyDown={onKeyDown}
        placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
      />
    </form>
  );
};
```

### TypeScript Patterns

#### Comprehensive Component Props

```typescript
// Base props interface pattern
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Polymorphic component pattern
type AsChildProps<T> = T & {
  asChild?: boolean;
};

// Variant props with CVA
type VariantProps<T extends (...args: any) => any> = Parameters<T>[0];

// Generic form field props
interface FormFieldProps<T = any> {
  name: keyof T;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
}

// Event handler type patterns
type SelectHandler<T> = (value: T) => void;
type ChangeHandler<T> = (value: T) => void;
type SubmitHandler<T> = (data: T) => void | Promise<void>;

// API response patterns
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component ref patterns
type ComponentRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>["ref"];
```

#### Advanced Utility Types

```typescript
// Deep partial for form updates
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

// Strict omit that ensures key exists
type StrictOmit<T, K extends keyof T> = Omit<T, K>;

// Extract props from component
type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

// Make specific fields required
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Form field error type
type FieldError = {
  message: string;
  type: string;
};

type FormErrors<T> = {
  [K in keyof T]?: T[K] extends object 
    ? FormErrors<T[K]>
    : FieldError;
};
```

### Code Organization

#### File Structure Conventions

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI primitives
│   ├── forms/          # Form-specific components
│   ├── layout/         # Layout components
│   └── feature/        # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── store/              # State management (Zustand stores)
├── types/              # TypeScript type definitions
├── utils/              # Pure utility functions
└── app/                # Next.js app router pages
    ├── (app)/          # Authenticated app routes
    ├── (public)/       # Public routes
    └── api/            # API routes
```

#### Component Export Pattern

```typescript
// components/ui/button.tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Component implementation
  }
);
Button.displayName = "Button";

// Named exports for flexibility
export { Button, buttonVariants };
export type { ButtonProps };

// components/ui/index.ts - Centralized exports
export { Button, buttonVariants } from "./button";
export type { ButtonProps } from "./button";

export { Input } from "./input";
export type { InputProps } from "./input";

// Usage - clean imports
import { Button, Input, type ButtonProps } from "@/components/ui";
```

### Testing Patterns

#### Component Testing Strategy

```typescript
// Component test utilities
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: RenderOptions
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
      <TRPCReactProvider>
        {children}
      </TRPCReactProvider>
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Test component behavior, not implementation
describe("Button", () => {
  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
  
    renderWithProviders(
      <Button onClick={handleClick}>Click me</Button>
    );
  
    await userEvent.click(screen.getByRole("button", { name: /click me/i }));
  
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("applies correct variant classes", () => {
    renderWithProviders(
      <Button variant="destructive">Delete</Button>
    );
  
    expect(screen.getByRole("button")).toHaveClass("bg-destructive");
  });
});
```

#### Form Testing Pattern

```typescript
// Form testing utilities
const fillAndSubmitForm = async (formData: FormData) => {
  await userEvent.type(
    screen.getByLabelText(/name/i),
    formData.name
  );
  
  await userEvent.type(
    screen.getByLabelText(/email/i),
    formData.email
  );
  
  await userEvent.click(
    screen.getByRole("button", { name: /submit/i })
  );
};

describe("ContactForm", () => {
  it("submits form with valid data", async () => {
    const handleSubmit = vi.fn();
  
    renderWithProviders(
      <ContactForm onSubmit={handleSubmit} />
    );
  
    await fillAndSubmitForm({
      name: "John Doe",
      email: "john@example.com",
    });
  
    expect(handleSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
    });
  });

  it("shows validation errors for invalid data", async () => {
    renderWithProviders(<ContactForm onSubmit={vi.fn()} />);
  
    await userEvent.click(
      screen.getByRole("button", { name: /submit/i })
    );
  
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
});
```

---

## Key Takeaways and Principles

### 1. Design System Philosophy

- **Consistency over customization**: Establish patterns and stick to them
- **Composition over configuration**: Build complex UIs from simple, focused components
- **Accessibility-first**: Build inclusive experiences from the ground up
- **Performance-conscious**: Optimize for real-world usage patterns

### 2. Technical Architecture

- **Type safety**: Comprehensive TypeScript coverage with proper constraints
- **State co-location**: Keep state close to where it's used
- **Separation of concerns**: Clear boundaries between UI, logic, and data
- **Progressive enhancement**: Start simple, add complexity where needed

### 3. Development Experience

- **Predictable patterns**: Consistent APIs and interfaces across components
- **Developer ergonomics**: Tools and utilities that enhance productivity
- **Maintainable code**: Clear structure and documentation
- **Testing strategy**: Focus on behavior over implementation

### 4. User Experience

- **Immediate feedback**: Loading states, optimistic updates, and clear error messages
- **Keyboard navigation**: Full keyboard support for all interactive elements
- **Responsive design**: Mobile-first approach with desktop enhancements
- **Performance**: Fast loading, smooth animations, and efficient updates

This guide represents the distilled wisdom from a production-ready design system that successfully balances sophistication with usability. By following these patterns and principles, you can build interfaces that are not only beautiful and functional but also maintainable and accessible.
