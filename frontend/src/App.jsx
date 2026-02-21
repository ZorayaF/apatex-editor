import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Now these imports actually find a file!
import HomePage from '@pages/HomePage';
import EditorPage from '@pages/EditorPage';
import LabPage from '@pages/LabPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/lab" element={<LabPage />} />
      </Routes>
    </Router>
  );
};

export default App;
