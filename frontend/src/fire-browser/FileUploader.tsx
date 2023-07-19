import React, {
  type FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { getAllFileEntries } from 'src/util/fileUtil';
import styled from '@emotion/styled';
import { FileBrowser } from '../fire-browser/FileBrowser';
import { FileSystem } from './../fire-browser/FileSystem';
import { observer } from 'mobx-react-lite';

interface FileUploaderProps {
  publicationId: string;
}

export const FileUploader: FunctionComponent<FileUploaderProps> = observer(
  (props: FileUploaderProps) => {
    const [isDropZoneVisible, setIsDropZoneVisible] = useState(false);
    const isChonkyDragRef = useRef(false);

    useEffect(() => {
      let lastTarget: EventTarget | null = null;

      window.addEventListener('dragenter', function (e) {
        if (!isChonkyDragRef.current) {
          lastTarget = e.target;
          setIsDropZoneVisible(true);
        }
      });

      window.addEventListener('dragleave', function (e) {
        if (
          !isChonkyDragRef.current &&
          (e.target === lastTarget || e.target === document)
        ) {
          setIsDropZoneVisible(false);
        }
      });
    }, []);

    const fs = useMemo(
      () => new FileSystem(props.publicationId),
      [props.publicationId]
    );

    const onDrop = async (e: {
      preventDefault: () => void;
      stopPropagation: () => void;
      dataTransfer: { items: DataTransferItemList };
    }): Promise<void> => {
      e.preventDefault();
      e.stopPropagation();
      const result = await getAllFileEntries(e.dataTransfer.items);
      fs.addFilesDnd(result);
      setIsDropZoneVisible(false);
    };

    return (
      <>
        <>
          {isDropZoneVisible && (
            <DropZone onDrop={onDrop}>Drag files here for upload</DropZone>
          )}
          <FileBrowser fs={fs} isChonkyDragRef={isChonkyDragRef} />
        </>
      </>
    );
  }
);

const DropZone = styled('div')`
  border-radius: 4px;
  border: 2px dashed var(--divider, #d2d2d6);
  background: var(--primary-states-selected, rgba(59, 78, 255, 0.08));
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 424px;

  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
  letter-spacing: 0.15px;
`;
