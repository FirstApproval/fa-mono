import { ReactElement, useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid/Grid';
import styled from '@emotion/styled';

const hinderText =
  "First Approval doesn't hinder your future article submissions. We simply segment your journey into rewarding phases, ensuring your data gets the recognition it deserves without affecting subsequent scientific publications.";

function countWords(str: string): number {
  const arr = str.split(' ');

  return arr.filter((word) => word !== '').length;
}

const hinderTextWords = countWords(hinderText);

const splitWords = (text: string, numWords: number): [string, string] => {
  const words = text.split(' ');
  let part1 = '';
  let part2 = '';
  words.forEach((word, idx) => {
    if (idx < numWords) {
      part1 += ' ' + word;
    } else {
      part2 += ' ' + word;
    }
  });
  return [part1, part2];
};

export const Hinder = (): ReactElement => {
  const hinderRef = useRef<HTMLDivElement | null>(null);
  const hinderStickyRef = useRef<HTMLDivElement | null>(null);

  const [grayText, setGrayText] = useState(hinderText);
  const [text, setText] = useState('');

  useEffect(() => {
    window.addEventListener('scroll', (e) => {
      if (!hinderRef.current) return;
      if (!hinderStickyRef.current) return;
      const scrollY = window.scrollY;
      const hinderRect = hinderRef.current.getBoundingClientRect();
      const hinderStickyRect = hinderStickyRef.current.getBoundingClientRect();
      const elementHeight = hinderStickyRect.height;
      const top = hinderRect.top + scrollY;
      const diff = scrollY - top;
      const numWords = Math.floor((diff / elementHeight) * hinderTextWords);
      if (diff > 0) {
        const [t, g] = splitWords(hinderText, numWords);
        setText(t);
        setGrayText(g);
      } else {
        setText('');
        setGrayText(hinderText);
      }
    });
  }, []);

  return (
    <HinderContainerWrap>
      <HinderContentWrap>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <HinderWrap ref={hinderRef}>
                <HinderSticky ref={hinderStickyRef}>
                  <HinderMain>{text}</HinderMain>
                  <HinderGray>{grayText}</HinderGray>
                </HinderSticky>
                <div style={{ height: '100vh' }} />
              </HinderWrap>
            </Grid>
          </Grid>
        </Grid>
      </HinderContentWrap>
    </HinderContainerWrap>
  );
};

const HinderContainerWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const HinderContentWrap = styled.div`
  width: 1184px;

  @media (max-width: 1300px) {
    width: 100%;
  }
`;

const HinderSticky = styled.div`
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, sans-serif;
  font-size: 72px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 86.4px */
  letter-spacing: -0.5px;

  margin: 200px 0;
  position: sticky;
  top: 20%;
  height: 80vh;

  @media (max-width: 1300px) {
    height: 65vh;
    top: 15%;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Roboto, sans-serif;
    font-size: 34px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%; /* 40.8px */
    letter-spacing: -0.5px;

    margin: 200px 0 100px;
  }
`;

const HinderGray = styled.span`
  color: var(--divider, #d2d2d6);
`;

const HinderMain = styled.span`
  color: var(--text-primary, #040036);
`;

const HinderWrap = styled.div`
  position: relative;
  z-index: 0;

  @media (max-width: 1300px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;
