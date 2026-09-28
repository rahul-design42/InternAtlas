
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const Image = ({ src, alt, className, ...props }: any) => {
  const imgSrc = typeof src === 'object' ? src.src : src;
  return <img src={imgSrc} alt={alt} className={className} {...props} />;
};

export const Link = ({ href, children, className, ...props }: any) => {
  return <RouterLink to={href || '#'} className={className} {...props}>{children}</RouterLink>;
};

import { useNavigate } from 'react-router-dom';
export const useRouter = () => {
  const navigate = useNavigate();
  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1)
  };
};
