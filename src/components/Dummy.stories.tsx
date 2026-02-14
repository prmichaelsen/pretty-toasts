import type { Meta, StoryObj } from '@storybook/react';
import { Dummy } from './Dummy';

const meta: Meta<typeof Dummy> = {
  title: 'Test/Dummy',
  component: Dummy,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Dummy>;

export const Default: Story = {
  args: {
    text: 'Hello Storybook!',
    color: 'blue',
  },
};

export const Red: Story = {
  args: {
    text: 'Red variant',
    color: 'red',
  },
};

export const Green: Story = {
  args: {
    text: 'Green variant',
    color: 'green',
  },
};
