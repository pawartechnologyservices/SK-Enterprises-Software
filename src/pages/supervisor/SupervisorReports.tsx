import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const SupervisorReports = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reports] = useState([
    { id: 1, title: "Daily Site Report", date: "2025-01-10", status: "submitted", type: "Site" },
    { id: 2, title: "Weekly Progress Report", date: "2025-01-07", status: "submitted", type: "Progress" },
    { id: 3, title: "Employee Attendance Summary", date: "2025-01-05", status: "submitted", type: "Attendance" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Report uploaded successfully!");
    setDialogOpen(false);
  };

  const handleDownload = (title: string) => {
    toast.success(`Downloading ${title}...`);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Reports" subtitle="Upload and manage reports" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Report</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Report Title</Label>
                  <Input id="title" placeholder="Enter report title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter description" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <Input id="file" type="file" required />
                </div>
                <Button type="submit" className="w-full">Submit Report</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submitted Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                    <Badge variant="outline">{report.type}</Badge>
                    <Badge variant="default">{report.status}</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(report.title)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SupervisorReports;
