import React from 'react';
import styles from './styles/App.module.scss';
import { RouterProvider } from 'react-router-dom';
import router from './routes/index';

function App() {
  return (
    <div className={styles.test}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
