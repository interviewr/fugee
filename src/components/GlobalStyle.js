import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @font-face {
      font-family: 'Open Sans';
      font-style: normal;
      font-weight: 300;
      src: url(${require('../assets/fonts/OpenSans/OpenSans-Light.ttf')}) format('truetype');
    }

    @font-face {
      font-family: 'Open Sans';
      font-style: normal;
      font-weight: 400;
      src: url(${require('../assets/fonts/OpenSans/OpenSans-Regular.ttf')}) format('truetype');
    }

    @font-face {
      font-family: 'Open Sans';
      font-style: normal;
      font-weight: 700;
      src: url(${require('../assets/fonts/OpenSans/OpenSans-Bold.ttf')}) format('truetype');
    }

    body {
      font-family: "Open Sans", sans-serif;
      font-size: 13px;
      font-weight: 400;
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    *,
    *:before,
    *:after {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }
`

export default GlobalStyle
