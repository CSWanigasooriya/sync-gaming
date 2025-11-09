import { useEffect } from 'react';
import './AdBanner.css';

export default function AdBanner({ position = 'bottom', adType = 'banner' }) {
  useEffect(() => {
    // Load Google AdSense or your ad network
    if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
      try {
        window.adsbygoogle.push({});
      } catch (error) {
        console.error('Ad loading error:', error);
      }
    }
  }, []);

  // In development, show placeholder
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`ad-banner ad-banner-${position} ad-placeholder`}>
        <div className="ad-placeholder-content">
          📺 Advertisement Placeholder ({adType})
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-banner ad-banner-${position}`}>
      {adType === 'banner' && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={process.env.REACT_APP_ADSENSE_CLIENT_ID}
          data-ad-slot={process.env.REACT_APP_ADSENSE_SLOT_BANNER}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        ></ins>
      )}

      {adType === 'interstitial' && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={process.env.REACT_APP_ADSENSE_CLIENT_ID}
          data-ad-slot={process.env.REACT_APP_ADSENSE_SLOT_INTERSTITIAL}
        ></ins>
      )}
    </div>
  );
}
