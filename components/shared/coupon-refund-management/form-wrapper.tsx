import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
};

const FormWrapper = ({ title, children }: Props) => {
  return (
    <Card title={title} className="bg-[#FAF6EF] border-none">
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default FormWrapper;
