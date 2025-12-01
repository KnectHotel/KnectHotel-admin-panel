interface HeadingProps {
    title?: string;
    description?: string;
    className?: string;
  }
  
  export const Heading: React.FC<HeadingProps> = ({ title, description, className }) => {
    return (
      <div>
        <h2 className={`text-lg md:text-3xl my-4 md:my-6 font-bold tracking-tight text-[#281f0fcc] ${className}`}>{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    );
  };
  