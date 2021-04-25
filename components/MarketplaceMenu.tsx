import React, { FC, useCallback, useEffect, useState } from 'react';
import { Dimensions, Modal } from 'react-native';
import styled from 'styled-components/native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import commonInjectedFunctions, { SET_BODY_OPACITY_ZERO } from '../utils/commonInjectedFunctions';

const MARGIN_TOP = 50;

const StyledWebView = styled(WebView)`
  flex: 1;
  margin-top: ${MARGIN_TOP}px;
`;

const INJECTED_STYLES = `
a {
  padding: 10px;
  border-bottom: initial;
}

select {
  font-size: 15px;
  width: 100% !important;
  display: block;
}

.custom-menu-item {
  display: block;
  width: 100%;
  font-size: 15px;
  padding: 15px;
  margin-right: 30px;
}

.custom-menu-item-count {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 15px;
}
`;

const INJECTED_JAVASCRIPT = `
  ${commonInjectedFunctions}

  function handleLocationChange(event) {
    if (event.target.tagName === 'A' && event.target.href) {
      event.preventDefault();
      const url = sanitizeLink(event.target.href);
      window.ReactNativeWebView.postMessage(url);
    }
  }

  function hideSubMenuToggles(element) {
    return new Promise((resolve) => {
      if (element) {
        let table;
        for (let index = 0; index < element.children.length; index += 1) {
          const child = element.children[index];
          if (child.tagName === 'H2') {
            child.style.display = 'none';
          } else if (!table && child.tagName === 'TABLE') {
            table = child;
          } else if (table) {
            child.style.display = 'none';
          }
        }

        if (table) {
          const rows = table.firstElementChild.children;
          for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
            const row = rows[rowIndex];
            if (rowIndex === 0) {
              row.style.display = 'none';
            } else if (row.classList.contains('hl') && row.children[1].firstElementChild.tagName === 'A') {
              row.classList.remove('bg2');
              row.style.position = 'relative';
              const columns = row.children;
              for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
                const column = columns[columnIndex];
                if (columnIndex === 0) {
                  column.style.display = 'none';
                } else if (columnIndex === 1) {
                  column.firstElementChild.classList.add('custom-menu-item');
                } else if (columnIndex === 2) {
                  column.classList.add('custom-menu-item-count');
                }
              }
            }
          }
        }
      }

      resolve();
    });
  }

  document.addEventListener('click', handleLocationChange, false);
  document.body.style.transition = 'opacity 0.3s ease-out';

  addMetaViewport();
  resetTableStyles();
  injectStyles(\`${INJECTED_STYLES}\`);

  hideMainTableLayout('menu')
    .then((element) => hideSubMenuToggles(element))
    .then(() => {
      setTimeout(() => {
        document.body.style.opacity = '1';
      });
    });
`;

const INJECTED_JAVASCRIPT_BEFORE_CONTENT_LOADED = `
  document.body.style.opacity = '0';
`;

interface MarketplaceMenuProps {
  onLocationChange: (url: string) => void;
  onMenuClosed: () => void;
  opened: boolean;
  uri: string;
}

const MarketplaceMenu: FC<MarketplaceMenuProps> = ({ onLocationChange, onMenuClosed, opened, uri }) => {
  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    onLocationChange(event.nativeEvent.data);
    onMenuClosed();
  }, [onLocationChange, onMenuClosed]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={opened}
    >
      <StyledWebView
        source={{ uri }}
        onMessage={handleMessage}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        injectedJavaScriptBeforeContentLoaded={SET_BODY_OPACITY_ZERO}
      />
    </Modal>
  );
};

export default MarketplaceMenu;
