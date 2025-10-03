import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MaintenanceConfig {
  enabled: boolean;
  message_en: string;
  message_fr: string;
  contact_email: string;
  show_logo: boolean;
}

export const useMaintenanceMode = () => {
  const [config, setConfig] = useState<MaintenanceConfig>({
    enabled: false,
    message_en: '',
    message_fr: '',
    contact_email: '',
    show_logo: true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings' as any)
          .select('setting_value')
          .eq('setting_key', 'maintenance_mode')
          .single();

        if (!error && data) {
          const settingData = data as unknown as { setting_value: MaintenanceConfig };
          if ('setting_value' in settingData) {
            setConfig(settingData.setting_value);
          }
        } else {
          console.warn('Maintenance config not found, using defaults');
        }
      } catch (error) {
        console.error('Failed to fetch maintenance config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();

    // Realtime subscription
    const channel = supabase
      .channel('site_settings_maintenance')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
          filter: 'setting_key=eq.maintenance_mode'
        },
        (payload) => {
          if (payload.new && 'setting_value' in payload.new) {
            setConfig(payload.new.setting_value as MaintenanceConfig);
          } else if (payload.eventType === 'DELETE') {
            // Row deleted, reset to defaults
            setConfig({
              enabled: false,
              message_en: '',
              message_fr: '',
              contact_email: '',
              show_logo: true
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { config, isLoading };
};
