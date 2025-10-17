import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, RefreshCw, Eye, Filter, Calendar } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";

const ManagerReports = () => {
  const [reports, setReports] = useState([
    { 
      id: 1, 
      name: "Weekly Task Summary", 
      date: "Week 2, Jan 2025", 
      status: "Ready",
      type: "weekly",
      size: "2.4 MB",
      downloads: 15
    },
    { 
      id: 2, 
      name: "Supervisor Performance", 
      date: "Jan 2025", 
      status: "Ready",
      type: "monthly",
      size: "1.8 MB",
      downloads: 8
    },
    { 
      id: 3, 
      name: "Site Operations Report", 
      date: "Jan 2025", 
      status: "Processing",
      type: "monthly",
      size: "3.2 MB",
      downloads: 0
    },
    { 
      id: 4, 
      name: "Daily Activity Log", 
      date: "Jan 15, 2025", 
      status: "Ready",
      type: "daily",
      size: "1.1 MB",
      downloads: 23
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter reports based on selection
  const filteredReports = reports.filter(report => {
    if (filter === "all") return true;
    return report.type === filter;
  });

  const handleDownload = (reportName: string, reportId: number) => {
    // Simulate download process
    toast.success(`Downloading ${reportName}...`);
    
    // Update download count
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, downloads: report.downloads + 1 }
        : report
    ));
    
    // Simulate actual download (in real app, this would be an API call)
    setTimeout(() => {
      toast.success(`${reportName} downloaded successfully!`);
    }, 1500);
  };

  const handlePreview = (reportName: string) => {
    toast.info(`Opening preview for ${reportName}`);
    // In a real app, this would open a modal or new page with report preview
  };

  const handleRefreshReports = () => {
    setIsRefreshing(true);
    toast.info("Refreshing reports...");
    
    // Simulate API call to refresh reports
    setTimeout(() => {
      // Update processing reports to ready (simulating completion)
      setReports(prev => prev.map(report => 
        report.status === "Processing" 
          ? { ...report, status: "Ready" }
          : report
      ));
      setIsRefreshing(false);
      toast.success("Reports updated successfully!");
    }, 2000);
  };

  const handleGenerateNewReport = () => {
    toast.info("Opening report generator...");
    // In real app, this would open a modal or navigate to report generator
  };

  const handleExportAll = () => {
    const readyReports = reports.filter(report => report.status === "Ready");
    if (readyReports.length === 0) {
      toast.error("No ready reports to export");
      return;
    }
    
    toast.info(`Preparing ${readyReports.length} reports for export...`);
    // Simulate export process
    setTimeout(() => {
      toast.success("All reports exported successfully!");
    }, 2500);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Ready": return "default";
      case "Processing": return "secondary";
      case "Failed": return "destructive";
      default: return "default";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "daily": return "text-blue-600 bg-blue-100";
      case "weekly": return "text-green-600 bg-green-100";
      case "monthly": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Reports" 
        subtitle="View, download and manage your reports" 
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* Action Buttons */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-2">
                <Button
                  onClick={handleRefreshReports}
                  disabled={isRefreshing}
                  variant="outline"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
                
                <Button
                  onClick={handleGenerateNewReport}
                  variant="outline"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate New
                </Button>

                <Button
                  onClick={handleExportAll}
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export All
                </Button>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  <Filter className="mr-2 h-3 w-3" />
                  All
                </Button>
                <Button
                  variant={filter === "daily" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("daily")}
                >
                  Daily
                </Button>
                <Button
                  variant={filter === "weekly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("weekly")}
                >
                  Weekly
                </Button>
                <Button
                  variant={filter === "monthly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("monthly")}
                >
                  Monthly
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Available Reports</span>
              <Badge variant="outline">
                {filteredReports.length} reports
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No reports found for the selected filter.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium">{report.name}</h3>
                          <Badge 
                            variant="outline" 
                            className={getTypeColor(report.type)}
                          >
                            {report.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {report.date}
                          </div>
                          <span>•</span>
                          <span>{report.size}</span>
                          <span>•</span>
                          <span>{report.downloads} downloads</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusVariant(report.status)}>
                        {report.status}
                      </Badge>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePreview(report.name)}
                          variant="outline"
                          size="sm"
                          disabled={report.status !== "Ready"}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          onClick={() => handleDownload(report.name, report.id)}
                          disabled={report.status !== "Ready"}
                          size="sm"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {reports.filter(r => r.status === "Ready").length}
              </div>
              <div className="text-sm text-muted-foreground">Ready Reports</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {reports.reduce((total, report) => total + report.downloads, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Downloads</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {reports.filter(r => r.status === "Processing").length}
              </div>
              <div className="text-sm text-muted-foreground">Processing</div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ManagerReports;