import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import defaultAvatar from '../../assets/Images/image.png';
import './Profile.css';
import { useUser } from '../../context/UserContext';
import { authService } from '../../services/api';

const Profile = () => {
  const { user, setUser, loading } = useUser();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  let initialImage = (typeof user?.image === 'string' ? user.image : user?.image?.url) || defaultAvatar;
  if (initialImage && initialImage.startsWith('/uploads')) {
    initialImage = API_URL.replace('/api', '') + initialImage;
  }
  const [preview, setPreview] = useState(initialImage);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    image: null,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phoneNumber: Yup.string(),
    // Email is not editable
  });

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue('image', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const formData = new FormData();
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('phoneNumber', values.phoneNumber);
      if (values.image) {
        formData.append('image', values.image);
      }
      const response = await authService.updateProfile(formData);
      if (response.status === 'success') {
        setUser(response.data.user);
        // Update preview to new image from backend
        let newImage = (typeof response.data.user.image === 'string'
          ? response.data.user.image
          : response.data.user.image?.url) || defaultAvatar;
        if (newImage && newImage.startsWith('/uploads')) {
          newImage = API_URL.replace('/api', '') + newImage;
        }
        setPreview(newImage);
        setStatus({ success: 'Profile updated successfully!' });
      } else {
        setStatus({ error: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      setStatus({ error: error?.message || 'Failed to update profile' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sx-profile-container">
      <h2>My Profile</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, isSubmitting, status }) => (
          <Form className="sx-profile-form">
            <div className="sx-profile-avatar-section">
              <img src={preview} alt="Profile" className="sx-profile-avatar" />
              <label className="sx-profile-upload-btn">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleImageChange(e, setFieldValue)}
                />
              </label>
            </div>
            <div className="sx-profile-fields">
              <label>First Name</label>
              <Field name="firstName" type="text" />
              <ErrorMessage name="firstName" component="div" className="sx-profile-error" />

              <label>Last Name</label>
              <Field name="lastName" type="text" />
              <ErrorMessage name="lastName" component="div" className="sx-profile-error" />

              <label>Email</label>
              <Field name="email" type="email" disabled />

              <label>Phone Number</label>
              <Field name="phoneNumber" type="text" />
              <ErrorMessage name="phoneNumber" component="div" className="sx-profile-error" />
            </div>
            <button type="submit" disabled={isSubmitting || loading} className="sx-profile-save-btn">
              {isSubmitting || loading ? 'Saving...' : 'Save Changes'}
            </button>
            {status && status.success && <div className="sx-profile-success">{status.success}</div>}
            {status && status.error && <div className="sx-profile-error">{status.error}</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Profile; 