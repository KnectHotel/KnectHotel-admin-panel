import ResetPasswordForm from '@/components/form/login/reset-password-form';
import Image from 'next/image';
import React from 'react';
import loginPageImage from '../../../../../public/assets/loginPageImage.png';

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen w-full flex relative">
      {/* left part Image */}
      <div className="hidden lg:block w-[60%]">
        <Image
          src={loginPageImage}
          alt="Login Page Image"
          width={1000}
          className="h-screen object-cover"
          priority
          quality={100}
        />
      </div>
      {/* Right part form */}
      <div className="w-full relative overflow-hidden login-background flex justify-center items-center">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
