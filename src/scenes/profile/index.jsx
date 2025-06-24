import React, { useState, useRef } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Form, Input, Button, Avatar, Row, Col, message, Modal } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined, CameraOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/reset.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const Profile = ({apiUrl}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const userDetails = JSON.parse(sessionStorage.getItem('CrmDetails')) || {};
  const firstName = userDetails.firstname;
  const middleName = userDetails.middlename;
  const lastName = userDetails.lastname;
  const email = userDetails.email;
  const phoneNo = userDetails.mobile;
  const phonecode = userDetails.phonecode;
  const userGender = userDetails.extraind2;
  const country = userDetails.extraind3;
  const state = userDetails.extraind4;
  const city = userDetails.extraind5;
  const passwords = userDetails.passwords;
  const profileImageUrl = userDetails.imageUrl;

  const initialValues = {
    firstName: firstName || '',
    middleName: middleName || '',
    lastName: lastName || '',
    password: passwords || '',
    city: city || '',
    state: state || '',
    country: country || '',
    email: email || '',
    phonecode: phonecode || '',
    PhoneNo: phoneNo || '',
    gender: userGender || '',
  };

  const checkoutSchema = yup.object().shape({
    firstName: yup.string().required('Required'),
    middleName: yup.string(),
    lastName: yup.string().required('Required'),
    password: yup.string().required('Required'),
    city: yup.string().required('Required'),
    state: yup.string().required('Required'),
    country: yup.string().required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
    PhoneNo: yup
      .string()
      .matches(/^[0-9]+$/, 'Only numbers are allowed')
      .min(10, 'Must be at least 10 digits')
      .required('Required'),
    gender: yup.string().required('Required'),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const sessionData = JSON.parse(sessionStorage.getItem('CrmDetails'));
    const crmid = sessionData?.crmid || '';
    const passwords = values.password;
    const formData = new FormData();
    formData.append('crmid', crmid);;
    formData.append('passwords', passwords);
    // Add all other fields as needed
    formData.append('firstname', values.firstName);
    formData.append('lastname', values.lastName);
    // formData.append('city', values.city);
    // formData.append('state', values.state);
    // formData.append('country', values.country);
    formData.append('email', values.email);
    formData.append('PhoneNo', values.PhoneNo);
    formData.append('gender', values.gender);
    // Add photo if selected
    if (values.profileImageFile) {
      formData.append('crmProfileImageBySelf', values.profileImageFile);
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/UpdatecrmProfileDetailsByitsSelf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Profile updated successfully!');
      // Update sessionStorage with new imageUrl if present in response
      let updatedUserDetails = { ...sessionData, passwords  };
      if (response.data && response.data.imageUrl) {
        updatedUserDetails.imageUrl = response.data.imageUrl;
      }
      sessionStorage.setItem('CrmDetails', JSON.stringify(updatedUserDetails));
      setIsEditing(false);
    } catch (error) {
      message.error('Error submitting form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    if (!isEditing) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result);
        setCropModalVisible(true);
      };
      reader.readAsDataURL(file);
    }
  };

  function onImageLoad(e) {
    // Center crop logic, but width/height not used directly
    setCrop({
      unit: '%',
      x: 10,
      y: 10,
      width: 80,
      height: 80,
      aspect: 1,
    });
  }

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  // Accept Formik helpers as argument for crop save
  const handleCropImage = async (setFieldValue) => {
    if (!completedCrop || !imgRef.current) return;
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        // Set preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImage(reader.result);
        };
        reader.readAsDataURL(blob);
        // Set blob in Formik
        setFieldValue('profileImageFile', blob);
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  // Accept Formik helpers for crop save
  const handleSaveCroppedImage = async (setFieldValue) => {
    await handleCropImage(setFieldValue);
    setCropModalVisible(false);
  };

  // Ant Design theme colors (customize as needed)
  const cardStyle = {
    background: '#fff',
    borderRadius: 8,
    padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    margin: 16,
  };

  return (
    <div style={cardStyle}>
<Formik initialValues={initialValues} validationSchema={checkoutSchema} onSubmit={handleSubmit} enableReinitialize>
  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm }) => (
    <>
      <form onSubmit={handleSubmit}>
        <Row justify="center" style={{ marginBottom: 24 }}>
          <Col>
            <Avatar
              size={120}
              src={profileImage || profileImageUrl || 'https://via.placeholder.com/150'}
              style={{ border: '2px solid #1677ff', cursor: isEditing ? 'pointer' : 'default', opacity: isEditing ? 1 : 0.8 }}
              onClick={() => isEditing && fileInputRef.current?.click()}
              icon={<CameraOutlined />}
            />
            {isEditing && (
              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <Button
                  type="dashed"
                  icon={<CameraOutlined />}
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ borderRadius: 8 }}
                >
                  {profileImage ? 'Change Photo' : 'Add Photo'}
                </Button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
              disabled={!isEditing}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <h2 style={{ marginBottom: 24, textAlign: "center" }}>Profile Details</h2>
          </Col>
        </Row>
<Row gutter={16}>
  <Col xs={24} md={8}>
    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>ID</div>
    <Form.Item
      validateStatus={touched.crmId && errors.crmId ? 'error' : ''}
      help={touched.crmId && errors.crmId}
      style={{ marginBottom: 16 }}
    >
      <Input
        name="crmId"
        value={values.crmId || userDetails.crmid || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={true}
        size="large"
      />
    </Form.Item>
  </Col>
  <Col xs={24} md={8}>
    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>First Name</div>
    <Form.Item
      validateStatus={touched.firstName && errors.firstName ? 'error' : ''}
      help={touched.firstName && errors.firstName}
      style={{ marginBottom: 16 }}
    >
      <Input
        name="firstName"
        value={values.firstName}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={true}
        size="large"
      />
    </Form.Item>
  </Col>
  <Col xs={24} md={8}>
    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Last Name</div>
    <Form.Item
      validateStatus={touched.lastName && errors.lastName ? 'error' : ''}
      help={touched.lastName && errors.lastName}
      style={{ marginBottom: 16 }}
    >
      <Input
        name="lastName"
        value={values.lastName}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={true}
        size="large"
      />
    </Form.Item>
  </Col>
  <Col xs={24} md={8}>
    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Email</div>
    <Form.Item
      validateStatus={touched.email && errors.email ? 'error' : ''}
      help={touched.email && errors.email}
      style={{ marginBottom: 16 }}
    >
      <Input
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={true}
        size="large"
      />
    </Form.Item>
  </Col>
  <Col xs={24} md={8}>
    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Phone Number</div>
    <Form.Item
      validateStatus={touched.PhoneNo && errors.PhoneNo ? 'error' : ''}
      help={touched.PhoneNo && errors.PhoneNo}
      style={{ marginBottom: 16 }}
    >
      <Input
        name="PhoneNo"
        value={values.PhoneNo}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={true}
        size="large"
      />
    </Form.Item>
  </Col>
  <Col xs={24} md={8}>
    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Gender</div>
    <Form.Item
      validateStatus={touched.gender && errors.gender ? 'error' : ''}
      help={touched.gender && errors.gender}
      style={{ marginBottom: 16 }}
    >
      <Input
        name="gender"
        value={values.gender}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={true}
        size="large"
      />
    </Form.Item>
  </Col>
  <Col xs={24} md={8}>
    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Password</div>
    <Form.Item
      validateStatus={touched.password && errors.password ? 'error' : ''}
      help={touched.password && errors.password}
      style={{ marginBottom: 16 }}
    >
      <Input.Password
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={!isEditing}
        size="large"
      />
    </Form.Item>
  </Col>
</Row>
        <Row justify="end" gutter={16} style={{ marginTop: 24 }}>
          {isEditing && (
            <>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={isLoading}
                  size="large"
                  style={{ fontWeight: 'bold', borderRadius: 8, background: '#3e4396' }}
                >
                  Save
                </Button>
              </Col>
              <Col>
                <Button
                  htmlType="button"
                  type="default"
                  icon={<CloseOutlined />}
                  size="large"
                  style={{ marginLeft: 8, fontWeight: 'bold', borderRadius: 8, }}
                  onClick={() => {
                    setIsEditing(false);
                    resetForm();
                    setProfileImage(null);
                  }}
                >
                  Cancel
                </Button>
              </Col>
            </>
          )}
        </Row>
      </form>
      <Row justify="end" gutter={16} style={{ marginTop: 16 }}>
        {!isEditing && (
          <Col>
            <Button
              htmlType="button"
              icon={<EditOutlined />}
              size="large"
              style={{ background: '#3e4396', color: '#fff', fontWeight: 'bold', borderRadius: 8 }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          </Col>
        )}
      </Row>
      {/* Crop Modal */}
      <Modal
        open={cropModalVisible}
        title="Crop Profile Picture"
        onCancel={() => setCropModalVisible(false)}
        onOk={() => handleSaveCroppedImage(setFieldValue)}
        okText="Save Photo"
        cancelText="Cancel"
        width={400}
        styles={{ body: { height: 350 } }}
      >
        {originalImage && (
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={handleCropComplete}
            aspect={1}
            circularCrop
          >
            <img
              ref={imgRef}
              src={originalImage}
              onLoad={onImageLoad}
              style={{ maxHeight: '70vh', maxWidth: '100%' }}
              alt="Crop preview"
            />
          </ReactCrop>
        )}
      </Modal>
    </>
  )}
</Formik>
    </div>
  );
};

export default Profile;