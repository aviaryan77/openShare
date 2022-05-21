import React, {useEffect, FunctionComponent} from 'react';
import {Text, View, StyleSheet, Animated} from 'react-native';

const TextAnimator = props => {
  const animatedValues = [];

  let textArr = props.content.trim().split(' ');
  textArr.forEach((_, i) => {
    animatedValues[i] = new Animated.Value(0);
  });
  //    textArr = textArr;

  useEffect(() => {
    animated();
  }, []);

  const animated = (toValue = 1) => {
    const animations = textArr.map((_, i) => {
      return Animated.timing(animatedValues[i], {
        toValue,
        duration: props.duration,
        useNativeDriver: true,
      });
    });

    Animated.stagger(
      props.duration / 5,
      toValue === 0 ? animations.reverse() : animations,
    ).start(() => {
      setTimeout(() => animated(toValue === 0 ? 1 : 0), 1000);
      if (props.onFinish) {
        props.onFinish();
      }
    });
  };

  return (
    <View style={[props.style, styles.textWrapper]}>
      {textArr.map((word, index) => {
        return (
          <Animated.Text
            key={`${word}-${index}`}
            style={[
              props.textStyle,
              {
                opacity: animatedValues[index],
                transform: [
                  {
                    translateY: Animated.multiply(
                      animatedValues[index],
                      new Animated.Value(-5),
                    ),
                  },
                ],
              },
            ]}>
            {word}
            {`${index < textArr.length ? ' ' : ''}`}
          </Animated.Text>
        );
      })}
    </View>
  );
};

export default TextAnimator;

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    // justifyContent: 'center',
  },
});
