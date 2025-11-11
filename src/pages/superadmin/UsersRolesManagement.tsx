import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, Shield, Briefcase, Users, Mail, Phone, MapPin, UserCog } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'supervisor' | 'employee';
  department: string;
  site: string;
  phone: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

// Indian dummy data
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@company.com',
    role: 'admin',
    department: 'IT',
    site: 'Mumbai Office',
    phone: '9876543210',
    status: 'active',
    joinDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    role: 'manager',
    department: 'HR',
    site: 'Delhi Branch',
    phone: '9876543211',
    status: 'active',
    joinDate: '2023-02-20'
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.patel@company.com',
    role: 'manager',
    department: 'Operations',
    site: 'Bangalore Tech Park',
    phone: '9876543212',
    status: 'inactive',
    joinDate: '2023-03-10'
  },
  {
    id: '4',
    name: 'Sanjay Singh',
    email: 'sanjay.singh@company.com',
    role: 'supervisor',
    department: 'IT',
    site: 'Mumbai Office',
    phone: '9876543213',
    status: 'active',
    joinDate: '2023-04-05'
  },
  {
    id: '5',
    name: 'Neha Reddy',
    email: 'neha.reddy@company.com',
    role: 'supervisor',
    department: 'HR',
    site: 'Delhi Branch',
    phone: '9876543214',
    status: 'active',
    joinDate: '2023-05-12'
  },
  {
    id: '6',
    name: 'Rahul Verma',
    email: 'rahul.verma@company.com',
    role: 'employee',
    department: 'IT',
    site: 'Mumbai Office',
    phone: '9876543216',
    status: 'active',
    joinDate: '2023-06-18'
  },
  {
    id: '7',
    name: 'Sunita Iyer',
    email: 'sunita.iyer@company.com',
    role: 'employee',
    department: 'HR',
    site: 'Delhi Branch',
    phone: '9876543217',
    status: 'active',
    joinDate: '2023-07-22'
  }
];

const departments = ['IT', 'HR', 'Finance', 'Operations', 'Marketing', 'Sales', 'Admin'];
const sites = ['Mumbai Office', 'Delhi Branch', 'Bangalore Tech Park', 'Chennai Center', 'Hyderabad Campus'];
const roles = ['admin', 'manager', 'supervisor', 'employee'];

// User Form Component
const UserForm = ({ onSubmit, isEditing = false, user = null }: any) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'employee',
    department: user?.department || '',
    site: user?.site || '',
    phone: user?.phone || '',
    status: user?.status || 'active',
    joinDate: user?.joinDate || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Enter full name"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Enter password"
            required={!isEditing}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Department</Label>
          <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Site</Label>
          <Select value={formData.site} onValueChange={(value) => setFormData({...formData, site: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select site" />
            </SelectTrigger>
            <SelectContent>
              {sites.map(site => (
                <SelectItem key={site} value={site}>{site}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Join Date</Label>
          <Input
            type="date"
            value={formData.joinDate}
            onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="Enter phone number"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {isEditing ? 'Update User' : 'Add User'}
      </Button>
    </form>
  );
};

// Reusable User List Component
const UserList = ({ 
  title, 
  icon: Icon, 
  roleFilter,
  description 
}: { 
  title: string;
  icon: React.ElementType;
  roleFilter: User['role'][];
  description: string;
}) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredUsers = users
    .filter(user => roleFilter.includes(user.role))
    .filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.site.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAddUser = (formData: any) => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      ...formData
    };
    setUsers([newUser, ...users]);
    toast.success(`${title.slice(0, -1)} added successfully`);
    setDialogOpen(false);
  };

  const handleEditUser = (formData: any, userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, ...formData } : user
    ));
    toast.success(`${title.slice(0, -1)} updated successfully`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success(`${title.slice(0, -1)} deleted successfully`);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { 
        ...user, 
        status: user.status === 'active' ? 'inactive' : 'active' 
      } : user
    ));
    toast.success('Status updated successfully');
  };

  const getRoleColor = (role: User['role']) => {
    const colors = {
      admin: 'destructive',
      manager: 'default',
      supervisor: 'secondary',
      employee: 'outline'
    };
    return colors[role];
  };

  const getStatusColor = (status: User['status']) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Icon className="h-6 w-6" />
              {title} ({filteredUsers.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add {title.slice(0, -1)}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New {title.slice(0, -1)}</DialogTitle>
              </DialogHeader>
              <UserForm onSubmit={handleAddUser} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No {title.toLowerCase()} found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div>{user.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleColor(user.role) as "default" | "destructive" | "outline" | "secondary"}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {user.site}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {user.phone}
                    </div>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit {title.slice(0, -1)}</DialogTitle>
                          </DialogHeader>
                          <UserForm 
                            user={user} 
                            onSubmit={(data: any) => handleEditUser(data, user.id)}
                            isEditing={true}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Stats Cards Component
const StatsCards = () => {
  const users = initialUsers;
  
  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      description: "All system users",
      color: "text-blue-600"
    },
    {
      title: "Admins",
      value: users.filter(u => u.role === 'admin').length,
      icon: UserCog,
      description: "System administrators",
      color: "text-red-600"
    },
    {
      title: "Managers",
      value: users.filter(u => u.role === 'manager').length,
      icon: Briefcase,
      description: "Department managers",
      color: "text-green-600"
    },
    {
      title: "Supervisors",
      value: users.filter(u => u.role === 'supervisor').length,
      icon: Shield,
      description: "Team supervisors",
      color: "text-purple-600"
    },
    {
      title: "Employees",
      value: users.filter(u => u.role === 'employee').length,
      icon: Users,
      description: "Regular employees",
      color: "text-orange-600"
    },
    {
      title: "Active Users",
      value: users.filter(u => u.status === 'active').length,
      icon: Users,
      description: "Currently active",
      color: "text-green-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Main Component
const UsersRolesManagement = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Users & Roles Management" 
        subtitle="Manage all system users, roles and permissions" 
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <StatsCards />
        
        <Tabs defaultValue="admins" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="admins" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Admins
            </TabsTrigger>
            <TabsTrigger value="managers" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Managers
            </TabsTrigger>
            <TabsTrigger value="supervisors" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Supervisors
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employees
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="admins">
            <UserList 
              title="Admins"
              icon={UserCog}
              roleFilter={['admin']}
              description="System administrators with full access"
            />
          </TabsContent>
          
          <TabsContent value="managers">
            <UserList 
              title="Managers"
              icon={Briefcase}
              roleFilter={['manager']}
              description="Department managers with management privileges"
            />
          </TabsContent>
          
          <TabsContent value="supervisors">
            <UserList 
              title="Supervisors"
              icon={Shield}
              roleFilter={['supervisor']}
              description="Team supervisors with oversight responsibilities"
            />
          </TabsContent>
          
          <TabsContent value="employees">
            <UserList 
              title="Employees"
              icon={Users}
              roleFilter={['employee']}
              description="Regular employees with standard access"
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default UsersRolesManagement;