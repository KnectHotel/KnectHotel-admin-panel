import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
};

const FormWrapper = ({ title, children }: Props) => {
  return (
    <Card title={title}>
      <CardHeader>
        <Heading title={title} className='md:mb-0'/>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default FormWrapper;
