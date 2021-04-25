import React, { FC, useCallback, useReducer, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { WebViewMessageEvent } from 'react-native-webview';
import ImageViewer from 'react-native-image-zoom-viewer';

import { BottomTabParamList } from '../types';
import Hamburger from '../components/Hamburger';
import MarketplaceContent from '../components/MarketplaceContent';
import MarketplaceMenu from '../components/MarketplaceMenu';
import SwipeDownModal from '../components/SwipeDownModal';

const DEFAULT_URI = process.env.BASE_URL ? `${process.env.BASE_URL.replace(/\/$/, '')}/tori/` : undefined;

const Container = styled.View`
  flex: 1;
`;

const ErrorText = styled.Text`
  color: red;
`;

const MessageContainer = styled.View`
  background-color: purple;
`;

const MessageText = styled.Text`
`;

const OpenMenuButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const MarketplaceScreen: FC<StackScreenProps<BottomTabParamList, 'Marketplace'>> = ({ navigation }) => {
  if (!DEFAULT_URI) {
    return (
      <Container>
        <ErrorText>BASE_URL ei ole asetettu</ErrorText>
      </Container>
    );
  }

  const [messages, addMessage] = useReducer((state: string[], message: string) => [...state, message], []);
  const [menuOpened, setMenuOpened] = useState(false);
  const [uri, setUri] = useState(DEFAULT_URI);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      return () => setUri(DEFAULT_URI);
    }, [])
  );

  const handleLocationChange = useCallback((newUrl: string) => {
    if (newUrl.indexOf('.jpg') !== -1) {
      setImageUrl(newUrl);
    } else {
      setUri(newUrl);
    }
  }, []);

  const handleMenuClosed = useCallback(() => {
    setMenuOpened(false);
  }, []);

  const handleMenuOpen = useCallback(() => {
    setMenuOpened(true);
  }, []);

  const handleImageClosed = useCallback(() => {
    setImageUrl(undefined);
  }, []);

  return (
    <Container>
      <MessageContainer>
        {messages.map((message, index) => (
          <MessageText key={`message-${index}`}>{message}</MessageText>
        ))}
      </MessageContainer>
      <MarketplaceContent
        onLocationChange={handleLocationChange}
        uri={uri}
      />
      <MarketplaceMenu
        onLocationChange={handleLocationChange}
        onMenuClosed={handleMenuClosed}
        opened={menuOpened}
        uri={uri}
      />
      <SwipeDownModal visible={Boolean(imageUrl)} onClose={handleImageClosed}>
        <ImageViewer imageUrls={imageUrl ? [{ url: imageUrl }] : []} />
      </SwipeDownModal>
      <OpenMenuButton onPress={handleMenuOpen}>
         <Hamburger />
      </OpenMenuButton>
    </Container>
  );
}

export default MarketplaceScreen;
