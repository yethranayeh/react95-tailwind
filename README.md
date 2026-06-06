<h1 align="center">React95 Tailwind</h1>

<p align="center">
  <a href="https://github.com/yethranayeh/react95-tailwind/actions/workflows/ci.yml"><img src="https://github.com/yethranayeh/react95-tailwind/actions/workflows/ci.yml/badge.svg" alt="CI status" /></a>
  <a href="https://github.com/yethranayeh/react95-tailwind/actions/workflows/release.yml"><img src="https://github.com/yethranayeh/react95-tailwind/actions/workflows/release.yml/badge.svg" alt="release status" /></a>
</p>

> [!IMPORTANT]
> This is a **Tailwind CSS migration fork** of the original [React95](https://github.com/react95-io/react95) library.
> It was mainly implemented by **Jules from Google** as a way to test his capabilities as an AI software engineer.

<p align="center">
  <b>Refreshed</b> Windows95 UI components for your modern React apps. <br /> Rebuilt with Tailwind CSS 🚀</p>

![hero](https://user-images.githubusercontent.com/28541613/81947711-28b05580-9601-11ea-964a-c3a6de998496.png)

## Getting Started

First, install the component library:

```sh
npm install react95-tailwind
```

Import the CSS file, wrap your app with `ThemeProvider`... and you are ready to go! 🚀

```jsx
import React from 'react';
import { MenuList, MenuListItem, Separator, ThemeProvider } from 'react95-tailwind';

// Import the library's CSS
import 'react95-tailwind/dist/index.css';

const App = () => (
  <ThemeProvider theme='original'>
    <MenuList>
      <MenuListItem>🎤 Sing</MenuListItem>
      <MenuListItem>💃🏻 Dance</MenuListItem>
      <Separator />
      <MenuListItem disabled>😴 Sleep</MenuListItem>
    </MenuList>
  </ThemeProvider>
);

export default App;
```


