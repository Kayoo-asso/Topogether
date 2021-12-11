import React, { useState } from 'react';
import { Icon } from './Icon';

interface CheckboxProps {
  checked: boolean,
}

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const [isChecked, setIsChecked] = useState(props.checked);
  const icon = isChecked ? 'checked' : 'checkbox';
  return (<Icon name={icon} onClick={() => setIsChecked(!isChecked)} />);
};
