import React, { forwardRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Champ mot de passe avec icône œil pour afficher/masquer la saisie.
 * S'utilise exactement comme un <input type="password"> classique,
 * y compris avec le spread de react-hook-form ({...register(...)}).
 */
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, ...props }, ref) => {
        const [visible, setVisible] = useState(false);

        return (
            <div className="relative">
                <input
                    {...props}
                    ref={ref}
                    type={visible ? 'text' : 'password'}
                    className={`${className || ''} pr-10`}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                    aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                    {visible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
