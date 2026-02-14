import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from './ToastContainer';
import { 
  selectToasts, 
  removeToast, 
  clearAllToasts,
} from '../store/toastSlice';
import { useMediaQuery } from '../hooks/useMediaQuery';

/**
 * Redux-connected toast container
 * Automatically connects to Redux store and manages toast state
 */
export const ReduxToastContainer: React.FC = () => {
  const toasts = useSelector(selectToasts);
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  return (
    <ToastContainer
      toasts={toasts}
      onRemoveToast={(id) => dispatch(removeToast(id))}
      onClearAll={() => dispatch(clearAllToasts())}
      isDesktop={isDesktop}
    />
  );
};
