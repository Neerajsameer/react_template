import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import RoutePathComponent from './RoutePathComponent';
import store from './store';
import './framework/styles/index.scss';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

function App() {
  return (

    <MantineProvider withNormalizeCSS withGlobalStyles theme={{
      fontFamily: "Mulish",
      primaryColor: "red",
    }}>
      <NotificationsProvider position='bottom-center'>
        <Provider store={store}>
          <BrowserRouter>
            <RoutePathComponent />
          </BrowserRouter>
        </Provider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
