import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components/native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import commonInjectedFunctions, { SET_BODY_OPACITY_ZERO } from '../utils/commonInjectedFunctions';

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const StyledWebView = styled(WebView)`
  flex: 1;
`;

const INJECTED_STYLES = `
`;

const INJECTED_JAVASCRIPT = `
  ${commonInjectedFunctions}

  function handleLocationChange(event) {
    if (event.target.tagName === 'A' && event.target.href) {
      event.preventDefault();
      const url = sanitizeLink(event.target.href);
      window.ReactNativeWebView.postMessage(url);
    } else if (
      event.target.tagName === 'IMG'
      && event.target.parentElement.tagName === 'A'
      && event.target.parentElement.href
    ) {
      event.preventDefault();
      const url = sanitizeLink(event.target.parentElement.href);
      window.ReactNativeWebView.postMessage(url);
    }
  }

  document.addEventListener('click', handleLocationChange, false);
  document.body.style.transition = 'opacity 0.3s ease-out';

  addMetaViewport();
  resetTableStyles();
  injectStyles(\`${INJECTED_STYLES}\`);

  hideMainTableLayout('content').then(() => {
    setTimeout(() => {
      document.body.style.opacity = '1';
      window.scrollTo(0, 0);
    }, 1000);
  });
`;

interface MarketplaceContentProps {
  onLocationChange: (url: string) => void;
  uri: string;
}

const MarketplaceContent: FC<MarketplaceContentProps> = ({ onLocationChange, uri }) => {
  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    onLocationChange(event.nativeEvent.data);
  }, [onLocationChange]);

  return (
    <Container>
      <StyledWebView
        source={{ uri }}
        onMessage={handleMessage}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        injectedJavaScriptBeforeContentLoaded={SET_BODY_OPACITY_ZERO}
      />
    </Container>
  );
};

export default MarketplaceContent;
