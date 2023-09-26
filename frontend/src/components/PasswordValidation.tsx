import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';

interface PasswordValidationProps {
  password: string;
}

export const PasswordValidation: FunctionComponent<PasswordValidationProps> = ({
  password
}) => {
  const [passwordHint, setPasswordHint] = useState('');
  const [passwordHintColor, setPasswordHintColor] = useState('');
  const [lineColors, setLineColors] = useState(['', '', '']);
  const theme = useTheme();

  useEffect(() => {
    if (password.length < 8) {
      setPasswordHint('Please use 8+ characters for a secure password');
      setPasswordHintColor(theme.palette.error.dark);
      setLineColors([theme.palette.error.dark, '#D9D9D9', '#D9D9D9']);
    } else if (password.length >= 8 && password.length < 12) {
      setPasswordHint('So-so password');
      setPasswordHintColor(theme.palette.warning.dark);
      setLineColors([
        theme.palette.warning.dark,
        theme.palette.warning.dark,
        '#D9D9D9'
      ]);
    } else {
      setPasswordHint('Great password');
      setPasswordHintColor(theme.palette.info.dark);
      setLineColors([
        theme.palette.info.dark,
        theme.palette.info.dark,
        theme.palette.info.dark
      ]);
    }
  }, [password, theme]);

  return (
    <>
      <span
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          marginBottom: '16px'
        }}>
        <hr
          style={{
            width: '32%',
            marginLeft: '0',
            borderTop: `2px solid ${lineColors[0]}`
          }}
        />
        <hr style={{ width: '32%', borderTop: `2px solid ${lineColors[1]}` }} />
        <hr
          style={{
            width: '32%',
            marginRight: '0',
            borderTop: `2px solid ${lineColors[2]}`
          }}
        />
      </span>
      <div
        style={{
          color: passwordHintColor,
          fontSize: '20px',
          marginBottom: '16px'
        }}>
        {passwordHint}
      </div>
    </>
  );
};
