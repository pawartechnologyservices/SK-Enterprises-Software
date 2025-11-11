import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ManagerTasks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: "Site Inspection Report", 
      assignedTo: "Alice Supervisor", 
      priority: "high", 
      status: "in-progress", 
      dueDate: "2025-01-15",
      description: "Complete site inspection and submit report"
    },
    { 
      id: 2, 
      title: "Employee Training", 
      assignedTo: "Bob Supervisor", 
      priority: "medium", 
      status: "pending", 
      dueDate: "2025-01-20",
      description: "Conduct training session for new employees"
    },
    { 
      id: 3, 
      title: "Equipment Maintenance", 
      assignedTo: "Carol Supervisor", 
      priority: "high", 
      status: "completed", 
      dueDate: "2025-01-10",
      description: "Perform routine maintenance on all equipment"
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: ""
  });

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  };

  // Add new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task = {
      id: Math.max(0, ...tasks.map(t => t.id)) + 1,
      ...newTask,
      status: "pending"
    };
    setTasks(prev => [...prev, task]);
    toast.success("Task assigned successfully!");
    setDialogOpen(false);
    setNewTask({ title: "", description: "", assignedTo: "", priority: "medium", dueDate: "" });
  };

  // Update task status
  const updateStatus = (id: number, status: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status } : task));
    toast.success("Task status updated!");
  };

  // Delete task
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted successfully!");
  };

  // View task details
  const handleViewTask = (task: any) => {
    toast.info(`Task: ${task.title}`, {
      description: `Assigned to: ${task.assignedTo}\nStatus: ${task.status}\nDue: ${task.dueDate}`,
      action: {
        label: "Edit",
        onClick: () => toast.info("Edit functionality would open here")
      }
    });
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get priority color
  const getPriorityColor = (priority: string) => {
    return priority === "high" ? "destructive" : priority === "medium" ? "default" : "secondary";
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Task Management" subtitle="Assign and track tasks" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Tasks</CardTitle>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Assign Task
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(task.priority)} className="capitalize">
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select value={task.status} onValueChange={(value) => updateStatus(task.id, value)}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewTask(task)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Edit task functionality")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
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

        {/* Assign Task Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter task title" 
                  value={newTask.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter task description" 
                  value={newTask.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignTo">Assign To</Label>
                <Select 
                  value={newTask.assignedTo} 
                  onValueChange={(value) => handleInputChange('assignedTo', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alice Supervisor">Alice Supervisor</SelectItem>
                    <SelectItem value="Bob Supervisor">Bob Supervisor</SelectItem>
                    <SelectItem value="Carol Supervisor">Carol Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value) => handleInputChange('priority', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input 
                    id="dueDate" 
                    type="date" 
                    value={newTask.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    required 
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Assign Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default ManagerTasks;