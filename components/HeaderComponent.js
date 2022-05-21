import {StyleSheet, Text, Pressable, View} from 'react-native';
import React from 'react';
import {theme, h, w} from '../constants/theme';

const HeaderComponent = ({title, onBackPress}) => {
  return (
    <View style={styles.headerContainer}>
      {onBackPress ? (
        <Pressable style={styles.backButton} onPress={onBackPress}>
          <Text style={styles.backText}>{`< Back`}</Text>
        </Pressable>
      ) : null}
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </View>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  headerContainer: {
    width: w,
    height: h * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.headerTint,
  },
  backButton: {
    left: 0,
    width: w * 0.25,
    position: 'absolute',
  },
  backText: {
    padding: 8,
    fontSize: 14,
    color: '#fff',
    fontWeight: '400',
  },

  header: {
    width: w,
    alignItems: 'center',
  },
  headerText: {
    padding: 8,
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
});
