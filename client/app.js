import React from 'react';
import Header from './header';
import Footer from './footer';
import Routes from './routes';

const App = () => {
  return (
    <div id="main">
      <Header />
      <Routes />
      <Footer />
    </div>
  );
};

export default App;
