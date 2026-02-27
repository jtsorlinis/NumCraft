interface ToastProps {
  message: string | null;
}

export const Toast = ({ message }: ToastProps): JSX.Element | null => {
  if (!message) {
    return null;
  }

  return <div className="toast">{message}</div>;
};
