
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SettingsPanel, { UserSettings } from '@/components/settings/SettingsPanel';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();

  const handleSettingsChange = (settings: UserSettings) => {
    // In a real app, this would save to local storage or a backend
    console.log('Settings updated:', settings);
    
    // Example of calculating tax based on region
    const taxRate = getTaxRateForRegion(settings.region);
    console.log(`Tax rate for ${settings.region}: ${taxRate}%`);
  };
  
  // Helper function to get tax rate based on region
  const getTaxRateForRegion = (region: string): number => {
    const taxRates: Record<string, number> = {
      'us': 7.25,
      'eu': 21,
      'uk': 20,
      'ca': 13,
      'au': 10,
      'jp': 10,
      'in': 18,
      'cn': 13,
      'br': 17,
      'mx': 16,
    };
    
    return taxRates[region] || 0;
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
          <SettingsPanel onSettingsChange={handleSettingsChange} />
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
