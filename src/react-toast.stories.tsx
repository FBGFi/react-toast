import { Meta, StoryObj } from "@storybook/react";

function TestComponent() {
  return <button>Show toast</button>
}

export default {
  title: "React toast",
  component: TestComponent
} as Meta;

export const SimpleExample: StoryObj = {
  name: "Simple example at usage of toast"
};