import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Calendar, User, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

type LeaveRequest = {
  id: number;
  employee: string;
  employeeId: string;
  type: string;
  from: string;
  to: string;
  days: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
};

const Leave = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [leaveToDelete, setLeaveToDelete] = useState<number | null>(null);
  
  const [leaveForm, setLeaveForm] = useState({
    type: "",
    from: "",
    to: "",
    reason: "",
  });

  // Mock data for leave requests (in real app, this would come from API)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    { 
      id: 1, 
      employee: "John Doe", 
      employeeId: "EMP001",
      type: "Sick Leave", 
      from: "2025-01-15", 
      to: "2025-01-17", 
      days: 3, 
      status: "pending", 
      reason: "Medical treatment",
      appliedDate: "2025-01-10"
    },
    { 
      id: 2, 
      employee: "Jane Smith", 
      employeeId: "EMP002",
      type: "Annual Leave", 
      from: "2025-01-20", 
      to: "2025-01-25", 
      days: 5, 
      status: "approved", 
      reason: "Family vacation",
      appliedDate: "2025-01-05",
      approvedBy: "Admin User",
      approvedDate: "2025-01-06"
    },
    { 
      id: 3, 
      employee: "Mike Wilson", 
      employeeId: "EMP003",
      type: "Casual Leave", 
      from: "2025-01-18", 
      to: "2025-01-19", 
      days: 2, 
      status: "pending", 
      reason: "Personal work",
      appliedDate: "2025-01-12"
    },
    { 
      id: 4, 
      employee: "Sarah Johnson", 
      employeeId: "EMP004",
      type: "Emergency Leave", 
      from: "2025-01-22", 
      to: "2025-01-22", 
      days: 1, 
      status: "rejected", 
      reason: "Family emergency",
      appliedDate: "2025-01-21",
      approvedBy: "Admin User",
      approvedDate: "2025-01-21",
      comments: "Please provide proper documentation"
    },
  ]);

  // Calculate leave statistics
  const leaveStats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(leave => leave.status === "pending").length,
    approved: leaveRequests.filter(leave => leave.status === "approved").length,
    rejected: leaveRequests.filter(leave => leave.status === "rejected").length,
    available: 20, // Mock available leave days
    used: leaveRequests
      .filter(leave => leave.status === "approved")
      .reduce((sum, leave) => sum + leave.days, 0),
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setLeaveForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate days between dates
  const calculateDays = (from: string, to: string) => {
    if (!from || !to) return 0;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Handle leave application submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const days = calculateDays(leaveForm.from, leaveForm.to);
    
    if (days <= 0) {
      toast.error("End date must be after start date");
      return;
    }

    if (leaveStats.used + days > leaveStats.available) {
      toast.error("Insufficient leave balance");
      return;
    }

    const newLeave: LeaveRequest = {
      id: Math.max(0, ...leaveRequests.map(l => l.id)) + 1,
      employee: "Current User", // In real app, get from auth context
      employeeId: "EMP001",
      type: leaveForm.type,
      from: leaveForm.from,
      to: leaveForm.to,
      days: days,
      status: "pending",
      reason: leaveForm.reason,
      appliedDate: new Date().toISOString().split('T')[0],
    };

    setLeaveRequests(prev => [newLeave, ...prev]);
    
    // In real app, send to Super Admin panel via API
    toast.success("Leave request submitted! Sent for approval.");
    
    setLeaveForm({
      type: "",
      from: "",
      to: "",
      reason: "",
    });
    setDialogOpen(false);
  };

  // Handle leave edit
  const handleEdit = (leave: LeaveRequest) => {
    if (leave.status !== "pending") {
      toast.error("Only pending leave requests can be edited");
      return;
    }

    setSelectedLeave(leave);
    setLeaveForm({
      type: leave.type,
      from: leave.from,
      to: leave.to,
      reason: leave.reason,
    });
    setEditDialogOpen(true);
  };

  // Handle leave update
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLeave) return;

    const days = calculateDays(leaveForm.from, leaveForm.to);
    
    if (days <= 0) {
      toast.error("End date must be after start date");
      return;
    }

    setLeaveRequests(prev =>
      prev.map(leave =>
        leave.id === selectedLeave.id
          ? {
              ...leave,
              type: leaveForm.type,
              from: leaveForm.from,
              to: leaveForm.to,
              days: days,
              reason: leaveForm.reason,
            }
          : leave
      )
    );

    toast.success("Leave request updated successfully!");
    setEditDialogOpen(false);
    setSelectedLeave(null);
    setLeaveForm({
      type: "",
      from: "",
      to: "",
      reason: "",
    });
  };

  // Handle leave cancellation
  const handleCancel = (leaveId: number) => {
    setLeaveToDelete(leaveId);
    setDeleteDialogOpen(true);
  };

  // Confirm leave cancellation
  const confirmCancel = () => {
    if (leaveToDelete) {
      const leave = leaveRequests.find(l => l.id === leaveToDelete);
      
      if (leave?.status !== "pending") {
        toast.error("Only pending leave requests can be cancelled");
        return;
      }

      setLeaveRequests(prev => prev.filter(leave => leave.id !== leaveToDelete));
      toast.success("Leave request cancelled successfully!");
      setDeleteDialogOpen(false);
      setLeaveToDelete(null);
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Check if leave can be edited/cancelled
  const canModify = (leave: LeaveRequest) => {
    return leave.status === "pending";
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Leave Management" subtitle="Apply for and manage leave requests" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* Leave Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{leaveStats.total}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{leaveStats.pending}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{leaveStats.approved}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{leaveStats.rejected}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Days</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {leaveStats.available - leaveStats.used}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apply for Leave Button */}
        <div className="flex justify-end">
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Apply for Leave
          </Button>
        </div>

        {/* Leave Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>My Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No leave requests found
                </div>
              ) : (
                leaveRequests.map((leave) => (
                  <motion.div
                    key={leave.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium">{leave.type}</h3>
                            <p className="text-sm text-muted-foreground">
                              {leave.from} to {leave.to} ({leave.days} days)
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Reason:</strong> {leave.reason}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Applied:</strong> {leave.appliedDate}
                        </p>
                        {leave.approvedBy && (
                          <p className="text-sm text-muted-foreground">
                            <strong>{leave.status === "approved" ? "Approved" : "Rejected"} by:</strong> {leave.approvedBy} on {leave.approvedDate}
                          </p>
                        )}
                        {leave.comments && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Comments:</strong> {leave.comments}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={getStatusVariant(leave.status)}
                          className="flex items-center gap-1"
                        >
                          {getStatusIcon(leave.status)}
                          {leave.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(leave)}
                            disabled={!canModify(leave)}
                            title="Edit Leave"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCancel(leave.id)}
                            disabled={!canModify(leave)}
                            title="Cancel Leave"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Apply for Leave Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>
              Submit a new leave request. It will be sent to your supervisor for approval.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Leave Type</Label>
              <Select 
                value={leaveForm.type} 
                onValueChange={(value) => handleInputChange("type", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                  <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                  <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                  <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From Date</Label>
                <Input 
                  id="from" 
                  type="date" 
                  value={leaveForm.from}
                  onChange={(e) => handleInputChange("from", e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To Date</Label>
                <Input 
                  id="to" 
                  type="date" 
                  value={leaveForm.to}
                  onChange={(e) => handleInputChange("to", e.target.value)}
                  required 
                />
              </div>
            </div>
            {leaveForm.from && leaveForm.to && (
              <div className="text-sm text-muted-foreground">
                Total days: {calculateDays(leaveForm.from, leaveForm.to)}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea 
                id="reason" 
                placeholder="Enter reason for leave" 
                value={leaveForm.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full">Submit Request</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Leave Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Leave Request</DialogTitle>
            <DialogDescription>
              Update your leave request details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-type">Leave Type</Label>
              <Select 
                value={leaveForm.type} 
                onValueChange={(value) => handleInputChange("type", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                  <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-from">From Date</Label>
                <Input 
                  id="edit-from" 
                  type="date" 
                  value={leaveForm.from}
                  onChange={(e) => handleInputChange("from", e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-to">To Date</Label>
                <Input 
                  id="edit-to" 
                  type="date" 
                  value={leaveForm.to}
                  onChange={(e) => handleInputChange("to", e.target.value)}
                  required 
                />
              </div>
            </div>
            {leaveForm.from && leaveForm.to && (
              <div className="text-sm text-muted-foreground">
                Total days: {calculateDays(leaveForm.from, leaveForm.to)}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-reason">Reason</Label>
              <Textarea 
                id="edit-reason" 
                placeholder="Enter reason for leave" 
                value={leaveForm.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                required 
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">Update Request</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Leave Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this leave request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Request</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Leave;