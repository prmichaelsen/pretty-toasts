import type { Meta, StoryObj } from '@storybook/react';
import { Simple } from './Simple';

const meta: Meta<typeof Simple> = {
  title: 'Test/Simple',
  component: Simple,
};

export default meta;
type Story = StoryObj<typeof Simple>;

export const Default: Story = {
  args: {
    text: 'Hello World!',
  },
};
