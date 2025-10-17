import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, CheckCircle, Clock, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    employee: "",
    priority: "medium",
    deadline: "",
    assignedBy: "Supervisor"
  });

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Available employees
  const employees = [
    { id: 1, name: "John Doe", role: "Developer" },
    { id: 2, name: "Sarah Wilson", role: "Designer" },
    { id: 3, name: "Mike Johnson", role: "Tester" },
    { id: 4, name: "Emily Brown", role: "Manager" }
  ];

  // Add new task with form data
  const addTask = () => {
    if (!newTask.title || !newTask.employee || !newTask.deadline) {
      toast.error("Please fill all required fields");
      return;
    }

    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      employee: newTask.employee,
      priority: newTask.priority,
      status: "pending",
      deadline: newTask.deadline,
      assignedBy: newTask.assignedBy,
      assignedDate: new Date().toISOString().split('T')[0]
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      employee: "",
      priority: "medium",
      deadline: "",
      assignedBy: "Supervisor"
    });
    setShowAddForm(false);
    toast.success("Task assigned successfully!");
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => 
    filter === "all" || task.status === filter
  );

  // Update task status
  const updateStatus = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
    toast.success(`Task marked as ${newStatus}`);
  };

  // Start task
  const startTask = (id) => {
    updateStatus(id, "in-progress");
  };

  // Complete task
  const completeTask = (id) => {
    updateStatus(id, "completed");
  };

  // Edit task
  const editTask = (id) => {
    toast.info("Edit feature coming soon!");
  };

  // Delete task
  const deleteTask = (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== id));
      toast.success("Task deleted successfully!");
    }
  };

  // Get colors
  const getColor = (type, value) => {
    const colors = {
      priority: {
        high: "destructive",
        medium: "default", 
        low: "secondary"
      },
      status: {
        completed: "default",
        "in-progress": "default",
        pending: "secondary"
      }
    };
    return colors[type]?.[value] || "outline";
  };

  // Stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Task Management" subtitle="Assign and track tasks for employees" />
      
      <div className="p-6 space-y-6">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Task Overview</h2>
          
          {/* Add Task Dialog */}
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Assign New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Assign New Task to Employee</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Task Details */}
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Task Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the task details..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows={3}
                  />
                </div>

                {/* Employee Selection */}
                <div className="space-y-2">
                  <Label htmlFor="employee">Assign to Employee *</Label>
                  <Select value={newTask.employee} onValueChange={(value) => setNewTask({...newTask, employee: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.name}>
                          {emp.name} - {emp.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority and Deadline */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline *</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={addTask} className="flex-1">
                    Assign Task
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard title="Total Tasks" value={stats.total} />
          <StatCard title="Pending" value={stats.pending} color="text-orange-500" />
          <StatCard title="In Progress" value={stats.inProgress} color="text-blue-500" />
          <StatCard title="Completed" value={stats.completed} color="text-green-500" />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "in-progress", "completed"].map(status => (
            <Button 
              key={status}
              variant={filter === status ? "default" : "outline"} 
              onClick={() => setFilter(status)}
            >
              {status === "all" ? "All Tasks" : status}
            </Button>
          ))}
        </div>

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tasks assigned yet.</p>
                <Button onClick={() => setShowAddForm(true)} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Your First Task
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map(task => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="font-medium">{task.employee}</TableCell>
                      
                      <TableCell>
                        <Badge variant={getColor("priority", task.priority)}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant={getColor("status", task.status)}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.deadline}
                        </div>
                      </TableCell>

                      <TableCell>{task.assignedDate}</TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Status Action Buttons */}
                          {task.status === "pending" && (
                            <Button size="sm" onClick={() => startTask(task.id)}>
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          )}
                          
                          {task.status === "in-progress" && (
                            <Button size="sm" onClick={() => completeTask(task.id)}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                          )}
                          
                          {task.status === "completed" && (
                            <Badge className="bg-green-100 text-green-800">
                              Done ✓
                            </Badge>
                          )}

                          {/* Edit and Delete Buttons */}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => editTask(task.id)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteTask(task.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, color = "text-foreground" }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </CardContent>
  </Card>
);

export default Tasks;