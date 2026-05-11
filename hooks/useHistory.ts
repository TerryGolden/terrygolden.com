import { useState, useCallback, useRef } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseHistoryReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
}

const MAX_HISTORY_SIZE = 50;

export function useHistory<T>(initialState: T): UseHistoryReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: []
  });

  const isUndoRedoRef = useRef(false);

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    if (isUndoRedoRef.current) return;

    setHistory(prev => {
      const nextState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prev.present)
        : newState;

      if (JSON.stringify(nextState) === JSON.stringify(prev.present)) {
        return prev;
      }

      const newPast = [...prev.past, prev.present];
      if (newPast.length > MAX_HISTORY_SIZE) {
        newPast.shift();
      }

      return {
        past: newPast,
        present: nextState,
        future: []
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      isUndoRedoRef.current = true;
      setTimeout(() => { isUndoRedoRef.current = false; }, 0);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      isUndoRedoRef.current = true;
      setTimeout(() => { isUndoRedoRef.current = false; }, 0);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  const clear = useCallback(() => {
    setHistory({
      past: [],
      present: history.present,
      future: []
    });
  }, [history.present]);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    clear
  };
}
