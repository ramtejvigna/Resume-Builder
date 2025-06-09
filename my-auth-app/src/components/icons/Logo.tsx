import { Briefcase } from 'lucide-react';

interface LogoProps {
  size?: number;
  iconSize?: number;
  textSize?: string;
  color?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export default function Logo({ 
  iconSize = 8, 
  textSize = "text-2xl",
  color = "text-primary",
  orientation = 'horizontal',
  className = ""
}: LogoProps) {
  return (
    <div className={`flex items-center ${orientation === 'horizontal' ? 'space-x-2' : 'flex-col space-y-1'} ${className}`}>
      <Briefcase className={`h-${iconSize} w-${iconSize} ${color}`} />
      <span className={`font-headline font-bold ${textSize} ${color}`}>
        ResumeFlow
      </span>
    </div>
  );
}
