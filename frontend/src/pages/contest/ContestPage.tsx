import React, { type FunctionComponent, useEffect, useState } from "react"
import {observer} from 'mobx-react-lite';
import {HeaderComponent} from '../../components/HeaderComponent';
import {Footer} from '../home/Footer';
import contestEnvelope from 'src/assets/contest-envelope.svg';
import contestRight from 'src/assets/contest-right.svg';
import contestRightTop from 'src/assets/contest-right-top.svg';
import contestRightBlue from 'src/assets/contest-right-blue.svg';
import contestUnleash from 'src/assets/contest-unleash.svg';
import contestUnleashMobile from 'src/assets/contest-unleash-mobile.svg';
import contestTopImage from 'src/assets/contest-top-image.svg';
import contest1 from 'src/assets/contest-1.svg';
import contest2 from 'src/assets/contest-2.svg';
import contest3 from 'src/assets/contest-3.svg';
import AnastasiaShubina from 'src/assets/contest/organizing-сommittee/AnastasiaShubina.png';
import AlexanderPanchin from 'src/assets/contest/organizing-сommittee/AlexanderPanchin.png';
import DanielDominguez from 'src/assets/contest/organizing-сommittee/DanielDominguez.png';
import AnastasiaEgorova from 'src/assets/contest/organizing-сommittee/AnastasiaEgorova.png';
import ElenaArzumanyan from 'src/assets/contest/organizing-сommittee/ElenaArzumanyan.png';
import EugenKhomula from 'src/assets/contest/organizing-сommittee/EugenKhomula.png';
import EvgenyAkkuratov from 'src/assets/contest/organizing-сommittee/EvgenyAkkuratov.png';
import MariaPorokh from 'src/assets/contest/organizing-сommittee/MariaPorokh.png';
import MikhailBatin from 'src/assets/contest/organizing-сommittee/MikhailBatin.png';
import TatyanaLopatina from 'src/assets/contest/organizing-сommittee/TatyanaLopatina.png';
import TylerHilsabeck from 'src/assets/contest/organizing-сommittee/TylerHilsabeck.png';
import AlexandraStolzing from 'src/assets/contest/judges/AlexandraStolzing.png';
import AnchaBaranova from 'src/assets/contest/judges/AnchaBaranova.png';
import PeterLydsky from 'src/assets/contest/judges/PeterLydsky.png';
import StanislovasJanakuskas from 'src/assets/contest/judges/StanislovasJanakuskas.png';
import ThomasStoeger from 'src/assets/contest/judges/ThomasStoeger.png';
import { routerStore } from '../../core/router';
import { Page } from '../../core/router/constants';
import { Alert, Box, Button, Grid, InputAdornment, Link, Snackbar, Tooltip, Typography } from "@mui/material"
import styled from '@emotion/styled';
import { userStore } from '../../core/user';
import { DataCollectionType, LinkMapping } from "../../apis/first-approval-api"
import { css } from '@emotion/react';
import { INTRO_VIEWED } from "../../core/router/RouterStore"
import { Helmet } from "react-helmet"
import { ArrowForward, OpenInNewOutlined, MailOutlined } from "@mui/icons-material"
import { FlexWrapColumn, FullWidthButton, FullWidthTextField, HeightElement } from "../common.styled"
import { validateEmail } from "../../util/emailUtil"
import { linkMappingService, subscriptionService } from "../../core/service"
import { format, toZonedTime } from "date-fns-tz";

export interface ExpertElement {
    logo: string;
    name: string;
    title: string;
    url?: string;
}

const organizationCommittee: ExpertElement[] = [
    {
        logo: DanielDominguez,
        name: "Daniel\nDominguez",
        title: "Student Competition Lead, First Approval, CA",
        url: "https://www.linkedin.com/in/daniel-dominguez-gomez/"
    },
    {
        logo: AnastasiaShubina,
        name: "Anastasia\nShubina",
        title: "Operations manager, First Approval, CA",
        url: "https://www.linkedin.com/in/anastasia-n-shubina"
    },
    {
        logo: AnastasiaEgorova,
        name: "Anastasia\nEgorova",
        title: "Open Longevity, CA",
        url: "https://www.linkedin.com/in/anastasia-egorova-60580397"
    },
    {
        logo: AlexanderPanchin,
        name: "Alexander\nPanchin",
        title: "Open Longevity, CA",
        url: "https://www.linkedin.com/in/alexander-panchin-2b303945"
    },
    {
        logo: ElenaArzumanyan,
        name: "Elena\nArzumanyan",
        title: "PhD, Natera, CA",
        url: "https://www.linkedin.com/in/elena-a-096ba5234"
    },
      {
        logo: EugenKhomula,
        name: "Eugen\nKhomula",
        title: "PhD, UCSF, CA",
        url: "https://www.linkedin.com/in/eugen-khomula"
    },
    {
        logo: EvgenyAkkuratov,
        name: "Evgeny\nAkkuratov",
        title: "PhD, Stowers Institute for Medical Research, MO",
        url: "https://www.stowers.org/people/evgeny-akkuratov"
    },
    {
        logo: MariaPorokh,
        name: "Maria\nPorokh",
        title: "PhD, First Approval",
        url: "https://www.linkedin.com/in/maria-porokh-97a7a1121"
    },
    {
        logo: MikhailBatin,
        name: "Mikhail\nBatin",
        title: "Open Longevity, CA",
        url: "https://www.linkedin.com/in/mikhail-batin-02a56a45"
    },
    {
        logo: TatyanaLopatina,
        name: "Tatyana\nLopatina",
        title: "UCSF, CA",
        url: "https://www.linkedin.com/in/tatiana-lopatina-19286a32"
    },
    {
        logo: TylerHilsabeck,
        name: "Tyler\nHilsabeck",
        title: "PhD, Salk Institute for Biological Studies, CA",
        url: "https://www.linkedin.com/in/tyler-hilsabeck"
    }
]

const judges: ExpertElement[] = [
    {
        logo: AnchaBaranova,
        name: "Ancha\nBaranova",
        title: "Professor of Systems Biology, George Mason University, VA, USA.",
    },
    {
        logo: PeterLydsky,
        name: "Peter\nLydsky",
        title: "Assistant Professor at City University of Hong Kong, China.",
    },
    {
        logo: AlexandraStolzing,
        name: "Alexandra\nStolzing",
        title: "Professor for Biogerontological Engineering, Loughborough University, UK.",
    },
    {
        logo: ThomasStoeger,
        name: "Thomas\nStoeger",
        title: "Assistant Professor at the Feinberg School of Medicine Northwestern University, IL, USA.",
    },
    {
        logo: StanislovasJanakuskas,
        name: "Stanislovas\nJanakuskas",
        title: "Research Assistant Professor at Albert Einstein College of medicine, NY, USA.",
    },
]

