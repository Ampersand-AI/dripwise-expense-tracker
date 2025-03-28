
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { GlobeIcon, CoinsIcon, BellIcon, EyeIcon } from 'lucide-react';

interface SettingsPanelProps {
  onSettingsChange?: (settings: UserSettings) => void;
}

export interface UserSettings {
  currency: string;
  region: string;
  notifications: boolean;
  darkMode: boolean;
}

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
  { value: 'AUD', label: 'Australian Dollar (A$)' },
  { value: 'INR', label: 'Indian Rupee (₹)' },
  { value: 'CNY', label: 'Chinese Yuan (¥)' },
  { value: 'BRL', label: 'Brazilian Real (R$)' },
  { value: 'MXN', label: 'Mexican Peso (Mex$)' },
];

const regions = [
  { value: 'us', label: 'United States' },
  { value: 'eu', label: 'European Union' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'jp', label: 'Japan' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'in', label: 'India' },
  { value: 'cn', label: 'China' },
  { value: 'br', label: 'Brazil' },
  { value: 'mx', label: 'Mexico' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<UserSettings>({
    currency: 'USD',
    region: 'us',
    notifications: true,
    darkMode: false,
  });
  const { toast } = useToast();

  const handleSettingChange = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
    
    toast({
      title: "Settings updated",
      description: `Your ${key} preference has been saved.`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Account Settings</CardTitle>
        <CardDescription>
          Customize your experience and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="font-medium flex items-center gap-2">
            <GlobeIcon className="h-4 w-4" />
            <span>Regional Settings</span>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={settings.currency} 
                onValueChange={(value) => handleSettingChange('currency', value)}
              >
                <SelectTrigger id="currency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This will be used for all expense and budget calculations
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Region for Tax Calculation</Label>
              <Select 
                value={settings.region} 
                onValueChange={(value) => handleSettingChange('region', value)}
              >
                <SelectTrigger id="region" className="w-full">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Tax rates and regulations will be based on this region
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="font-medium flex items-center gap-2">
            <CoinsIcon className="h-4 w-4" />
            <span>Display Preferences</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-xs text-muted-foreground">
                Switch between light and dark theme
              </p>
            </div>
            <Switch 
              id="dark-mode" 
              checked={settings.darkMode}
              onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive alerts about unusual spending and budget
              </p>
            </div>
            <Switch 
              id="notifications" 
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save All Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsPanel;
