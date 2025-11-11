import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { 
  User, 
  Palette, 
  Bell, 
  Shield, 
  Save, 
  RotateCcw,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Globe,
  Download,
  Upload
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ManagerSettings = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: "Manager User",
    email: "manager@company.com",
    phone: "+1 234 567 8901",
    department: "Operations",
    position: "Operations Manager"
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    weeklyReports: true,
    urgentAlerts: true,
    teamUpdates: false
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "team",
    activityStatus: true,
    twoFactorAuth: false,
    dataSharing: false
  });

  // App Preferences
  const [appPreferences, setAppPreferences] = useState({
    language: "english",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
    autoBackup: true,
    compactMode: false
  });

  // Handle Profile Update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }, 1000);
  };

  // Handle Password Change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
    }, 1000);
  };

  // Handle Notification Toggle
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Notification Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${!notifications[key] ? 'enabled' : 'disabled'}`,
    });
  };

  // Handle Privacy Setting Change
  const handlePrivacyChange = (key: keyof typeof privacySettings, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle App Preference Change
  const handleAppPreferenceChange = (key: keyof typeof appPreferences, value: any) => {
    setAppPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset Profile Form
  const handleResetProfile = () => {
    setProfileData({
      name: "Manager User",
      email: "manager@company.com",
      phone: "+1 234 567 8901",
      department: "Operations",
      position: "Operations Manager"
    });
    toast({
      title: "Form Reset",
      description: "Profile form has been reset to original values",
    });
  };

  // Reset Password Form
  const handleResetPassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    toast({
      title: "Form Reset",
      description: "Password form has been cleared",
    });
  };

  // Export Settings
  const handleExportSettings = () => {
    const settings = {
      profile: profileData,
      preferences: appPreferences,
      notifications: notifications,
      privacy: privacySettings
    };
    
    // Simulate export
    toast({
      title: "Settings Exported",
      description: "Your settings have been downloaded",
    });
  };

  // Import Settings
  const handleImportSettings = () => {
    // Simulate import
    toast({
      title: "Settings Imported",
      description: "Your settings have been updated from backup",
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Settings" 
        subtitle="Manage your profile and preferences"
        onMenuClick={onMenuClick}
      />

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={profileData.department}
                          onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          value={profileData.position}
                          onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleResetProfile}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility('current')}
                          >
                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility('new')}
                          >
                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility('confirm')}
                          >
                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Update Password
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleResetPassword}
                          className="flex items-center gap-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Clear
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        checked={privacySettings.twoFactorAuth}
                        onCheckedChange={(checked) => handlePrivacyChange('twoFactorAuth', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Activity Status</Label>
                        <p className="text-sm text-muted-foreground">Allow others to see when you're active</p>
                      </div>
                      <Switch
                        checked={privacySettings.activityStatus}
                        onCheckedChange={(checked) => handlePrivacyChange('activityStatus', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Sharing</Label>
                        <p className="text-sm text-muted-foreground">Help improve our service by sharing usage data</p>
                      </div>
                      <Switch
                        checked={privacySettings.dataSharing}
                        onCheckedChange={(checked) => handlePrivacyChange('dataSharing', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={() => handleNotificationToggle('smsNotifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Get weekly performance reports</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={() => handleNotificationToggle('weeklyReports')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Urgent Alerts</Label>
                      <p className="text-sm text-muted-foreground">Immediate notifications for critical issues</p>
                    </div>
                    <Switch
                      checked={notifications.urgentAlerts}
                      onCheckedChange={() => handleNotificationToggle('urgentAlerts')}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance & Preferences Tab */}
            <TabsContent value="appearance">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize your visual experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Theme Mode</Label>
                        <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                      </div>
                      <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">Use compact layout for better space utilization</p>
                      </div>
                      <Switch
                        checked={appPreferences.compactMode}
                        onCheckedChange={(checked) => handleAppPreferenceChange('compactMode', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Application Preferences</CardTitle>
                    <CardDescription>Configure your application settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={appPreferences.language}
                        onValueChange={(value) => handleAppPreferenceChange('language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={appPreferences.timezone}
                        onValueChange={(value) => handleAppPreferenceChange('timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-5">EST (UTC-5)</SelectItem>
                          <SelectItem value="UTC-8">PST (UTC-8)</SelectItem>
                          <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                          <SelectItem value="UTC+1">CET (UTC+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select
                        value={appPreferences.dateFormat}
                        onValueChange={(value) => handleAppPreferenceChange('dateFormat', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto Backup</Label>
                        <p className="text-sm text-muted-foreground">Automatically backup your settings</p>
                      </div>
                      <Switch
                        checked={appPreferences.autoBackup}
                        onCheckedChange={(checked) => handleAppPreferenceChange('autoBackup', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Backup & Restore</CardTitle>
                    <CardDescription>Manage your settings backup</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleExportSettings}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export Settings
                      </Button>
                      <Button 
                        onClick={handleImportSettings}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Import Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ManagerSettings;