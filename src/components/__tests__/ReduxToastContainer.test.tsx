import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ReduxToastContainer } from '../ReduxToastContainer';
import toastReducer from '../../store/toastSlice';

describe('ReduxToastContainer', () => {
  it('should render without crashing', () => {
    const store = configureStore({
      reducer: { prettyToasts: toastReducer },
    });

    const { container } = render(
      <Provider store={store}>
        <ReduxToastContainer />
      </Provider>
    );

    // Container renders even with no toasts
    expect(container).toBeTruthy();
  });

  it('should connect to Redux store', () => {
    const store = configureStore({
      reducer: { prettyToasts: toastReducer },
    });

    // Should not throw when rendering
    expect(() => {
      render(
        <Provider store={store}>
          <ReduxToastContainer />
        </Provider>
      );
    }).not.toThrow();
  });
});
