
import Image from 'next/image';

type LogoProps = {
    variant?: 'icon' | 'full' | 'white';
    className?: string;
};

export function Logo({ variant = 'icon', className }: LogoProps) {
  let src;
  let width;
  let height;

  switch (variant) {
    case 'full':
      src = '/logo-full.svg';
      width = 120;
      height = 32;
      break;
    case 'white':
        src = '/logo-white.svg';
        width = 120;
        height = 32;
        break;
    case 'icon':
    default:
      src = '/logo-icon.svg';
      width = 40;
      height = 40;
      break;
  }

  return (
    <Image
      src={src}
      alt="Fashionary Logo"
      width={width}
      height={height}
      className={className}
    />
  );
}
