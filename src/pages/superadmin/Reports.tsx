import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Reports = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const attendanceData = [
    { month: "Jan", present: 950, absent: 50 },
    { month: "Feb", present: 920, absent: 80 },
    { month: "Mar", present: 970, absent: 30 },
    { month: "Apr", present: 940, absent: 60 },
  ];

  const financialData = [
    { category: "Revenue", value: 150000 },
    { category: "Expenses", value: 80000 },
    { category: "Profit", value: 70000 },
  ];

  const taskData = [
    { name: "Completed", value: 142, color: "hsl(var(--primary))" },
    { name: "In Progress", value: 34, color: "hsl(var(--secondary))" },
    { name: "Pending", value: 28, color: "hsl(var(--muted))" },
  ];

  const attendanceReport = [
    { id: 1, employee: "John Doe", present: 22, absent: 2, leaves: 1, percentage: "91%" },
    { id: 2, employee: "Jane Smith", present: 23, absent: 1, leaves: 1, percentage: "95%" },
    { id: 3, employee: "Mike Johnson", present: 20, absent: 4, leaves: 1, percentage: "83%" },
  ];

  const handleDownloadReport = (reportType: string) => {
    toast.success(`${reportType} report downloaded as PDF`);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Reports & Analytics" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-40"
                />
                <span className="text-muted-foreground">to</span>
                <Input 
                  type="date" 
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-40"
                />
              </div>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="ops">Operations</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
              <Button>Apply Filters</Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="attendance">Attendance Report</TabsTrigger>
            <TabsTrigger value="financial">Financial Report</TabsTrigger>
            <TabsTrigger value="tasks">Task Report</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Attendance Analytics</CardTitle>
                <Button onClick={() => handleDownloadReport("Attendance")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="hsl(var(--primary))" />
                    <Bar dataKey="absent" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>

                <div>
                  <h3 className="font-semibold mb-4">Employee Attendance Details</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Present Days</TableHead>
                        <TableHead>Absent Days</TableHead>
                        <TableHead>Leaves</TableHead>
                        <TableHead>Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceReport.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.employee}</TableCell>
                          <TableCell>{record.present}</TableCell>
                          <TableCell>{record.absent}</TableCell>
                          <TableCell>{record.leaves}</TableCell>
                          <TableCell className="font-semibold text-primary">{record.percentage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Financial Summary</CardTitle>
                <Button onClick={() => handleDownloadReport("Financial")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={financialData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {financialData.map((item) => (
                      <Card key={item.category}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">{item.category}</p>
                              <p className="text-2xl font-bold">${item.value.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-primary" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Task Completion Report</CardTitle>
                <Button onClick={() => handleDownloadReport("Task")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={taskData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {taskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-4">
                    {taskData.map((item) => (
                      <Card key={item.name}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">{item.name}</p>
                              <p className="text-2xl font-bold">{item.value}</p>
                            </div>
                            <FileText className="h-8 w-8" style={{ color: item.color }} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Reports;
