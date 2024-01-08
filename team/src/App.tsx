import './App.css';
import React, { ReactElement } from 'react';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { Header } from './team/Header';
import { Footer } from './team/Footer';
import { JoinBeta } from './team/JoinBeta';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { ReactComponent as TeamLogo } from './team/assets/team_logo.svg';
import { ReactComponent as Citation } from './team/assets/citation.svg';
import { ReactComponent as BlackAndOrangeRound } from './team/assets/black_and_orange_round.svg';
import { ReactComponent as CallMade } from './team/assets/call_made.svg';
import Flasks from './team/assets/flasks.png';
import TimofeyPng from './team/assets/timofey.png';
import AnastasiaPng from './team/assets/anastasia.png';
import SergeiPng from './team/assets/sergei.png';
import VladimirPng from './team/assets/vladimir.png';
import IliaPng from './team/assets/ilia.png';
import IliaAdvisorPng from './team/assets/ilia_advisor.png';
import VladislavPng from './team/assets/vlad.png';
import LeonidPng from './team/assets/leonid.png';
import IvanPng from './team/assets/ivan.png';
import BeibarysPng from './team/assets/beibarys.png';
import MichailAdvisorPng from './team/assets/michail_advisor.png';
import AnastasiaAdvisorPng from './team/assets/anastasia_advisor.png';
import StanislavAdvisorPng from './team/assets/stanisla_advisor.png';
import PeterAdvisorPng from './team/assets/peter_advisor.png';
import AlexeyAdvisorPng from './team/assets/alexey_advisor.png';
import TimofeyRound from './team/assets/timofey_round.png';

const font12px = css`
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 166%; /* 19.92px */
  letter-spacing: 0.4px;
`;

const font16px = css`
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 154%; /* 24.64px */
  letter-spacing: 0.15px;
`;

const font20px = css`
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 32px */
  letter-spacing: 0.15px;
`;

const font24px = css`
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 154%; /* 36.96px */
`;

const font34px = css`
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 34px;
  font-style: normal;
  font-weight: 600;
  line-height: 123.5%; /* 41.99px */
  letter-spacing: 0.25px;
`;

const font51px = css`
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 51px;
  font-style: normal;
  font-weight: 700;
  line-height: 121%; /* 61.71px */
`;

const font72px = css`
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 72px;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 86.4px */
  letter-spacing: -0.5px;
`;

const font96px = css`
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 96px;
  font-style: normal;
  font-weight: 700;
  line-height: 121%; /* 116.16px */
`;

const colorDim = css`
  color: rgba(4, 0, 54, 0.38);
`;

const colorStandard = css`
  color: #040036;
`;

