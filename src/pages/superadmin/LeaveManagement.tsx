import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Search, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeRole: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
}

const LeaveManagement = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employeeName: "John Smith",
      employeeRole: "Manager",
      leaveType: "Annual Leave",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      days: 5,
      reason: "Family vacation",
      status: "pending",
      appliedOn: "2024-01-10"
    },
    {
      id: "2",
      employeeName: "Sarah Johnson",
      employeeRole: "Supervisor",
      leaveType: "Sick Leave",
      startDate: "2024-01-12",
      endDate: "2024-01-13",
      days: 2,
      reason: "Medical appointment",
      status: "pending",
      appliedOn: "2024-01-09"
    },
    {
      id: "3",
      employeeName: "Mike Davis",
      employeeRole: "Employee",
      leaveType: "Personal Leave",
      startDate: "2024-01-18",
      endDate: "2024-01-19",
      days: 2,
      reason: "Personal matter",
      status: "approved",
      appliedOn: "2024-01-08"
    }
  ]);

  const handleApprove = (id: string) => {
    setLeaveRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status: "approved" as const } : req)
    );
    toast({
      title: "Success",
      description: "Leave request approved",
    });
  };

  const handleReject = (id: string) => {
    setLeaveRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status: "rejected" as const } : req)
    );
    toast({
      title: "Success",
      description: "Leave request rejected",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredRequests = leaveRequests.filter(req =>
    req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.employeeRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = leaveRequests.filter(r => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Leave Management" 
        subtitle="Review and manage all leave requests"
        onMenuClick={onMenuClick}
      />

      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <CardTitle>All Leave Requests</CardTitle>
                    <CardDescription>
                      {pendingCount > 0 && (
                        <Badge variant="destructive" className="mt-1">
                          {pendingCount} Pending Approval
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="w-full md:w-auto flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, role, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No leave requests found
                  </div>
                ) : (
                  filteredRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg bg-muted/30"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{request.employeeName}</h4>
                            <p className="text-sm text-muted-foreground">{request.employeeRole}</p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Leave Type:</span>
                            <p className="font-medium">{request.leaveType}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <p className="font-medium">{request.days} days</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">From:</span>
                            <p className="font-medium">{request.startDate}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">To:</span>
                            <p className="font-medium">{request.endDate}</p>
                          </div>
                        </div>

                        <div>
                          <span className="text-sm text-muted-foreground">Reason:</span>
                          <p className="text-sm mt-1">{request.reason}</p>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Applied on: {request.appliedOn}
                        </div>

                        {request.status === "pending" && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(request.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaveManagement;
