import React from 'react';

export default function Loader({ size = 'medium', text = 'Loading...', showText = true }) {
    const sizeClasses = {
        small: 'w-8 h-8 border-2',
        medium: 'w-12 h-12 border-4',
        large: 'w-16 h-16 border-4'
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div
                className={`${sizeClasses[size]} border-gray-300 border-t-blue-500 rounded-full animate-spin`}
            ></div>
            {showText && (
                <p className="mt-3 text-gray-600 text-sm">{text}</p>
            )}
        </div>
    );
}