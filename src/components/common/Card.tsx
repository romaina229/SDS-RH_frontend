import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    icon?: React.ComponentType<{ className?: string }>;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle, icon: Icon }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
            {(title || Icon) && (
                <div className="flex items-center p-6 pb-0">
                    {Icon && (
                        <div className="p-2 rounded-lg bg-primary-50 text-primary-600 mr-3">
                            <Icon className="h-5 w-5" />
                        </div>
                    )}
                    <div>
                        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                    </div>
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
};

export default Card;