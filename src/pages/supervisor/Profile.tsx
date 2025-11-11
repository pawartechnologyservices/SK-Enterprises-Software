import { useState, useRef } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Building2, Save, Lock, Camera, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Supervisor User",
    email: "supervisor@sk.com",
    phone: "+1 234 567 8902",
    department: "Operations",
    role: "Supervisor",
    avatar: "" // Added avatar URL field
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle avatar upload
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setProfile(prev => ({ ...prev, avatar: imageUrl }));
      toast.success("Avatar updated successfully!");
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Remove avatar
  const handleRemoveAvatar = () => {
    setProfile(prev => ({ ...prev, avatar: "" }));
    toast.success("Avatar removed");
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call - in real app, upload avatar to server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically send the profile data + avatar to your backend
      console.log("Profile data to save:", {
        ...profile,
        avatar: profile.avatar ? "Uploaded to server" : "No avatar"
      });
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.new !== password.confirm) {
      toast.error("New passwords don't match");
      return;
    }

    if (password.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Password changed successfully!");
      setPassword({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Handle account actions
  const handleAccountAction = (action: 'export' | 'delete') => {
    if (action === 'export') {
      const data = JSON.stringify(profile, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'profile-data.json';
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully!");
    } else {
      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        toast.error("Account deletion initiated");
        // Add actual deletion logic here
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="My Profile" subtitle="Manage your account settings" />
      
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section with Upload */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-border">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                {/* Upload Button */}
                <Button 
                  size="icon" 
                  className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full shadow-lg"
                  onClick={handleAvatarClick}
                >
                  <Camera className="h-5 w-5" />
                </Button>

                {/* Remove Avatar Button (only when avatar exists) */}
                {profile.avatar && (
                  <Button 
                    size="icon"
                    variant="destructive"
                    className="absolute -bottom-2 -left-2 h-8 w-8 rounded-full shadow-lg"
                    onClick={handleRemoveAvatar}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <p className="mt-4 font-semibold text-lg">{profile.name}</p>
              <p className="text-sm text-muted-foreground">{profile.role}</p>

              {/* Upload Instructions */}
              <p className="text-xs text-muted-foreground mt-2 text-center max-w-xs">
                Click the camera icon to upload a profile picture
                <br />
                Supported: JPG, PNG, GIF • Max: 5MB
              </p>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid gap-4">
                <FormField
                  label="Full Name"
                  value={profile.name}
                  onChange={(value) => setProfile({...profile, name: value})}
                  icon={<User className="h-4 w-4" />}
                />

                <FormField
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={(value) => setProfile({...profile, email: value})}
                  icon={<Mail className="h-4 w-4" />}
                />

                <FormField
                  label="Phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(value) => setProfile({...profile, phone: value})}
                  icon={<Phone className="h-4 w-4" />}
                />

                <FormField
                  label="Department"
                  value={profile.department}
                  onChange={(value) => setProfile({...profile, department: value})}
                  icon={<Building2 className="h-4 w-4" />}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <PasswordField
                label="Current Password"
                value={password.current}
                onChange={(value) => setPassword({...password, current: value})}
              />

              <PasswordField
                label="New Password" 
                value={password.new}
                onChange={(value) => setPassword({...password, new: value})}
              />

              <PasswordField
                label="Confirm Password"
                value={password.confirm}
                onChange={(value) => setPassword({...password, confirm: value})}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !password.current || !password.new || !password.confirm}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleAccountAction('export')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleAccountAction('delete')}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Form Field Component
const FormField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  icon 
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="relative">
      <div className="absolute left-3 top-3 text-muted-foreground">
        {icon}
      </div>
      <Input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
        required
      />
    </div>
  </div>
);

// Password Field Component  
const PasswordField = ({ 
  label, 
  value, 
  onChange 
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input 
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

export default Profile;