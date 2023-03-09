import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { pathToRegexp } from 'path-to-regexp';
import { Typography } from 'antd';
import 'antd/dist/antd.css';
const { Text } = Typography;
const App = () => {
  return (
    <>
      <Text>Ant Design</Text>
      <br />
      <Text>这是一个demo</Text>
    </>
  );
};
export default hot(module)(App);
