// src/App.jsx
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import HomePage from "@pages/HomePage";
import EditorPage from "@pages/EditorPage";

const App = () => {
  return (
    <MantineProvider defaultColorScheme="light">
      <Notifications position="top-right" zIndex={1000} />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
};

export default App;
