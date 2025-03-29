import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

const SettingsPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  Manage your personal information and account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfile 
                  appearance={{
                    baseTheme: dark,
                    elements: {
                      rootBox: "mx-auto w-full py-4",
                      card: "bg-background shadow-none",
                      navbar: "hidden",
                      pageScrollBox: "max-w-full",
                      footer: "hidden",
                      logoBox: "hidden",
                      logoImage: "hidden"
                    }
                  }}
                  routing="path"
                  path="/settings"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Appearance settings will be available in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Choose how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Notification settings will be available in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect with other services and applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Integration settings will be available in a future update.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
