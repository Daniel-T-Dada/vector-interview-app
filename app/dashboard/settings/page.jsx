"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Check, X, Bell, Moon, Shield, Save } from "lucide-react";
import { SettingsSkeleton } from "@/components/skeletons/settings-skeleton";

function SettingsContent() {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Placeholder settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    appearance: {
      compactMode: false,
      highContrast: false,
    },
    privacy: {
      shareData: true,
      analytics: true,
    }
  });

  useEffect(() => {
    // Simulate loading settings
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Custom toggle component using available UI components
  const Toggle = ({ checked, onChange, disabled }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        checked ? 'bg-primary' : 'bg-muted'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-background transition-transform`}
      />
    </button>
  );

  // Custom tabs component using available UI components
  const [activeTab, setActiveTab] = useState("general");

  const handleToggle = (category, setting) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: !settings[category][setting]
      }
    });
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <main className="p-6 pt-16 md:pt-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Custom tabs */}
        <div className="space-y-6">
          <div className="border-b border-border">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("general")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "general"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "notifications"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("privacy")}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === "privacy"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Privacy
              </button>
            </div>
          </div>

          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label>Name</Label>
                    <div className="font-medium">{session?.user?.name || "User"}</div>
                  </div>
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <div className="font-medium">{session?.user?.email || "email@example.com"}</div>
                  </div>
                  <div className="space-y-1">
                    <Label>Account Type</Label>
                    <div className="font-medium">Administrator</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Moon className="mr-2 h-5 w-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize how the dashboard looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce spacing and show more content
                      </p>
                    </div>
                    <Toggle
                      checked={settings.appearance.compactMode}
                      onChange={() => handleToggle("appearance", "compactMode")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase contrast for better visibility
                      </p>
                    </div>
                    <Toggle
                      checked={settings.appearance.highContrast}
                      onChange={() => handleToggle("appearance", "highContrast")}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Toggle
                      checked={settings.notifications.email}
                      onChange={() => handleToggle("notifications", "email")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications in your browser
                      </p>
                    </div>
                    <Toggle
                      checked={settings.notifications.push}
                      onChange={() => handleToggle("notifications", "push")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via text message
                      </p>
                    </div>
                    <Toggle
                      checked={settings.notifications.sms}
                      onChange={() => handleToggle("notifications", "sms")}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="share-data">Share Usage Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Help us improve by sharing anonymous usage data
                      </p>
                    </div>
                    <Toggle
                      checked={settings.privacy.shareData}
                      onChange={() => handleToggle("privacy", "shareData")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="analytics">Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow us to collect analytics data
                      </p>
                    </div>
                    <Toggle
                      checked={settings.privacy.analytics}
                      onChange={() => handleToggle("privacy", "analytics")}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="flex items-center">
            {saving ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
} 