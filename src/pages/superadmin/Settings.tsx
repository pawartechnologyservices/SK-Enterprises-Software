import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Save, User, Lock, Shield } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Settings = () => {
  const [profileData, setProfileData] = useState({
    name: "Super Admin",
    email: "admin@skproject.com",
    phone: "+1234567890",
  });

  const [permissions, setPermissions] = useState({
    canCreateAdmins: true,
    canManageManagers: true,
    canViewReports: true,
    canDeleteUsers: false,
  });

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    toast.success("Password updated successfully!");
    e.currentTarget.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Settings" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        name="currentPassword"
                        type="password" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        name="newPassword"
                        type="password" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        name="confirmPassword"
                        type="password" 
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                    </div>
                    <ThemeToggle />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Create Admin Accounts</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow creation of new admin users
                    </p>
                  </div>
                  <Switch 
                    checked={permissions.canCreateAdmins}
                    onCheckedChange={(checked) => 
                      setPermissions({...permissions, canCreateAdmins: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Manage Managers</Label>
                    <p className="text-sm text-muted-foreground">
                      Create, edit, and delete manager accounts
                    </p>
                  </div>
                  <Switch 
                    checked={permissions.canManageManagers}
                    onCheckedChange={(checked) => 
                      setPermissions({...permissions, canManageManagers: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>View All Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Access to all system reports and analytics
                    </p>
                  </div>
                  <Switch 
                    checked={permissions.canViewReports}
                    onCheckedChange={(checked) => 
                      setPermissions({...permissions, canViewReports: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Delete Users</Label>
                    <p className="text-sm text-muted-foreground">
                      Permanent deletion of user accounts
                    </p>
                  </div>
                  <Switch 
                    checked={permissions.canDeleteUsers}
                    onCheckedChange={(checked) => 
                      setPermissions({...permissions, canDeleteUsers: checked})
                    }
                  />
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => toast.success("Permissions updated successfully!")}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Permissions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Settings;
