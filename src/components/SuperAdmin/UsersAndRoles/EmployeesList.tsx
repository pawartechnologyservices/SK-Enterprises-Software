import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Edit, Trash2, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const EmployeesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", email: "john.d@sk.com", supervisor: "Alice Supervisor", department: "Operations", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane.s@sk.com", supervisor: "Bob Supervisor", department: "HR", status: "active" },
    { id: 3, name: "Mike Wilson", email: "mike.w@sk.com", supervisor: "Carol Supervisor", department: "Finance", status: "inactive" },
    { id: 4, name: "Sarah Brown", email: "sarah.b@sk.com", supervisor: "Alice Supervisor", department: "Operations", status: "active" },
  ]);

  const handleDelete = (id: number) => {
    setEmployees(employees.filter(e => e.id !== id));
    toast.success("Employee deleted successfully!");
  };

  const toggleStatus = (id: number) => {
    setEmployees(employees.map(e => 
      e.id === id ? { ...e, status: e.status === "active" ? "inactive" : "active" } : e
    ));
    toast.success("Employee status updated!");
  };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
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
                <TableHead>Supervisor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.supervisor}</Badge>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleStatus(employee.id)}
                      >
                        {employee.status === "active" ? (
                          <UserX className="h-4 w-4 text-destructive" />
                        ) : (
                          <UserCheck className="h-4 w-4 text-primary" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(employee.id)}
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
  );
};
