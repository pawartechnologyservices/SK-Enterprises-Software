import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Building2, Save, Eye, EyeOff, Camera } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "Manager User",
    email: "manager@sk.com",
    phone: "+1 234 567 8901",
    department: "Operations",
    role: "Manager"
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile updated successfully!");
    }, 1500);
  };

  // Handle password change
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords don't match!");
      return;
    }

    if (passwordData.new.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    if (!passwordData.current) {
      toast.error("Please enter your current password");
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password updated successfully!");
      setPasswordData({ current: "", new: "", confirm: "" });
    }, 1500);
  };

  // Handle avatar change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      toast.success("Avatar selected! Click 'Save Avatar' to update.");
    }
  };

  // Handle avatar save
  const handleSaveAvatar = () => {
    if (!avatarFile) {
      toast.error("Please select an image first");
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Avatar updated successfully!");
    }, 1500);
  };

  // Handle avatar removal
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    toast.info("Avatar selection cancelled");
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
      <DashboardHeader title="My Profile" subtitle="Manage your account settings" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 max-w-2xl mx-auto space-y-6"
      >
        {/* Profile Avatar Section */}
        <div className="flex flex-col items-center p-8 border rounded-lg bg-card">
          <div className="relative">
            <Avatar className="h-24 w-24 mb-4">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="Profile avatar" />
              ) : null}
              <AvatarFallback className="text-2xl">
                {formData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 cursor-pointer">
              <div className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveAvatar}
              disabled={!avatarFile || isLoading}
            >
              {isLoading ? "Saving..." : "Save Avatar"}
            </Button>
            {avatarPreview && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRemoveAvatar}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="department" 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </form>
        </div>

        {/* Password Change Form */}
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <div className="relative">
                <Input 
                  id="current" 
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <div className="relative">
                <Input 
                  id="new" 
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  className="pr-10"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm New Password</Label>
              <div className="relative">
                <Input 
                  id="confirm" 
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  className="pr-10"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        </div>

        {/* Account Information */}
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">Account Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Role</Label>
                <p className="font-medium">{formData.role}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Member Since</Label>
                <p className="font-medium">March 15, 2023</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Last Login</Label>
                <p className="font-medium">Today, 09:24 AM</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;