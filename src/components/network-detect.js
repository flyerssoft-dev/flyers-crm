import { Modal } from 'antd';
import React, { useState, useEffect } from 'react'

const NetworkDetect = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
      // Update network status
      const handleStatusChange = () => {
        setIsOnline(navigator.onLine);
      };
  
      // Listen to the online status
      window.addEventListener('online', handleStatusChange);
  
      // Listen to the offline status
      window.addEventListener('offline', handleStatusChange);
  
      // Specify how to clean up after this effect for performance improvment
      return () => {
        window.removeEventListener('online', handleStatusChange);
        window.removeEventListener('offline', handleStatusChange);
      };
    }, [isOnline]);

    // if(isOnline) return null

    return (
        <Modal centered open={!isOnline} title="Offline Notice" closable={false} footer={null}>
            Please connect with network to continue...
        </Modal>
    )
}

export default NetworkDetect