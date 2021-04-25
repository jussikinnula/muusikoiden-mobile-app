import React, { FC, useCallback, useReducer, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import styled from 'styled-components/native';
import { WebViewMessageEvent } from 'react-native-webview';
import ImageViewer from 'react-native-image-zoom-viewer';

import { BottomTabParamList } from '../types';
import MarketplaceContent from '../components/MarketplaceContent';
import SwipeDownModal from '../components/SwipeDownModal';

const DEFAULT_URI = process.env.BASE_URL ? `${process.env.BASE_URL.replace(/\/$/, '')}/tori/haku.php` : undefined;

const Container = styled.View`
  flex: 1;
`;

const ErrorText = styled.Text`
  color: red;
`;

const SearchScreen: FC<StackScreenProps<BottomTabParamList, 'User'>> = ({ navigation }) => {
  if (!DEFAULT_URI) {
    return (
      <Container>
        <ErrorText>BASE_URL ei ole asetettu</ErrorText>
      </Container>
    );
  }

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

  const handleImageClosed = useCallback(() => {
    setImageUrl(undefined);
  }, []);

  return (
    <Container>
      <MarketplaceContent
        onLocationChange={handleLocationChange}
        uri={uri}
      />
      <SwipeDownModal visible={Boolean(imageUrl)} onClose={handleImageClosed}>
        <ImageViewer imageUrls={imageUrl ? [{ url: imageUrl }] : []} />
      </SwipeDownModal>
    </Container>
  );
}

export default SearchScreen;
