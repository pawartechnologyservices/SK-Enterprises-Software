import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Mail, Plus, Edit, Trash2, UserCheck, UserX, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  role: z.enum(["Manager", "Supervisor"]),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
});

type TeamMember = {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  supervisors?: number;
  employees?: number;
  status: string;
  joinDate: string;
  lastActive: string;
};

const Team = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [team, setTeam] = useState<TeamMember[]>([
    { 
      id: 1, 
      name: "John Manager", 
      role: "Manager", 
      email: "john.m@sk.com", 
      phone: "+1234567890", 
      supervisors: 5, 
      employees: 25,
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2024-12-19"
    },
    { 
      id: 2, 
      name: "Sarah Manager", 
      role: "Manager", 
      email: "sarah.m@sk.com", 
      phone: "+1234567891", 
      supervisors: 3, 
      employees: 15,
      status: "active",
      joinDate: "2024-02-20",
      lastActive: "2024-12-19"
    },
    { 
      id: 3, 
      name: "Alice Supervisor", 
      role: "Supervisor", 
      email: "alice.s@sk.com", 
      phone: "+1234567892", 
      employees: 8, 
      status: "active",
      joinDate: "2024-03-10",
      lastActive: "2024-12-18"
    },
    { 
      id: 4, 
      name: "Bob Supervisor", 
      role: "Supervisor", 
      email: "bob.s@sk.com", 
      phone: "+1234567893", 
      employees: 6, 
      status: "inactive",
      joinDate: "2024-01-25",
      lastActive: "2024-12-15"
    },
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailContent, setEmailContent] = useState("");

  const form = useForm<z.infer<typeof teamMemberSchema>>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Manager",
      phone: "",
    },
  });

  const filteredTeam = team.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      form.reset({
        name: member.name,
        email: member.email,
        role: member.role as "Manager" | "Supervisor",
        phone: member.phone,
      });
    } else {
      setEditingMember(null);
      form.reset({
        name: "",
        email: "",
        role: "Manager",
        phone: "",
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof teamMemberSchema>) => {
    if (editingMember) {
      setTeam(team.map(m => 
        m.id === editingMember.id 
          ? { 
              ...m, 
              name: values.name, 
              email: values.email, 
              role: values.role, 
              phone: values.phone,
              lastActive: new Date().toISOString().split('T')[0]
            } 
          : m
      ));
      toast.success("Team member updated successfully!");
    } else {
      const newMember: TeamMember = {
        id: Math.max(0, ...team.map(m => m.id)) + 1,
        name: values.name,
        email: values.email,
        role: values.role,
        phone: values.phone,
        supervisors: values.role === "Manager" ? 0 : undefined,
        employees: values.role === "Supervisor" ? 0 : undefined,
        status: "active",
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
      };
      setTeam([...team, newMember]);
      toast.success("Team member added successfully!");
    }
    setDialogOpen(false);
    form.reset();
  };

  const handleDelete = () => {
    if (memberToDelete) {
      const memberName = team.find(m => m.id === memberToDelete)?.name;
      setTeam(team.filter(m => m.id !== memberToDelete));
      toast.success(`Team member ${memberName} deleted successfully!`);
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const toggleStatus = (id: number) => {
    setTeam(team.map(m => {
      if (m.id === id) {
        const newStatus = m.status === "active" ? "inactive" : "active";
        toast.success(`Team member ${m.name} ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
        return { 
          ...m, 
          status: newStatus,
          lastActive: new Date().toISOString().split('T')[0]
        };
      }
      return m;
    }));
  };

  const handleViewDetails = (member: TeamMember) => {
    setSelectedMember(member);
    setViewDialogOpen(true);
  };

  const handleSendEmail = (member: TeamMember) => {
    setSelectedMember(member);
    setEmailContent("");
    setEmailDialogOpen(true);
  };

  const handleEmailSubmit = () => {
    if (selectedMember && emailContent.trim()) {
      // Simulate sending email
      setTimeout(() => {
        toast.success(`Email sent to ${selectedMember.name} successfully!`);
        setEmailDialogOpen(false);
        setEmailContent("");
      }, 1000);
    } else {
      toast.error("Please enter email content");
    }
  };

  const handleCall = (phone: string) => {
    // Simulate making a call
    toast.info(`Calling ${phone}...`);
    // In real app, you would use: window.open(`tel:${phone}`)
  };

  const getStatusVariant = (status: string) => {
    return status === "active" ? "default" : "secondary";
  };

  const getRoleColor = (role: string) => {
    return role === "Manager" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="My Team" subtitle="View and manage your team members" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{team.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Managers</p>
                  <p className="text-2xl font-bold">{team.filter(m => m.role === "Manager").length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supervisors</p>
                  <p className="text-2xl font-bold">{team.filter(m => m.role === "Supervisor").length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{team.filter(m => m.status === "active").length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Team Members</CardTitle>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Team Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeam.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No team members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTeam.map((member) => (
                      <TableRow key={member.id} className={member.status === "inactive" ? "opacity-60" : ""}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Joined {new Date(member.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">{member.email}</p>
                            <p className="text-sm text-muted-foreground">{member.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.role === "Manager" ? (
                            <div className="space-y-1">
                              <p className="text-sm">{member.supervisors} Supervisors</p>
                              <p className="text-sm text-muted-foreground">{member.employees} Employees</p>
                            </div>
                          ) : (
                            <p className="text-sm">{member.employees} Employees</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(member.status)}>
                            {member.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(member.lastActive).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleViewDetails(member)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleSendEmail(member)}
                              title="Send Email"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleCall(member.phone)}
                              title="Call"
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleOpenDialog(member)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleStatus(member.id)}
                              title={member.status === "active" ? "Deactivate" : "Activate"}
                            >
                              {member.status === "active" ? (
                                <UserX className="h-4 w-4 text-destructive" />
                              ) : (
                                <UserCheck className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setMemberToDelete(member.id);
                                setDeleteDialogOpen(true);
                              }}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add/Edit Member Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMember ? "Update Member" : "Add Member"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="font-medium">{selectedMember.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <Badge className={getRoleColor(selectedMember.role)}>
                    {selectedMember.role}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-medium">{selectedMember.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="font-medium">{selectedMember.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge variant={getStatusVariant(selectedMember.status)}>
                    {selectedMember.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                  <p className="font-medium">{new Date(selectedMember.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Active</label>
                  <p className="font-medium">{new Date(selectedMember.lastActive).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Team Size</label>
                  <p className="font-medium">
                    {selectedMember.role === "Manager" 
                      ? `${selectedMember.supervisors} Supervisors, ${selectedMember.employees} Employees`
                      : `${selectedMember.employees} Employees`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Email to {selectedMember?.name}</DialogTitle>
            <DialogDescription>
              Send an email to {selectedMember?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Content</label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Type your message here..."
                className="w-full h-32 p-3 border rounded-md resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEmailSubmit}>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the team member{" "}
              <strong>{team.find(m => m.id === memberToDelete)?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Team;