const LandingApp = (): ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <Header />

      <VerticalDivider height={'175px'} mobileHeight={'40px'} />

      <Container>
        <MainContent>
          <MainLogoContainer>
            <MainLogo />
          </MainLogoContainer>
          <VerticalDivider height={'40px'} mobileHeight={'40px'} />
          <MainTitle>
            A decade in science, <br /> a moment of realization
          </MainTitle>
          <VerticalDivider height={'40px'} mobileHeight={'40px'} />
          <MainSubtitleContainer>
            <MainSubtitle>
              <TimofeyRoundLogo src={TimofeyRound} />
              <MainTimofeyRoundText>
                Tim Glinin about First Approval mission
              </MainTimofeyRoundText>
            </MainSubtitle>
          </MainSubtitleContainer>
        </MainContent>
      </Container>

      <VerticalDivider height={'249px'} mobileHeight={'56px'} />

      <Container>
        <DescriptionContent>
          <DescriptionBaseText>After a&nbsp;</DescriptionBaseText>
          <DescriptionBrightText>
            decade in scientific research and postdoctoral work in
            biology,&nbsp;
          </DescriptionBrightText>
          <DescriptionBaseText>
            transitioned to evaluating projects at a biomedical research
            foundation. This role revealed a stark inefficiency.
          </DescriptionBaseText>
        </DescriptionContent>
      </Container>

      <Container>
        <ElementContent>
          <CitationContainer />I saw firsthand: Less than 10 from 10 000
          initiatives successfully made it to market{' '}
          <FlasksContentContainer>
            <FlasksContainer src={Flasks} />
          </FlasksContentContainer>
          <FlasksMobileContentContainer>
            <FlasksMobileContainer src={Flasks} />
          </FlasksMobileContentContainer>
        </ElementContent>
      </Container>

      <VerticalDivider height={'142px'} mobileHeight={'102px'} />

      <Container>
        <DescriptionContent>
          <DescriptionBrightText>
            The real struggle? Access to raw research data:&nbsp;
          </DescriptionBrightText>
          <DescriptionBaseText>
            academic articles and research reports, even when published in
            top-tier journals, often lacked the raw data behind them.
          </DescriptionBaseText>
        </DescriptionContent>
      </Container>

      <Container>
        <ElementContent>
          <CitationContainer />
          <OnlyDesktop>
            Data transparency is a key to effective research.
            <br />
            <ElementDimText>
              A startling truth: Less than 1% of scientific data sees the light
              of day{' '}
            </ElementDimText>
          </OnlyDesktop>
          <OnlyMobile>
            Data transparency is a key to effective research.{' '}
            <ElementDimText>
              A startling truth: Less than 1% of scientific data sees the light
              of day{' '}
            </ElementDimText>
          </OnlyMobile>
          <ArticlesRow>
            <OnlyDesktop>
              <EmptyArticlesPrefix></EmptyArticlesPrefix>
            </OnlyDesktop>
            <Article
              name={'Molecular Brain'}
              text={
                'No raw data, no science: another possible source of the reproducibility crisis'
              }
              link={'https://doi.org/10.1186/s13041-020-0552-2'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <OnlyDesktop>
              <EmptyArticlesPostfix />
            </OnlyDesktop>
          </ArticlesRow>
        </ElementContent>
      </Container>

      <VerticalDivider height={'396px'} mobileHeight={'356px'} />

      <Container>
        <DescriptionContent>
          <DescriptionBaseText>
            The unseen gap in scientific research is beyond the paper.&nbsp;
          </DescriptionBaseText>
          <DescriptionBrightText>
            Primary data is crucial for refining methods, verifying results, and
            ensuring research integrity.&nbsp;
          </DescriptionBrightText>
          <DescriptionBaseText>
            Without it, critical errors and oversights remain hidden.
          </DescriptionBaseText>
        </DescriptionContent>
      </Container>

      <Container>
        <ElementContent>
          <CitationContainer />
          <OnlyDesktop>
            A staggering 60% <BlackAndOrangeRoundContainer /> <br />
            of studies face replication challenges{' '}
          </OnlyDesktop>
          <OnlyMobile>
            A staggering 60% <br /> of studies face replication challenges{' '}
          </OnlyMobile>
          <ArticlesRow>
            <OnlyDesktop>
              <EmptyArticlesPrefix></EmptyArticlesPrefix>
            </OnlyDesktop>
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <Article
              name={'Nature'}
              text={'Many researchers say they’ll share data — but don’t'}
              link={'https://doi.org/10.1038/d41586-022-01692-1'}
            />
            <OnlyDesktop>
              <EmptyArticlesPostfix />
            </OnlyDesktop>
          </ArticlesRow>
        </ElementContent>
      </Container>

      <VerticalDivider height={'396px'} mobileHeight={'356px'} />

      <Container>
        <DescriptionContent>
          <DescriptionBaseText>
            Years of valuable data remain unseen, a lost treasure in the
            scientific community.&nbsp;
          </DescriptionBaseText>
          <DescriptionBrightText>
            Revealing this data can ignite new collaborations and groundbreaking
            research. For researchers, this means more citations, collaboration
            opportunities, and even financial rewards.
          </DescriptionBrightText>
        </DescriptionContent>
      </Container>

      <Container>
        <TeamElementContent>
          <CitationContainer />
          <TeamContainerTitle>
            Our aim is to foster a more efficient, transparent scientific
            community
          </TeamContainerTitle>
          Our team is our driving force
        </TeamElementContent>
        <OnlyDesktop>
          <TeamMemberRow>
            <TeamMember
              logo={TimofeyPng}
              name={'Dr. Tim'}
              title={'Founder & CEO'}
              url={'https://www.linkedin.com/in/timofey-glinin/'}
            />
            <TeamMember
              logo={AnastasiaPng}
              name={'Anastasia'}
              title={'Co-founder & COO'}
              url={'https://www.linkedin.com/in/anastasia-n-shubina/'}
            />
            <TeamMember
              logo={SergeiPng}
              name={'Sergei'}
              title={'Co-founder & CTO'}
              url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
            />
          </TeamMemberRow>
          <VerticalDivider height={'64px'} />
          <TeamMemberRow>
            <TeamMember
              logo={VladimirPng}
              name={'Vladimir'}
              title={'Blockchain'}
              url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
            />
            <TeamMember
              logo={IliaPng}
              name={'Ilia'}
              title={'Design'}
              url={'https://www.linkedin.com/in/ikanazin/'}
            />
            <TeamMember
              logo={VladislavPng}
              name={'Vladislav'}
              title={'Engineering'}
              url={'https://www.linkedin.com/in/taravkov/'}
            />
          </TeamMemberRow>
          <VerticalDivider height={'64px'} />
          <TeamMemberRow>
            <TeamMember
              logo={LeonidPng}
              name={'Leonid'}
              title={'Engineering'}
              url={'https://www.linkedin.com/in/leoshevt/'}
            />
            <TeamMember
              logo={IvanPng}
              name={'Ivan'}
              title={'Engineering'}
              url={'https://www.linkedin.com/in/iteleshov/'}
            />
            <TeamMember
              logo={BeibarysPng}
              name={'Beibarys'}
              title={'Engineering'}
              url={'https://www.linkedin.com/in/beibarys-zholmyrza/'}
            />
          </TeamMemberRow>
          <VerticalDivider height={'160px'} />
        </OnlyDesktop>
        <OnlyMobile>
          <TeamMemberRow>
            <TeamMember
              logo={TimofeyPng}
              name={'Dr. Tim'}
              title={'Founder & CEO'}
              url={'https://www.linkedin.com/in/timofey-glinin/'}
            />
            <TeamMember
              logo={AnastasiaPng}
              name={'Anastasia'}
              title={'Co-founder & COO'}
              url={'https://www.linkedin.com/in/anastasia-n-shubina/'}
            />
          </TeamMemberRow>
          <VerticalDivider mobileHeight={'24px'} />
          <TeamMemberRow>
            <TeamMember
              logo={SergeiPng}
              name={'Sergei'}
              title={'Co-founder & CTO'}
              url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
            />
            <TeamMember
              logo={VladimirPng}
              name={'Vladimir'}
              title={'Blockchain'}
              url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
            />
          </TeamMemberRow>
          <VerticalDivider mobileHeight={'24px'} />
          <TeamMemberRow>
            <TeamMember
              logo={IliaPng}
              name={'Ilia'}
              title={'Design'}
              url={'https://www.linkedin.com/in/ikanazin/'}
            />
            <TeamMember
              logo={VladislavPng}
              name={'Vladislav'}
              title={'Engineering'}
              url={'https://www.linkedin.com/in/taravkov/'}
            />
          </TeamMemberRow>
          <VerticalDivider mobileHeight={'24px'} />
          <TeamMemberRow>
            <TeamMember
              logo={LeonidPng}
              name={'Leonid'}
              title={'Engineering'}
              url={'https://www.linkedin.com/in/leoshevt/'}
            />
            <TeamMember
              logo={IvanPng}
              name={'Ivan'}
              title={'Engineering'}
              url={'https://www.linkedin.com/in/iteleshov/'}
            />
          </TeamMemberRow>
          <VerticalDivider mobileHeight={'24px'} />
          <TeamMemberRow>
            <TeamMember
              logo={BeibarysPng}
              name={'Beibarys'}
              title={'Engineering'}
              url={'https://www.linkedin.com/in/beibarys-zholmyrza/'}
            />
          </TeamMemberRow>
          <VerticalDivider mobileHeight={'56px'} />
        </OnlyMobile>
      </Container>

      <Container>
        <ExpertsContent>
          <ExpertsTitle>
            Our expert board is a dynamic blend of foundation heads, leading
            scientists, and industry innovators
          </ExpertsTitle>
          <VerticalDivider height={'80px'} mobileHeight={'40px'} />
          <OnlyDesktop>
            <ExpertsRow>
              <Expert
                logo={MichailAdvisorPng}
                name={'Mikhail Batin'}
                title={'Founder | Longevity fund'}
                url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
              />
              <Expert
                logo={AnastasiaAdvisorPng}
                name={'Anastasia Egorova'}
                title={'Founder | Longevity fund'}
                url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
              />
              <Expert
                logo={StanislavAdvisorPng}
                name={'Stanislav Yankauskas'}
                title={'Scientist'}
                url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
              />
            </ExpertsRow>
            <VerticalDivider height={'16px'} />
            <ExpertsRow>
              <Expert
                logo={IliaAdvisorPng}
                name={'Ilya Fomin'}
                title={'Technology leader | Youtube'}
                url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
              />
              <Expert
                logo={PeterAdvisorPng}
                name={'Peter Lidsky'}
                title={'Scientist'}
                url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
              />
              <Expert
                logo={AlexeyAdvisorPng}
                name={'Aleksei Petrenko'}
                title={'Researcher | Apple'}
                url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
              />
            </ExpertsRow>
          </OnlyDesktop>
          <OnlyMobile>
            <ExpertsColumn>
              <Expert
                logo={MichailAdvisorPng}
                name={'Mikhail Batin'}
                title={'Founder | Longevity fund'}
                url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
              />
              <VerticalDivider mobileHeight={'8px'} />
              <Expert
                logo={AnastasiaAdvisorPng}
                name={'Anastasia Egorova'}
                title={'Founder | Longevity fund'}
                url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
              />
              <VerticalDivider mobileHeight={'8px'} />
              <Expert
                logo={StanislavAdvisorPng}
                name={'Stanislav Yankauskas'}
                title={'Scientist'}
                url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
              />
              <VerticalDivider mobileHeight={'8px'} />
              <Expert
                logo={IliaAdvisorPng}
                name={'Ilya Fomin'}
                title={'Technology leader | Youtube'}
                url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
              />
              <VerticalDivider mobileHeight={'8px'} />
              <Expert
                logo={PeterAdvisorPng}
                name={'Peter Lidsky'}
                title={'Scientist'}
                url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
              />
              <VerticalDivider mobileHeight={'8px'} />
              <Expert
                logo={AlexeyAdvisorPng}
                name={'Aleksei Petrenko'}
                title={'Researcher | Apple'}
                url={'https://www.linkedin.com/in/sergeyfrolovdev/'}
              />
            </ExpertsColumn>
          </OnlyMobile>
        </ExpertsContent>
      </Container>

      <VerticalDivider height={'160px'} mobileHeight={'56px'} />

      <JoinBeta />
      <Footer />
    </ThemeProvider>
  );
};

