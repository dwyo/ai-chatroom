import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, ...props }, ref) => {
    const baseStyles = 'w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2';
    const stateStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';

    return (
      <div className="w-full">
        <div className="flex items-center gap-4">
          {label && (
            <label className="min-w-24 text-sm font-medium text-gray-700 text-right">
              {label}
            </label>
          )}
          <input
            ref={ref}
            className={`${baseStyles} ${stateStyles} ${className}`}
            {...props}
          />
        </div>
        {(error || helperText) && (
          <p
            className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;