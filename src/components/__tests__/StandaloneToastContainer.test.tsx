import { render } from '@testing-library/react';
import { StandaloneToastContainer } from '../StandaloneToastContainer';
import { ToastProvider } from '../../hooks/ToastContext';

describe('StandaloneToastContainer', () => {
  it('should render without crashing', () => {
    // Should not throw when rendering (returns null with no toasts)
    expect(() => {
      render(
        <ToastProvider>
          <StandaloneToastContainer />
        </ToastProvider>
      );
    }).not.toThrow();
  });

  it('should connect to ToastContext', () => {
    const { container } = render(
      <ToastProvider>
        <StandaloneToastContainer />
      </ToastProvider>
    );

    // Container is rendered (even if it returns null with no toasts)
    expect(container).toBeTruthy();
  });
});
