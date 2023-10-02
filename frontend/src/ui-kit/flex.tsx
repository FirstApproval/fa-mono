import styled from '@emotion/styled';

export const Flex = styled('div')<{
  direction?: FlexDirection;
  justifyContent?: FlexJustifyContent;
  alignItems?: FlexAlignItems;
}>`
  display: flex;
  flex-direction: ${(props) => props.direction ?? FlexDirection.row};
  justify-content: ${(props) =>
    props.justifyContent ?? FlexJustifyContent.flexStart};
  align-items: ${(props) => props.alignItems ?? FlexAlignItems.flexStart};
`;

export enum FlexDirection {
  row = 'row',
  column = 'column'
}

export enum FlexJustifyContent {
  flexStart = 'flex-start',
  flexEnd = 'flex-end',
  center = 'center',
  spaceBetween = 'space-between',
  spaceAround = 'space-around',
  spaceEvenly = 'space-evenly'
}

export enum FlexAlignItems {
  flexStart = 'flex-start',
  flexEnd = 'flex-end',
  center = 'center',
  baseline = 'baseline',
  stretch = 'stretch'
}
