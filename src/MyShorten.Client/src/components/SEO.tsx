import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  description?: string;
  name?: string;
}

export const SEO = ({
  title = 'My Shorten',
  description = 'URL shortener app',
  name = 'J.Meira',
}: Props) => (
  <Helmet>
    <title>{title}</title>
    <meta name='description' content={description} />
    <meta property='og:title' content={title} />
    <meta property='og:description' content={description} />
    <meta name='twitter:creator' content={name} />
    <meta name='twitter:title' content={title} />
    <meta name='twitter:description' content={description} />
  </Helmet>
);
