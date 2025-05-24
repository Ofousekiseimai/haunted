import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize([
    {
      trackingId: 'G-FXJ30XVLMD',
    }
  ]);
  
  // Optional: Set debug mode for development
  if (import.meta.env.DEV) {
    ReactGA.gtag('set', 'debug_mode', true);
  }
};

export const trackPageView = (path) => {
  ReactGA.send({
    hitType: 'pageview',
    page: path,
  });
};

export const trackEvent = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label
  });
};