const Expert = ({ logo, name, title, url }: ExpertElement) => {
  const ExpertContainer = styled.a`
    display: flex;
    flex-direction: column;  
    align-items: flex-start;
    background: #fff;
    padding: 8px 0 8px 8px;

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
      margin-bottom: 4px;
      filter: grayscale(100%);
      border-radius: 50%;
      object-fit: cover; /* Обрежет изображение, чтобы оно заполняло круг */

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
    white-space: nowrap;
    text-align: start;
      
    @media (max-width: 1300px) {
      ${font16px};
    }
    @media (max-width: 1500px) and (min-width: 960px) {
      white-space: pre-line;
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

interface ContestPageProps {}

export const ContestPage: FunctionComponent<ContestPageProps> = observer((props: ContestPageProps) => {
        useEffect(() => localStorage.setItem(INTRO_VIEWED, 'true'), []);
        const submissionDeadlineText = 'Submission deadline: 30 November 2025';
        const metaDescription = 'First Approval is pleased to invite students to participate in the Student Biological Data Competition. ' +
          'This unique initiative is aimed at encouraging the next generation of scientists to publish high-quality data in biology, ' +
          'biotechnology, and biomedicine. The competition directly evaluates the quality of scientific datasets and their annotation, ' +
          'aiming to…';

        const [isValidEmail, setIsValidEmail] = useState(true);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [showSuccessSubscriptionAlter, setShowSuccessSubscriptionAlter] = useState(false);
        const [email, setEmail] = useState('');
        const [webinarLinkMapping, setWebinarLinkMapping] =
          useState<LinkMapping | undefined>(undefined);
        const [webinarTime, setWebinarTime] =
          useState<string | undefined>(undefined);

        useEffect(() => {
            setIsValidEmail(email.length > 0 && validateEmail(email));
        }, [email]);

        useEffect(() => {
            linkMappingService.getLinkByAlias('contest-webinar')
              .then(response => {
                  const linkMapping = response.data;
                  if (linkMapping) {
                    setWebinarLinkMapping(linkMapping)
                    const timeZone = "America/Los_Angeles";
                    const zoned = toZonedTime(linkMapping?.eventTime!!, timeZone);
                    const formattedEventTime = format(zoned, "d MMMM yyyy. h:mm a zzz", { timeZone });
                    setWebinarTime(formattedEventTime);
                  }
              });
        }, []);

        const applyNow = () => userStore.goToCreatePublication(DataCollectionType.STUDENT);

        const validate = (): boolean => {
            const isVE =
              email.length > 0 && validateEmail(email);
            setIsValidEmail(isVE);
            return isVE;
        };
        const validateAndContinue = (event: any): void => {
            if (event.key === 'Enter' || event.keyCode === 13 || event.button === 0) {
                event.preventDefault();
                const isValid = validate();
                if (isValid) {
                    setIsSubmitting(true);
                    subscriptionService.subscribe({email}).then(_ => {
                        setIsSubmitting(false);
                        setShowSuccessSubscriptionAlter(true);
                    });
                }
            }
        };

        return (
            <>
                <Helmet>
                    <title>Participate in the First Approval Student Biological Data Competition</title>
                    <meta property="og:title" content="Participate in the First Approval Student Biological Data Competition"/>
                    <meta property="og:description" content={metaDescription} />
                    <meta name="description" content={metaDescription} />
                </Helmet>
                <HeaderComponent
                  showLoginOutlinedButton={true}
                  showPublishButton={true}
                  isStudentCompetition={true}
                />
                {/*Student Biological Data Competition block desktop*/}
                <div>
                    <Box
                        component={Grid}
                        item
                        display={{
                            xs: 'none',
                            s: 'none',
                            md: 'block',
                            lg: 'block',
                            xl: 'block',
                        }}>
                        <div style={{
                            paddingLeft: 128,
                            paddingRight: 128,
                            marginBottom: 80,
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}>
                                <div>
                                    <div style={{
                                        borderRadius: 8,
                                        height: 40,
                                        width: 400,
                                        backgroundColor: '#040036',
                                        color: '#fff',
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 24,
                                    }}>
                                        ‍📚 Are you a student? Take part in the competition
                                    </div>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 48,
                                        fontWeight: 700,
                                        marginBottom: 24,
                                    }}>
                                        Student Biological Data Competition
                                    </div>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 20,
                                        fontWeight: 400,
                                        marginBottom: 24,
                                        marginRight: 120,
                                    }}>
                                        The Student Biological Data Competition is an international contest dedicated to scientific
                                        datasets in biology, biotechnology, and biomedicine. This first-of-its-kind competition directly
                                        evaluates the quality of scientific datasets and their annotation, aiming to promote
                                        Open Data practices among students. A central focus of the competition is the evaluation of scientific data
                                        from experiments.
                                    </div>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 20,
                                        fontWeight: 400,
                                        marginBottom: 24,
                                        marginRight: 120,
                                    }}>
                                        The competition is open in three categories for Bachelor’s, Master’s, and PhD students.
                                        Submissions will be evaluated by a panel of experts based on completeness of annotation, data
                                        accuracy, novelty and quality of experimental design, and potential for reuse.
                                        Participants will have the opportunity to gain recognition from an independent panel of top academic and
                                        industry experts in their fields and will receive a data publication on the First Approval platform.
                                    </div>
                                    <Button
                                        style={{
                                            display: 'flex',
                                            height: 40,
                                            width: 200,
                                            padding: 8,
                                            justifyContent: 'center',
                                            alignItems: 'flex-end',
                                            color: '#3C47E5',
                                            backgroundColor: 'rgba(60,71,229,0.12)'
                                        }}
                                        variant="text"
                                        onClick={applyNow}
                                        size={'large'}>
                                        Apply now <img src={contestRightBlue} style={{marginBottom: 4, marginLeft: 8}}/>
                                    </Button>
                                </div>
                                <img src={contestTopImage} style={{width: 486}}/>
                            </div>
                        </div>
                    </Box>
                </div>
                {/*Student Biological Data Competition block mobile*/}
                <div>
                    <div>
                        <Box
                            component={Grid}
                            item
                            display={{
                                xs: 'block',
                                s: 'block',
                                md: 'none',
                                lg: 'none',
                                xl: 'none',
                            }}>
                            <div style={{
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginBottom: 40,
                            }}>
                                <div>
                                    <div style={{
                                        borderRadius: 8,
                                        height: 40,
                                        width: 300,
                                        backgroundColor: '#040036',
                                        color: '#fff',
                                        fontFamily: 'Roboto',
                                        fontSize: 12,
                                        fontWeight: 400,
                                        marginBottom: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        ‍📚 Are you a student? Take part in the competition
                                    </div>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 34,
                                        fontWeight: 700,
                                        marginBottom: 24,
                                    }}>
                                        Student Biological Data Competition
                                    </div>
                                    <img src={contestTopImage} style={{width: '100%', marginBottom: 24}}/>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        marginBottom: 24,
                                    }}>
                                        First Approval is pleased to announce a student dataset competition aimed at
                                        promoting innovative scientific practices in data publication across the fields
                                        of biology, biotechnology, and biomedicine. The objectives of this competition
                                        include training students in the principles and techniques of data publication,
                                        fostering the reuse of scientific data, and introducing decentralized solutions
                                        to the scientific community.
                                    </div>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        marginBottom: 24,
                                    }}>
                                        A central focus of the competition will be the evaluation of raw scientific
                                        data from experiments. Submissions will be evaluated by a panel of experts for
                                        completeness of annotation, data accuracy, novelty and quality of the
                                        experimental design, and potential for reuse. The competition’s mission is to
                                        identify and reward exceptional datasets, highlighting experiments distinguished
                                        by their high quality, innovative methodologies, and exemplary experimental
                                        design.
                                    </div>
                                    <Button
                                        style={{
                                            display: 'flex',
                                            height: 40,
                                            width: '100%',
                                            padding: 8,
                                            justifyContent: 'center',
                                            alignItems: 'flex-end',
                                            color: '#3C47E5',
                                            backgroundColor: 'rgba(60,71,229,0.12)'
                                        }}
                                        variant="text"
                                        onClick={applyNow}
                                        size={'large'}>
                                        Apply now <img src={contestRightBlue}
                                                       style={{marginBottom: 4, marginLeft: 8}}/>
                                    </Button>
                                </div>
                            </div>
                        </Box>
                    </div>
                </div>
                {/*Eligibility block desktop*/}
                <div>
                    <Box
                        component={Grid}
                        item
                        display={{
                            xs: 'none',
                            s: 'none',
                            md: 'block',
                            lg: 'block',
                            xl: 'block',
                        }}>
                        <div style={{
                            paddingLeft: 128,
                            paddingRight: 128,
                            marginBottom: 80,
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                            }}>
                                <div style={{width: '50%'}}>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 24,
                                        fontWeight: 600,
                                        marginBottom: 24,
                                    }}>
                                        About First Approval
                                    </div>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 20,
                                        fontWeight: 400,
                                        marginBottom: 32
                                    }}>
                                        First Approval is an innovative platform for scientific data publishing,
                                        sharing, and collaboration. It offers convenient and rapid data annotation,
                                        decentralized storage, and enhanced reliability for data preservation and
                                        protection. Additionally, it provides incentives to authors for sharing their
                                        datasets.
                                    </div>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 24,
                                        fontWeight: 600,
                                        marginBottom: 24,
                                    }}>
                                        Eligibility
                                    </div>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 20,
                                        fontWeight: 400,
                                    }}>
                                      To participate, you must be an undergraduate, graduate, or PhD student.
                                      Recent graduates (within 12 months of graduation) are also eligible.
                                      Participants are required to submit their original dataset for publication
                                      on the First Approval platform by the submission deadline. All datasets in the fields of biology,
                                      biotechnology, or biomedicine are eligible for the competition,
                                      particularly those in the following areas:
                                      <ul>
                                            <li>Molecular Biology and Biochemistry</li>
                                            <li>Genetics</li>
                                            <li>Cell Biology and Histology</li>
                                            <li>Physiology</li>
                                            <li>Biophysics</li>
                                            <li>Neuroscience</li>
                                            <li>Embryology</li>
                                            <li>Biomedical Research</li>
                                            <li>Biotechnology</li>
                                            <li>Omics Technologies</li>
                                            <li>Behavioral Science</li>
                                            <li>Aging</li>
                                            <li>Zoology and Entomology</li>
                                            <li>Botany</li>
                                            <li>Virology and Parasitology</li>
                                            <li>Ecology</li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    {
                                      webinarLinkMapping && <div
                                        style={{
                                          width: 540,
                                          height: 80,
                                          color: 'white',
                                          backgroundColor: "#3b4eff",
                                          fontFamily: "Roboto",
                                          fontSize: 20,
                                          fontWeight: 500,
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "flex-start",
                                          borderRadius: 8,
                                          padding: "10px 24px"
                                        }}
                                      >
                                        <Tooltip title={webinarLinkMapping.description}>
                                          <Link
                                            color="inherit"
                                            href={webinarLinkMapping?.url}
                                            underline={"none"}
                                            target={"_blank"}>
                                            <span>Info session: {webinarTime}</span>
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                cursor: "pointer"
                                              }}>
                                              <span>Register now</span>
                                              <OpenInNewOutlined sx={{
                                                width: 24,
                                                height: 24,
                                                marginLeft: "8px"
                                              }} />
                                            </div>
                                          </Link>
                                        </Tooltip>
                                      </div>
                                    }
                                    <div>
                                        <Typography marginBottom='6px' marginTop='18px'>
                                            Would you like to learn more about competition? Join our mailing list:
                                        </Typography>
                                        <FullWidthTextField
                                          autoComplete={'email'}
                                          autoFocus
                                          value={email}
                                          type={'email'}
                                          onChange={(e) => setEmail(e.currentTarget.value)}
                                          onKeyDown={validateAndContinue}
                                          label="Email"
                                          variant="outlined"
                                          InputProps={{
                                              startAdornment: (
                                                <InputAdornment position="start">
                                                    <MailOutlined />
                                                </InputAdornment>
                                              )
                                          }}
                                        />
                                        <HeightElement value={'10px'} />
                                        <FullWidthButton
                                          loading={isSubmitting}
                                          disabled={!isValidEmail}
                                          variant="contained"
                                          size={'large'}
                                          endIcon={<ArrowForward />}
                                          onClick={validateAndContinue}>
                                            Subscribe
                                        </FullWidthButton>
                                    </div>
                                    <HeightElement value={'20px'} />
                                    <div style={{
                                        width: 540,
                                        height: 80,
                                        marginBottom: 6,
                                        backgroundColor: '#F8F7FA',
                                        fontFamily: 'Roboto',
                                        fontSize: 24,
                                        fontWeight: 500,
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderRadius: 8,
                                        cursor: 'default',
                                    }}>
                                        <img src={contest1} style={{marginRight: 8, marginLeft: 16}}/>
                                        {submissionDeadlineText}
                                    </div>
                                    <Link
                                        color="inherit"
                                        href={'/docs/information-letter.pdf'}
                                        target={'_blank'}>
                                        <div style={{
                                            width: 540,
                                            height: 80,
                                            marginBottom: 6,
                                            backgroundColor: '#F8F7FA',
                                            fontFamily: 'Roboto',
                                            fontSize: 24,
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                        }}>
                                            <img src={contest2} style={{marginRight: 8, marginLeft: 16}}/>
                                            Information letter
                                            <img src={contestRightTop} style={{marginLeft: 8}}/>
                                        </div>
                                    </Link>
                                    <Link
                                        color="inherit"
                                        href={'/docs/Guide_Stud-Bio-Data_2025.pdf'}
                                        target={'_blank'}>
                                        <div style={{
                                            width: 540,
                                            height: 80,
                                            marginBottom: 6,
                                            backgroundColor: '#F8F7FA',
                                            fontFamily: 'Roboto',
                                            fontSize: 24,
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                        }}>
                                            <img src={contest3} style={{marginRight: 8, marginLeft: 16}}/>
                                            Guidelines
                                            <img src={contestRightTop} style={{marginLeft: 8}}/>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Box>
                </div>
                {/*Eligibility block mobile*/}
                <div>
                    <div>
                        <Box
                            component={Grid}
                            item
                            display={{
                                xs: 'block',
                                s: 'block',
                                md: 'none',
                                lg: 'none',
                                xl: 'none',
                            }}>
                            <div style={{
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginBottom: 40,
                            }}>
                                <div style={{marginBottom: 32}}>
                                    <div style={{marginBottom: '12px'}}>
                                        <Typography marginBottom='6px'>
                                            Would you like to learn more about competition? Join our mailing list:
                                        </Typography>
                                        <FullWidthTextField
                                          autoComplete={'email'}
                                          autoFocus
                                          value={email}
                                          type={'email'}
                                          onChange={(e) => setEmail(e.currentTarget.value)}
                                          onKeyDown={validateAndContinue}
                                          label="Email"
                                          variant="outlined"
                                          InputProps={{
                                              startAdornment: (
                                                <InputAdornment position="start">
                                                    <MailOutlined />
                                                </InputAdornment>
                                              )
                                          }}
                                        />
                                        <HeightElement value={'8px'} />
                                        <FullWidthButton
                                          loading={isSubmitting}
                                          disabled={!isValidEmail}
                                          variant="contained"
                                          size={'large'}
                                          endIcon={<ArrowForward />}
                                          onClick={validateAndContinue}>
                                            Subscribe
                                        </FullWidthButton>
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: 80,
                                        marginBottom: 6,
                                        backgroundColor: '#F8F7FA',
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 500,
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderRadius: 8,
                                    }}>
                                        <img src={contest1} style={{marginRight: 8, marginLeft: 16}}/>
                                        {submissionDeadlineText}
                                    </div>
                                    <Link
                                        color="inherit"
                                        href={'https://docs.google.com/document/d/1qkKKMeW1OjavRftz1QqDhpxT36JxupTEvIQ4Eyoli0c'}
                                        target={'_blank'}>
                                        <div style={{
                                            width: '100%',
                                            height: 80,
                                            marginBottom: 6,
                                            backgroundColor: '#F8F7FA',
                                            fontFamily: 'Roboto',
                                            fontSize: 16,
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                        }}>
                                            <img src={contest2} style={{marginRight: 8, marginLeft: 16}}/>
                                            Information letter
                                            <img src={contestRightTop} style={{marginLeft: 8}}/>
                                        </div>
                                    </Link>
                                    <Link
                                        color="inherit"
                                        href={'https://docs.google.com/document/d/1Cq5OTm_gODN3JUjZCBzid2eY_kmKn9AwVhDc1klmva0'}
                                        target={'_blank'}>
                                        <div style={{
                                            width: '100%',
                                            height: 80,
                                            backgroundColor: '#F8F7FA',
                                            fontFamily: 'Roboto',
                                            fontSize: 16,
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            borderRadius: 8,
                                            marginBottom: 6,
                                            cursor: 'pointer',
                                        }}>
                                            <img src={contest3} style={{marginRight: 8, marginLeft: 16}}/>
                                            Guidelines
                                            <img src={contestRightTop} style={{marginLeft: 8}}/>
                                        </div>
                                    </Link>
                                    <div
                                      style={{
                                          color: 'white',
                                          width: '100%',
                                          height: 80,
                                          backgroundColor: "#3b4eff",
                                          fontFamily: 'Roboto',
                                          fontSize: 16,
                                          fontWeight: 500,
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'flex-start',
                                          justifyContent: 'center',
                                          borderRadius: 8,
                                          padding: "10px 24px",
                                      }}
                                    >
                                        <span>Info session: {webinarTime}</span>
                                        <Link
                                          color="inherit"
                                          href={webinarLinkMapping?.url}
                                          target={'_blank'}>
                                            <div
                                              style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                              }}>
                                                <span>Register now</span>
                                                <OpenInNewOutlined sx={{ width: 24, height: 24, marginLeft: '8px' }} />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 24,
                                        fontWeight: 600,
                                        marginBottom: 24,
                                    }}>
                                        About First Approval
                                    </div>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        marginBottom: 32
                                    }}>
                                        First Approval is an innovative platform for scientific data publishing,
                                        sharing, and collaboration. It offers convenient and rapid data annotation,
                                        decentralized storage, and enhanced reliability for data preservation and
                                        protection. Additionally, it provides incentives to authors for sharing their
                                        datasets.
                                    </div>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 24,
                                        fontWeight: 600,
                                        marginBottom: 24,
                                    }}>
                                        Eligibility
                                    </div>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                    }}>
                                        To participate, you must be an undergraduate, graduate, or PhD student.
                                        Participants are required to submit their original dataset for publication on
                                        the First Approval platform by the submission deadline. All datasets in the
                                        fields of biology, biotechnology, or biomedicine are eligible for the
                                        competition, particularly those in the following areas:
                                        <ul>
                                            <li>Molecular Biology and Biochemistry</li>
                                            <li>Genetics</li>
                                            <li>Cell Biology and Histology</li>
                                            <li>Physiology</li>
                                            <li>Biophysics</li>
                                            <li>Neuroscience</li>
                                            <li>Embryology</li>
                                            <li>Biomedical Research</li>
                                            <li>Biotechnology</li>
                                            <li>Omics Technologies</li>
                                            <li>Behavioral Science</li>
                                            <li>Aging</li>
                                            <li>Zoology and Entomology</li>
                                            <li>Botany</li>
                                            <li>Virology and Parasitology</li>
                                            <li>Ecology</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                </div>
                {/*Submission Requirements block desktop*/}
                <div>
                    <Box
                        component={Grid}
                        item
                        display={{
                            xs: 'none',
                            s: 'none',
                            md: 'block',
                            lg: 'block',
                            xl: 'block',
                        }}>
                        <div style={{
                            paddingLeft: 128,
                            paddingRight: 128,
                            marginBottom: 80,
                        }}>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 24,
                                fontWeight: 600,
                                marginBottom: 16,
                            }}>
                                Submission Requirements
                            </div>
                            <ul>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 16,
                                }}>
                                    <span style={{fontWeight: 500}}>Detailed Annotation:</span> The dataset must include
                                    comprehensive annotations that fully
                                    explain the process of data acquisition and the specifics of the conducted
                                    experiments.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 16,
                                }}>
                                    <span style={{fontWeight: 500}}>Eligible Data:</span> Submissions may include any
                                    form of raw and processed scientific data, covering both original datasets and
                                    those replicating previously published experiments. Negative data that fail to
                                    confirm initial hypothesis are also welcome. By accepting such a broad range of
                                    data types, the competition seeks to encourage rigorous scientific discourse and
                                    foster greater transparency in research.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 16,
                                }}>
                                    <span style={{fontWeight: 500}}>Types of Data:</span> We welcome the publication of
                                    original data, including data
                                    that
                                    replicate previously published experiments, as well as negative data that do not
                                    confirm
                                    initial hypothesis.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                }}>
                                    <span style={{fontWeight: 500}}>Originality:</span> The dataset must not have been
                                    previously published on any
                                    other repository.
                                    However, we will accept its submission if the volume of data has been increased
                                    compared
                                    to the previous publication and if the prior annotation was insufficient for reuse.
                                    In
                                    this case, a reference to the previously published version of the dataset is
                                    mandatory.
                                </li>
                            </ul>
                        </div>
                    </Box>
                </div>
                {/*What constitutes a scientific dataset block desktop*/}
                <div>
                    <Box
                      component={Grid}
                      item
                      display={{
                          xs: 'none',
                          s: 'none',
                          md: 'block',
                          lg: 'block',
                          xl: 'block',
                      }}>
                        <div style={{
                            paddingLeft: 128,
                            paddingRight: 128,
                            marginBottom: 80,
                        }}>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 24,
                                fontWeight: 600,
                                marginBottom: 16,
                            }}>
                                What constitutes a scientific dataset?
                            </div>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 20,
                                fontWeight: 400,
                            }}>
                                A scientific dataset consists of the raw or processed data obtained from a completed biological
                                experiment, supplemented by comprehensive annotation (metadata) that describe the experimental design,
                                methodologies, background context, and objectives. For this competition, datasets of any size and
                                in any discipline‑standard file format are admissible (e.g., HPLC chromatograms,
                                next‑generation sequencing reads, light‑microscopy images, or structured spreadsheets).
                            </div>
                        </div>
                    </Box>
                </div>
                {/*Submission Requirements block mobile*/}
                <div>
                    <Box
                        component={Grid}
                        item
                        display={{
                            xs: 'block',
                            s: 'block',
                            md: 'none',
                            lg: 'none',
                            xl: 'none',
                        }}>
                        <div style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            marginBottom: 40,
                        }}>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 24,
                                fontWeight: 600,
                                marginBottom: 16,
                            }}>
                                Submission Requirements
                            </div>
                            <ul>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    marginBottom: 16,
                                }}>
                                    <span style={{fontWeight: 500}}>Detailed Annotation:</span> The dataset must
                                    include
                                    comprehensive annotations that fully
                                    explain the process of data acquisition and the specifics of the conducted
                                    experiments.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    marginBottom: 16,
                                }}>
                                    <span style={{fontWeight: 500}}>Eligible Data:</span> Submissions may include any
                                    form of raw and processed scientific data, covering both original datasets and
                                    those replicating previously published experiments. Negative data that fail to
                                    confirm initial hypothesis are also welcome. By accepting such a broad range of
                                    data types, the competition seeks to encourage rigorous scientific discourse and
                                    foster greater transparency in research.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    marginBottom: 16,
                                }}>
                                    <span style={{fontWeight: 500}}>Types of Data:</span> We welcome the publication
                                    of
                                    original data, including data
                                    that
                                    replicate previously published experiments, as well as negative data that do not
                                    confirm
                                    initial hypothesis.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                }}>
                                    <span style={{fontWeight: 500}}>Originality:</span> The dataset must not have
                                    been
                                    previously published on any
                                    other repository.
                                    However, we will accept its submission if the volume of data has been increased
                                    compared
                                    to the previous publication and if the prior annotation was insufficient for
                                    reuse. In
                                    this case, a reference to the previously published version of the dataset is
                                    mandatory.
                                </li>
                            </ul>
                        </div>
                    </Box>
                </div>
                {/*What constitutes a scientific dataset block mobile*/}
                <div>
                        <Box
                            component={Grid}
                            item
                            display={{
                                xs: 'block',
                                s: 'block',
                                md: 'none',
                                lg: 'none',
                                xl: 'none',
                            }}>
                            <div style={{
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginBottom: 40,
                            }}>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 24,
                                    fontWeight: 600,
                                    marginBottom: 16,
                                }}>
                                    What constitutes a scientific dataset?
                                </div>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                }}>
                                    A scientific dataset consists of the raw or processed data obtained from a completed biological
                                    experiment, supplemented by comprehensive annotation (metadata) that describe the experimental design,
                                    methodologies, background context, and objectives. For this competition, datasets of any size and
                                    in any discipline‑standard file format are admissible (e.g., HPLC chromatograms,
                                    next‑generation sequencing reads, light‑microscopy images, or structured spreadsheets).
                                </div>
                            </div>
                        </Box>
                    </div>
                {/*Prizes block desktop*/}
                <div>
                    <Box
                        component={Grid}
                        item
                        display={{
                            xs: 'none',
                            s: 'none',
                            md: 'block',
                            lg: 'block',
                            xl: 'block',
                        }}>
                        <div style={{
                            paddingLeft: 128,
                            paddingRight: 128,
                            marginBottom: 80,
                        }}>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 24,
                                fontWeight: 600,
                                marginBottom: 16,
                            }}>
                                Prizes
                            </div>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 20,
                                fontWeight: 400,
                                marginBottom: 16,
                            }}>
                                A total prize fund of $7,500 will be awarded across three main categories:
                                <span style={{
                                    fontWeight: 500,
                                    marginLeft: 4
                                }}>Undergraduate, Graduate, and PhD students. <br/><br/> The prizes in each category are as follows:</span>
                            </div>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 20,
                                fontWeight: 400,
                                marginBottom: 4,
                                height: 48,
                                backgroundColor: '#F8F7FA',
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: 12,
                                width: 500,
                            }}>
                                First Place: $1000
                            </div>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 20,
                                fontWeight: 400,
                                marginBottom: 4,
                                height: 48,
                                backgroundColor: '#F8F7FA',
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: 12,
                                width: 500,
                            }}>
                                Second Place: $500
                            </div>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 20,
                                fontWeight: 400,
                                marginBottom: 4,
                                height: 48,
                                backgroundColor: '#F8F7FA',
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: 12,
                                width: 500,
                            }}>
                                Third Place: $200
                            </div>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 20,
                                fontWeight: 400,
                                marginBottom: 24,
                                height: 48,
                                backgroundColor: '#F8F7FA',
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: 12,
                                width: 500,
                            }}>
                                Fourth to Tenth Place: Each will receive $100
                            </div>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 20,
                                fontWeight: 500,
                                marginBottom: 16,
                            }}>
                                Additional special prizes include:
                            </div>
                            <ul style={{marginLeft: '-24px'}}>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 16,
                                }}>
                                    Best Negative Dataset: $300 – awarded to a dataset that challenges the original
                                    hypothesis by producing non-confirmatory results.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 16,
                                }}>
                                    Best Replication Dataset: $300 – awarded to a dataset that successfully reproduces
                                    the findings of a previous experiment.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 32,
                                }}>
                                    Special prizes from partner organizations may be added to the prize pool.
                                </li>
                            </ul>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 20,
                                fontWeight: 400,
                            }}>
                                All participants who have reached the final selection stage will receive a certificate
                                with
                                an honorable mention.
                            </div>
                        </div>
                    </Box>
                </div>
                {/*Prizes block mobile*/}
                <div>
                    <div>
                        <Box
                            component={Grid}
                            item
                            display={{
                                xs: 'block',
                                s: 'block',
                                md: 'none',
                                lg: 'none',
                                xl: 'none',
                            }}>
                            <div style={{
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginBottom: 40,
                            }}>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 24,
                                    fontWeight: 600,
                                    marginBottom: 16,
                                }}>
                                    Prizes
                                </div>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    marginBottom: 16,
                                }}>
                                    A total prize fund of $7,500 will be awarded across three main categories:
                                    <span style={{fontWeight: 500, marginLeft: 4}}>Undergraduate, Graduate, and PhD students. <br/><br/> The prizes in each category are as follows:</span>
                                </div>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    marginBottom: 4,
                                    height: 48,
                                    backgroundColor: '#F8F7FA',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 12,
                                    width: 500,
                                }}>
                                    First Place: $1000
                                </div>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    marginBottom: 4,
                                    height: 48,
                                    backgroundColor: '#F8F7FA',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 12,
                                    width: '100%',
                                }}>
                                    Second Place: $500
                                </div>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    marginBottom: 4,
                                    height: 48,
                                    backgroundColor: '#F8F7FA',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 12,
                                    width: '100%',
                                }}>
                                    Third Place: $200
                                </div>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    marginBottom: 24,
                                    height: 48,
                                    backgroundColor: '#F8F7FA',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: 12,
                                    width: '100%',
                                }}>
                                    Fourth to Tenth Place: Each will receive $100
                                </div>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 500,
                                    marginBottom: 16,
                                }}>
                                    Additional special prizes include:
                                </div>
                                <ul style={{marginLeft: '-24px'}}>
                                    <li style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        marginBottom: 16,
                                    }}>
                                        Best Negative Dataset: $500
                                    </li>
                                    <li style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        marginBottom: 16,
                                    }}>
                                        Best Replication Dataset: $500
                                    </li>
                                    <li style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        marginBottom: 32,
                                    }}>
                                        Special prizes from partner organizations may be added to the prize pool.
                                    </li>
                                </ul>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                }}>
                                    All participants who have reached the final selection stage will receive a
                                    certificate
                                    with
                                    an honorable mention.
                                </div>
                            </div>
                        </Box>
                    </div>
                </div>
                {/*Publication and Recognition block desktop*/}
                <div>
                    <Box
                        component={Grid}
                        item
                        display={{
                            xs: 'none',
                            s: 'none',
                            md: 'block',
                            lg: 'block',
                            xl: 'block',
                        }}>
                        <div style={{
                            paddingLeft: 128,
                            paddingRight: 128,
                            marginBottom: 80,
                        }}>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 24,
                                fontWeight: 600,
                                marginBottom: 16,
                            }}>
                                Publication and Recognition
                            </div>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 20,
                                fontWeight: 400,
                            }}>
                                All participants whose datasets pass our initial curation for compliance with
                                scientific data‑publishing standards will receive a first‑authored, open‑access data publication with a
                                DOI, issued as part of a dedicated collection of biological, biotechnological, or biomedical datasets.
                                This publication will be a valuable addition to each participant’s CV, highlighting their
                                technical expertise.
                                The records will become publicly available once the competition has ended.
                                Depositing a dataset with First Approval <span style={{fontWeight: 500}}>does not</span> impede
                                subsequent publication of related work in a journal.
                                The repository record is recognised as a formal research output and can be cited in
                                the Data Availability or Methods section of a peer‑reviewed manuscript.
                            </div>
                        </div>
                    </Box>
                </div>
                {/*Publication and Recognition block mobile*/}
                <div>
                    <div>
                        <Box
                            component={Grid}
                            item
                            display={{
                                xs: 'block',
                                s: 'block',
                                md: 'none',
                                lg: 'none',
                                xl: 'none',
                            }}>
                            <div style={{
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginBottom: 40,
                            }}>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 24,
                                    fontWeight: 600,
                                    marginBottom: 16,
                                }}>
                                    Publication and Recognition
                                </div>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                }}>
                                    All participants whose datasets pass our initial curation for compliance with
                                    scientific data‑publishing standards will receive a first‑authored, open‑access data publication with a
                                    DOI, issued as part of a dedicated collection of biological, biotechnological, or biomedical datasets.
                                    This publication will be a valuable addition to each participant’s CV, highlighting their
                                    technical expertise.
                                    The records will become publicly available once the competition has concluded.
                                    Depositing a dataset with First Approval <span style={{fontWeight: 500}}>does not</span> impede
                                    subsequent publication of related work in a journal.
                                    The repository record is recognised as a formal research output and can be cited in
                                    the Data Availability or Methods section of a peer‑reviewed manuscript.
                                </div>
                            </div>
                        </Box>
                    </div>
                </div>
                {/*Evaluation Criteria block desktop*/}
                <div>
                    <Box
                        component={Grid}
                        item
                        display={{
                            xs: 'none',
                            s: 'none',
                            md: 'block',
                            lg: 'block',
                            xl: 'block',
                        }}>
                        <div style={{
                            paddingLeft: 128,
                            paddingRight: 128,
                            marginBottom: 80,
                        }}>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 24,
                                fontWeight: 600,
                                marginBottom: 24,
                            }}>
                                Evaluation Criteria
                            </div>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 20,
                                fontWeight: 400,
                                marginBottom: 16,
                            }}>
                                The competition entries will be evaluated based on:
                            </div>
                            <ul style={{marginLeft: '-24px'}}>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 12,
                                }}>
                                    <span style={{fontWeight: 500}}>Completeness of Annotation:</span> How well the
                                    dataset is described.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 12,
                                }}>
                                    <span style={{fontWeight: 500}}>Data Accuracy:</span> The reliability and validity
                                    of the data.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 12,
                                }}>
                                    <span style={{fontWeight: 500}}>Novelty and quality</span> of the experimental
                                    design.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                }}>
                                    <span style={{fontWeight: 500}}>Potential for Reuse:</span> The usefulness of the
                                    dataset for further research.
                                </li>
                            </ul>
                        </div>
                    </Box>
                </div>
                {/*SEvaluation Criteria block mobile*/}
                <div>
                    <div>
                        <Box
                            component={Grid}
                            item
                            display={{
                                xs: 'block',
                                s: 'block',
                                md: 'none',
                                lg: 'none',
                                xl: 'none',
                            }}>
                            <div style={{
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginBottom: 40,
                            }}>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 24,
                                    fontWeight: 600,
                                    marginBottom: 24,
                                }}>
                                    Evaluation Criteria
                                </div>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    marginBottom: 16,
                                }}>
                                    The competition entries will be evaluated based on:
                                </div>
                                <ul style={{marginLeft: '-24px'}}>
                                    <li style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        marginBottom: 12,
                                    }}>
                                        <span style={{fontWeight: 500}}>Completeness of Annotation:</span> How well the
                                        dataset is described.
                                    </li>
                                    <li style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        marginBottom: 12,
                                    }}>
                                        <span style={{fontWeight: 500}}>Data Accuracy:</span> The reliability and
                                        validity of the data.
                                    </li>
                                    <li style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        marginBottom: 12,
                                    }}>
                                        <span style={{fontWeight: 500}}>Novelty and quality</span> of the experimental
                                        design.
                                    </li>
                                    <li style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                    }}>
                                        <span style={{fontWeight: 500}}>Potential for Reuse:</span> The usefulness of
                                        the dataset for further research.
                                    </li>
                                </ul>
                            </div>
                        </Box>
                    </div>
                </div>
                {/*Submission Guidelines block desktop*/}
                <div>
                    <Box
                        component={Grid}
                        item
                        display={{
                            xs: 'none',
                            s: 'none',
                            md: 'block',
                            lg: 'block',
                            xl: 'block',
                        }}>
                        <div style={{
                            paddingLeft: 128,
                            paddingRight: 128,
                            marginBottom: 80,
                        }}>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 24,
                                fontWeight: 600,
                                marginBottom: 24,
                            }}>
                                Submission Guidelines
                            </div>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 20,
                                fontWeight: 400,
                                marginBottom: 16,
                            }}>
                                Participants must upload and annotate their datasets on the First Approval platform. If
                                the
                                dataset has been analyzed in a previously published scientific article, the reference to
                                that article must be provided. If the dataset is intended for future publication, the
                                "Data
                                Availability" section of the article should indicate that the dataset is available on
                                the
                                First Approval platform, with the appropriate DOI provided.
                            </div>
                            <ul style={{marginLeft: '-24px'}}>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 12,
                                }}>
                                    <span style={{fontWeight: 500}}>Multiple Submissions:</span> Allowed.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 12,
                                }}>
                                    <span style={{fontWeight: 500}}>Co-authored Submissions:</span> Allowed, but the
                                    prize will be awarded to the first author by default.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 12,
                                }}>
                                <LinkWrap
                                  color="inherit"
                                  href={'/docs/Guide_Stud-Bio-Data_2025.pdf'}
                                  target={'_blank'}>
                                    <span style={{ fontWeight: 500 }}>
                                      Link for Detailed Guidelines
                                    </span>
                                </LinkWrap>
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 12,
                                }}>
                                    <span style={{fontWeight: 500}}>Submission is free of charge</span>
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 12,
                                }}>
                                    <span style={{fontWeight: 500}}>Upload a signed letter from your academic supervisor.</span>
                                </li>
                            </ul>
                        </div>
                    </Box>
                </div>
                {/*Submission Guidelines block mobile*/}
                <div>
                    <div>
                        <Box
                            component={Grid}
                            item
                            display={{
                                xs: 'block',
                                s: 'block',
                                md: 'none',
                                lg: 'none',
                                xl: 'none',
                            }}>
                            <div style={{
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginBottom: 40,
                            }}>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 24,
                                    fontWeight: 600,
                                    marginBottom: 24,
                                }}>
                                    Submission Guidelines
                                </div>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    marginBottom: 16,
                                }}>
                                    Participants must upload and annotate their datasets on the First Approval platform.
                                    If the
                                    dataset has been analyzed in a previously published scientific article, the
                                    reference to
                                    that article must be provided. If the dataset is intended for future publication,
                                    the "Data
                                    Availability" section of the article should indicate that the dataset is available
                                    on the
                                    First Approval platform, with the appropriate DOI provided.
                                </div>
                                <ul style={{marginLeft: '-24px'}}>
                                    <li style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        marginBottom: 12,
                                    }}>
                                        <span style={{fontWeight: 500}}>Multiple Submissions:</span> Allowed.
                                    </li>
                                    <li style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        marginBottom: 12,
                                    }}>
                                        <span style={{fontWeight: 500}}>Co-authored Submissions:</span> Allowed, but the
                                        prize will be awarded to the first author by default.
                                    </li>
                                    <li style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                        marginBottom: 12,
                                    }}>
                                    <LinkWrap
                                        color="inherit"
                                        href={'/docs/Guide_Stud-Bio-Data_2025.pdf.pdf'}
                                        target={'_blank'}>
                                        <span style={{fontWeight: 500}}>
                                          Link for Detailed Guidelines
                                        </span>
                                    </LinkWrap>
                                    </li>
                                    <li style={{
                                      fontFamily: 'Roboto',
                                      fontSize: 16,
                                      fontWeight: 400,
                                      marginBottom: 12,
                                    }}>
                                      <span style={{fontWeight: 500}}>Submission is free of charge</span>
                                    </li>
                                    <li style={{
                                      fontFamily: 'Roboto',
                                      fontSize: 16,
                                      fontWeight: 400,
                                      marginBottom: 12,
                                    }}>
                                      <span style={{fontWeight: 500}}>Upload a signed letter from your academic supervisor.</span>
                                    </li>
                                </ul>
                            </div>
                        </Box>
                    </div>
                </div>
                {/*Partners block desktop*/}
                <div>
                    <Box
                        component={Grid}
                        item
                        display={{
                            xs: 'none',
                            s: 'none',
                            md: 'block',
                            lg: 'block',
                            xl: 'block',
                        }}>
                        <div style={{
                            paddingLeft: 128,
                            paddingRight: 128,
                            marginBottom: 80,
                        }}>
                            <div style={{
                                marginBottom: 24,
                                fontFamily: 'Roboto',
                                fontSize: 24,
                                fontWeight: 600,
                            }}>
                                Partners
                            </div>
                            <div style={{
                                marginBottom: 12,
                                fontFamily: 'Roboto',
                                fontSize: 20,
                                fontWeight: 400,
                            }}>
                                <span style={{fontWeight: 500}}>Open Longevity</span>, a US nonprofit organization
                                focused on accelerating aging research.
                            </div>
                            <div style={{
                                fontFamily: 'Roboto',
                                fontSize: 20,
                                fontWeight: 400,
                            }}>
                                Additional partners will be announced soon.
                            </div>
                        </div>

            <div
              style={{
                paddingLeft: 128,
                paddingRight: 128,
                marginBottom: 80
              }}>
              <div
                style={{
                  marginBottom: 24,
                  fontFamily: 'Roboto',
                  fontSize: 24,
                  fontWeight: 600
                }}>
                Our Mission
              </div>
              <div
                style={{
                  fontFamily: 'Roboto',
                  fontSize: 20,
                  fontWeight: 400
                }}>
                We aim to introduce Open Data practices to student researchers,
                promoting high-quality data annotation and well-designed
                experiments. In the scientific world, publishing research papers
                is prioritized, while the preparation, annotation, and
                publication of scientific data receive far less attention. This
                competition seeks to recognize and reward outstanding datasets,
                highlighting experiments distinguished by their high quality,
                innovative methodologies, and exemplary design. Alongside new
                and original datasets, we also welcome Negative Datasets—those
                that do not confirm the original hypothesis—and Replicative
                Datasets, which successfully reproduce previous experiments.
              </div>

              <div
                style={{
                  fontFamily: 'Roboto',
                  fontSize: 20,
                  fontWeight: 400
                }}>
                We believe that such practices will foster the reuse of
                scientific data, enhance reproducibility, and improve data
                quality.
              </div>
            </div>
            <div
              style={{
                paddingLeft: 128,
                paddingRight: 128,
                marginBottom: 80
              }}>
              <div
                style={{
                  marginBottom: 24,
                  fontFamily: 'Roboto',
                  fontSize: 24,
                  fontWeight: 600
                }}>
                For Press and Partners
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontFamily: 'Roboto',
                  fontSize: 20,
                  fontWeight: 400,
                  marginBottom: 30
                }}>
                <span>
                  <span>Please find our </span>
                  <Link href={'https://drive.google.com/drive/folders/11-gzHgrSi5_beHpAM4z2tDae2XujwJh-'}
                        target={'_blank'}>
                    media kit
                  </Link>.
                </span>
                <span>
                  We would greatly appreciate your support in sharing information about our competition within your network.
                </span>
              </div>
            </div>
            <div
              style={{
                  paddingLeft: 128,
                  paddingRight: 128,
                  marginBottom: 80
              }}>
                <div
                  style={{
                      marginBottom: 24,
                      fontFamily: 'Roboto',
                      fontSize: 24,
                      fontWeight: 600
                  }}>
                    The Judges
                </div>
                <div
                  style={{
                      fontFamily: 'Roboto',
                      fontSize: 20,
                      fontWeight: 400,
                      marginBottom: 30
                  }}>
                    Dozens of academics from around the world participate in our judging process,
                    selecting winners based on the quality of the work.
                </div>
                <Grid container spacing={2} justifyContent="start">
                    {judges.map((expert, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                          <Expert
                            logo={expert.logo}
                            name={expert.name}
                            title={expert.title}
                            url={expert.url}
                          />
                      </Grid>
                    ))}
                </Grid>
            </div>
            <div
              style={{
                  paddingLeft: 128,
                  paddingRight: 128,
                  marginBottom: 80
              }}>
                <div
                  style={{
                      marginBottom: 24,
                      fontFamily: 'Roboto',
                      fontSize: 24,
                      fontWeight: 600
                  }}>
                    The organizing committee
                </div>
                <div
                  style={{
                      fontFamily: 'Roboto',
                      fontSize: 20,
                      fontWeight: 400,
                      marginBottom: 30
                  }}>
                    The Organizing Committee of the Student Data Competition includes dozens of scientists from around the world,
                    as well as international academics, lecturers, and industry experts
                </div>
                <Grid container spacing={2} justifyContent="flex-start">
                    {organizationCommittee.map((expert, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                          <Expert
                            logo={expert.logo}
                            name={expert.name}
                            title={expert.title}
                            url={expert.url}
                          />
                      </Grid>
                    ))}
                </Grid>
            </div>
          </Box>
        </div>
        {/*Partners block mobile*/}
        <div>
          <div>
            <Box
              component={Grid}
              item
              display={{
                xs: 'block',
                s: 'block',
                md: 'none',
                lg: 'none',
                xl: 'none'
              }}>
              <div
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  marginBottom: 40
                }}>
                <div
                  style={{
                    marginBottom: 24,
                    fontFamily: 'Roboto',
                    fontSize: 24,
                    fontWeight: 600
                  }}>
                  Partners
                </div>
                <div
                  style={{
                    marginBottom: 12,
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    fontWeight: 400
                  }}>
                  <span style={{ fontWeight: 500 }}>Open Longevity</span>, a US
                  nonprofit organization focused on accelerating aging research.
                </div>
                <div
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    fontWeight: 400
                  }}>
                  Additional partners will be announced soon.
                </div>
              </div>

              <div
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  marginBottom: 40
                }}>
                <div
                  style={{
                    marginBottom: 24,
                    fontFamily: 'Roboto',
                    fontSize: 24,
                    fontWeight: 600
                  }}>
                  Our Mission
                </div>
                <div
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    fontWeight: 400
                  }}>
                  We aim to introduce Open Data practices to student
                  researchers, promoting high-quality data annotation and
                  well-designed experiments. In the scientific world, publishing
                  research papers is prioritized, while the preparation,
                  annotation, and publication of scientific data receive far
                  less attention. This competition seeks to recognize and reward
                  outstanding datasets, highlighting experiments distinguished
                  by their high quality, innovative methodologies, and exemplary
                  design. Alongside new and original datasets, we also welcome
                  Negative Datasets—those that do not confirm the original
                  hypothesis—and Replicative Datasets, which successfully
                  reproduce previous experiments.
                </div>
                <div
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    fontWeight: 400
                  }}>
                  We believe that such practices will foster the reuse of
                  scientific data, enhance reproducibility, and improve data
                  quality.
                </div>
              </div>
              <div
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  marginBottom: 40
                }}>
                <div
                  style={{
                    marginBottom: 24,
                    fontFamily: 'Roboto',
                    fontSize: 24,
                    fontWeight: 600
                  }}>
                  For Press and Partners
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'Roboto',
                    marginBottom: 24,
                    fontSize: 16,
                    fontWeight: 400,
                  }}>
                <span>
                  <span>Please find our </span>
                  <Link href={'https://drive.google.com/drive/folders/11-gzHgrSi5_beHpAM4z2tDae2XujwJh-'}
                        target={'_blank'}>
                    media kit
                  </Link>.
                </span>
                  <span>
                  We would greatly appreciate your support in sharing information about our competition within your network.
                </span>
                </div>
              </div>
              <div
                style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    marginBottom: 40
                }}>
                  <div
                    style={{
                        marginBottom: 24,
                        fontFamily: 'Roboto',
                        fontSize: 24,
                        fontWeight: 600
                    }}>
                      The Judges
                  </div>
                  <div
                    style={{
                        fontFamily: 'Roboto',
                        fontSize: 16,
                        fontWeight: 400,
                        marginBottom: 30
                    }}>
                      Dozens of academics from around the world participate in our judging process,
                      selecting winners based on the quality of the work.
                  </div>
                  <Grid container spacing={2} justifyContent="start">
                      {judges.map((expert, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                            <Expert
                              logo={expert.logo}
                              name={expert.name}
                              title={expert.title}
                              url={expert.url}
                            />
                        </Grid>
                      ))}
                  </Grid>
              </div>
              <div
                style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    marginBottom: 40
                }}>
                  <div
                    style={{
                        marginBottom: 24,
                        fontFamily: 'Roboto',
                        fontSize: 24,
                        fontWeight: 600
                    }}>
                      The organizing committee
                  </div>
                  <div
                    style={{
                        fontFamily: 'Roboto',
                        fontSize: 16,
                        fontWeight: 400,
                        marginBottom: 30
                    }}>
                      The Organizing Committee of the Student Data Competition includes dozens of scientists from around the world,
                      as well as international academics, lecturers, and industry experts
                  </div>
                  <Grid container spacing={2} justifyContent="start">
                      {organizationCommittee.map((expert, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                            <Expert
                              logo={expert.logo}
                              name={expert.name}
                              title={expert.title}
                              url={expert.url}
                            />
                        </Grid>
                      ))}
                  </Grid>
              </div>
            </Box>
          </div>
        </div>
        {/*Unleash data potential block desktop*/}
        <div>
          <Box
            component={Grid}
            item
            display={{
              xs: 'none',
              s: 'none',
              md: 'block',
              lg: 'block',
              xl: 'block'
            }}>
            <div
              style={{
                paddingLeft: 128,
                paddingRight: 128,
                marginBottom: 80
              }}>
              <div
                style={{
                  width: '100%',
                  height: 290,
                  borderRadius: 8,
                  backgroundColor: '#F8F7FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                <div
                  style={{
                    marginLeft: 96
                  }}>
                  <div
                    style={{
                      marginBottom: 24,
                      fontFamily: 'Roboto',
                      fontSize: 34,
                      fontWeight: 600
                    }}>
                    Unleash your data's potential
                  </div>
                  <div
                    style={{
                      marginBottom: 32,
                      fontFamily: 'Roboto',
                      fontSize: 20,
                      fontWeight: 400,
                      width: 320
                    }}>
                    Share your datasets and let them fuel new scientific
                    breakthroughs
                  </div>
                  <Button
                    style={{
                      display: 'flex',
                      height: 40,
                      width: 200,
                      padding: 8,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      color: '#3C47E5',
                      backgroundColor: 'rgba(60,71,229,0.12)'
                    }}
                    variant="text"
                    onClick={applyNow}
                    size={'large'}>
                    Apply now{' '}
                    <img
                      src={contestRightBlue}
                      style={{
                        marginBottom: 4,
                        marginLeft: 8
                      }}
                    />
                  </Button>
                </div>
                <img
                  src={contestUnleash}
                  height={290}
                  style={{ marginRight: 16 }}
                />
              </div>
            </div>
          </Box>
        </div>
        {/*Unleash data potential block mobile*/}
        <div>
          <Box
            component={Grid}
            item
            display={{
              xs: 'block',
              s: 'block',
              md: 'none',
              lg: 'none',
              xl: 'none'
            }}>
            <div
              style={{
                paddingLeft: 20,
                paddingRight: 20,
                marginBottom: 40
              }}>
              <div
                style={{
                  width: '100%',
                  borderRadius: 8,
                  backgroundColor: '#F8F7FA'
                }}>
                <div
                  style={{
                    padding: 24,
                    fontFamily: 'Roboto',
                    fontSize: 24,
                    fontWeight: 600
                  }}>
                  Unleash your data's potential
                </div>
                <div
                  style={{
                    paddingLeft: 24,
                    paddingRight: 24,
                    paddingBottom: 24,
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    fontWeight: 400,
                    width: 320
                  }}>
                  Share your datasets and let them fuel new scientific
                  breakthroughs
                </div>
                <img src={contestUnleashMobile} width={'100%'} />
              </div>
            </div>
          </Box>
        </div>
        {/*Sign up block desktop*/}
        <Box
          component={Grid}
          item
          display={{
            xs: 'none',
            s: 'none',
            md: 'block',
            lg: 'block',
            xl: 'block'
          }}>
          <div
            style={{
              height: 274,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F8F7FA'
            }}>
            <img src={contestEnvelope} />
            <div>
              <div
                style={{
                  marginLeft: 64,
                  marginBottom: 24,
                  fontFamily: 'Roboto',
                  fontSize: 34,
                  fontWeight: 600,
                  letterSpacing: '0.25px'
                }}>
                Stay informed on the latest news and updates. Sign up now!
              </div>
              <div>
                <Button
                  style={{
                    marginLeft: 64,
                    display: 'flex',
                    height: 40,
                    width: 120,
                    padding: 8,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    color: '#fff'
                  }}
                  variant="contained"
                  onClick={() => {
                    routerStore.navigatePage(Page.SIGN_UP);
                  }}
                  size={'large'}>
                  Sign up{' '}
                  <img
                    src={contestRight}
                    style={{
                      marginBottom: 4,
                      marginLeft: 8
                    }}
                  />
                </Button>
              </div>
            </div>
          </div>
        </Box>
        {/*Sign up block mobile*/}
        <Box
          component={Grid}
          item
          display={{
            xs: 'block',
            s: 'block',
            md: 'none',
            lg: 'none',
            xl: 'none'
          }}>
          <div
            style={{
              height: 324,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#F8F7FA',
              padding: 24
            }}>
            <img src={contestEnvelope} width={70} height={70} />
            <div>
              <div
                style={{
                  marginTop: 24,
                  marginBottom: 24,
                  fontFamily: 'Roboto',
                  fontSize: 24,
                  fontWeight: 600
                }}>
                Stay informed on the latest news and updates. Sign up now!
              </div>
              <div>
                <Button
                  style={{
                    display: 'flex',
                    height: 40,
                    width: '100%',
                    padding: 8,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    color: '#fff'
                  }}
                  variant="contained"
                  onClick={() => {
                    routerStore.navigatePage(Page.SIGN_UP);
                  }}
                  size={'large'}>
                  Sign up{' '}
                  <img
                    src={contestRight}
                    style={{
                      marginBottom: 4,
                      marginLeft: 8
                    }}
                  />
                </Button>
              </div>
            </div>
          </div>
        </Box>
        <Footer />
        <Snackbar
          open={showSuccessSubscriptionAlter}
          autoHideDuration={4000}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          onClose={() => setShowSuccessSubscriptionAlter(false)}>
            <Alert severity="success" sx={{ width: '100%' }}>
                You're successfully subscribed!
            </Alert>
        </Snackbar>
      </>
    );
  }
);

const VerticalDivider = styled.div<{
    height?: string;
    mobileHeight?: string;
}>`
  height: ${(props) => props.height ?? '0'};

  @media (max-width: 1300px) {
    height: ${(props) => props.mobileHeight ?? '0'};
  }
`;

const ExpertsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
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

const font16px = css`
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 154%; /* 24.64px */
  letter-spacing: 0.15px;
`;

const ExpertsTitle = styled.div`
  width: 600px;
  ${font34px};

  @media (max-width: 1300px) {
    width: 100%;
    ${font16px};
  }
`;

const ExpertsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: calc(100vw - 32px);
`;

const OnlyMobile = styled.div`
  @media (min-width: 500px) {
    display: none;
  }
`;

const OnlyDesktop = styled.div`
  @media (max-width: 1300px) {
    display: none;
  }
`;

const font12px = css`
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Roboto, serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 166%; /* 19.92px */
  letter-spacing: 0.4px;
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

const colorDim = css`
  color: rgba(4, 0, 54, 0.38);
`;

const LinkWrap = styled(Link)`
    cursor: pointer;
`;
