import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
};

const CardWrapper = ({ title, children }: Props) => {
  return (
    <Card
      title={title}
      className="bg-[#FAF6EF] w-full max-w-6xl shadow-custom border-none"
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CardWrapper;
