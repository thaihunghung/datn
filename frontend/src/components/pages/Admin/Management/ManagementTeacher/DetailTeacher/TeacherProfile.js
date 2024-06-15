import React, { useState, useEffect } from 'react';
import { Button, Input, Avatar } from '@nextui-org/react';
import { axiosAdmin } from '../../../../../../service/AxiosAdmin';
import { useParams } from 'react-router-dom';
import { storage } from '../../../../../../service/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const TeacherProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    teacherCode: '',
    email: '',
    permission: '',
    typeTeacher: '',
    imgURL: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosAdmin.get(`teacher/${id}`);
        const data = response.data;
        setProfile({
          name: data.name,
          teacherCode: data.teacherCode,
          email: data.email,
          permission: data.permission,
          typeTeacher: data.typeTeacher,
          imgURL: data.imgURL
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axiosAdmin.put(`teacher/${id}`, profile);
      setIsEditing(false);
      console.log('Profile saved', profile);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    console.log('Profile edit cancelled');
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("ffff")
      const storageRef = ref(storage, `avatars/${id}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setProfile({ ...profile, imgURL: downloadURL });
        await axiosAdmin.put(`/teacher`, { imgURL: downloadURL });
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold">My Profile</h3>
      </div>
      <div className="text-center mb-6">
        <Avatar 
          showFallback 
          src={profile.imgURL || 'https://images.unsplash.com/broken'} 
          fallback={<i className="fa-solid fa-arrow-up-from-bracket"></i>} 
          className="w-24 h-24 mx-auto"
        />
        {isEditing && (
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarChange} 
            className="mt-4"
          />
        )}
        {!isEditing && (
          <Button icon={<i className="fas fa-edit"></i>} onClick={() => setIsEditing(true)} className="mt-4">Edit</Button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <Input 
          label="NAME" 
          name="name" 
          value={profile.name} 
          onChange={handleChange} 
          fullWidth 
          disabled={!isEditing}
          className="w-full"
        />
        <Input 
          label="TEACHER CODE" 
          name="teacherCode" 
          value={profile.teacherCode} 
          onChange={handleChange} 
          fullWidth 
          disabled={!isEditing}
          className="w-full"
        />
        <Input 
          label="EMAIL" 
          name="email" 
          value={profile.email} 
          onChange={handleChange} 
          fullWidth 
          disabled={!isEditing}
          className="w-full"
        />
        <Input 
          label="PERMISSION" 
          name="permission" 
          value={profile.permission} 
          onChange={handleChange} 
          fullWidth 
          disabled={!isEditing}
          className="w-full"
        />
        <Input 
          label="TYPE TEACHER" 
          name="typeTeacher" 
          value={profile.typeTeacher} 
          onChange={handleChange} 
          fullWidth 
          disabled={!isEditing}
          className="w-full"
        />
        {isEditing && (
          <div className="flex gap-4 justify-center mt-6">
            <Button onClick={handleSave} className="bg-blue-500">Save</Button>
            <Button onClick={handleCancel} className="bg-red-500">Cancel</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;
