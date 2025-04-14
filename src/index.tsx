import { HTMLAttributes, ReactNode } from "react";
import { createRoot, Root } from "react-dom/client";

const defaultTimeout = 2000;

interface CreateToastArgs {
  element: ReactNode;
  timeOut?: number;
  wrapperAttributes?: HTMLAttributes<HTMLDivElement>;
  disposeOnClick?: boolean;
}

export class ToastProvider {
  private static toasts = new Map<
    string,
    { root: Root; element: HTMLDivElement }
  >();
  private static toastContainer: HTMLDivElement | undefined;

  private static pop(id: string) {
    const toast = ToastProvider.toasts.get(id);
    if (!toast) return;
    const toastContainer = ToastProvider.getContainer();
    toast.root.unmount();
    toastContainer.removeChild(toast.element);
    ToastProvider.toasts.delete(id);
    if (ToastProvider.toasts.size === 0) {
      toastContainer.remove();
      ToastProvider.toastContainer = undefined;
    }
  }

  private static push(id: string, element: HTMLDivElement) {
    const toastContainer = ToastProvider.getContainer();
    toastContainer.appendChild(element);
    const root = createRoot(element);
    ToastProvider.toasts.set(id, { root, element });
    return root;
  }

  private static getContainer() {
    if (!ToastProvider.toastContainer) {
      ToastProvider.toastContainer = document.createElement("div");
      ToastProvider.toastContainer.id = "toast__container";
      document.body.appendChild(ToastProvider.toastContainer);
    }
    return ToastProvider.toastContainer;
  }

  private static createWrapper(
    { className, ...attributes }: HTMLAttributes<HTMLDivElement>,
    disposeOnClick?: boolean,
  ) {
    const toastContainer = ToastProvider.getContainer();
    const wrapperId = Date.now().toString();
    const wrapper = document.createElement("div");
    const baseClassName = "toast__wrapper";
    const wrapperClass = className
      ? `${baseClassName} ${className}`
      : baseClassName;
    wrapper.className = wrapperClass;
    wrapper.id = wrapperId;

    Object.entries(attributes).forEach(([key, value]) => {
      wrapper.setAttribute(key, value);
    });

    if (disposeOnClick) {
      wrapper.addEventListener("click", () => ToastProvider.pop(wrapperId));
    }

    toastContainer.appendChild(wrapper);

    return { wrapper, wrapperId };
  }

  static create({
    element,
    timeOut = defaultTimeout,
    wrapperAttributes = {},
    disposeOnClick,
  }: CreateToastArgs) {
    const { wrapper, wrapperId } = ToastProvider.createWrapper(
      wrapperAttributes,
      disposeOnClick,
    );
    const root = ToastProvider.push(wrapperId, wrapper);
    root.render(element);
    if (timeOut) {
      setTimeout(() => ToastProvider.pop(wrapperId), timeOut);
    }
  }
}
