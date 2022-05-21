import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';

import {theme} from '../constants/theme';
import {HeaderComponent} from '../components';
import RenderHtml from 'react-native-render-html';
import TextAnimator from '../components/TextAnimator';

const CsvScreen = ({navigation, route}) => {
  const renderData = route.params.data;
  const {width} = useWindowDimensions();

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="Imported data"
        onBackPress={() =>
          navigation.navigate('HomeScreen', {backDataClean: true})
        }
      />
      <StatusBar
        translucent
        barStyle={'light-content'}
        backgroundColor={'transparent'}
      />
      {!renderData ? (
        <ActivityIndicator size="large" color="#ffab00" />
      ) : (
        <ScrollView style={styles.detailContainer}>
          <View style={styles.textAnimatorContainer}>
            <TextAnimator
              content={
                'Instantly Settle balances with your friends using UPI with split karo'
              }
              textStyle={styles.line}
              style={styles.headerTagLine}
              duration={500}
              // onFinish={_onFinish}
            />
            <ScrollView horizontal style={styles.csvRenderContainer}>
              <RenderHtml
                contentWidth={width * 2}
                source={{
                  html: `<p style="color: #fff">${renderData}</p>`,
                }}
              />
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default CsvScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    justifyContent: 'center',
    backgroundColor: theme.bg,
  },

  headerTagLine: {
    marginVertical: 10,
  },

  name: {
    fontSize: 24,
    color: '#fff',
  },

  detailContainer: {
    backgroundColor: theme.bg,
    paddingHorizontal: 10,
    flex: 1,
    borderRadius: 10,
  },

  csvRenderContainer: {
    backgroundColor: theme.bg,
    marginHorizontal: 15,
    borderRadius: 5,
  },

  textAnimatorContainer: {
    flex: 1,
    marginBottom: 25,
  },

  line: {
    color: '#ffab00',
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 2,
  },
});
