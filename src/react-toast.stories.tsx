import { Meta, StoryObj } from "@storybook/react";
import { ToastProvider } from "./index";

function TestElement() {
  return <div>This is a toast as React element!</div>;
}

interface TestComponentProps {
  type: "string" | "element" | "reactNode";
}

function TestComponent({ type }: TestComponentProps) {
  function showToast() {
    if (type === "string") {
      ToastProvider.create({ element: "This is a toast as string!" });
    } else if (type === "element") {
      ToastProvider.create({ element: <div>This is a toast as element!</div> });
    } else {
      ToastProvider.create({ element: <TestElement /> });
    }
  }
  return <button onClick={showToast}>Show toast</button>;
}

export default {
  title: "React toast",
  component: TestComponent,
} as Meta<typeof TestComponent>;

export const SimpleExample: StoryObj<TestComponentProps> = {
  name: "Simple example at usage of toast",
  args: {
    type: "string",
  },
};

export const ElementExample: StoryObj<TestComponentProps> = {
  name: "Example with HTML element passed to provider",
  args: {
    type: "element",
  },
};

export const ReactExample: StoryObj<TestComponentProps> = {
  name: "Example with React element passed to provider",
  args: {
    type: "reactNode",
  },
};
