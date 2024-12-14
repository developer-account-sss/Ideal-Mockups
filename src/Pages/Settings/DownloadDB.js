import React from 'react';
import config from '../../config';

const DownloadDB = () => {
    const downloadFile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.baseURL}/download/database`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
            });

            const blob = await response.blob();

            // Create a temporary URL
            const url = window.URL.createObjectURL(new Blob([blob]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'database.db');

            document.body.appendChild(link);

            link.click();

            // Clean up
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div>
            <button onClick={downloadFile}>Download Database Backup</button>
        </div>
    );
};

export default DownloadDB;
