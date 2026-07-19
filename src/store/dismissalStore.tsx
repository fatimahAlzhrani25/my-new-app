import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { classrooms, dismissalGroups, initialChildren } from '../data/mockData';
import { Child, Classroom, DismissalGroup, DismissalStage, STAGE_ORDER } from '../types';

interface DismissalState {
  children: Child[];
  groups: DismissalGroup[];
  classrooms: Classroom[];
}

type Action =
  | { type: 'CALL_GROUP'; groupId: string }
  | { type: 'ADVANCE_CHILD'; childId: string }
  | { type: 'SET_CHILD_STAGE'; childId: string; stage: DismissalStage }
  | { type: 'RESET_DAY' };

function withStage(child: Child, stage: DismissalStage): Child {
  if (child.stage === stage) return child;
  return {
    ...child,
    stage,
    stageLog: [...child.stageLog, { stage, at: Date.now() }],
  };
}

function nextStage(stage: DismissalStage): DismissalStage {
  const idx = STAGE_ORDER.indexOf(stage);
  if (idx === -1 || idx === STAGE_ORDER.length - 1) return stage;
  return STAGE_ORDER[idx + 1];
}

function reducer(state: DismissalState, action: Action): DismissalState {
  switch (action.type) {
    case 'CALL_GROUP': {
      return {
        ...state,
        children: state.children.map((child) =>
          child.groupId === action.groupId && child.stage === 'in_class'
            ? withStage(child, 'called')
            : child,
        ),
      };
    }
    case 'ADVANCE_CHILD': {
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === action.childId ? withStage(child, nextStage(child.stage)) : child,
        ),
      };
    }
    case 'SET_CHILD_STAGE': {
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === action.childId ? withStage(child, action.stage) : child,
        ),
      };
    }
    case 'RESET_DAY': {
      return {
        ...state,
        children: state.children.map((child) => ({
          ...child,
          stage: 'in_class',
          stageLog: [{ stage: 'in_class', at: Date.now() }],
        })),
      };
    }
    default:
      return state;
  }
}

interface DismissalContextValue {
  children: Child[];
  groups: DismissalGroup[];
  classrooms: Classroom[];
  callGroup: (groupId: string) => void;
  advanceChild: (childId: string) => void;
  setChildStage: (childId: string, stage: DismissalStage) => void;
  resetDay: () => void;
}

const DismissalContext = createContext<DismissalContextValue | null>(null);

export function DismissalProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    children: initialChildren,
    groups: dismissalGroups,
    classrooms,
  });

  const callGroup = useCallback((groupId: string) => dispatch({ type: 'CALL_GROUP', groupId }), []);
  const advanceChild = useCallback((childId: string) => dispatch({ type: 'ADVANCE_CHILD', childId }), []);
  const setChildStage = useCallback(
    (childId: string, stage: DismissalStage) => dispatch({ type: 'SET_CHILD_STAGE', childId, stage }),
    [],
  );
  const resetDay = useCallback(() => dispatch({ type: 'RESET_DAY' }), []);

  const value = useMemo<DismissalContextValue>(
    () => ({
      children: state.children,
      groups: state.groups,
      classrooms: state.classrooms,
      callGroup,
      advanceChild,
      setChildStage,
      resetDay,
    }),
    [state, callGroup, advanceChild, setChildStage, resetDay],
  );

  return <DismissalContext.Provider value={value}>{reactChildren}</DismissalContext.Provider>;
}

export function useDismissal() {
  const ctx = useContext(DismissalContext);
  if (!ctx) throw new Error('useDismissal must be used within DismissalProvider');
  return ctx;
}