type TeamMemberProps = {
  logo: any;
  name: string;
  title: string;
  url: string;
};

const TeamMember = ({ logo, name, title, url }: TeamMemberProps) => {
  const TeamMemberContainer = styled.div`
    width: 300px;
    height: 400px;

    @media (max-width: 1300px) {
      width: calc((100vw - 32px - 24px) / 2);
      height: auto;
    }
  `;

  const TeamMemberLogo = styled.img`
    width: 300px;
    height: 300px;
    filter: grayscale(100%);

    @media (max-width: 1300px) {
      width: calc((100vw - 32px - 24px) / 2);
      height: calc((100vw - 32px - 24px) / 2);
    }
  `;

  const CallMadeContainer = styled(CallMade)`
    width: 24px;
    height: 24px;
    cursor: pointer;
    margin-left: 8px;
  `;

  const TeamMemberName = styled.a`
    margin-top: 20px;
    text-decoration: none;
    ${font34px};
    display: flex;
    align-items: center;

    @media (max-width: 1300px) {
      margin-top: 12px;
      ${font24px};
    }
  `;

  const TeamMemberTitle = styled.div`
    ${font20px};
    ${colorDim};
  `;

  return (
    <TeamMemberContainer>
      <TeamMemberLogo src={logo} />
      <TeamMemberName href={url} target={'_blank'}>
        {name} <CallMadeContainer />
      </TeamMemberName>
      <TeamMemberTitle>{title}</TeamMemberTitle>
    </TeamMemberContainer>
  );
};

