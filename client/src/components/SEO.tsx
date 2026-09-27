import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  image?: string;
}

export const SEO = ({ 
  title = 'InternAtlas - Professional Opportunities Platform', 
  description = 'Find internships, jobs, hackathons, and scholarships all in one place.',
  type = 'website',
  url = 'https://internatlas.com',
  image = 'https://internatlas.com/og-image.jpg'
}: SEOProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
