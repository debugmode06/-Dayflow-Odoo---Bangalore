import React from 'react';
import AuthLayout from '../components/AuthLayout';
import SignupForm from '../components/SignupForm';

export const SignupPage = () => {
  return (
    <AuthLayout title="Create an account" subtitle="Join OdooSphere as an employee">
      <SignupForm />
    </AuthLayout>
  );
};

export default SignupPage;
