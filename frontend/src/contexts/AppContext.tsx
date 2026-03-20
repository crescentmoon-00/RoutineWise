import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { ChildProfile, Routine, ActivityLog, Rule } from '@/types';

interface AppState {
  currentChild: ChildProfile | null;
  routines: Routine[];
  logs: ActivityLog[];
  rules: Rule[];
  isLoading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  setCurrentChild: (child: ChildProfile | null) => void;
  setRoutines: (routines: Routine[]) => void;
  addLog: (log: ActivityLog) => void;
  setRules: (rules: Rule[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'SET_CURRENT_CHILD'; payload: ChildProfile | null }
  | { type: 'SET_ROUTINES'; payload: Routine[] }
  | { type: 'ADD_LOG'; payload: ActivityLog }
  | { type: 'SET_RULES'; payload: Rule[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_CHILD':
      return { ...state, currentChild: action.payload };
    case 'SET_ROUTINES':
      return { ...state, routines: action.payload };
    case 'ADD_LOG':
      return { ...state, logs: [...state.logs, action.payload] };
    case 'SET_RULES':
      return { ...state, rules: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState: AppState = {
  currentChild: null,
  routines: [],
  logs: [],
  rules: [],
  isLoading: false,
  error: null,
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setCurrentChild = (child: ChildProfile | null) => {
    dispatch({ type: 'SET_CURRENT_CHILD', payload: child });
  };

  const setRoutines = (routines: Routine[]) => {
    dispatch({ type: 'SET_ROUTINES', payload: routines });
  };

  const addLog = (log: ActivityLog) => {
    dispatch({ type: 'ADD_LOG', payload: log });
  };

  const setRules = (rules: Rule[]) => {
    dispatch({ type: 'SET_RULES', payload: rules });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setCurrentChild,
        setRoutines,
        addLog,
        setRules,
        setLoading,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
