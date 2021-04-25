# Muusikoiden.net mobile app

This is prototype mobile browser, which transforms [Muusikoiden.net](https://muusikoiden.net/) into a fully fledged mobile application.

The mobile application doesn't save or send the information anywhere, everything happens inside the mobile application. All pages are viewed inside WebView components, with injecting JavaScript which transforms the legacy table-folded HTML structure into modern flex/block layout, which nicely works on mobile devices.

## Architecture

Each section hides unrelevant information from the page. For example in [MarketplaceScreen](./screens/MarketplaceScreen.tsx), component responsible on rendering the center, [MarketplaceContent](./components/MarketplaceContent.tsx), hides top header, left menu and product categories. When pressing hamburger button top right, [MarketplaceMenu](./components/MarketplaceMenu.tsx) pops from bottom - which displays a page which has everything but product categories hidden.

Each WebView also hijack links by placing document level listener or target specific links. This is done so that for example links to images can be rendered with with zoomable/pannable [react-native-image-zoom-viewer](https://www.npmjs.com/package/react-native-image-zoom-viewer) image viewer component. Hijacked links are targeted into main content WebView, for example links hijacked in menu open in main content WebView instead.

Common parts of the hiding is implemented in [commonInjectedFunctions](./utils/commonInjectedFunctions.js) part, which is shared in all WebView -pages components.

## Technology

The mobile app has been developed with [Expo](https://expo.io/), however, it's mainly a regular [React Native](https://reactnative.dev/) application (no Expo-specific things used, however converting would need to dismantle Expo of course).

## License

The application is [licensed](./LICENSE) under [MIT license](https://en.wikipedia.org/wiki/MIT_License).