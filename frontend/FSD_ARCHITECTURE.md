# Feature-Sliced Design (FSD) Architecture

This project has been refactored to follow the Feature-Sliced Design (FSD) architecture pattern, which provides a scalable and maintainable structure for React applications.

## 📁 Project Structure

```
src/
├── app/                    # Application layer
│   ├── providers/         # App providers and context
│   ├── store/            # Global state management
│   └── App/              # Main App component
├── pages/                 # Page components
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard page
│   ├── transactions/     # Transactions page
│   ├── plans/           # Plans page
│   └── insights/        # Insights page
├── widgets/              # Complex UI blocks
│   ├── header/          # Header widget
│   └── tabs/            # Tabs widget
├── features/             # Business features
│   ├── add-transaction/ # Add transaction feature
│   └── delete-transaction/ # Delete transaction feature
├── entities/             # Business entities
│   └── transaction/     # Transaction entity
├── shared/              # Shared resources
│   ├── ui/              # Reusable UI components
│   ├── lib/             # Utility functions
│   └── api/             # API layer
└── components/          # Legacy components (to be migrated)
```

## 🏗️ Architecture Layers

### 1. **App Layer** (`app/`)

- **Purpose**: Application initialization and global configuration
- **Contains**:
  - Global state management (Context + useReducer)
  - App providers
  - Main App component
- **Rules**: Can import from all layers

### 2. **Pages Layer** (`pages/`)

- **Purpose**: Route-level components that compose features and widgets
- **Contains**:
  - `AuthPage` - Authentication flow
  - `DashboardPage` - Main dashboard
  - `TransactionsPage` - Transaction management
  - `PlansPage` - Budget planning
  - `InsightsPage` - AI insights
- **Rules**: Can import from widgets, features, entities, shared

### 3. **Widgets Layer** (`widgets/`)

- **Purpose**: Complex UI blocks that combine multiple features
- **Contains**:
  - `Header` - Application header with navigation
  - `Tabs` - Tab navigation system
- **Rules**: Can import from features, entities, shared

### 4. **Features Layer** (`features/`)

- **Purpose**: Business features and user interactions
- **Contains**:
  - `AddTransactionForm` - Transaction creation
  - `DeleteConfirmationModal` - Transaction deletion
- **Rules**: Can import from entities, shared

### 5. **Entities Layer** (`entities/`)

- **Purpose**: Business entities and their representations
- **Contains**:
  - `TransactionCard` - Transaction display component
- **Rules**: Can import from shared only

### 6. **Shared Layer** (`shared/`)

- **Purpose**: Reusable utilities, components, and configurations
- **Contains**:
  - `ui/` - Reusable UI components (Button, Modal)
  - `lib/` - Utility functions (calculations, offline storage)
  - `api/` - API layer and endpoints
- **Rules**: Cannot import from other layers

## 🔄 State Management

### Global State (Context + useReducer)

- **Location**: `app/store/index.js`
- **Features**:
  - Centralized state management
  - Action creators for state updates
  - Type-safe actions with ACTION_TYPES
  - Automatic localStorage persistence

### State Structure

```javascript
{
  // Auth state
  userToken: string | null,
  userInfo: object | null,
  isAuthenticated: boolean,
  showLoginScreen: boolean,

  // UI state
  currentMonth: string,
  currentYear: string,
  activeTab: string,

  // Data state
  transactions: array,
  plans: object,
  hasPendingPlanChanges: boolean,

  // Modal state
  isDeleteModalOpen: boolean,
  transactionToDeleteId: string | null,

  // AI Insights state
  insight: string,
  isLoading: boolean,

  // Form state
  form: object,
  selectedCategoryFilter: string,
  searchText: string,
}
```

## 🚀 Key Benefits

### 1. **Reduced Prop Drilling**

- Global state management eliminates the need to pass props through multiple component levels
- Components access state directly through the `useApp()` hook

### 2. **Separation of Concerns**

- Each layer has a specific responsibility
- Business logic is separated from UI components
- API calls are centralized in the shared layer

### 3. **Scalability**

- Easy to add new features without affecting existing code
- Clear import rules prevent circular dependencies
- Modular structure supports team development

### 4. **Maintainability**

- Related code is grouped together
- Clear boundaries between different types of functionality
- Easy to locate and modify specific features

### 5. **Reusability**

- Shared components and utilities can be used across the application
- Features can be easily extracted and reused in other projects

## 🔧 Usage Examples

### Using Global State

```javascript
import { useApp } from "../app/store";

function MyComponent() {
  const { state, actions } = useApp();

  const handleClick = () => {
    actions.setActiveTab("dashboard");
  };

  return <button onClick={handleClick}>Current tab: {state.activeTab}</button>;
}
```

### Creating a New Feature

```javascript
// features/new-feature/NewFeatureForm/NewFeatureForm.jsx
import React from "react";
import { useApp } from "../../../app/store";
import { Button } from "../../../shared/ui";

export function NewFeatureForm() {
  const { state, actions } = useApp();

  const handleSubmit = () => {
    // Feature logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## 📋 Migration Notes

### Completed Migrations

- ✅ Global state management implementation
- ✅ Page components extraction
- ✅ Widget components creation
- ✅ Feature components creation
- ✅ Entity components creation
- ✅ Shared utilities and components
- ✅ API layer centralization

### Legacy Components

The following components remain in the `components/` directory and can be gradually migrated:

- `SummaryCards.jsx`
- `TransactionsTable.jsx`
- `SummaryTable.jsx`
- `NeedsWantsSavingsChart.jsx`
- `MonthlySpendTrendChart.jsx`
- `InsightsTab.jsx`
- `MonthYearSelector.jsx`
- Auth components (`Login.jsx`, `Signup.jsx`)

### Next Steps

1. Migrate remaining legacy components to appropriate FSD layers
2. Add TypeScript for better type safety
3. Implement error boundaries
4. Add unit tests for each layer
5. Consider adding a routing library for better navigation management

## 🎯 Best Practices

1. **Follow Import Rules**: Respect the layer import restrictions
2. **Keep Components Small**: Each component should have a single responsibility
3. **Use Shared Layer**: Leverage shared components and utilities
4. **State Management**: Use global state for cross-component data
5. **API Layer**: Centralize all API calls in the shared/api directory
6. **Error Handling**: Implement proper error boundaries and error states
7. **Testing**: Write tests for each layer independently

This FSD architecture provides a solid foundation for scaling the budget application while maintaining code quality and developer experience.
