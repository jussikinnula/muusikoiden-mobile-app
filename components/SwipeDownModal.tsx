// https://github.com/MinaSamir11/react-native-swipe-down
// 
// This is simplified version of the original react-native-swipe-down,
// I created the simplified version just because TypeScript type definitions
// were missing (e.g. @types/react-native-swipe-down).
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  LayoutChangeEvent,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/stack';
import styled from 'styled-components/native';

const TOP_OFFSET = 100;
const HEADER_HEIGHT_OFFSET = 30;
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

// height: ${({ top }) => WINDOW_HEIGHT - top - TOP_OFFSET - 300}px;
const Container = styled(Animated.View)<{ top: number }>`
  opacity: 0;
  flex: 1;
  margin-top: ${({ top }) => top + TOP_OFFSET}px;
  max-height: ${({ top }) => WINDOW_HEIGHT - top * 2 - TOP_OFFSET}px;
  overflow: hidden;
`;

const HeaderContainer = styled(Animated.View)<{ top: number, height: number }>`
  position: absolute;
  top: ${({ top }) => top + TOP_OFFSET}px;
  left: 0;
  right: 0;
  height: ${({ height }) => height + HEADER_HEIGHT_OFFSET}px;
`;

const DefaultHeaderContainer = styled.View`
  width: 100%;
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  align-items: center;
  background-color: black;
`;

const DefaultHeaderLine = styled.View`
  background-color: white;
  width: 75px;
  height: 6px;
  border-radius: 3px;
`;

const DefaultHeader: FC = () => (
  <DefaultHeaderContainer>
    <DefaultHeaderLine />
  </DefaultHeaderContainer>
);

interface SwipeDownModalProps {
  header?: JSX.Element;
  onClose?: () => void;
  visible?: boolean;
}

const SwipeDownModal: FC<SwipeDownModalProps> = (props) => {
  const { children, header = <DefaultHeader />, visible = false, onClose } = props;
  const pan = useRef(new Animated.ValueXY()).current;
  const [isAnimating, setIsAnimating] = useState(false);
  const navigationHeaderHeight = useHeaderHeight();
  const [headerHeight, setHeaderHeight] = useState(0);
  const { top } = useSafeAreaInsets();

  let animatedValueX = 0;
  let animatedValueY = 0;

  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (isAnimating) {
          return false;
        }
        if (gestureState.dy > 22) {
          return true;
        }
        return false;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: animatedValueX,
          y: animatedValueY,
        });
        pan.setValue({ x: 0, y: 0 }); // Initial value
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        // Flatten the offset so it resets the default positioning
        if (gestureState.dy > 0 && gestureState.vy > 0) {
          if (gestureState.vy <= -0.7 || gestureState.dy <= -100) {
            Animated.timing(pan, {
              toValue: { x: 0, y: -WINDOW_HEIGHT },
              duration: 150,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }).start(() => {
              onClose?.();
            });
          } else if (gestureState.vy >= 0.5 || gestureState.dy >= 100) {
            Animated.timing(pan, {
              toValue: {x: 0, y: WINDOW_HEIGHT / 2},
              duration: 150,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }).start(() => {
              onClose?.();
            });
          } else {
            Animated.spring(pan, {
              toValue: 0,
              useNativeDriver: false,
            }).start();
          }
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (visible) {
      animatedValueX = 0;
      animatedValueY = 0;
      pan.setOffset({
        x: animatedValueX,
        y: animatedValueY,
      });
      pan.setValue({x: 0, y: 0}); // Initial value
      pan.x.addListener(value => (animatedValueX = value.value));
      pan.y.addListener(value => (animatedValueY = value.value));

      setIsAnimating(true);
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration: 150,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        setIsAnimating(false);
      });
    }
  }, [visible]);

  const handleOnClose = useCallback(() => {
    Keyboard.dismiss();
    Animated.timing(pan, {
      toValue: { x: 0, y: WINDOW_HEIGHT },
      duration: 150,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      onClose?.();
    });
  }, []);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height);
  }, []);

  const opacity = pan.y.interpolate({
    inputRange: [-WINDOW_HEIGHT, 0, WINDOW_HEIGHT / 2],
    outputRange: [0, 1, 0],
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        handleOnClose();
      }}>
      <Container
        top={top + 10}
        style={[{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          opacity,
        }]}
        {...panResponder.panHandlers}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          {children}
        </TouchableWithoutFeedback>
      </Container>

      <HeaderContainer
        top={navigationHeaderHeight}
        height={headerHeight}
        style={[{
          transform: [{translateX: pan.x}, {translateY: pan.y}],
          opacity,
        }]}
        {...panResponder.panHandlers}>
        <TouchableWithoutFeedback>
          <View onLayout={handleLayout}>
            {header}
          </View>
        </TouchableWithoutFeedback>
      </HeaderContainer>
    </Modal>
  );
};

export default SwipeDownModal;
