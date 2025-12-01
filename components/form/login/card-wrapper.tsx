import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';
import CardWrapperHeader from './card-wrapper-header';

type Props = {
  title: string;
  label: string;
  incorrectPasswordMessage?: string | null;
  backButtonHref?: string;
  backButtonLabel?: string;
  children: React.ReactNode;
};

const CardWrapper = ({
  title,
  label,
  incorrectPasswordMessage,
  backButtonHref,
  backButtonLabel,
  children
}: Props) => {
  return (
    <Card className="border-none bg-offWhite shadow-none w-full lg:w-[80%] xl:w-[60%]">
      <CardHeader>
        <CardWrapperHeader
          title={title}
          label={label}
          incorrectPasswordMessage={incorrectPasswordMessage}
        />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CardWrapper;
