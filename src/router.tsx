import { createBrowserRouter } from 'react-router-dom';
import Home from '@pages/home/Home';
import Work from '@pages/work/Work';
import InitData from '@pages/init-data/InitData';
import LaunchParams from '@pages/launch-params/LaunchParams';
import TonConnect from '@pages/ton-connect/TonConnect';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/work',
      element: <Work />,
    },
    {
      path: '/init-data',
      element: <InitData />,
    },
    {
      path: '/launch-params',
      element: <LaunchParams />,
    },
    {
      path: '/ton-connect',
      element: <TonConnect />,
    },
  ],
  {
    basename: '/driptech', // Based on your next.config.mjs basePath
  }
);
