/* @flow */

module.exports = {
  host: process.env.NODE_HOST || '0.0.0.0', // Define your host from 'package.json'
  port: process.env.PORT,
  app: {
    htmlAttributes: { lang: 'en' },
    title: 'demo',
    titleTemplate: 'demoB',
    meta: [
      {
        name: 'description',
        content: 'demo to B.'
      }
    ]
  }
};
