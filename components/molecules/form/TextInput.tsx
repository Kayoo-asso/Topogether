import React, { InputHTMLAttributes, forwardRef } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
  type?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({ type = 'text', ...props }: TextInputProps, ref) => (
  <div className="relative">
    <input
      ref={ref}
      placeholder={props.label}
      type={type}
      id={props.id}
      value={props.value}
      className="peer h-10 border-dark border-b-2 placeholder-transparent focus:border-main focus:outline-none"
    />
    <label
      htmlFor={props.id}
      className="absolute left-0 -top-3.5 text-grey-medium peer-focus:text-main transition-all peer-placeholder-shown:top-2 peer-focus:-top-3.5"
    >
      {props.label}
    </label>
    {props.error && <div className="ktext-error text-error">{props.error}</div>}
  </div>
));

TextInput.displayName = 'TextInput';
