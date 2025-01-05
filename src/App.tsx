import { RouterProvider } from 'react-router-dom';
import { Root } from './components/Root/Root';
import { router } from './router';

function App() {
  return (
    <Root>
      <RouterProvider router={router} />
    </Root>
  );
}

export default App;
