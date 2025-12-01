import logo1 from '../../../public/assets/logo1.svg';
import logo2 from '../../../public/assets/logo2.svg';
import Image from 'next/image';

type Props = {
  title: string;
  label: string;
  incorrectPasswordMessage?: string | null;
};

const CardWrapperHeader = ({
  title,
  label,
  incorrectPasswordMessage
}: Props) => {
  return (
    <div className="w-full inline-block space-y-8">
      <div className="mx-auto h-auto flex flex-col justify-center items-center gap-3">
        <Image
          src={logo1}
          alt="logo"
          priority
          quality={100}
          height={30}
          width={30}
        />
        <Image src={logo2} alt="logo" priority quality={100} />
      </div>
      {incorrectPasswordMessage && (
        <p className="text-sm w-full text-center text-red-500">
          {incorrectPasswordMessage}
        </p>
      )}
      <div className="space-y-1 text-start">
        <h2 className="">{title}</h2>
        <p className="text-xs 2xl:text-sm opacity-40">{label}</p>
      </div>
    </div>
  );
};

export default CardWrapperHeader;
