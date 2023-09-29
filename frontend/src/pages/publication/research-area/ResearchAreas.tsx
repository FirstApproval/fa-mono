import React, { ReactElement } from 'react';
import agriculture from '../asset/agricultural.svg';
import biochemistry from '../asset/biochemistry.svg';
import business from '../asset/business.svg';
import chemicalEngineering from '../asset/chemicalEngineering.svg';
import chemistry from '../asset/chemistry.svg';
import computerScience from '../asset/computerScience.svg';
import decision from '../asset/decision.svg';
import dentistry from '../asset/dentistry.svg';
import earth from '../asset/earth.svg';
import economics from '../asset/economics.svg';
import energy from '../asset/energy.svg';
import engineering from '../asset/engineering.svg';
import environment from '../asset/environment.svg';
import healthProfessions from '../asset/healthProfessions.svg';
import humanities from '../asset/humanities.svg';
import materials from '../asset/materials.svg';
import mathematics from '../asset/mathematics.svg';
import medicine from '../asset/medicine.svg';
import microbiology from '../asset/microbiology.svg';
import neuroscience from '../asset/neuroscience.svg';
import nursing from '../asset/nursing.svg';
import pharmacology from '../asset/pharmacology.svg';
import physics from '../asset/physics.svg';
import psychology from '../asset/psychology.svg';
import socialSciences from '../asset/socialSciences.svg';
import veterinary from '../asset/veterinary.svg';

