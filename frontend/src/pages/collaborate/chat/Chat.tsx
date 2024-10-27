import React from 'react';
import AvatarNameBox from '../elements/AvatarNameBox';
import { Button, ButtonGroup, Typography } from '@mui/material';
import { HeightElement } from '../../common.styled';
import Markdown from 'react-markdown';

const Messages = [
  {
    id: 1,
    name: 'Peter Lidsky',
    avatar: 'PL',
    text: `I would like to include you as a co-author of my work, as I plan to use the materials from your dataset. 

* Potential title of my publication in collaboration: Mice brain control/ex fertilization RNA-seq data
* Type of my publication in collaboration: Journal Article
* Details of the research: The aim is to investigate the main cortex genetical alterations in the result of mice prenatal influence.
* Intended journal for publication: Nature Communications 
* Expected publication date: 1 January 2025
`
  },
  {
    id: 0,
    name: 'Assistant',
    avatar: 'FA',
    text: `I would like to include you as a co-author of my work, as I plan to use the materials from your dataset. 

* Potential title of my publication in collaboration: Mice brain control/ex fertilization RNA-seq data
* Type of my publication in collaboration: Journal Article
* Details of the research: The aim is to investigate the main cortex genetical alterations in the result of mice prenatal influence.
* Intended journal for publication: Nature Communications 
* Expected publication date: 1 January 2025
`
  }
];

const Message = ({
  name,
  avatar,
  children
}: {
  name: string;
  avatar: string;
  children: string;
}): React.ReactElement => {
  return (
    <div>
      <AvatarNameBox avatar={avatar} name={name} />
      <HeightElement value={'12px'} />
      <Typography variant={'body'}>
        <Markdown>{children}</Markdown>
      </Typography>
    </div>
  );
};

const UserOptions = (): React.ReactElement => {
  return (
    <div>
      <AvatarNameBox avatar={'ME'} name={'Me Myself'} />
      <HeightElement value={'32px'} />
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group">
        <Button onClick={() => alert('Action 1')}>Approve collaboration</Button>
        <Button onClick={() => alert('Action 2')}>
          Decline, citation is enough
        </Button>
        <Button onClick={() => alert('Action 3')}>Email data user</Button>
        <Button onClick={() => alert('Action 3')}>I need help</Button>
      </ButtonGroup>
    </div>
  );
};

const Chat: React.FC = () => {
  return (
    <div>
      <HeightElement value={'64px'} />
      {Messages.map((message) => (
        <>
          <Message key={message.id} name={message.name} avatar={message.avatar}>
            {message.text}
          </Message>
          <HeightElement value={'32px'} />
        </>
      ))}
      <UserOptions />
    </div>
  );
};

export default Chat;
