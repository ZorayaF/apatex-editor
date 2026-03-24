import "@mantine/core/styles.css";

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

import HomePage from "@pages/HomePage";
import EditorPage from "@pages/EditorPage";

const App = () => {
  return (
    <MantineProvider defaultColorScheme="light">
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
