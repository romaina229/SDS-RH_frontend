import toast from 'react-hot-toast';

export const showToast = {
    success: (message: string, options?: any) => {
        toast.success(message, {
            duration: 3000,
            icon: '✅',
            style: {
                background: '#065f46',
                color: '#fff',
                border: '1px solid #10b981',
                padding: '12px 20px',
                borderRadius: '12px',
            },
            ...options,
        });
    },

    error: (message: string, options?: any) => {
        toast.error(message, {
            duration: 4000,
            icon: '❌',
            style: {
                background: '#7f1d1d',
                color: '#fff',
                border: '1px solid #ef4444',
                padding: '12px 20px',
                borderRadius: '12px',
            },
            ...options,
        });
    },

    warning: (message: string, options?: any) => {
        toast(message, {
            duration: 3000,
            icon: '⚠️',
            style: {
                background: '#78350f',
                color: '#fff',
                border: '1px solid #f59e0b',
                padding: '12px 20px',
                borderRadius: '12px',
            },
            ...options,
        });
    },

    info: (message: string, options?: any) => {
        toast(message, {
            duration: 3000,
            icon: 'ℹ️',
            style: {
                background: '#1e3a5f',
                color: '#fff',
                border: '1px solid #3b82f6',
                padding: '12px 20px',
                borderRadius: '12px',
            },
            ...options,
        });
    },

    loading: (message: string, options?: any) => {
        return toast.loading(message, {
            duration: 2000,
            style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #6366f1',
                padding: '12px 20px',
                borderRadius: '12px',
            },
            ...options,
        });
    },

    dismiss: (toastId?: string) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    },

    promise: async <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        },
        options?: any
    ) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            {
                style: {
                    padding: '12px 20px',
                    borderRadius: '12px',
                },
                ...options,
            }
        );
    },
};

export default showToast;