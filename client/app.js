import React, { useState } from 'react';
import axios from 'axios';
import socket from './index.js';

import Welcome from './components/welcome.js';

const App = () => {
  return (
    <div>
      <Welcome />
    </div>
  );
};

export default App;
