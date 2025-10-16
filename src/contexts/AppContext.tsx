import React, { createContext, useContext, useReducer } from 'react';

type Challenge = {
  id: number;
  title: string;
  icon: string;
  points: number;
  completed: boolean;
};

type User = {
  name: string;
  points: number;
  level: number;
  treesPlanted: number;
};

type State = {
  user: User;
  challenges: Challenge[];
};

type Action =
  | { type: 'COMPLETE_CHALLENGE'; payload: number }
  | { type: 'PLANT_TREE' }
  | { type: 'ADD_POINTS'; payload: number }
  | { type: 'SET_USER'; payload: Partial<User> };

const initialState: State = {
  user: {
    name: 'Eco Buddy',
    points: 0,
    level: 1,
    treesPlanted: 0,
  },
  challenges: [
    { id: 1, title: 'Walk instead of drive', icon: '🚶', points: 30, completed: false },
    { id: 2, title: 'Cycle to school', icon: '🚲', points: 50, completed: false },
    { id: 3, title: 'Water a tree', icon: '💧', points: 10, completed: false },
    { id: 4, title: 'Pick up plastic', icon: '🗑️', points: 20, completed: false },
    { id: 5, title: 'Spread an eco tip', icon: '📢', points: 25, completed: false },
  ],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'COMPLETE_CHALLENGE': {
      const challenges = state.challenges.map((ch) =>
        ch.id === action.payload ? { ...ch, completed: true } : ch
      );
      const completedChallenge = state.challenges.find((ch) => ch.id === action.payload);
      const bonus = completedChallenge && !completedChallenge.completed ? completedChallenge.points : 0;
      return {
        ...state,
        user: {
          ...state.user,
          points: state.user.points + bonus,
          level: Math.floor((state.user.points + bonus) / 200) + 1,
        },
        challenges,
      };
    }
    case 'PLANT_TREE':
      return {
        ...state,
        user: {
          ...state.user,
          treesPlanted: state.user.treesPlanted + 1,
          points: state.user.points + 10,
          level: Math.floor((state.user.points + 10) / 200) + 1,
        }
      };
    case 'ADD_POINTS':
      return {
        ...state,
        user: {
          ...state.user,
          points: state.user.points + action.payload,
          level: Math.floor((state.user.points + action.payload) / 200) + 1,
        }
      };
    case 'SET_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
