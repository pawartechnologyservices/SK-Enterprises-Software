import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Download, FileText, Calendar, TrendingUp, Search, Filter, Plus, Eye, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const reportSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["Attendance", "Financial", "Tasks", "Performance", "Leave", "Inventory"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  format: z.enum(["PDF", "Excel", "CSV"]),
});

type Report = {
  id: number;
  name: string;
  type: string;
  date: string;
  status: "Ready" | "Processing" | "Failed";
  generatedAt: string;
  fileSize?: string;
  downloadCount: number;
};

const AdminReports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [reports, setReports] = useState<Report[]>([
    { 
      id: 1, 
      name: "Monthly Attendance Report", 
      type: "Attendance", 
      date: "Jan 2025", 
      status: "Ready",
      generatedAt: "2025-01-15 10:30 AM",
      fileSize: "2.4 MB",
      downloadCount: 24
    },
    { 
      id: 2, 
      name: "Financial Summary Q4 2024", 
      type: "Financial", 
      date: "Dec 2024", 
      status: "Ready",
      generatedAt: "2024-12-31 03:15 PM",
      fileSize: "1.8 MB",
      downloadCount: 18
    },
    { 
      id: 3, 
      name: "Task Completion Report", 
      type: "Tasks", 
      date: "Jan 2025", 
      status: "Processing",
      generatedAt: "2025-01-20 09:45 AM",
      downloadCount: 0
    },
    { 
      id: 4, 
      name: "Employee Performance Review", 
      type: "Performance", 
      date: "Jan 2025", 
      status: "Ready",
      generatedAt: "2025-01-18 02:20 PM",
      fileSize: "3.1 MB",
      downloadCount: 12
    },
    { 
      id: 5, 
      name: "Leave Balance Summary", 
      type: "Leave", 
      date: "Jan 2025", 
      status: "Failed",
      generatedAt: "2025-01-19 11:10 AM",
      downloadCount: 0
    },
    { 
      id: 6, 
      name: "Inventory Status Report", 
      type: "Inventory", 
      date: "Jan 2025", 
      status: "Ready",
      generatedAt: "2025-01-16 04:30 PM",
      fileSize: "1.2 MB",
      downloadCount: 8
    },
  ]);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      type: "Attendance",
      startDate: "",
      endDate: "",
      format: "PDF",
    },
  });

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle report download
  const handleDownload = (report: Report) => {
    if (report.status !== "Ready") {
      toast.error(`Cannot download - report is ${report.status.toLowerCase()}`);
      return;
    }

    // Simulate download process
    toast.success(`Downloading ${report.name}...`);
    
    // Update download count
    setReports(reports.map(r => 
      r.id === report.id ? { ...r, downloadCount: r.downloadCount + 1 } : r
    ));
  };

  // Handle report generation
  const onSubmit = (values: z.infer<typeof reportSchema>) => {
    // Simulate report generation process
    toast.info("Generating report... This may take a few moments.");
    
    setTimeout(() => {
      const newReport: Report = {
        id: Math.max(0, ...reports.map(r => r.id)) + 1,
        name: values.title,
        type: values.type,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        status: "Ready",
        generatedAt: new Date().toLocaleString(),
        fileSize: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
        downloadCount: 0,
      };
      
      setReports([newReport, ...reports]);
      setGenerateDialogOpen(false);
      form.reset();
      toast.success("Report generated successfully!");
    }, 2000);
  };

  // Handle quick report generation
  const handleQuickGenerate = (type: string) => {
    const reportTypes = {
      Attendance: "Monthly Attendance Summary",
      Performance: "Performance Review Report",
      Leave: "Leave Balance Summary",
      Financial: "Financial Overview Report",
    };

    const reportName = reportTypes[type as keyof typeof reportTypes] || `${type} Report`;
    
    toast.info(`Generating ${reportName}...`);
    
    setTimeout(() => {
      const newReport: Report = {
        id: Math.max(0, ...reports.map(r => r.id)) + 1,
        name: reportName,
        type: type,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        status: "Ready",
        generatedAt: new Date().toLocaleString(),
        fileSize: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
        downloadCount: 0,
      };
      
      setReports([newReport, ...reports]);
      toast.success(`${reportName} generated successfully!`);
    }, 1500);
  };

  // Handle view report details
  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  // Handle retry failed report
  const handleRetry = (reportId: number) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, status: "Processing" } : r
    ));
    
    toast.info("Retrying report generation...");
    
    setTimeout(() => {
      setReports(reports.map(r => 
        r.id === reportId ? { 
          ...r, 
          status: "Ready",
          generatedAt: new Date().toLocaleString(),
          fileSize: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`
        } : r
      ));
      toast.success("Report generated successfully!");
    }, 2000);
  };

  // Handle delete report
  const handleDelete = (reportId: number) => {
    const reportName = reports.find(r => r.id === reportId)?.name;
    setReports(reports.filter(r => r.id !== reportId));
    toast.success(`Report "${reportName}" deleted successfully!`);
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Ready': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'Processing': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Failed': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Ready': return 'default';
      case 'Processing': return 'secondary';
      case 'Failed': return 'destructive';
      default: return 'outline';
    }
  };

  // Statistics
  const stats = {
    total: reports.length,
    ready: reports.filter(r => r.status === 'Ready').length,
    processing: reports.filter(r => r.status === 'Processing').length,
    totalDownloads: reports.reduce((sum, report) => sum + report.downloadCount, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Reports & Analytics" subtitle="Generate and download system reports" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Generated this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready to Download</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ready}</div>
              <p className="text-xs text-muted-foreground">Available reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDownloads}</div>
              <p className="text-xs text-muted-foreground">All time downloads</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.processing}</div>
              <p className="text-xs text-muted-foreground">Being generated</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Available Reports</CardTitle>
            <Button onClick={() => setGenerateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Attendance">Attendance</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Tasks">Tasks</SelectItem>
                    <SelectItem value="Performance">Performance</SelectItem>
                    <SelectItem value="Leave">Leave</SelectItem>
                    <SelectItem value="Inventory">Inventory</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Ready">Ready</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No reports found matching your criteria
                </div>
              ) : (
                filteredReports.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium">{report.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Generated: {report.generatedAt}
                            {report.fileSize && ` • ${report.fileSize}`}
                            {report.downloadCount > 0 && ` • ${report.downloadCount} downloads`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{report.type}</Badge>
                        <Badge variant={getStatusColor(report.status)} className="flex items-center gap-1">
                          {getStatusIcon(report.status)}
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(report)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDownload(report)}
                        disabled={report.status !== "Ready"}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      {report.status === "Failed" && (
                        <Button
                          variant="outline"
                          onClick={() => handleRetry(report.id)}
                          className="flex items-center gap-2"
                        >
                          <Clock className="h-4 w-4" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Generate Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Generate Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => handleQuickGenerate("Attendance")}
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm">Attendance</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => handleQuickGenerate("Performance")}
              >
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Performance</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => handleQuickGenerate("Leave")}
              >
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Leave Summary</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => handleQuickGenerate("Financial")}
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm">Financial</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generate Report Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
            <DialogDescription>
              Create a custom report with specific parameters and timeframe.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter report title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Attendance">Attendance</SelectItem>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="Tasks">Tasks</SelectItem>
                        <SelectItem value="Performance">Performance</SelectItem>
                        <SelectItem value="Leave">Leave</SelectItem>
                        <SelectItem value="Inventory">Inventory</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Output Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="CSV">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setGenerateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Generate Report
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Report Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedReport.name}</h3>
                <p className="text-muted-foreground">{selectedReport.type} Report</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedReport.status)}
                    <Badge variant={getStatusColor(selectedReport.status)}>
                      {selectedReport.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Generated</label>
                  <p className="font-medium">{selectedReport.generatedAt}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">File Size</label>
                  <p className="font-medium">{selectedReport.fileSize || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Downloads</label>
                  <p className="font-medium">{selectedReport.downloadCount}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleDownload(selectedReport)}
                  disabled={selectedReport.status !== "Ready"}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                {selectedReport.status === "Failed" && (
                  <Button
                    variant="outline"
                    onClick={() => handleRetry(selectedReport.id)}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Retry
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReports;