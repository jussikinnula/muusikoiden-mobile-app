const RESET_TABLE_STYLES = `
body {
  padding: 5px;
}

table, thead, tbody, tfoot, tr, th, td {
  display: block;
  width: auto;
  height: auto;
  margin: 0;
  padding: 0;
  border: none;
  border-collapse: inherit;
  border-spacing: 0;
  border-color: inherit;
  vertical-align: inherit;
  text-align: left;
  font-weight: inherit;
  -webkit-border-horizontal-spacing: 0;
  -webkit-border-vertical-spacing: 0;
}
`;

export const SET_BODY_OPACITY_ZERO = `
  window.addEventListener('DOMContentLoaded',function () {
    document.body.style.opacity = '0';
  });
`;

const commonInjectedFunctions = `
  const INLINE_STYLE_ATTRIBUTES = [
    'align',
    'alink',
    'background',
    'bgcolor',
    'border',
    'cellpadding',
    'cellspacing',
    'clear',
    'color',
    'colspan',
    'face',
    'frame',
    'frameborder',
    'height',
    'hspace',
    'link',
    'marginheight',
    'marginwidth',
    'noshade',
    'nowrap',
    'rowspan',
    'scrolling',
    'style',
    'text',
    'valign',
    'vlink',
    'vspace',
    'width'
  ];

  const TABLE_TAG_NAMES = ['TABLE', 'TBODY', 'TR', 'TH', 'TD'];

  function addMetaViewport() {
    const meta = document.createElement('meta');
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
    meta.setAttribute('name', 'viewport');
    document.getElementsByTagName('head')[0].appendChild(meta);
  }

  function injectStyles(styles) {
    const css = document.createElement('style');
    css.type = 'text/css';
    css.appendChild(document.createTextNode(styles));
    document.getElementsByTagName('head')[0].appendChild(css);  
  }

  function removeInlineStylesFromElement(element) {
    const isHidden = element.style.display === 'none';
    INLINE_STYLE_ATTRIBUTES.forEach((attribute) => {
      element.removeAttribute(attribute);
    });

    if (isHidden) {
      element.style.display = 'none';
    }
  }

  function removeInlineStylesFromElements(elements) {
    for (let index = 0; index < elements.length; index += 1) {
      const element = elements[index];
      removeInlineStylesFromElement(element);
    }
  }

  function resetTableStyles() {
    injectStyles(\`${RESET_TABLE_STYLES}\`);
    const tagNames = ['TABLE', 'TBODY', 'TR', 'TH', 'TD'];
    TABLE_TAG_NAMES.forEach((tagName) => {
      const elements = document.getElementsByTagName(tagName);
      removeInlineStylesFromElements(elements);
    });
  }

  function sanitizeLink(link) {
    return link.replace(/^['"]/, '').replace(/['"]$/, '');
  }

  function getTopLevelContentTable() {
    const bodyChildren = document.body.children;
    for (let index = 0; index < bodyChildren.length; index += 1) {
      const element = bodyChildren[index];
      if (element.tagName === 'TABLE' && element.id !== 'cookie-table') {
        return element;
      }
    }
  }

  function hideElements(elements, match) {
    if (elements) {
      for (let index = 0; index < elements.length; index += 1) {
        const element = elements[index];
        if (match === undefined || index !== match) {
          element.style.display = 'none';
        }
      }
    }
  }

  function hideMainTableLayout(show = 'content') {
    return new Promise((resolve) => {
      const table = getTopLevelContentTable();
      const rows = table.firstElementChild.children;
      const contentRowIndex = rows.length - 2;
      hideElements(rows, contentRowIndex);

      const columns = rows[contentRowIndex].children;
      const mainContentTableRowIndex = 3;
      hideElements(columns, mainContentTableRowIndex);

      const mainContentNodes = columns[mainContentTableRowIndex].children;
      let beforeMainContent = mainContentNodes[0];
      let loggedIn = false;
      if (beforeMainContent.firstElementChild.firstElementChild.firstElementChild.classList.contains('quickmenu')) {
        beforeMainContent = mainContentNodes[1];
        if (show === 'menu') {
          mainContentNodes[0].style.display = 'none';
        } else {
          const quickMenuElements = document.getElementsByClassName('quickmenu_icon');
          hideElements(quickMenuElements);
        }
        loggedIn = true;
      }

      const preMainContentRows = beforeMainContent
        .firstElementChild
        .firstElementChild
        .firstElementChild
        .children;
      if (preMainContentRows[0].firstElementChild) {
        const mainContentRows = preMainContentRows[0].firstElementChild.children;
        const centerContentRowIndex = 1;
        hideElements(mainContentRows, centerContentRowIndex);

        const centerContentColumns = mainContentRows[centerContentRowIndex].children;
        const mainContentColumnIndex = 0;
        const menuColumnIndex = 3;
        let returnElement;
        for (let index = 0; index < columns.length; index += 1) {
          const centerContentColumn = centerContentColumns[index];
          if (show === 'content' && index === mainContentColumnIndex) {
            returnElement = centerContentColumn;
          } else if (show === 'menu' && index === menuColumnIndex) {
            returnElement = centerContentColumn;
          } else {
            centerContentColumn.style.display = 'none';
          }
        }
        resolve(returnElement);
      } else {
        resolve();
      }
    });
  }
`;

export default commonInjectedFunctions;
