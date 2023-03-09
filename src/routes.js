import App from './app';

export default [
  {
    component: App,
    path: '/',
    routes: [
      {
        path: '/b',
        exact: true,
        component: App, // Add your route here
        loadData: () => [
          // Add other pre-fetched actions here
        ],
      },
    ],
  },
];
