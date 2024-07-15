import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes/index';
import { Provider } from 'react-redux';
import store from './store/store';

function App() {
    return (
        <React.StrictMode>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </React.StrictMode>
    );
}

export default App;
