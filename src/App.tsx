import React from 'react';
import logo from './logo.svg';
import './App.css';
import { PushNotification } from './components/push-notification';
import { Provider } from 'react-redux';
import { store } from './store';
import { PushAuthWithHook } from './components/push-auth-with-hook';
import { Divider } from '@mui/material';

function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );

  return (
    <div>
      <Provider store={store}>
        <PushNotification />
        <Divider orientation='horizontal' sx={{ margin: '10px' }} />
        <PushAuthWithHook />
      </Provider>
    </div>
  );
}

export default App;
