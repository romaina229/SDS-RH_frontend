import React from 'react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ size = 'md', fullScreen = false }) => {
    const sizes = {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-16 w-16',
    };

    const spinner = (
        <div className="flex items-center justify-center">
            <div
                className={`${sizes[size]} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`}
            />
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default Loading;