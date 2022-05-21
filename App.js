import {StyleSheet, StatusBar, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import MainNavigator from './navigations';

import {theme} from './constants/theme';

const App = () => {
  return (
    <View style={styles.mainContainer}>
      <MainNavigator />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.bg,
  },
});
