import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Leave = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leaveRequests] = useState([
    { id: 1, type: "Casual Leave", from: "2025-01-25", to: "2025-01-26", days: 2, status: "pending", reason: "Personal work" },
    { id: 2, type: "Sick Leave", from: "2025-01-02", to: "2025-01-04", days: 3, status: "approved", reason: "Medical checkup" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Leave request submitted to Admin!");
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Leave Management" subtitle="Apply for leave" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md w-[95vw] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Employee Information */}
                <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="employeeName" className="text-sm">Employee Name</Label>
                    <Input 
                      id="employeeName" 
                      value="John Doe" 
                      readOnly 
                      className="bg-background h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId" className="text-sm">Employee ID</Label>
                    <Input 
                      id="employeeId" 
                      value="EMP001" 
                      readOnly 
                      className="bg-background h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm">Department</Label>
                    <Input 
                      id="department" 
                      value="Operations" 
                      readOnly 
                      className="bg-background h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber" className="text-sm">Contact Number</Label>
                    <Input 
                      id="contactNumber" 
                      value="+1 234 567 8900" 
                      readOnly 
                      className="bg-background h-9"
                    />
                  </div>
                </div>

                {/* Leave Details */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm">Leave Type</Label>
                  <Select required>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="casual">Casual Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from" className="text-sm">From Date</Label>
                    <Input id="from" type="date" required className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to" className="text-sm">To Date</Label>
                    <Input id="to" type="date" required className="h-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm">Reason</Label>
                  <Textarea 
                    id="reason" 
                    placeholder="Enter reason for leave" 
                    required 
                    className="min-h-[80px] resize-none"
                  />
                </div>
                <Button type="submit" className="w-full h-9">Submit to Admin</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveRequests.map((leave) => (
                <motion.div
                  key={leave.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{leave.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {leave.from} to {leave.to} ({leave.days} days)
                      </p>
                    </div>
                    <Badge
                      variant={leave.status === "approved" ? "default" : "secondary"}
                    >
                      {leave.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Reason: {leave.reason}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Leave;