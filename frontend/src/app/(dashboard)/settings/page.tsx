"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuthContext } from "@/lib/auth/auth-context";
import {
  Bell,
  Settings as SettingsIcon,
  Shield,
  UserCircle,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useAuthContext();

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8 pt-3 sm:pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Settings
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card
          className="hover:bg-accent/50 transition-colors cursor-pointer"
          asChild
        >
          <Link href="/profile">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <UserCircle className="size-6" />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details and bio
                </CardDescription>
              </div>
            </CardHeader>
          </Link>
        </Card>

        <Card className="opacity-60 cursor-not-allowed">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-2 bg-secondary rounded-full">
              <Bell className="size-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive alerts
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="opacity-60 cursor-not-allowed">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-2 bg-secondary rounded-full">
              <Shield className="size-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and sessions
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="opacity-60 cursor-not-allowed">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-2 bg-secondary rounded-full">
              <SettingsIcon className="size-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>
                Customization and theme settings
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
        <p>
          Your account is managed by <strong>JobMailer AI</strong>. For any
          security or subscription concerns, please contact support.
        </p>
      </div>
    </div>
  );
}
=======
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { settingsApi, UserSettings } from "@/lib/api/settings";
import { KeyRound, Save, Sparkles, Cloud, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    openaiApiKey: "",
    geminiApiKey: "",
    groqApiKey: "",
    openrouterApiKey: "",
    cloudinaryCloudName: "",
    cloudinaryApiKey: "",
    cloudinaryApiSecret: "",
    smtpHost: "",
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: "",
    smtpPassword: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getSettings();
      if (data) {
        setSettings({
          openaiApiKey: data.openaiApiKey || "",
          geminiApiKey: data.geminiApiKey || "",
          groqApiKey: data.groqApiKey || "",
          openrouterApiKey: data.openrouterApiKey || "",
          cloudinaryCloudName: data.cloudinaryCloudName || "",
          cloudinaryApiKey: data.cloudinaryApiKey || "",
          cloudinaryApiSecret: data.cloudinaryApiSecret || "",
          smtpHost: data.smtpHost || "",
          smtpPort: data.smtpPort || 587,
          smtpSecure: data.smtpSecure || false,
          smtpUser: data.smtpUser || "",
          smtpPassword: data.smtpPassword || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsApi.updateSettings(settings);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-8 pt-3 sm:pt-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Settings
        </h2>
        <p className="text-muted-foreground">
          Manage your API keys and application preferences here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* AI Providers Card */}
        <Card className="border-primary/10 shadow-md">
          <CardHeader className="bg-primary/5 rounded-t-xl pb-4">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Providers
            </CardTitle>
            <CardDescription>
              Configure API keys for email generation. The system will
              automatically fallback (Gemini → Groq → OpenRouter → OpenAI) if
              one fails.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="geminiApiKey">Google Gemini API Key</Label>
              <div className="relative">
                <Input
                  id="geminiApiKey"
                  name="geminiApiKey"
                  type="password"
                  placeholder="AIzaSy..."
                  value={settings.geminiApiKey}
                  onChange={handleChange}
                  className="pl-9"
                />
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groqApiKey">Groq API Key</Label>
              <div className="relative">
                <Input
                  id="groqApiKey"
                  name="groqApiKey"
                  type="password"
                  placeholder="gsk_..."
                  value={settings.groqApiKey}
                  onChange={handleChange}
                  className="pl-9"
                />
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="openrouterApiKey">OpenRouter API Key</Label>
              <div className="relative">
                <Input
                  id="openrouterApiKey"
                  name="openrouterApiKey"
                  type="password"
                  placeholder="sk-or-v1-..."
                  value={settings.openrouterApiKey}
                  onChange={handleChange}
                  className="pl-9"
                />
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border/50">
              <Label htmlFor="openaiApiKey" className="text-muted-foreground">
                OpenAI API Key (Optional Fallback)
              </Label>
              <div className="relative">
                <Input
                  id="openaiApiKey"
                  name="openaiApiKey"
                  type="password"
                  placeholder="sk-..."
                  value={settings.openaiApiKey}
                  onChange={handleChange}
                  className="pl-9"
                />
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cloudinary Card */}
        <Card className="border-primary/10 shadow-md h-fit">
          <CardHeader className="bg-primary/5 rounded-t-xl pb-4">
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              Cloudinary Storage
            </CardTitle>
            <CardDescription>
              Configure your Cloudinary credentials for resume PDF storage. Leave
              empty to use the system default.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="cloudinaryCloudName">Cloud Name</Label>
              <Input
                id="cloudinaryCloudName"
                name="cloudinaryCloudName"
                placeholder="your-cloud-name"
                value={settings.cloudinaryCloudName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cloudinaryApiKey">API Key</Label>
              <div className="relative">
                <Input
                  id="cloudinaryApiKey"
                  name="cloudinaryApiKey"
                  type="password"
                  placeholder="123456789012345"
                  value={settings.cloudinaryApiKey}
                  onChange={handleChange}
                  className="pl-9"
                />
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cloudinaryApiSecret">API Secret</Label>
              <div className="relative">
                <Input
                  id="cloudinaryApiSecret"
                  name="cloudinaryApiSecret"
                  type="password"
                  placeholder="***************************"
                  value={settings.cloudinaryApiSecret}
                  onChange={handleChange}
                  className="pl-9"
                />
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* SMTP Email Configuration */}
        <Card className="border-primary/10 shadow-md h-fit">
          <CardHeader className="bg-primary/5 rounded-t-xl pb-4">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              SMTP Configuration
            </CardTitle>
            <CardDescription>
              Configure custom email sending credentials. Leave empty to use system defaults.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  name="smtpHost"
                  placeholder="smtp.gmail.com"
                  value={settings.smtpHost}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">Port</Label>
                <Input
                  id="smtpPort"
                  name="smtpPort"
                  type="number"
                  placeholder="587"
                  value={settings.smtpPort}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      smtpPort: parseInt(e.target.value) || undefined,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <Switch
                id="smtpSecure"
                checked={settings.smtpSecure}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, smtpSecure: checked }))
                }
              />
              <Label htmlFor="smtpSecure">Use SSL/TLS (Secure)</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpUser">Email Address / User</Label>
              <Input
                id="smtpUser"
                name="smtpUser"
                type="email"
                placeholder="your_email@gmail.com"
                value={settings.smtpUser}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpPassword">App Password</Label>
              <div className="relative">
                <Input
                  id="smtpPassword"
                  name="smtpPassword"
                  type="password"
                  placeholder="your_app_password"
                  value={settings.smtpPassword}
                  onChange={handleChange}
                  className="pl-9"
                />
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="shadow-md hover:shadow-lg transition-all"
        >
          {saving ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent"></div>
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Settings
        </Button>
      </div>
    </div>
  );
}

