import Image from 'next/image';
import React from 'react';
import loginPageImage from '../../../../public/assets/loginPageImage.png';
import LoginForm from '@/components/form/login/login-form';

const LoginPage = () => {
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
      <div className=" w-full login-background flex justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
