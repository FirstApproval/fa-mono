import React, { type ReactElement, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectToolbarItems, SmartToolbarButton } from '@first-approval/chonky';

// eslint-disable-next-line react/display-name
export const FileToolbar: React.FC = React.memo(() => {
  const toolbarItems = useSelector(selectToolbarItems);

  const toolbarItemComponents = useMemo(() => {
    const components: ReactElement[] = [];
    for (let i = 0; i < toolbarItems.length; ++i) {
      const item = toolbarItems[i];

      const key = `toolbar-item-${typeof item === 'string' ? item : item.name}`;
      let component;
      if (typeof item === 'string') {
        component = <SmartToolbarButton key={key} fileActionId={item} />;
      } else {
        component = <div>{item.name}</div>;
      }
      components.push(component);
    }
    return components;
  }, [toolbarItems]);

  return <div>{toolbarItemComponents}</div>;
});
