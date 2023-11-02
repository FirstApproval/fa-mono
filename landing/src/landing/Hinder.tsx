import { ReactElement, useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid/Grid';
import styled from '@emotion/styled';
import { UploadWrap } from './styled';

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
  );
};

const HinderSticky = styled.div`
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto;
  font-size: 72px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%;
  letter-spacing: -0.5px;

  margin-top: 200px;
  position: sticky;
  top: 10%;
  left: 50%;
  height: 100vh;
`;

const HinderGray = styled.span`
  color: var(--divider, #d2d2d6);
`;

const HinderMain = styled.span`
  color: var(--text-primary, #040036);
`;

const HinderWrap = styled(UploadWrap)`
  position: relative;
  z-index: 0;
`;
