import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import styled from '@emotion/styled';

const BreadCrumbs: React.FC<{ name: string }> = ({ name }) => {
  return (
    <CrumbsWrapper>
      <Breadcrumbs separator={'/'} aria-label="breadcrumb">
        <Link href="/collaborate" color="inherit">
          Collaboration dashboard
        </Link>
        <Typography color="textPrimary">Assistant chat with {name}</Typography>
      </Breadcrumbs>
    </CrumbsWrapper>
  );
};

const CrumbsWrapper = styled.div`
  padding: 12px;
  border-bottom: 1px solid var(--divider, #d2d2d6);
`;

export default BreadCrumbs;
