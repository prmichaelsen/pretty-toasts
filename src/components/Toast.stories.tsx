import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import type { Toast as ToastType } from '../types';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

const baseToast: ToastType = {
  id: 'story-toast',
  type: 'success',
  title: 'Success!',
  message: 'Operation completed successfully',
  duration: 10000,
  isPaused: true, // Pause to prevent auto-dismiss
  isPermanent: true, // Make permanent
  createdAt: Date.now(),
};

export const Success: Story = {
  args: {
    toast: baseToast,
    onRemove: () => {},
    onMakePermanent: () => {},
  },
};

export const Error: Story = {
  args: {
    toast: { 
      ...baseToast, 
      type: 'error',
      title: 'Error!',
      message: 'Something went wrong',
    },
    onRemove: () => {},
    onMakePermanent: () => {},
  },
};
