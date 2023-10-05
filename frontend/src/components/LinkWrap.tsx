import { ReactElement, ReactNode } from 'react';
import { Link } from '@mui/material';

interface HeaderComponentProps {
  disabled?: boolean;
  link: string;
  children: ReactNode;
}

export const FALinkWrap = (props: HeaderComponentProps): ReactElement => {
  return (
    <>
      {!props.disabled && (
        <Link href={props.link} underline={'none'} color={'#040036'}>
          {props.children}
        </Link>
      )}
      {props.disabled && props.children}
    </>
  );
};
