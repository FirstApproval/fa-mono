import React, {type FunctionComponent} from 'react';
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
import {routerStore} from '../../core/router';
import {Page} from '../../core/router/constants';
import {Box, Button, Grid, Link} from '@mui/material';
import {userStore} from '../../core/user';
import {DataCollectionType} from '../../apis/first-approval-api';

interface ContestPageProps {}

export const ContestPage: FunctionComponent<ContestPageProps> = observer((props: ContestPageProps) => {

        const applyNow = () => userStore.goToCreatePublication(DataCollectionType.STUDENT);

        return (
            <>
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
                                        First Approval is pleased to announce a student dataset competition aimed at
                                        promoting innovative scientific practices in data publication across the fields
                                        of biology, biotechnology, and biomedicine. The objectives of this competition
                                        include training students in the principles and techniques of data publication,
                                        fostering the reuse of scientific data, and introducing decentralized solutions
                                        to the scientific community.
                                    </div>
                                    <div style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 20,
                                        fontWeight: 400,
                                        marginBottom: 24,
                                        marginRight: 120,
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
                                <div>
                                    <div style={{
                                        width: 480,
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
                                        <img src={contest1} style={{marginRight: 8, marginLeft: 16}}/>
                                        Submission deadline: 15 September 2025
                                    </div>
                                    <Link
                                        color="inherit"
                                        href={'https://docs.google.com/document/d/1qkKKMeW1OjavRftz1QqDhpxT36JxupTEvIQ4Eyoli0c'}
                                        target={'_blank'}>
                                        <div style={{
                                            width: 480,
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
                                        href={'https://docs.google.com/document/d/1Cq5OTm_gODN3JUjZCBzid2eY_kmKn9AwVhDc1klmva0'}
                                        target={'_blank'}>
                                        <div style={{
                                            width: 480,
                                            height: 80,
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
                                        <img src={contest1} style={{marginRight: 8, marginLeft: 16}}/>
                                        Submission deadline: 15 September 2025
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
                                            cursor: 'pointer',
                                        }}>
                                            <img src={contest3} style={{marginRight: 8, marginLeft: 16}}/>
                                            Guidelines
                                            <img src={contestRightTop} style={{marginLeft: 8}}/>
                                        </div>
                                    </Link>
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
                                    confirm initial hypotheses are also welcome. By accepting such a broad range of
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
                                    initial hypotheses.
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                }}>
                                    <span style={{fontWeight: 500}}>Orginality:</span> The dataset must not have been
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
                {/*Submission Requirements block mobile*/}
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
                                        confirm initial hypotheses are also welcome. By accepting such a broad range of
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
                                        initial hypotheses.
                                    </li>
                                    <li style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 16,
                                        fontWeight: 400,
                                    }}>
                                        <span style={{fontWeight: 500}}>Orginality:</span> The dataset must not have
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
                                    Best Negative Dataset: $500
                                </li>
                                <li style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20,
                                    fontWeight: 400,
                                    marginBottom: 16,
                                }}>
                                    Best Replication Dataset: $500
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
                                All participants will receive a first-authored Open Access data publication with a DOI,
                                published in a dedicated collection of biological, biotechnological, or biomedical data.
                                This will serve as a valuable addition to the participants' resumes, showcasing their
                                qualified skills. Publications will become publicly available after the competition
                                concludes and the winners are announced.
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
                                    All participants will receive a first-authored Open Access data publication with a
                                    DOI,
                                    published in a dedicated collection of biological, biotechnological, or biomedical
                                    data.
                                    This will serve as a valuable addition to the participants' resumes, showcasing
                                    their
                                    qualified skills. Publications will become publicly available after the competition
                                    concludes and the winners are announced.
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
                                    <span style={{fontWeight: 500}}>Detailed Guidelines</span> will be available soon.
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
                                        <span style={{fontWeight: 500}}>Detailed Guidelines</span> will be available
                                        soon.
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
                                xl: 'none',
                            }}>
                            <div style={{
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginBottom: 40,
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
                                    fontSize: 16,
                                    fontWeight: 400,
                                }}>
                                    <span style={{fontWeight: 500}}>Open Longevity</span>, a US nonprofit organization
                                    focused on accelerating aging research.
                                </div>
                                <div style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                }}>
                                    Additional partners will be announced soon.
                                </div>
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
                            xl: 'block',
                        }}>
                        <div style={{
                            paddingLeft: 128,
                            paddingRight: 128,
                            marginBottom: 80,
                        }}>
                            <div style={{
                                width: '100%',
                                height: 290,
                                borderRadius: 8,
                                backgroundColor: '#F8F7FA',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <div style={{
                                    marginLeft: 96,
                                }}>
                                    <div style={{
                                        marginBottom: 24,
                                        fontFamily: 'Roboto',
                                        fontSize: 34,
                                        fontWeight: 600,
                                    }}>
                                        Unleash your data's potential
                                    </div>
                                    <div style={{
                                        marginBottom: 32,
                                        fontFamily: 'Roboto',
                                        fontSize: 20,
                                        fontWeight: 400,
                                        width: 320,
                                    }}>
                                        Share your datasets and let them fuel new scientific breakthroughs
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
                                <img src={contestUnleash} height={290} style={{marginRight: 16}}/>
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
                            xl: 'none',
                        }}>
                        <div style={{
                            paddingLeft: 20,
                            paddingRight: 20,
                            marginBottom: 40,
                        }}>
                            <div style={{
                                width: '100%',
                                borderRadius: 8,
                                backgroundColor: '#F8F7FA',
                            }}>
                                <div style={{
                                    padding: 24,
                                    fontFamily: 'Roboto',
                                    fontSize: 24,
                                    fontWeight: 600,
                                }}>
                                    Unleash your data's potential
                                </div>
                                <div style={{
                                    paddingLeft: 24,
                                    paddingRight: 24,
                                    paddingBottom: 24,
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    fontWeight: 400,
                                    width: 320,
                                }}>
                                    Share your datasets and let them fuel new scientific breakthroughs
                                </div>
                                <img src={contestUnleashMobile} width={'100%'}/>
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
                        xl: 'block',
                    }}>
                    <div style={{
                        height: 274,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#F8F7FA'
                    }}>
                        <img src={contestEnvelope}/>
                        <div>
                            <div style={{
                                marginLeft: 64,
                                marginBottom: 24,
                                fontFamily: 'Roboto',
                                fontSize: 34,
                                fontWeight: 600,
                                letterSpacing: '0.25px',
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
                                    Sign up <img src={contestRight} style={{marginBottom: 4, marginLeft: 8}}/>
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
                        xl: 'none',
                    }}>
                    <div style={{
                        height: 324,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#F8F7FA',
                        padding: 24
                    }}>
                        <img src={contestEnvelope} width={70} height={70}/>
                        <div>
                            <div style={{
                                marginTop: 24,
                                marginBottom: 24,
                                fontFamily: 'Roboto',
                                fontSize: 24,
                                fontWeight: 600,
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
                                    Sign up <img src={contestRight} style={{marginBottom: 4, marginLeft: 8}}/>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Box>
                <Footer/>
            </>
        );
    }
);
