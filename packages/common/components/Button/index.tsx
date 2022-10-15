import { ButtonHTMLAttributes, ReactNode } from 'react';
import './button.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function Button({ children, ...rest }: Props) {
  return <button {...rest}>{children}</button>;
}

export default Button;
