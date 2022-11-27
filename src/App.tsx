import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import RoutePathComponent from "./RoutePathComponent";
import store from "./store";
import "./framework/styles/index.scss";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import "antd/dist/antd.css";

function App() {
  return (
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={{
        fontFamily: "Mulish",
        primaryColor: "orange",
        components: {
          Modal: {
            styles: {
              title: { fontWeight: "bold" },
            },
          },
        },
      }}
    >
      <ModalsProvider>
        <NotificationsProvider position="bottom-center">
          <Provider store={store}>
            <BrowserRouter>
              <RoutePathComponent />
            </BrowserRouter>
          </Provider>
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
