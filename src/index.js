import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';

// Suppress ResizeObserver warning (clean fix for AntD, Swiper)
if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
    const observer = new ResizeObserver(() => {});
    observer.observe(document.body);
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <React.StrictMode>
            <PersistGate persistor={persistor}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PersistGate>
        </React.StrictMode>
    </Provider>
);
