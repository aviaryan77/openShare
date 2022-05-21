import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  StyleSheet,
  LogBox,
  TouchableOpacity,
} from 'react-native';
import ShareMenu from 'react-native-share-menu';

import {
  TextAnimator,
  getSecondPart,
  readFileFromUri,
  HeaderComponent,
} from '../components';
import {theme, w} from '../constants/theme';
import {useIsFocused} from '@react-navigation/native';
import DocumentPicker, {isInProgress} from 'react-native-document-picker';

LogBox.ignoreLogs(['new NativeEventEmitter']);

export const HomeScreen = ({navigation, route}) => {
  const [sharedData, setSharedData] = useState('');
  const [sharedMimeType, setSharedMimeType] = useState('');
  const [sharedExtraData, setSharedExtraData] = useState(null);
  const [printData, setPrintData] = useState();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (route?.params?.backDataClean) {
      setSharedExtraData(null);
      setSharedMimeType('');
      setSharedData('');
      setPrintData('');
    }
  }, [isFocused]);

  useEffect(() => {
    if (sharedData) {
      navigation.navigate('CsvScreen', {data: sharedData});
    }
  }, [sharedData]);

  const handleShare = useCallback(item => {
    if (!item) {
      return;
    }

    const {mimeType, data, extraData} = item;

    setSharedData(data);
    setSharedExtraData(extraData);
    setSharedMimeType(mimeType);
  }, []);

  useEffect(() => {
    sharedData &&
      readFileFromUri({
        uri: sharedData,
        navigation: navigation,
        callback: data => {
          setPrintData(getSecondPart(data)),
            navigation.navigate('CsvScreen', {data: getSecondPart(data)});
        },
      });
  }, [sharedData, handleShare]);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, []);

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

  const text = `
  SplitKaro is India's first group expense manager that helps users fetch & split online food, grocery & other bills item-wise and in the fairest way possible. It is designed not just to split online bills, but also to Create your own item-quantity wise bills and Split them item-wise, among your friends Create a Collection of different kinds of bills; split & keep them all together in one place`;

  const importData = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.allFiles,
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });

      if (res?.type !== 'text/comma-separated-values') {
        alert(' File not supported, Please select a CSV file to import');
        return;
      } else {
        readFileFromUri({
          uri: res?.uri,
          navigation: navigation,
          callback: data => {
            setPrintData(getSecondPart(data));
            // navigation.navigate('CsvScreen', {data: getSecondPart(data)});
          },
        });
      }
    } catch {
      err => console.warn(err);
      handleError;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        barStyle={'light-content'}
        backgroundColor={'transparent'}
      />
      <HeaderComponent title="Split Karo Open Share" />
      <View style={styles.textAnimatorContainer}>
        <TextAnimator
          content={text}
          textStyle={styles.line}
          style={styles.headerTagLine}
          duration={500}
          // onFinish={_onFinish}
        />
      </View>

      {sharedMimeType.startsWith('image/') ? (
        <Image
          style={styles.image}
          source={{uri: sharedData}}
          resizeMode="contain"
        />
      ) : null}

      <TouchableOpacity style={styles.button} onPress={importData}>
        <Text style={styles.buttonText}>IMPORT CSV FILE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.bg,
    paddingTop: 30,
  },

  image: {
    width: '100%',
    height: 200,
  },
  button: {
    height: 44,
    bottom: 80,
    width: w * 0.7,
    borderRadius: 18,
    paddingVertical: 4,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.textTint,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '800',
  },

  textAnimatorContainer: {
    flex: 1,
    marginBottom: 25,
  },

  line: {
    color: '#ffab00',
    fontSize: 20,
    textAlign: 'left',
    marginBottom: 2,
    fontWeight: '500',
  },
  headerTagLine: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
