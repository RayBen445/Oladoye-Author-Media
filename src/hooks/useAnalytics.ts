import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Only track page views when location changes
    const trackPageView = async () => {
      try {
        await supabase.from('analytics_events').insert([{
          event_type: 'page_view',
          path: location.pathname
        }]);
      } catch (e) {
        console.error('Failed to track page view:', e);
      }
    };
    trackPageView();
  }, [location.pathname]);

  const trackEvent = async (eventType: string, metadata: any = {}, resourceId?: string) => {
    try {
      await supabase.from('analytics_events').insert([{
        event_type: eventType,
        path: window.location.pathname,
        metadata,
        resource_id: resourceId
      }]);
    } catch (e) {
      console.error(`Failed to track ${eventType}:`, e);
    }
  };

  return { trackEvent };
}
