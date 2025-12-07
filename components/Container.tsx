import { cn } from "@/lib/utils";

const Container = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("max-w-[1920px] w-full xl:px-20 px-4 mx-auto", className)}>
      {children}
    </div>
  );
};

export default Container;