export const Agriculture = (): ReactElement => {
  return (
    <img
      src={agriculture}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Biochemistry = (): ReactElement => {
  return (
    <img
      src={biochemistry}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Business = (): ReactElement => {
  return (
    <img
      src={business}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const ChemicalEngineering = (): ReactElement => {
  return (
    <img
      src={chemicalEngineering}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Chemistry = (): ReactElement => {
  return (
    <img
      src={chemistry}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const ComputerScience = (): ReactElement => {
  return (
    <img
      src={computerScience}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Decision = (): ReactElement => {
  return (
    <img
      src={decision}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Dentistry = (): ReactElement => {
  return (
    <img
      src={dentistry}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Earth = (): ReactElement => {
  return (
    <img
      src={earth}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Economics = (): ReactElement => {
  return (
    <img
      src={economics}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Energy = (): ReactElement => {
  return (
    <img
      src={energy}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Engineering = (): ReactElement => {
  return (
    <img
      src={engineering}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Environment = (): ReactElement => {
  return (
    <img
      src={environment}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const HealthProfessions = (): ReactElement => {
  return (
    <img
      src={healthProfessions}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Humanities = (): ReactElement => {
  return (
    <img
      src={humanities}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Materials = (): ReactElement => {
  return (
    <img
      src={materials}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Mathematics = (): ReactElement => {
  return (
    <img
      src={mathematics}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Medicine = (): ReactElement => {
  return (
    <img
      src={medicine}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Microbiology = (): ReactElement => {
  return (
    <img
      src={microbiology}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Neuroscience = (): ReactElement => {
  return (
    <img
      src={neuroscience}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Nursing = (): ReactElement => {
  return (
    <img
      src={nursing}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Pharmacology = (): ReactElement => {
  return (
    <img
      src={pharmacology}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Physics = (): ReactElement => {
  return (
    <img
      src={physics}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Psychology = (): ReactElement => {
  return (
    <img
      src={psychology}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const SocialSciences = (): ReactElement => {
  return (
    <img
      src={socialSciences}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};
export const Veterinary = (): ReactElement => {
  return (
    <img
      src={veterinary}
      style={{
        width: 24,
        height: 24
      }}
    />
  );
};

export const findResearchAreaIcon = (subcategory: string): ReactElement => {
  const category = researchAreaCategories.find(
    (category) => category.subcategory === subcategory
  );
  if (category) {
    return category.icon;
  } else {
    throw new Error('Category not found');
  }
};

export const findResearchAreaCategory = (subcategory: string): string => {
  const category = researchAreaCategories.find(
    (category) => category.subcategory === subcategory
  );
  if (category) {
    return category.category;
  } else {
    throw new Error('Category not found');
  }
};

export const researchAreaCategories = [
  {
    category: 'Agricultural and Biological Sciences',
    subcategory: 'Agricultural and Biological Sciences',
    icon: <Agriculture />
  },
  {
    category: 'Agricultural and Biological Sciences',
    subcategory: 'Agronomy and Crop Science',
    icon: <Agriculture />
  },
  {
    category: 'Agricultural and Biological Sciences',
    subcategory: 'Animal Science and Zoology',
    icon: <Agriculture />
  },
  {
    category: 'Agricultural and Biological Sciences',
    subcategory: 'Aquatic Science',
    icon: <Agriculture />
  },
  {
    category: 'Agricultural and Biological Sciences',
    subcategory: 'Ecology, Evolution, Behavior and Systematics',
    icon: <Agriculture />
  },
  {
    category: 'Agricultural and Biological Sciences',
    subcategory: 'Food Science',
    icon: <Agriculture />
  },
  {
    category: 'Agricultural and Biological Sciences',
    subcategory: 'Forestry',
    icon: <Agriculture />
  },
  {
    category: 'Agricultural and Biological Sciences',
    subcategory: 'General Agricultural and Biological Sciences',
    icon: <Agriculture />
  },
  {
    category: 'Agricultural and Biological Sciences',
    subcategory: 'Horticulture',
    icon: <Agriculture />
  },
  {
    category: 'Agricultural and Biological Sciences',
    subcategory: 'Insect Science',
    icon: <Agriculture />
  },
  {
    category: 'Agricultural and Biological Sciences',
    subcategory: 'Plant Science',
    icon: <Agriculture />
  },
  {
    category: 'Agricultural and Biological Sciences',
    subcategory: 'Soil Science',
    icon: <Agriculture />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'Archeology',
    icon: <Humanities />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'Arts and Humanities',
    icon: <Humanities />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'Classics',
    icon: <Humanities />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'Conservation',
    icon: <Humanities />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'General Arts and Humanities',
    icon: <Humanities />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'History',
    icon: <Humanities />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'History and Philosophy of Science',
    icon: <Humanities />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'Language and Linguistics',
    icon: <Humanities />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'Literature and Literary Theory',
    icon: <Humanities />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'Museology',
    icon: <Humanities />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'Music',
    icon: <Humanities />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'Philosophy',
    icon: <Humanities />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'Religious Studies',
    icon: <Humanities />
  },
  {
    category: 'Arts and Humanities',
    subcategory: 'Visual Arts and Performing Arts',
    icon: <Humanities />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Aging',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Biochemistry',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Biochemistry, Genetics and Molecular Biology',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Biophysics',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Biotechnology',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Cancer Research',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Cell Biology',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Clinical Biochemistry',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Developmental Biology',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Endocrinology',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'General Biochemistry, Genetics and Molecular Biology',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Genetics',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Molecular Biology',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Molecular Medicine',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Physiology',
    icon: <Biochemistry />
  },
  {
    category: 'Biochemistry, Genetics and Molecular Biology',
    subcategory: 'Structural Biology',
    icon: <Biochemistry />
  },
  {
    category: 'Business, Management and Accounting',
    subcategory: 'Accounting',
    icon: <Business />
  },
  {
    category: 'Business, Management and Accounting',
    subcategory: 'Business and International Management',
    icon: <Business />
  },
  {
    category: 'Business, Management and Accounting',
    subcategory: 'Business, Management and Accounting',
    icon: <Business />
  },
  {
    category: 'Business, Management and Accounting',
    subcategory: 'General Business, Management and Accounting',
    icon: <Business />
  },
  {
    category: 'Business, Management and Accounting',
    subcategory: 'Industrial Relations',
    icon: <Business />
  },
  {
    category: 'Business, Management and Accounting',
    subcategory: 'Management Information Systems',
    icon: <Business />
  },
  {
    category: 'Business, Management and Accounting',
    subcategory: 'Management of Technology and Innovation',
    icon: <Business />
  },
  {
    category: 'Business, Management and Accounting',
    subcategory: 'Marketing',
    icon: <Business />
  },
  {
    category: 'Business, Management and Accounting',
    subcategory: 'Organizational Behavior and Human Resource Management',
    icon: <Business />
  },
  {
    category: 'Business, Management and Accounting',
    subcategory: 'Strategy and Management',
    icon: <Business />
  },
  {
    category: 'Business, Management and Accounting',
    subcategory: 'Tourism, Leisure and Hospitality Management',
    icon: <Business />
  },
  {
    category: 'Chemical Engineering',
    subcategory: 'Bioengineering',
    icon: <ChemicalEngineering />
  },
  {
    category: 'Chemical Engineering',
    subcategory: 'Catalysis',
    icon: <ChemicalEngineering />
  },
  {
    category: 'Chemical Engineering',
    subcategory: 'Chemical Engineering',
    icon: <ChemicalEngineering />
  },
  {
    category: 'Chemical Engineering',
    subcategory: 'Chemical Health and Safety',
    icon: <ChemicalEngineering />
  },
  {
    category: 'Chemical Engineering',
    subcategory: 'Colloid and Surface Chemistry',
    icon: <ChemicalEngineering />
  },
  {
    category: 'Chemical Engineering',
    subcategory: 'Filtration and Separation',
    icon: <ChemicalEngineering />
  },
  {
    category: 'Chemical Engineering',
    subcategory: 'Fluid Flow and Transfer Processes',
    icon: <ChemicalEngineering />
  },
  {
    category: 'Chemical Engineering',
    subcategory: 'General Chemical Engineering',
    icon: <ChemicalEngineering />
  },
  {
    category: 'Chemical Engineering',
    subcategory: 'Process Chemistry and Technology',
    icon: <ChemicalEngineering />
  },
  {
    category: 'Chemistry',
    subcategory: 'Analytical Chemistry',
    icon: <Chemistry />
  },
  {
    category: 'Chemistry',
    subcategory: 'Chemistry',
    icon: <Chemistry />
  },
  {
    category: 'Chemistry',
    subcategory: 'Electrochemistry',
    icon: <Chemistry />
  },
  {
    category: 'Chemistry',
    subcategory: 'General Chemistry',
    icon: <Chemistry />
  },
  {
    category: 'Chemistry',
    subcategory: 'Inorganic Chemistry',
    icon: <Chemistry />
  },
  {
    category: 'Chemistry',
    subcategory: 'Organic Chemistry',
    icon: <Chemistry />
  },
  {
    category: 'Chemistry',
    subcategory: 'Physical and Theoretical Chemistry',
    icon: <Chemistry />
  },
  {
    category: 'Chemistry',
    subcategory: 'Spectroscopy',
    icon: <Chemistry />
  },
  {
    category: 'Computer Science',
    subcategory: 'Artificial Intelligence',
    icon: <ComputerScience />
  },
  {
    category: 'Computer Science',
    subcategory: 'Computational Theory and Mathematics',
    icon: <ComputerScience />
  },
  {
    category: 'Computer Science',
    subcategory: 'Computer Graphics and Computer-Aided Design',
    icon: <ComputerScience />
  },
  {
    category: 'Computer Science',
    subcategory: 'Computer Networks and Communications',
    icon: <ComputerScience />
  },
  {
    category: 'Computer Science',
    subcategory: 'Computer Science',
    icon: <ComputerScience />
  },
  {
    category: 'Computer Science',
    subcategory: 'Computer Science Applications',
    icon: <ComputerScience />
  },
  {
    category: 'Computer Science',
    subcategory: 'Computer Vision and Pattern Recognition',
    icon: <ComputerScience />
  },
  {
    category: 'Computer Science',
    subcategory: 'General Computer Science',
    icon: <ComputerScience />
  },
  {
    category: 'Computer Science',
    subcategory: 'Hardware and Architecture',
    icon: <ComputerScience />
  },
  {
    category: 'Computer Science',
    subcategory: 'Human-Computer Interaction',
    icon: <ComputerScience />
  },
  {
    category: 'Computer Science',
    subcategory: 'Information Systems',
    icon: <ComputerScience />
  },
  {
    category: 'Computer Science',
    subcategory: 'Signal Processing',
    icon: <ComputerScience />
  },
  {
    category: 'Computer Science',
    subcategory: 'Software',
    icon: <ComputerScience />
  },
  {
    category: 'Decision Sciences',
    subcategory: 'Decision Sciences',
    icon: <Decision />
  },
  {
    category: 'Decision Sciences',
    subcategory: 'General Decision Sciences',
    icon: <Decision />
  },
  {
    category: 'Decision Sciences',
    subcategory: 'Information Systems and Management',
    icon: <Decision />
  },
  {
    category: 'Decision Sciences',
    subcategory: 'Management Science and Operations Research',
    icon: <Decision />
  },
  {
    category: 'Decision Sciences',
    subcategory: 'Statistics, Probability and Uncertainty',
    icon: <Decision />
  },
  {
    category: 'Dentistry',
    subcategory: 'Dental Assisting',
    icon: <Dentistry />
  },
  {
    category: 'Dentistry',
    subcategory: 'Dental Hygiene',
    icon: <Dentistry />
  },
  {
    category: 'Dentistry',
    subcategory: 'Dentistry',
    icon: <Dentistry />
  },
  {
    category: 'Dentistry',
    subcategory: 'General Dentistry',
    icon: <Dentistry />
  },
  {
    category: 'Dentistry',
    subcategory: 'Oral Surgery',
    icon: <Dentistry />
  },
  {
    category: 'Dentistry',
    subcategory: 'Orthodontics',
    icon: <Dentistry />
  },
  {
    category: 'Dentistry',
    subcategory: 'Periodontics',
    icon: <Dentistry />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'Atmospheric Science',
    icon: <Earth />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'Computers in Earth Sciences',
    icon: <Earth />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'Earth and Planetary Sciences',
    icon: <Earth />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'Earth-Surface Processes',
    icon: <Earth />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'Economic Geology',
    icon: <Earth />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'General Earth and Planetary Sciences',
    icon: <Earth />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'Geochemistry and Petrology',
    icon: <Earth />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'Geology',
    icon: <Earth />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'Geophysics',
    icon: <Earth />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'Geotechnical Engineering and Engineering Geology',
    icon: <Earth />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'Oceanography',
    icon: <Earth />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'Paleontology',
    icon: <Earth />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'Space and Planetary Science',
    icon: <Earth />
  },
  {
    category: 'Earth and Planetary Sciences',
    subcategory: 'Stratigraphy',
    icon: <Earth />
  },
  {
    category: 'Economics, Econometrics and Finance',
    subcategory: 'Economics and Econometrics',
    icon: <Economics />
  },
  {
    category: 'Economics, Econometrics and Finance',
    subcategory: 'Economics, Econometrics and Finance',
    icon: <Economics />
  },
  {
    category: 'Economics, Econometrics and Finance',
    subcategory: 'Finance',
    icon: <Economics />
  },
  {
    category: 'Economics, Econometrics and Finance',
    subcategory: 'General Economics, Econometrics and Finance',
    icon: <Economics />
  },
  {
    category: 'Energy',
    subcategory: 'Energy',
    icon: <Energy />
  },
  {
    category: 'Energy',
    subcategory: 'Energy Engineering and Power Technology',
    icon: <Energy />
  },
  {
    category: 'Energy',
    subcategory: 'Fuel Technology',
    icon: <Energy />
  },
  {
    category: 'Energy',
    subcategory: 'General Energy',
    icon: <Energy />
  },
  {
    category: 'Energy',
    subcategory: 'Nuclear Energy and Engineering',
    icon: <Energy />
  },
  {
    category: 'Energy',
    subcategory: 'Renewable Energy, Sustainability and the Environment',
    icon: <Energy />
  },
  {
    category: 'Engineering',
    subcategory: 'Aerospace Engineering',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Architecture',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Automotive Engineering',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Biomedical Engineering',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Building and Construction',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Civil and Structural Engineering',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Computational Mechanics',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Control and Systems Engineering',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Electrical and Electronic Engineering',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Engineering',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'General Engineering',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Industrial and Manufacturing Engineering',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Mechanical Engineering',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Mechanics of Materials',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Media Technology',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Ocean Engineering',
    icon: <Engineering />
  },
  {
    category: 'Engineering',
    subcategory: 'Safety, Risk, Reliability and Quality',
    icon: <Engineering />
  },
  {
    category: 'Environmental Science',
    subcategory: 'Ecological Modeling',
    icon: <Environment />
  },
  {
    category: 'Environmental Science',
    subcategory: 'Ecology',
    icon: <Environment />
  },
  {
    category: 'Environmental Science',
    subcategory: 'Environmental Chemistry',
    icon: <Environment />
  },
  {
    category: 'Environmental Science',
    subcategory: 'Environmental Engineering',
    icon: <Environment />
  },
  {
    category: 'Environmental Science',
    subcategory: 'Environmental Science',
    icon: <Environment />
  },
  {
    category: 'Environmental Science',
    subcategory: 'General Environmental Science',
    icon: <Environment />
  },
  {
    category: 'Environmental Science',
    subcategory: 'Global and Planetary Change',
    icon: <Environment />
  },
  {
    category: 'Environmental Science',
    subcategory: 'Health, Toxicology and Mutagenesis',
    icon: <Environment />
  },
  {
    category: 'Environmental Science',
    subcategory: 'Management, Monitoring, Policy and Law',
    icon: <Environment />
  },
  {
    category: 'Environmental Science',
    subcategory: 'Nature and Landscape Conservation',
    icon: <Environment />
  },
  {
    category: 'Environmental Science',
    subcategory: 'Pollution',
    icon: <Environment />
  },
  {
    category: 'Environmental Science',
    subcategory: 'Waste Management and Disposal',
    icon: <Environment />
  },
  {
    category: 'Environmental Science',
    subcategory: 'Water Science and Technology',
    icon: <Environment />
  },
  {
    category: 'Health Professions',
    subcategory: 'Chiropractics',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Complementary and Manual Therapy',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Emergency Medical Services',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'General Health Professions',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Health Information Management',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Health Professions',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Medical Assisting and Transcription',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Medical Laboratory Technology',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Medical Terminology',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Occupational Therapy',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Optometry',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Pharmacy',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Physical Therapy, Sports Therapy and Rehabilitation',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Podiatry',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Radiological and Ultrasound Technology',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Respiratory Care',
    icon: <HealthProfessions />
  },
  {
    category: 'Health Professions',
    subcategory: 'Speech and Hearing',
    icon: <HealthProfessions />
  },
  {
    category: 'Immunology and Microbiology',
    subcategory: 'Applied Microbiology and Biotechnology',
    icon: <Microbiology />
  },
  {
    category: 'Immunology and Microbiology',
    subcategory: 'General Immunology and Microbiology',
    icon: <Microbiology />
  },
  {
    category: 'Immunology and Microbiology',
    subcategory: 'Immunology',
    icon: <Microbiology />
  },
  {
    category: 'Immunology and Microbiology',
    subcategory: 'Immunology and Microbiology',
    icon: <Microbiology />
  },
  {
    category: 'Immunology and Microbiology',
    subcategory: 'Microbiology',
    icon: <Microbiology />
  },
  {
    category: 'Immunology and Microbiology',
    subcategory: 'Parasitology',
    icon: <Microbiology />
  },
  {
    category: 'Immunology and Microbiology',
    subcategory: 'Virology',
    icon: <Microbiology />
  },
  {
    category: 'Materials Science',
    subcategory: 'Biomaterials',
    icon: <Materials />
  },
  {
    category: 'Materials Science',
    subcategory: 'Ceramics and Composites',
    icon: <Materials />
  },
  {
    category: 'Materials Science',
    subcategory: 'Electronic, Optical and Magnetic Materials',
    icon: <Materials />
  },
  {
    category: 'Materials Science',
    subcategory: 'General Materials Science',
    icon: <Materials />
  },
  {
    category: 'Materials Science',
    subcategory: 'Materials Chemistry',
    icon: <Materials />
  },
  {
    category: 'Materials Science',
    subcategory: 'Materials Science',
    icon: <Materials />
  },
  {
    category: 'Materials Science',
    subcategory: 'Metals and Alloys',
    icon: <Materials />
  },
  {
    category: 'Materials Science',
    subcategory: 'Polymers and Plastics',
    icon: <Materials />
  },
  {
    category: 'Materials Science',
    subcategory: 'Surfaces, Coatings and Films',
    icon: <Materials />
  },
  {
    category: 'Mathematics',
    subcategory: 'Algebra and Number Theory',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'Analysis',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'Applied Mathematics',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'Computational Mathematics',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'Control and Optimization',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'Discrete Mathematics and Combinatorics',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'General Mathematics',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'Geometry and Topology',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'Logic',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'Mathematical Physics',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'Mathematics',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'Modeling and Simulation',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'Numerical Analysis',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'Statistics and Probability',
    icon: <Mathematics />
  },
  {
    category: 'Mathematics',
    subcategory: 'Theoretical Computer Science',
    icon: <Mathematics />
  },
  {
    category: 'Medicine',
    subcategory: 'Anatomy',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Anesthesiology and Pain Medicine',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Biochemistry',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Cardiology and Cardiovascular Medicine',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Complementary and Alternative Medicine',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Critical Care and Intensive Care Medicine',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Dermatology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Drug Guides',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Embryology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Emergency Medicine',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Endocrinology, Diabetes and Metabolism',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Epidemiology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Family Practice',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Gastroenterology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'General Medicine',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Clinical Genetics',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Geriatrics and Gerontology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Health Informatics',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Health Policy',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Hematology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Hepatology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Histology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Immunology and Allergy',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Infectious Diseases',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Internal Medicine',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Medicine',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Microbiology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Nephrology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Clinical Neurology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Obstetrics and Gynecology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Oncology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Ophthalmology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Orthopedics and Sports Medicine',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Otorhinolaryngology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Pathology and Forensic Medicine',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Pediatrics, Perinatology and Child Health',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Pharmacology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Physiology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Psychiatry and Mental Health',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Public Health, Environmental and Occupational Health',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Pulmonary and Respiratory Medicine',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Radiology, Nuclear Medicine and Imaging',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Rehabilitation',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Reproductive Medicine',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Reviews and References',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Rheumatology',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Surgery',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Transplantation',
    icon: <Medicine />
  },
  {
    category: 'Medicine',
    subcategory: 'Urology',
    icon: <Medicine />
  },
  {
    category: 'Neuroscience',
    subcategory: 'Behavioral Neuroscience',
    icon: <Neuroscience />
  },
  {
    category: 'Neuroscience',
    subcategory: 'Biological Psychiatry',
    icon: <Neuroscience />
  },
  {
    category: 'Neuroscience',
    subcategory: 'Cellular and Molecular Neuroscience',
    icon: <Neuroscience />
  },
  {
    category: 'Neuroscience',
    subcategory: 'Cognitive Neuroscience',
    icon: <Neuroscience />
  },
  {
    category: 'Neuroscience',
    subcategory: 'Developmental Neuroscience',
    icon: <Neuroscience />
  },
  {
    category: 'Neuroscience',
    subcategory: 'Endocrine and Autonomic Systems',
    icon: <Neuroscience />
  },
  {
    category: 'Neuroscience',
    subcategory: 'General Neuroscience',
    icon: <Neuroscience />
  },
  {
    category: 'Neuroscience',
    subcategory: 'Neurology',
    icon: <Neuroscience />
  },
  {
    category: 'Neuroscience',
    subcategory: 'Neuroscience',
    icon: <Neuroscience />
  },
  {
    category: 'Neuroscience',
    subcategory: 'Sensory Systems',
    icon: <Neuroscience />
  },
  {
    category: 'Nursing',
    subcategory: 'Advanced and Specialized Nursing',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Assessment and Diagnosis',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Care Planning',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Community and Home Care',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Critical Care Nursing',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Emergency Nursing',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Fundamentals and Skills',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'General Nursing',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Gerontology',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Issues, Ethics and Legal Aspects',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'LPN and LVN',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Leadership and Management',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Maternity and Midwifery',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Medical and Surgical Nursing',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Nurse Assisting',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Nursing',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Nutrition and Dietetics',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Oncology',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Pathophysiology',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Pediatrics',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Pharmacology',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Psychiatric Mental Health',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Research and Theory',
    icon: <Nursing />
  },
  {
    category: 'Nursing',
    subcategory: 'Review and Exam Preparation',
    icon: <Nursing />
  },
  {
    category: 'Pharmacology, Toxicology and Pharmaceutics',
    subcategory: 'Drug Discovery',
    icon: <Pharmacology />
  },
  {
    category: 'Pharmacology, Toxicology and Pharmaceutics',
    subcategory: 'General Pharmacology, Toxicology and Pharmaceutics',
    icon: <Pharmacology />
  },
  {
    category: 'Pharmacology, Toxicology and Pharmaceutics',
    subcategory: 'Pharmaceutical Science',
    icon: <Pharmacology />
  },
  {
    category: 'Pharmacology, Toxicology and Pharmaceutics',
    subcategory: 'Pharmacology',
    icon: <Pharmacology />
  },
  {
    category: 'Pharmacology, Toxicology and Pharmaceutics',
    subcategory: 'Pharmacology, Toxicology and Pharmaceutics',
    icon: <Pharmacology />
  },
  {
    category: 'Pharmacology, Toxicology and Pharmaceutics',
    subcategory: 'Toxicology',
    icon: <Pharmacology />
  },
  {
    category: 'Physics and Astronomy',
    subcategory: 'Acoustics and Ultrasonics',
    icon: <Physics />
  },
  {
    category: 'Physics and Astronomy',
    subcategory: 'Astronomy and Astrophysics',
    icon: <Physics />
  },
  {
    category: 'Physics and Astronomy',
    subcategory: 'Atomic and Molecular Physics, and Optics',
    icon: <Physics />
  },
  {
    category: 'Physics and Astronomy',
    subcategory: 'Condensed Matter Physics',
    icon: <Physics />
  },
  {
    category: 'Physics and Astronomy',
    subcategory: 'General Physics and Astronomy',
    icon: <Physics />
  },
  {
    category: 'Physics and Astronomy',
    subcategory: 'Instrumentation',
    icon: <Physics />
  },
  {
    category: 'Physics and Astronomy',
    subcategory: 'Nuclear and High Energy Physics',
    icon: <Physics />
  },
  {
    category: 'Physics and Astronomy',
    subcategory: 'Physics and Astronomy',
    icon: <Physics />
  },
  {
    category: 'Physics and Astronomy',
    subcategory: 'Radiation',
    icon: <Physics />
  },
  {
    category: 'Physics and Astronomy',
    subcategory: 'Statistical and Nonlinear Physics',
    icon: <Physics />
  },
  {
    category: 'Physics and Astronomy',
    subcategory: 'Surfaces and Interfaces',
    icon: <Physics />
  },
  {
    category: 'Psychology',
    subcategory: 'Applied Psychology',
    icon: <Psychology />
  },
  {
    category: 'Psychology',
    subcategory: 'Clinical Psychology',
    icon: <Psychology />
  },
  {
    category: 'Psychology',
    subcategory: 'Developmental and Educational Psychology',
    icon: <Psychology />
  },
  {
    category: 'Psychology',
    subcategory: 'Experimental and Cognitive Psychology',
    icon: <Psychology />
  },
  {
    category: 'Psychology',
    subcategory: 'General Psychology',
    icon: <Psychology />
  },
  {
    category: 'Psychology',
    subcategory: 'Neuropsychology and Physiological Psychology',
    icon: <Psychology />
  },
  {
    category: 'Psychology',
    subcategory: 'Psychology',
    icon: <Psychology />
  },
  {
    category: 'Psychology',
    subcategory: 'Social Psychology',
    icon: <Psychology />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Anthropology',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Archeology',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Communication',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Cultural Studies',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Demography',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Development',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Education',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Gender Studies',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'General Social Sciences',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Geography, Planning and Development',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Health',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Human Factors and Ergonomics',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Law',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Library and Information Sciences',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Life-span and Life-course Studies',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Linguistics and Language',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Political Science and International Relations',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Public Administration',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Safety Research',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Social Sciences',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Sociology and Political Science',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Transportation',
    icon: <SocialSciences />
  },
  {
    category: 'Social Sciences',
    subcategory: 'Urban Studies',
    icon: <SocialSciences />
  },
  {
    category: 'Veterinary',
    subcategory: 'Equine',
    icon: <Veterinary />
  },
  {
    category: 'Veterinary',
    subcategory: 'Food Animals',
    icon: <Veterinary />
  },
  {
    category: 'Veterinary',
    subcategory: 'General Veterinary',
    icon: <Veterinary />
  },
  {
    category: 'Veterinary',
    subcategory: 'Small Animals',
    icon: <Veterinary />
  },
  {
    category: 'Veterinary',
    subcategory: 'Veterinary',
    icon: <Veterinary />
  }
];
