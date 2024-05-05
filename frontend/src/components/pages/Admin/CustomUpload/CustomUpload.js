import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';

const CustomUpload = ({ endpoint, setCurrent, fileList, setFileList}) => {
  
  const [uploading, setUploading] = useState(false);
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });
    console.log(fileList);
    console.log(formData);
    setUploading(true);
    // You can use any AJAX library you like
    fetch(`http://localhost:1509/api/admin/csv-save/${endpoint}`, {
      method: 'POST',
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.error) {
          message.error(data.error);

          message.error(data.detail);
          
        } else {
          setFileList([]);
          message.success(data.message);
          setCurrent(2)
        }
        
      })
      .catch(() => {
        message.error('Upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
};


    return (
        <div className='text-xl w-full flex flex-col items-center'>
                
                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    className='w-full p-5 flex justify-center items-center rounded-lg'
                >
                    <span className='w-full'>{uploading ? 'Uploading' : 'Start Upload'}</span>
                </Button>
        </div>
    )
}

export default CustomUpload;
