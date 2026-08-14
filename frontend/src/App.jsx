// src/App.jsx
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import "./features/editor/styles/variables.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";

const App = () => {
  return (
    <MantineProvider defaultColorScheme="light">
      {/* Notificaciones compactas: abajo a la derecha, sin apilarse y de cierre rápido */}
      <Notifications
        position="bottom-left"
        zIndex={1000}
        autoClose={1800}
        limit={1}
        containerWidth={300}
      />
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
