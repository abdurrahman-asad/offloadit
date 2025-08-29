import RHToast, { Toaster as RHToaster } from 'react-hot-toast';

export const Toaster = () => {
  return (
    <RHToaster
      position="bottom-right"
      toastOptions={{
        duration: 2000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
        },
        success: {
          style: {
            border: '1px solid var(--primary)',
          },
          iconTheme: {
            primary: 'var(--primary)',
            secondary: 'var(--primary-foreground)',
          },
        },
        error: {
          style: {
            border: '1px solid var(--destructive)',
          },
          iconTheme: {
            primary: 'var(--destructive)',
            secondary: 'var(--destructive-foreground)',
          },
        },
      }}
    />
  );
};

export const toast = RHToast;
