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
  font-style: normal;
  font-weight: 700;
  line-height: 120%;
  letter-spacing: -0.5px;

  margin-top: 200px;
  position: sticky;
  top: 10%;
  left: 50%;
  height: 100vh;

  font-size: 34px;

  @media (min-width: 400px) {
    font-size: 40px;
  }

  @media (min-width: 600px) {
    font-size: 48px;
  }

  @media (min-width: 1000px) {
    font-size: 48px;
  }

  @media (min-width: 1200px) {
    font-size: 64px;
  }

  @media (min-width: 1536px) {
    font-size: 64px;
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

  padding-left: 24px;
  padding-right: 24px;

  @media (min-width: 1024px) {
    padding-left: 74px;
    padding-right: 74px;
  }

  @media (min-width: 1280px) {
    padding-left: 92px;
    padding-right: 92px;
  }

  @media (min-width: 1440px) {
    padding-left: 128px;
    padding-right: 128px;
  }

  @media (min-width: 1536px) {
    padding-left: 176px;
    padding-right: 176px;
  }

  @media (min-width: 1980px) {
    padding-left: 368px;
    padding-right: 368px;
  }
`;
