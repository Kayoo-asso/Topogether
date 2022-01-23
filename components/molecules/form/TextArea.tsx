import React, { InputHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  displayLabel?: boolean,
  error?: string;
  type?: string;
  pointer?: boolean;
  className?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  type = 'text',
  displayLabel = true,
  className = '',
  pointer = false,
  ...props
}: TextAreaProps, ref) => (
  <div className={`relative mt-3 w-full ${className}`}>
    <textarea
      {...props}
      ref={ref}
      placeholder={props.label}
      id={props.id}
      value={props.value}
      className={`peer h-10 border-dark ktext-base border-b-2 ${displayLabel ? 'placeholder-transparent' : ''} focus:border-main focus:outline-none w-full ${pointer ? ' cursor-pointer' : ''}`}
    />

    {displayLabel && (
      <label
        htmlFor={props.id}
        className={`absolute left-0 -top-6 ktext-label text-grey-medium peer-focus:text-main transition-all peer-placeholder-shown:top-2 peer-focus:-top-6 ${pointer ? ' cursor-pointer' : ''}`}
      >
        {props.label}
      </label>
    )}

    {props.error && 
      <div className="ktext-error text-error">{props.error}</div>
    }
  </div>
));

TextArea.displayName = 'TextInput';
