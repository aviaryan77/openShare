/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, Button, Image, Dimensions} from 'react-native';
import ShareMenu from 'react-native-share-menu';
import RenderHtml from 'react-native-render-html';

import {writeFile, readFile, DownloadDirectoryPath} from 'react-native-fs';
import XLSX from 'xlsx';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from 'react-native-document-picker';

const App = () => {
  const [sharedData, setSharedData] = useState('');
  const [sharedMimeType, setSharedMimeType] = useState('');
  const [sharedExtraData, setSharedExtraData] = useState(null);

  const handleShare = useCallback(item => {
    if (!item) {
      return;
    }
    console.warn(item);
    const {mimeType, data, extraData} = item;

    setSharedData(data);
    setSharedExtraData(extraData);
    setSharedMimeType(mimeType);
  }, []);

  useEffect(() => {
    sharedData &&
      readFile(sharedData, 'ascii').then(res => {
        const wb = XLSX.read(res, {type: 'binary'});
        console.warn(wb);
        const wsName = wb.SheetNames[0];
        console.warn(wsName);
        const ws = wb.Sheets[wsName];
        console.warn(ws);
        const data = XLSX.utils.sheet_to_html(ws, {header: 1});
        // const data = XLSX.utils.sheet_to_json(ws, {header: 1});
        console.warn(data);
        setPrint(data);
      });
  }, [sharedData]);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, []);

  const [result, setResult] = React.useState();

  useEffect(() => {
    console.log(JSON.stringify(result, null, 2));
  }, [result]);

  const handleError = err => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
    }
  };

  const [print, setPrint] = useState();

  const importData = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      readFile(res[0].uri, 'ascii')
        .then(res => {
          const wb = XLSX.read(res, {type: 'binary'});
          console.warn(wb);
          const wsName = wb.SheetNames[0];
          console.warn(wsName);
          const ws = wb.Sheets[wsName];
          console.warn(ws);
          const data = XLSX.utils.sheet_to_html(ws, {header: 1});
          // const data = XLSX.utils.sheet_to_json(ws, {header: 1});
          console.warn(data);
          setPrint(data);
          // var temp = [];
          // for (let i = 0; i < data.length; i++) {
          //   temp.push({
          //     Date: data[i][0],
          //     Category: data[i][1],
          //     Cost: data[i][2],
          //     Currency: data[3][0],
          //     Avinash: data[i][4],
          //     Anu: data[i][5],
          //   });
          //   i === data.length - 1 && setPrint(data);
          // }
        })
        .catch(err => {
          console.error(err);
        });
    } catch {
      err => console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>React Native Share Menu</Text>
      <Text style={styles.instructions}>Shared type: {sharedMimeType}</Text>
      <Text style={styles.instructions}>
        Shared text: {sharedMimeType === 'text/plain' ? sharedData : ''}
      </Text>
      <Text style={styles.instructions}>Shared image:</Text>
      {sharedMimeType.startsWith('image/') && (
        <Image
          style={styles.image}
          source={{uri: sharedData}}
          resizeMode="contain"
        />
      )}
      <Text style={styles.instructions}>
        Shared file:{' '}
        {sharedMimeType !== 'text/plain' && !sharedMimeType.startsWith('image/')
          ? sharedData
          : ''}
      </Text>
      <Text style={styles.instructions}>
        Extra data: {sharedExtraData ? JSON.stringify(sharedExtraData) : ''}
      </Text>

      <Button
        title="open picker for single file selection"
        onPress={async () => {
          try {
            const pickerResult = await DocumentPicker.pickSingle({
              presentationStyle: 'fullScreen',
              copyTo: 'cachesDirectory',
            });
            setResult([pickerResult]);
          } catch (e) {
            handleError(e);
          }
        }}
      />
      <Button
        title="open picker for read file "
        onPress={async () => {
          importData();
        }}
      />

      {/* {print.map((item, index) => {
        return (
          <View key={index} style={{flexDirection: 'row'}}>
            <Text>{item.Date}</Text>
            <Text>{item.Category}</Text>
            <Text>{item.Currency}</Text>
            <Text>{item.Cost}</Text>
          </View>
        );
      })} */}

      <View style={{borderWidth: 1, width: Dimensions.get('screen').width}}>
        {print && (
          <RenderHtml
            contentWidth={Dimensions.get('screen').width}
            source={{html: print}}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 200,
  },
});

export default App;
