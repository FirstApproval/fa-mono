import { Button } from '@mui/material';
import React, { ReactElement, useState } from 'react';
import { BetaDialog } from './BetaDialog';

export const BetaDialogWithButton = (): ReactElement => {
  const [isBetaDialogOpen, setIsBetaDialogOpen] = useState(false);
  const onClose = (): void => setIsBetaDialogOpen(false);
  return (
    <>
      <Button
        onClick={() => setIsBetaDialogOpen(true)}
        style={{
          padding: 0,
          border: '1px solid var(--primary-main, #3B4EFF)',
          borderRadius: '24px',
          marginLeft: '12px'
        }}>
        BETA
      </Button>
      <BetaDialog isOpen={isBetaDialogOpen} onClose={onClose} />
    </>
  );
};
