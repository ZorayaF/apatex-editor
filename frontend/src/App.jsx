import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; // Importante para Mantine v8
import { useDocStore } from './store/useDocStore';
import { Home } from './features/home/Home.jsx';
import { Editor } from './features/editor/Editor';

export default function App() {
  const currentPage = useDocStore((state) => state.currentPage);

  return (
    <MantineProvider>
      {currentPage === 'home' ? <Home /> : <Editor />}
    </MantineProvider>
  );
}
