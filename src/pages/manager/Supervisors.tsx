import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOutletContext } from "react-router-dom";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Edit, Trash2, Mail, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const supervisorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

type Supervisor = {
  id: number;
  name: string;
  email: string;
  phone: string;
  employees: number;
  tasks: number;
  status: string;
};

const Supervisors = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState<Supervisor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supervisorToDelete, setSupervisorToDelete] = useState<number | null>(null);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([
    { id: 1, name: "Alice Supervisor", email: "alice.s@sk.com", phone: "+1234567890", employees: 8, tasks: 12, status: "active" },
    { id: 2, name: "Bob Supervisor", email: "bob.s@sk.com", phone: "+1234567891", employees: 6, tasks: 9, status: "active" },
    { id: 3, name: "Carol Supervisor", email: "carol.s@sk.com", phone: "+1234567892", employees: 5, tasks: 7, status: "inactive" },
  ]);

  const form = useForm<z.infer<typeof supervisorSchema>>({
    resolver: zodResolver(supervisorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const handleOpenDialog = (supervisor?: Supervisor) => {
    if (supervisor) {
      setEditingSupervisor(supervisor);
      form.reset({
        name: supervisor.name,
        email: supervisor.email,
        phone: supervisor.phone,
        password: "",
      });
    } else {
      setEditingSupervisor(null);
      form.reset({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof supervisorSchema>) => {
    if (editingSupervisor) {
      setSupervisors(supervisors.map(s => 
        s.id === editingSupervisor.id 
          ? { ...s, name: values.name, email: values.email, phone: values.phone } 
          : s
      ));
      toast.success("Supervisor updated successfully!");
    } else {
      const newSupervisor: Supervisor = {
        id: Math.max(...supervisors.map(s => s.id)) + 1,
        name: values.name,
        email: values.email,
        phone: values.phone,
        employees: 0,
        tasks: 0,
        status: "active",
      };
      setSupervisors([...supervisors, newSupervisor]);
      toast.success("Supervisor added successfully!");
    }
    setDialogOpen(false);
    form.reset();
  };

  const handleDelete = () => {
    if (supervisorToDelete) {
      setSupervisors(supervisors.filter(s => s.id !== supervisorToDelete));
      toast.success("Supervisor deleted successfully!");
      setDeleteDialogOpen(false);
      setSupervisorToDelete(null);
    }
  };

  const toggleStatus = (id: number) => {
    setSupervisors(supervisors.map(s => 
      s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s
    ));
    toast.success("Supervisor status updated!");
  };

  const filteredSupervisors = supervisors.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Supervisors" 
        subtitle="Manage your supervisors"
        onMenuClick={onMenuClick}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>All Supervisors</CardTitle>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supervisor
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search supervisors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupervisors.map((supervisor) => (
                  <TableRow key={supervisor.id}>
                    <TableCell className="font-medium">{supervisor.name}</TableCell>
                    <TableCell>{supervisor.email}</TableCell>
                    <TableCell>{supervisor.employees}</TableCell>
                    <TableCell>{supervisor.tasks}</TableCell>
                    <TableCell>
                      <Badge variant={supervisor.status === "active" ? "default" : "secondary"}>
                        {supervisor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Send Email">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenDialog(supervisor)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleStatus(supervisor.id)}
                          title={supervisor.status === "active" ? "Deactivate" : "Activate"}
                        >
                          {supervisor.status === "active" ? (
                            <UserX className="h-4 w-4 text-destructive" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-primary" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSupervisorToDelete(supervisor.id);
                            setDeleteDialogOpen(true);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingSupervisor ? "Edit Supervisor" : "Add New Supervisor"}</DialogTitle>
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
              {!editingSupervisor && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSupervisor ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supervisor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this supervisor? This action cannot be undone.
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

export default Supervisors;
