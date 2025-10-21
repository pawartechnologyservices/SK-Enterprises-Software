import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, XCircle, Clock, Users, User, BarChart3, Download } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("my-attendance");
  
  // My Attendance Data
  const [myAttendance, setMyAttendance] = useState([
    { id: 1, date: "2024-01-15", checkIn: "09:00 AM", checkOut: "05:00 PM", status: "Present", hours: "8.0" },
    { id: 2, date: "2024-01-14", checkIn: "09:15 AM", checkOut: "05:30 PM", status: "Present", hours: "8.25" },
    { id: 3, date: "2024-01-13", checkIn: "09:05 AM", checkOut: "04:45 PM", status: "Present", hours: "7.67" },
    { id: 4, date: "2024-01-12", checkIn: "-", checkOut: "-", status: "Absent", hours: "0.0" },
    { id: 5, date: "2024-01-11", checkIn: "08:55 AM", checkOut: "05:15 PM", status: "Present", hours: "8.33" },
  ]);

  // Employee Attendance Data
  const [employeeAttendance, setEmployeeAttendance] = useState([
    { id: 1, name: "John Doe", shift: "Morning", date: "2024-01-15", checkIn: "09:00 AM", checkOut: "05:00 PM", status: true, hours: "8.0" },
    { id: 2, name: "Jane Smith", shift: "Evening", date: "2024-01-15", checkIn: "02:00 PM", checkOut: "10:00 PM", status: true, hours: "8.0" },
    { id: 3, name: "Mike Johnson", shift: "Morning", date: "2024-01-15", checkIn: "09:30 AM", checkOut: "05:15 PM", status: true, hours: "7.75" },
    { id: 4, name: "Sarah Wilson", shift: "Morning", date: "2024-01-15", checkIn: "-", checkOut: "-", status: false, hours: "0.0" },
    { id: 5, name: "David Brown", shift: "Evening", date: "2024-01-15", checkIn: "02:15 PM", checkOut: "10:30 PM", status: true, hours: "8.25" },
    { id: 6, name: "Emily Davis", shift: "Morning", date: "2024-01-15", checkIn: "08:45 AM", checkOut: "05:00 PM", status: true, hours: "8.25" },
  ]);

  // Current day stats for employees
  const presentCount = employeeAttendance.filter(e => e.status).length;
  const totalEmployees = employeeAttendance.length;

  // My attendance stats
  const myPresentCount = myAttendance.filter(e => e.status === "Present").length;
  const myTotalDays = myAttendance.length;

  // Toggle employee attendance
  const toggleEmployeeAttendance = (id: number) => {
    setEmployeeAttendance(employeeAttendance.map(emp => 
      emp.id === id ? { ...emp, status: !emp.status } : emp
    ));
    toast.success("Attendance updated!");
  };

  // Mark all employees
  const handleMarkAllEmployees = (present: boolean) => {
    setEmployeeAttendance(employeeAttendance.map(emp => ({ ...emp, status: present })));
    toast.success(`All employees marked as ${present ? "present" : "absent"}!`);
  };

  // Export attendance data
  const handleExportData = () => {
    toast.success("Attendance data exported successfully!");
  };

  // Get status badge color
  const getStatusBadge = (status: string | boolean) => {
    if (status === "Present" || status === true) {
      return "bg-green-100 text-green-800 border-green-200";
    } else {
      return "bg-red-100 text-red-800 border-red-200";
    }
  };

  // Get status text
  const getStatusText = (status: string | boolean) => {
    return status === "Present" || status === true ? "Present" : "Absent";
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Attendance Management" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="my-attendance" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              My Attendance
            </TabsTrigger>
            <TabsTrigger value="employee-attendance" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employee Attendance
            </TabsTrigger>
          </TabsList>

          {/* My Attendance Tab */}
          <TabsContent value="my-attendance" className="space-y-6">
            {/* Stats Cards for My Attendance */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Days</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{myTotalDays}</div>
                  <p className="text-xs text-muted-foreground">Tracked period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Present Days</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{myPresentCount}</div>
                  <p className="text-xs text-muted-foreground">Days attended</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
                  <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{myTotalDays - myPresentCount}</div>
                  <p className="text-xs text-muted-foreground">Days missed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((myPresentCount / myTotalDays) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Overall rate</p>
                </CardContent>
              </Card>
            </div>

            {/* My Attendance History */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <CardTitle>My Attendance History</CardTitle>
                    <CardDescription>Your attendance records for the past days</CardDescription>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Hours Worked</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myAttendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {record.checkIn}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {record.checkOut}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadge(record.status)}>
                            {record.status === "Present" ? (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            ) : (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {record.hours} hrs
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Current Day Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Check In Time</p>
                      <p className="text-2xl font-bold">09:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Current Status</p>
                      <p className="text-2xl font-bold text-green-600">Present</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Estimated Hours</p>
                      <p className="text-2xl font-bold">8.0 hrs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employee Attendance Tab */}
          <TabsContent value="employee-attendance" className="space-y-6">
            {/* Stats Cards for Employee Attendance */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEmployees}</div>
                  <p className="text-xs text-muted-foreground">All shifts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                  <p className="text-xs text-muted-foreground">Employees present</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
                  <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {totalEmployees - presentCount}
                  </div>
                  <p className="text-xs text-muted-foreground">Employees absent</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((presentCount / totalEmployees) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Overall rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Employee Attendance Management */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <CardTitle>Today's Employee Attendance</CardTitle>
                    <CardDescription>Manage attendance for all employees</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleMarkAllEmployees(true)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark All Present
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleMarkAllEmployees(false)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Mark All Absent
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead className="text-right">Mark Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeAttendance.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            employee.shift === "Morning" 
                              ? "bg-blue-100 text-blue-800 border-blue-200" 
                              : "bg-purple-100 text-purple-800 border-purple-200"
                          }>
                            {employee.shift}
                          </Badge>
                        </TableCell>
                        <TableCell>{employee.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {employee.checkIn}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {employee.checkOut}
                          </div>
                        </TableCell>
                        <TableCell>
                          {employee.status ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              Present
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-600">
                              <XCircle className="h-4 w-4" />
                              Absent
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {employee.hours} hrs
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm">
                              {getStatusText(employee.status)}
                            </span>
                            <Switch
                              checked={employee.status}
                              onCheckedChange={() => toggleEmployeeAttendance(employee.id)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Export Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Attendance
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Rate</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Best Month</span>
                      <span className="font-medium">January (95%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Shift Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Morning Shift</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Evening Shift</span>
                      <span className="font-medium">40%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Attendance;