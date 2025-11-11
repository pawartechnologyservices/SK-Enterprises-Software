import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Eye, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const SupervisorsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null);
  const [supervisors, setSupervisors] = useState([
    { id: 1, name: "Alice Supervisor", email: "alice.s@sk.com", manager: "John Manager", employees: 8, status: "active" },
    { id: 2, name: "Bob Supervisor", email: "bob.s@sk.com", manager: "Sarah Manager", employees: 6, status: "active" },
    { id: 3, name: "Carol Supervisor", email: "carol.s@sk.com", manager: "Mike Manager", employees: 5, status: "inactive" },
  ]);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Supervisor added successfully!");
    setDialogOpen(false);
  };

  const handleEdit = (supervisor: any) => {
    setSelectedSupervisor(supervisor);
    setEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Supervisor updated successfully!");
    setEditDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setSupervisors(supervisors.filter(s => s.id !== id));
    toast.success("Supervisor deleted successfully!");
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Supervisors</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Supervisor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Supervisor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Assign to Manager</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Manager</SelectItem>
                      <SelectItem value="sarah">Sarah Manager</SelectItem>
                      <SelectItem value="mike">Mike Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter password" required />
                </div>
                <Button type="submit" className="w-full">Create Supervisor</Button>
              </form>
            </DialogContent>
          </Dialog>
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
                <TableHead>Manager</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSupervisors.map((supervisor) => (
                <TableRow key={supervisor.id}>
                  <TableCell className="font-medium">{supervisor.name}</TableCell>
                  <TableCell>{supervisor.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{supervisor.manager}</Badge>
                  </TableCell>
                  <TableCell>{supervisor.employees}</TableCell>
                  <TableCell>
                    <Badge variant={supervisor.status === "active" ? "default" : "secondary"}>
                      {supervisor.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(supervisor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleStatus(supervisor.id)}
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
                        onClick={() => handleDelete(supervisor.id)}
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supervisor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" defaultValue={selectedSupervisor?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" defaultValue={selectedSupervisor?.email} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-manager">Manager</Label>
              <Select defaultValue={selectedSupervisor?.manager}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john">John Manager</SelectItem>
                  <SelectItem value="sarah">Sarah Manager</SelectItem>
                  <SelectItem value="mike">Mike Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Update Supervisor</Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
