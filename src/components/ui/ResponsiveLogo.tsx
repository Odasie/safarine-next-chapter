import { useEffect, useState } from 'react';

interface ResponsiveLogoProps {
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export const ResponsiveLogo = ({ className = '', theme = 'light' }: ResponsiveLogoProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getLogoPath = () => {
    const base = '/images/branding/';
    const themePrefix = theme === 'dark' ? 'logo-dark' : 'logo-light';
    const mobileSuffix = isMobile ? '-mobile' : '';
    return `${base}${themePrefix}${mobileSuffix}.webp`;
  };

  const getAltText = () => {
    return isMobile ? 'Safarine Logo Mobile' : 'Safarine Logo';
  };

  return (
    <img
      src={getLogoPath()}
      alt={getAltText()}
      className={`h-auto ${className}`}
      fetchPriority="high"
      loading="eager"
    />
  );
};