const EmptyArticlesPrefix = styled.div`
  min-width: calc((100vw - 900px) / 2);
  height: 316px;
`;

const EmptyArticlesPostfix = styled.div`
  min-width: 12px;
  height: 316px;
`;

const ArticlesRow = styled.div`
  width: 100vw;
  display: flex;
  gap: 24px;
  overflow-x: scroll;
  position: absolute;
  left: calc(-1 * (100vw - (100vw - ((100vw - 860px) / 2))));
  bottom: -396px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
    
  @media (max-width: 1300px) {
    width: 100%;
    left: 0;
    bottom: -356px;
  }
`;

type ArticleProps = {
  name: string;
  text: string;
  link: string;
};

const Article = ({ name, text, link }: ArticleProps) => {
  const ArticleContent = styled.a`
    height: 266px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #d2d2d6;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      transition: 1s;
      border: 1px solid #040036;

      * {
        transition: 1s;
        color: #040036;
      }
    }
  `;

  const ArticleTitleContainer = styled.div`
    width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `;

  const ArticleTitle1Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  const ArticleTitle = styled.div`
    ${font20px};
    ${colorDim};
  `;

  const ArticleLink = styled.div`
    ${font12px};
    ${colorDim};
    width: 252px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;

  return (
    <ArticleContent href={link} target={'_blank'}>
      <ArticleTitleContainer>
        <ArticleTitle1Container>
          <ArticleTitle>{name}</ArticleTitle>
          <CallMade />
        </ArticleTitle1Container>
        <VerticalDivider height={'16px'} />
        <ArticleTitle>{text}</ArticleTitle>
      </ArticleTitleContainer>
      <ArticleLink>{link}</ArticleLink>
    </ArticleContent>
  );
};

const TeamMemberRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
`;

const TeamContainerTitle = styled.div`
  ${font34px};
  ${colorDim};

  @media (max-width: 1300px) {
    margin-bottom: 20px;
    ${font16px};
  }
`;

const OnlyDesktop = styled.div`
  @media (max-width: 1300px) {
    display: none;
  }
`;

const OnlyMobile = styled.div`
  @media (min-width: 500px) {
    display: none;
  }
`;

const BlackAndOrangeRoundContainer = styled(BlackAndOrangeRound)`
  width: 64px;
  height: 64px;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainLogoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MainLogo = styled(TeamLogo)`
  width: 130px;
  height: 130px;
`;

const MainTimofeyRoundText = styled.div`
  ${font24px};

  @media (max-width: 1300px) {
    ${font16px};
  }
`;

const TimofeyRoundLogo = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 12px;
`;

const MainTitle = styled.div`
  ${font96px};

  @media (max-width: 1300px) {
    ${font51px};
  }
`;

const MainSubtitleContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  width: 100%;
`;

const MainSubtitle = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  width: 470px;
`;

const MainContent = styled.div`
  width: 1026px;

  @media (max-width: 1300px) {
    width: 100%;
  }
`;

const CitationContainer = styled(Citation)`
  position: absolute;
  z-index: -1;
  top: -36px;
  left: -60px;

  @media (max-width: 1300px) {
    display: none;
  }
`;

const FlasksContentContainer = styled.div`
  position: absolute;
  z-index: -1;
  bottom: -142px;
  left: 0;
  overflow: hidden;
  width: calc(100vw - ((100vw - 860px) / 2));
`;

const FlasksContainer = styled.img`
  height: 62px;

  @media (max-width: 1300px) {
    display: none;
  }
`;

const FlasksMobileContentContainer = styled.div`
  position: absolute;
  z-index: -1;
  bottom: -102px;
  left: 0;
  overflow: hidden;
  width: calc(100vw - ((100vw - 100%) / 2));
`;

const FlasksMobileContainer = styled.img`
  height: 62px;

  @media (min-width: 500px) {
    display: none;
  }
`;

const ElementContentXOverflowHidden = styled.div`
  position: relative;
  z-index: 1;
  width: 860px;
  margin: 160px 0;

  ${font72px};

  @media (max-width: 1300px) {
    width: calc(100% - 32px);
    margin: 56px 16px;

    ${font34px};
  }
`;

const ElementContent = styled.div`
  position: relative;
  z-index: 1;
  width: 860px;
  margin: 160px 0;

  ${font72px};

  @media (max-width: 1300px) {
    width: calc(100% - 32px);
    margin: 56px 16px;

    ${font34px};
  }
`;

const ExpertsContent = styled.div`
  width: 1169px;
  margin: 160px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1300px) {
    width: calc(100% - 32px);
    margin: 56px 16px;
  }
`;

const ExpertsTitle = styled.div`
  width: 600px;
  ${font34px};

  @media (max-width: 1300px) {
    width: 100%;
    ${font16px};
  }
`;

const ExpertsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

const ExpertsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: calc(100vw - 32px);
`;

const Expert = ({ logo, name, title, url }: TeamMemberProps) => {
  const ExpertContainer = styled.a`
    display: flex;
    align-items: center;
    border-radius: 80px;
    border: 1px solid #d2d2d6;
    background: #fff;
    padding: 8px 32px 8px 8px;

    text-decoration: none;

    @media (max-width: 1300px) {
      border: none;
      padding: 8px 0;
    }
  `;

  const ExpertLogo = styled.img`
    width: 80px;
    height: 80px;
    margin-right: 16px;
    filter: grayscale(100%);

    @media (max-width: 1300px) {
      width: 64px;
      height: 64px;
    }
  `;

  const ExpertNameContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `;

  const ExpertName = styled.div`
    ${font24px};

    @media (max-width: 1300px) {
      ${font16px};
    }
  `;

  const ExpertTitle = styled.div`
    ${font16px};
    ${colorDim};
  `;

  return (
    <ExpertContainer href={url} target={'_blank'}>
      <ExpertLogo src={logo} />
      <ExpertNameContainer>
        <ExpertName>{name}</ExpertName>
        <ExpertTitle>{title}</ExpertTitle>
      </ExpertNameContainer>
    </ExpertContainer>
  );
};

const TeamElementContent = styled(ElementContent)`
  margin: 160px 0 80px;

  @media (max-width: 1300px) {
    margin: 56px 16px 40px;
  }
`;

const ElementDimText = styled.span`
  ${colorDim};
`;

const DescriptionContent = styled.div`
  width: 600px;
  margin: 160px 0;

  @media (max-width: 1300px) {
    width: calc(100% - 32px);
    margin: 56px 16px;
  }
`;

const DescriptionBaseText = styled.span`
  ${colorDim};
  ${font34px};

  @media (max-width: 1300px) {
    ${font16px};
  }
`;

const DescriptionBrightText = styled.span`
  ${font34px};

  @media (max-width: 1300px) {
    ${font16px};
  }
`;

const VerticalDivider = styled('div')<{
  height?: string;
  mobileHeight?: string;
}>`
  height: ${(props) => props.height ?? '0'};

  @media (max-width: 1300px) {
    height: ${(props) => props.mobileHeight ?? '0'};
  }
`;

export default LandingApp;
