import styled from '@emotion/styled';

export const LabelWrap = styled.div<{
  marginBottom?: string;
}>`
  font-size: 24px;
  font-style: normal;
  font-weight: 600;

  margin-bottom: ${(props) => props.marginBottom ?? '32px'};
`;

export const SectionWrap = styled.div`
  margin-top: 48px;
  margin-bottom: 48px;
`;
