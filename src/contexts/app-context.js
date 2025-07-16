import React, { useState, useContext } from 'react';

// Define the context
const AppContext = React.createContext({});

const AppContextProvider = ({ children }) => {
    // New appConfig state to manage configurations like 'showOutstanding' and 'showSecondInvoice'
    const [appConfigs, setAppConfigs] = useState({
        showOutstanding: true,
        showSecondInvoice: true,
    });

    // Function to update app configurations (like showOutstanding, showSecondInvoice)
    const handleAppConfigChange = (configName, value) => {
        setAppConfigs((prevConfigs) => ({
            ...prevConfigs,
            [configName]: value,
        }));
    };

    return (
        <AppContext.Provider
            value={{
                appConfigs, // Provide appConfigs to the context consumers
                handleAppConfigChange, // Provide the config change handler
            }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to access the context
const useAppContext = () => {
    return useContext(AppContext);
};

export { AppContextProvider, useAppContext };
