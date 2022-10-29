import { ButtonHTMLAttributes, ReactNode } from 'react';
import './button.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function Button({ children, ...rest }: Props) {
  console.log('..');
  return <button {...rest}>{children}</button>;
}

export default Button;
