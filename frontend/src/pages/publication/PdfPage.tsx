import { observer } from 'mobx-react-lite';
import { type FunctionComponent, useState } from 'react';
import { PdfStore } from './store/PdfStore';
import { routerStore } from '../../core/router';
import {
  Document,
  Page,
  PDFViewer,
  Text,
  StyleSheet,
  View,
  Image
} from '@react-pdf/renderer';

export const PdfPage: FunctionComponent = observer(() => {
  const [publicationId] = useState(() => routerStore.lastPathSegment);
  const [store] = useState(() => new PdfStore(publicationId));

  const styles = StyleSheet.create({
    viewer: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    page: {
      padding: '10 40',
      color: 'rgba(0, 0, 0, 1)',
      flexWrap: 'wrap'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottom: '1 solid rgba(0, 0, 0, 1)'
    },
    negativeData: {
      backgroundColor: 'rgba(0, 0, 0, 1)',
      color: 'rgba(255, 255, 255, 1)',
      fontSize: 12,
      fontWeight: 600,
      paddingVertical: 5,
      paddingHorizontal: 10
    },
    logo: {
      height: '16',
      width: '100px'
    },
    title: {
      fontSize: 29,
      marginTop: 20,
      width: '100%',
      fontWeight: 700
    },
    metaInfo: {
      fontSize: 9,
      fontWeight: 600
    },
    border: {
      borderTop: '1 solid rgba(0, 0, 0, 1)',
      marginVertical: 10
    },
    description: {
      fontSize: 11,
      textAlign: 'justify',
      fontWeight: 500
    },
    mainPart: {
      fontSize: 9,
      textAlign: 'justify',
      fontWeight: 400,
      width: '48%'
    },
    body: {
      flexWrap: 'wrap'
    }
  });

  const combineFields = (): string => {
    let combinedContent = '';

    if (store.publication?.predictedGoals) {
      combinedContent += `<Text>${'Experiment goals'}</Text>\n`;
      combinedContent +=
        store.publication?.predictedGoals.map((p) => p.text).join(' ') + '\n';
    }
    if (store.publication?.methodDescription) {
      combinedContent +=
        store.publication?.methodDescription.map((p) => p.text).join(' ') +
        '\n';
    }
    if (store.publication?.objectOfStudyDescription) {
      combinedContent +=
        store.publication?.objectOfStudyDescription
          .map((p) => p.text)
          .join(' ') + '\n';
    }

    return combinedContent;
  };
  const splitIntoColumns = (content: string): string[] => {
    const words = content.split(' ');
    const half = Math.ceil(words.length / 2);
    const firstColumn = words.slice(0, half).join(' ');
    const secondColumn = words.slice(half).join(' ');

    return [firstColumn, secondColumn];
  };
  const combinedContent = combineFields();

  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image debug src={'./asset/logo.jpg'} style={styles.logo} />
            {store.publication?.negativeData && (
              <Text style={styles.negativeData}>Negative data</Text>
            )}
          </View>
          <Text style={styles.title}>{store.publication?.title}</Text>
          <Text style={styles.border} />
          <Text style={styles.metaInfo}>{store.getAuthors()}</Text>
          <Text style={styles.metaInfo}>
            {`Published online: ${store.publication?.publicationTime}`}
          </Text>
          <Text style={styles.border} />
          {store.publication?.description?.map((p, index) => (
            <Text key={index} style={styles.description}>
              {p.text}
            </Text>
          ))}
          <View style={styles.body}>
            <Text style={styles.mainPart}>
              {splitIntoColumns(combinedContent)[0]}
              {splitIntoColumns(combinedContent)[1]}
            </Text>
            <Text style={styles.mainPart}>
              {splitIntoColumns(combinedContent)[0]}
              {splitIntoColumns(combinedContent)[1]}
            </Text>
            <Text style={styles.mainPart}>
              {splitIntoColumns(combinedContent)[0]}
              {splitIntoColumns(combinedContent)[1]}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
});
