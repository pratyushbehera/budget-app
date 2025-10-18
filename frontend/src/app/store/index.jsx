import { createContext, useContext, useReducer, useCallback } from "react";

// Initial state
const initialState = {
  // Auth state
  userToken: localStorage.getItem("userToken") || null,
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
  isAuthenticated: !!localStorage.getItem("userToken"),
  showLoginScreen: true,

  // UI state
  currentMonth: new Date().toISOString().slice(5, 7),
  currentYear: new Date().getFullYear().toString(),
  activeTab: "dashboard",

  // Data state
  transactions: [],
  plans: {},
  hasPendingPlanChanges: false,

  // Modal state
  isDeleteModalOpen: false,
  transactionToDeleteId: null,

  // AI Insights state
  insight: "",
  isLoading: false,

  // Form state
  form: {
    date: new Date().toISOString().slice(0, 10),
    category: "",
    amount: "",
    notes: "",
  },
  selectedCategoryFilter: "All",
  searchText: "",
};

// Action types
export const ACTION_TYPES = {
  // Auth actions
  LOGIN_USER: "LOGIN_USER",
  LOGOUT_USER: "LOGOUT_USER",
  SET_SHOW_LOGIN_SCREEN: "SET_SHOW_LOGIN_SCREEN",

  // UI actions
  SET_CURRENT_MONTH: "SET_CURRENT_MONTH",
  SET_CURRENT_YEAR: "SET_CURRENT_YEAR",
  SET_ACTIVE_TAB: "SET_ACTIVE_TAB",

  // Data actions
  SET_TRANSACTIONS: "SET_TRANSACTIONS",
  ADD_TRANSACTION: "ADD_TRANSACTION",
  REMOVE_TRANSACTION: "REMOVE_TRANSACTION",
  SET_PLANS: "SET_PLANS",
  UPDATE_PLAN: "UPDATE_PLAN",
  SET_HAS_PENDING_PLAN_CHANGES: "SET_HAS_PENDING_PLAN_CHANGES",

  // Modal actions
  SET_DELETE_MODAL_OPEN: "SET_DELETE_MODAL_OPEN",
  SET_TRANSACTION_TO_DELETE_ID: "SET_TRANSACTION_TO_DELETE_ID",

  // AI Insights actions
  SET_INSIGHT: "SET_INSIGHT",
  SET_IS_LOADING: "SET_IS_LOADING",

  // Form actions
  SET_FORM: "SET_FORM",
  RESET_FORM: "RESET_FORM",
  SET_SELECTED_CATEGORY_FILTER: "SET_SELECTED_CATEGORY_FILTER",
  SET_SEARCH_TEXT: "SET_SEARCH_TEXT",
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.LOGIN_USER:
      return {
        ...state,
        userToken: action.payload.token,
        userInfo: action.payload,
        isAuthenticated: true,
      };

    case ACTION_TYPES.LOGOUT_USER:
      return {
        ...state,
        userToken: null,
        userInfo: null,
        isAuthenticated: false,
        showLoginScreen: true,
      };

    case ACTION_TYPES.SET_SHOW_LOGIN_SCREEN:
      return {
        ...state,
        showLoginScreen: action.payload,
      };

    case ACTION_TYPES.SET_CURRENT_MONTH:
      return {
        ...state,
        currentMonth: action.payload,
      };

    case ACTION_TYPES.SET_CURRENT_YEAR:
      return {
        ...state,
        currentYear: action.payload,
      };

    case ACTION_TYPES.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload,
      };

    case ACTION_TYPES.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
      };

    case ACTION_TYPES.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case ACTION_TYPES.REMOVE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case ACTION_TYPES.SET_PLANS:
      return {
        ...state,
        plans: action.payload,
      };

    case ACTION_TYPES.UPDATE_PLAN: {
      const { category, value, currentYear, currentMonth } = action.payload;
      return {
        ...state,
        plans: {
          ...state.plans,
          [currentYear]: {
            ...state.plans[currentYear],
            [currentMonth]: {
              ...state.plans[currentYear]?.[currentMonth],
              [category]: Number(value || 0),
            },
          },
        },
        hasPendingPlanChanges: true,
      };
    }

    case ACTION_TYPES.SET_HAS_PENDING_PLAN_CHANGES:
      return {
        ...state,
        hasPendingPlanChanges: action.payload,
      };

    case ACTION_TYPES.SET_DELETE_MODAL_OPEN:
      return {
        ...state,
        isDeleteModalOpen: action.payload,
      };

    case ACTION_TYPES.SET_TRANSACTION_TO_DELETE_ID:
      return {
        ...state,
        transactionToDeleteId: action.payload,
      };

    case ACTION_TYPES.SET_INSIGHT:
      return {
        ...state,
        insight: action.payload,
      };

    case ACTION_TYPES.SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ACTION_TYPES.SET_FORM:
      return {
        ...state,
        form: { ...state.form, ...action.payload },
      };

    case ACTION_TYPES.RESET_FORM:
      return {
        ...state,
        form: action.payload,
      };

    case ACTION_TYPES.SET_SELECTED_CATEGORY_FILTER:
      return {
        ...state,
        selectedCategoryFilter: action.payload,
      };

    case ACTION_TYPES.SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload,
      };

    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    loginUser: useCallback((data) => {
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      dispatch({ type: ACTION_TYPES.LOGIN_USER, payload: data });
    }, []),

    logoutUser: useCallback(() => {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      dispatch({ type: ACTION_TYPES.LOGOUT_USER });
    }, []),

    setShowLoginScreen: useCallback((show) => {
      dispatch({ type: ACTION_TYPES.SET_SHOW_LOGIN_SCREEN, payload: show });
    }, []),

    setCurrentMonth: useCallback((month) => {
      dispatch({ type: ACTION_TYPES.SET_CURRENT_MONTH, payload: month });
    }, []),

    setCurrentYear: useCallback((year) => {
      dispatch({ type: ACTION_TYPES.SET_CURRENT_YEAR, payload: year });
    }, []),

    setActiveTab: useCallback((tab) => {
      dispatch({ type: ACTION_TYPES.SET_ACTIVE_TAB, payload: tab });
    }, []),

    setTransactions: useCallback((transactions) => {
      dispatch({ type: ACTION_TYPES.SET_TRANSACTIONS, payload: transactions });
    }, []),

    addTransaction: useCallback((transaction) => {
      dispatch({ type: ACTION_TYPES.ADD_TRANSACTION, payload: transaction });
    }, []),

    removeTransaction: useCallback((id) => {
      dispatch({ type: ACTION_TYPES.REMOVE_TRANSACTION, payload: id });
    }, []),

    setPlans: useCallback((plans) => {
      dispatch({ type: ACTION_TYPES.SET_PLANS, payload: plans });
    }, []),

    updatePlan: useCallback((category, value, currentYear, currentMonth) => {
      dispatch({
        type: ACTION_TYPES.UPDATE_PLAN,
        payload: { category, value, currentYear, currentMonth },
      });
    }, []),

    setHasPendingPlanChanges: useCallback((hasChanges) => {
      dispatch({
        type: ACTION_TYPES.SET_HAS_PENDING_PLAN_CHANGES,
        payload: hasChanges,
      });
    }, []),

    setDeleteModalOpen: useCallback((isOpen) => {
      dispatch({ type: ACTION_TYPES.SET_DELETE_MODAL_OPEN, payload: isOpen });
    }, []),

    setTransactionToDeleteId: useCallback((id) => {
      dispatch({
        type: ACTION_TYPES.SET_TRANSACTION_TO_DELETE_ID,
        payload: id,
      });
    }, []),

    setInsight: useCallback((insight) => {
      dispatch({ type: ACTION_TYPES.SET_INSIGHT, payload: insight });
    }, []),

    setIsLoading: useCallback((isLoading) => {
      dispatch({ type: ACTION_TYPES.SET_IS_LOADING, payload: isLoading });
    }, []),

    setForm: useCallback((formData) => {
      dispatch({ type: ACTION_TYPES.SET_FORM, payload: formData });
    }, []),

    resetForm: useCallback((initialForm) => {
      dispatch({ type: ACTION_TYPES.RESET_FORM, payload: initialForm });
    }, []),

    setSelectedCategoryFilter: useCallback((filter) => {
      dispatch({
        type: ACTION_TYPES.SET_SELECTED_CATEGORY_FILTER,
        payload: filter,
      });
    }, []),

    setSearchText: useCallback((text) => {
      dispatch({ type: ACTION_TYPES.SET_SEARCH_TEXT, payload: text });
    }, []),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
