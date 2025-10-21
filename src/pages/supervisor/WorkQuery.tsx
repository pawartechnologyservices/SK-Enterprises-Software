import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Plus, 
  Upload, 
  FileText, 
  Image, 
  Video, 
  X, 
  Eye, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  MessageCircle, 
  Paperclip, 
  User, 
  BarChart3,
  Sparkles,
  Trash2,
  Car,
  Shield,
  Wifi
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Types
interface WorkQuery {
  id: number;
  queryId: string;
  title: string;
  description: string;
  type: "task" | "service"; // New field to distinguish between task and service queries
  relatedId: string; // Can be taskId or serviceId
  relatedTo: string; // Task title or Service title
  employeeId?: string; // Only for task queries
  employeeName?: string; // Only for task queries
  serviceType?: "cleaning" | "waste-management" | "parking-management" | "security" | "maintenance"; // Only for service queries
  serviceStaffId?: string; // Only for service queries
  serviceStaffName?: string; // Only for service queries
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "in-progress" | "resolved" | "rejected";
  category: string;
  proofFiles: ProofFile[];
  supervisorId: string;
  supervisorName: string;
  createdAt: string;
  updatedAt: string;
  superadminResponse?: string;
  responseDate?: string;
}

interface ProofFile {
  id: number;
  name: string;
  type: "image" | "video" | "document" | "other";
  url: string;
  uploadDate: string;
  size: string;
}

interface AssignedTask {
  id: number;
  taskId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  deadline: string;
  status: "pending" | "in-progress" | "completed" | "delayed";
  priority: "low" | "medium" | "high";
}

interface FacilityService {
  id: number;
  serviceId: string;
  type: "cleaning" | "waste-management" | "parking-management" | "security" | "maintenance";
  title: string;
  description: string;
  location: string;
  assignedTo: string;
  assignedToName: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  schedule: string;
}

// Sample Data
const initialTasks: AssignedTask[] = [
  {
    id: 1,
    taskId: "TASK001",
    title: "Website Redesign - Homepage",
    description: "Redesign the company homepage with modern UI/UX principles",
    assignedTo: "EMP001",
    assignedToName: "Rajesh Kumar",
    deadline: "2024-02-15",
    status: "in-progress",
    priority: "high"
  },
  {
    id: 2,
    taskId: "TASK002",
    title: "Database Optimization",
    description: "Optimize database queries and improve performance",
    assignedTo: "EMP002",
    assignedToName: "Priya Sharma",
    deadline: "2024-02-20",
    status: "pending",
    priority: "medium"
  }
];

const initialServices: FacilityService[] = [
  {
    id: 1,
    serviceId: "CLEAN001",
    type: "cleaning",
    title: "Office Floor Deep Cleaning",
    description: "Complete deep cleaning of entire office floor including carpets, windows, and furniture",
    location: "Floor 3 - Main Office",
    assignedTo: "STAFF001",
    assignedToName: "Ramesh Kumar",
    status: "in-progress",
    schedule: "2024-02-15T09:00:00"
  },
  {
    id: 2,
    serviceId: "WASTE001",
    type: "waste-management",
    title: "Biomedical Waste Collection",
    description: "Urgent collection and disposal of biomedical waste from clinic area",
    location: "Building B - Clinic Wing",
    assignedTo: "STAFF002",
    assignedToName: "Suresh Patel",
    status: "pending",
    schedule: "2024-02-15T14:00:00"
  },
  {
    id: 3,
    serviceId: "PARK001",
    type: "parking-management",
    title: "Parking Lot Reorganization",
    description: "Reorganize parking lot markings and assign new parking slots",
    location: "Main Parking Lot - North Side",
    assignedTo: "STAFF003",
    assignedToName: "Anil Sharma",
    status: "completed",
    schedule: "2024-02-14T10:00:00"
  }
];

const initialWorkQueries: WorkQuery[] = [
  // Task-related queries
  {
    id: 1,
    queryId: "QUERY001",
    title: "Employee not following task guidelines",
    description: "The assigned employee is not following the established design guidelines for the homepage redesign. The color scheme and layout are inconsistent with our brand standards.",
    type: "task",
    relatedId: "TASK001",
    relatedTo: "Website Redesign - Homepage",
    employeeId: "EMP001",
    employeeName: "Rajesh Kumar",
    priority: "high",
    status: "pending",
    category: "work-quality",
    proofFiles: [
      {
        id: 1,
        name: "screenshot-design-issue.png",
        type: "image",
        url: "#",
        uploadDate: "2024-02-01",
        size: "2.4 MB"
      }
    ],
    supervisorId: "SUP001",
    supervisorName: "Supervisor User",
    createdAt: "2024-02-01T10:30:00",
    updatedAt: "2024-02-01T10:30:00"
  },
  // Service-related queries
  {
    id: 2,
    queryId: "QUERY002",
    title: "Cleaning service not meeting standards",
    description: "The deep cleaning service performed today did not meet the expected standards. Dust accumulation visible in corners and windows not properly cleaned.",
    type: "service",
    relatedId: "CLEAN001",
    relatedTo: "Office Floor Deep Cleaning",
    serviceType: "cleaning",
    serviceStaffId: "STAFF001",
    serviceStaffName: "Ramesh Kumar",
    priority: "high",
    status: "in-progress",
    category: "service-quality",
    proofFiles: [
      {
        id: 1,
        name: "dust-corner.jpg",
        type: "image",
        url: "#",
        uploadDate: "2024-02-15",
        size: "1.8 MB"
      },
      {
        id: 2,
        name: "dirty-window.jpg",
        type: "image",
        url: "#",
        uploadDate: "2024-02-15",
        size: "2.1 MB"
      }
    ],
    supervisorId: "SUP001",
    supervisorName: "Supervisor User",
    createdAt: "2024-02-15T11:20:00",
    updatedAt: "2024-02-15T11:20:00",
    superadminResponse: "We will arrange for re-cleaning and provide additional training to the staff.",
    responseDate: "2024-02-15T14:30:00"
  },
  {
    id: 3,
    queryId: "QUERY003",
    title: "Waste not collected on time",
    description: "Scheduled waste collection for biomedical waste was missed. Waste bins are overflowing and creating hygiene issues in clinic area.",
    type: "service",
    relatedId: "WASTE001",
    relatedTo: "Biomedical Waste Collection",
    serviceType: "waste-management",
    serviceStaffId: "STAFF002",
    serviceStaffName: "Suresh Patel",
    priority: "critical",
    status: "pending",
    category: "service-delay",
    proofFiles: [
      {
        id: 1,
        name: "overflowing-bins.jpg",
        type: "image",
        url: "#",
        uploadDate: "2024-02-15",
        size: "2.5 MB"
      }
    ],
    supervisorId: "SUP001",
    supervisorName: "Supervisor User",
    createdAt: "2024-02-15T16:45:00",
    updatedAt: "2024-02-15T16:45:00"
  },
  {
    id: 4,
    queryId: "QUERY004",
    title: "Parking slots not properly marked",
    description: "New parking slots are not clearly marked and numbered. Employees are confused about assigned parking areas.",
    type: "service",
    relatedId: "PARK001",
    relatedTo: "Parking Lot Reorganization",
    serviceType: "parking-management",
    serviceStaffId: "STAFF003",
    serviceStaffName: "Anil Sharma",
    priority: "medium",
    status: "resolved",
    category: "service-quality",
    proofFiles: [
      {
        id: 1,
        name: "parking-markings.jpg",
        type: "image",
        url: "#",
        uploadDate: "2024-02-14",
        size: "3.2 MB"
      }
    ],
    supervisorId: "SUP001",
    supervisorName: "Supervisor User",
    createdAt: "2024-02-14T15:30:00",
    updatedAt: "2024-02-15T10:15:00",
    superadminResponse: "Parking attendant has been instructed to re-mark all slots clearly. Work completed today.",
    responseDate: "2024-02-15T10:15:00"
  }
];

const categories = [
  "work-quality",
  "deadline-missed",
  "technical-issue",
  "communication-issue",
  "resource-needed",
  "behavioral-issue",
  "service-quality",
  "service-delay",
  "safety-issue",
  "other"
];

const categoryLabels: { [key: string]: string } = {
  "work-quality": "Work Quality Issue",
  "deadline-missed": "Deadline Missed",
  "technical-issue": "Technical Issue",
  "communication-issue": "Communication Issue",
  "resource-needed": "Resources Needed",
  "behavioral-issue": "Behavioral Issue",
  "service-quality": "Service Quality Issue",
  "service-delay": "Service Delay",
  "safety-issue": "Safety Issue",
  "other": "Other"
};

const serviceTypeLabels: { [key: string]: string } = {
  "cleaning": "Cleaning Service",
  "waste-management": "Waste Management",
  "parking-management": "Parking Management",
  "security": "Security Service",
  "maintenance": "Maintenance"
};

const serviceIcons: { [key: string]: any } = {
  "cleaning": Sparkles,
  "waste-management": Trash2,
  "parking-management": Car,
  "security": Shield,
  "maintenance": Wifi
};

// Reusable Components
const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200"
  };

  const icons = {
    low: <CheckCircle className="h-3 w-3" />,
    medium: <Clock className="h-3 w-3" />,
    high: <AlertCircle className="h-3 w-3" />,
    critical: <AlertCircle className="h-3 w-3" />
  };

  return (
    <Badge variant="outline" className={styles[priority as keyof typeof styles]}>
      <span className="flex items-center gap-1">
        {icons[priority as keyof typeof icons]}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200"
  };

  const icons = {
    pending: <Clock className="h-3 w-3" />,
    "in-progress": <AlertCircle className="h-3 w-3" />,
    resolved: <CheckCircle className="h-3 w-3" />,
    rejected: <X className="h-3 w-3" />
  };

  return (
    <Badge variant="outline" className={styles[status as keyof typeof styles]}>
      <span className="flex items-center gap-1">
        {icons[status as keyof typeof icons]}
        {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    </Badge>
  );
};

const QueryTypeBadge = ({ type }: { type: string }) => {
  const styles = {
    task: "bg-purple-100 text-purple-800 border-purple-200",
    service: "bg-blue-100 text-blue-800 border-blue-200"
  };

  const icons = {
    task: <User className="h-3 w-3" />,
    service: <Sparkles className="h-3 w-3" />
  };

  return (
    <Badge variant="outline" className={styles[type as keyof typeof styles]}>
      <span className="flex items-center gap-1">
        {icons[type as keyof typeof icons]}
        {type.charAt(0).toUpperCase() + type.slice(1)} Related
      </span>
    </Badge>
  );
};

const ServiceTypeBadge = ({ type }: { type: string }) => {
  const Icon = serviceIcons[type] || Sparkles;
  const styles = {
    cleaning: "bg-blue-100 text-blue-800 border-blue-200",
    "waste-management": "bg-green-100 text-green-800 border-green-200",
    "parking-management": "bg-purple-100 text-purple-800 border-purple-200",
    "security": "bg-orange-100 text-orange-800 border-orange-200",
    "maintenance": "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <Badge variant="outline" className={styles[type as keyof typeof styles]}>
      <span className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {serviceTypeLabels[type]}
      </span>
    </Badge>
  );
};

const FileIcon = ({ type }: { type: string }) => {
  const icons = {
    image: <Image className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    document: <FileText className="h-4 w-4" />,
    other: <Paperclip className="h-4 w-4" />
  };

  return icons[type as keyof typeof icons] || <Paperclip className="h-4 w-4" />;
};

const FilePreview = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const getFileType = (fileType: string): "image" | "video" | "document" | "other" => {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('text')) return 'document';
    return 'other';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <FileIcon type={getFileType(file.type)} />
        </div>
        <div>
          <div className="font-medium text-sm">{file.name}</div>
          <div className="text-xs text-muted-foreground">
            {formatFileSize(file.size)} • {getFileType(file.type).charAt(0).toUpperCase() + getFileType(file.type).slice(1)}
          </div>
        </div>
      </div>
      <Button
        size="sm"
        variant="destructive"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

// Main Component
const WorkQuery = () => {
  const [workQueries, setWorkQueries] = useState<WorkQuery[]>(initialWorkQueries);
  const [tasks, setTasks] = useState<AssignedTask[]>(initialTasks);
  const [services, setServices] = useState<FacilityService[]>(initialServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New query form state
  const [newQuery, setNewQuery] = useState({
    type: "task" as "task" | "service",
    title: "",
    description: "",
    relatedId: "",
    priority: "medium" as "low" | "medium" | "high" | "critical",
    category: "work-quality"
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Filter work queries
  const filteredQueries = workQueries.filter(query => {
    const matchesSearch = 
      query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.queryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.relatedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || query.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || query.priority === priorityFilter;
    const matchesType = typeFilter === "all" || query.type === typeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      
      // Check file sizes (max 10MB per file)
      const oversizedFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast.error("Some files exceed the 10MB size limit");
        return;
      }

      // Check total files count (max 5 files)
      if (uploadedFiles.length + newFiles.length > 5) {
        toast.error("Maximum 5 files allowed per query");
        return;
      }

      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) uploaded successfully`);
    }
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle related item selection
  const handleRelatedItemSelect = (itemId: string) => {
    setNewQuery(prev => ({ ...prev, relatedId: itemId }));
  };

  // Get related items based on selected type
  const getRelatedItems = () => {
    if (newQuery.type === "task") {
      return tasks;
    } else {
      return services;
    }
  };

  // Get selected related item details
  const getSelectedRelatedItem = () => {
    if (!newQuery.relatedId) return null;
    
    if (newQuery.type === "task") {
      return tasks.find(task => task.taskId === newQuery.relatedId);
    } else {
      return services.find(service => service.serviceId === newQuery.relatedId);
    }
  };

  // Handle form submission
  const handleSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newQuery.title || !newQuery.description || !newQuery.relatedId) {
      toast.error("Please fill all required fields");
      return;
    }

    const selectedItem = getSelectedRelatedItem();
    if (!selectedItem) {
      toast.error("Selected item not found");
      return;
    }

    // Create new query
    const newWorkQuery: WorkQuery = {
      id: workQueries.length + 1,
      queryId: `QUERY${String(workQueries.length + 1).padStart(3, '0')}`,
      title: newQuery.title,
      description: newQuery.description,
      type: newQuery.type,
      relatedId: newQuery.relatedId,
      relatedTo: 'taskId' in selectedItem ? selectedItem.title : selectedItem.title,
      priority: newQuery.priority,
      status: "pending",
      category: newQuery.category,
      proofFiles: uploadedFiles.map((file, index) => ({
        id: index + 1,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 
              file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text') ? 'document' : 'other',
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      })),
      supervisorId: "SUP001",
      supervisorName: "Supervisor User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add additional fields based on type
    if (newQuery.type === "task" && 'assignedTo' in selectedItem) {
      newWorkQuery.employeeId = selectedItem.assignedTo;
      newWorkQuery.employeeName = selectedItem.assignedToName;
    } else if (newQuery.type === "service" && 'type' in selectedItem) {
      newWorkQuery.serviceType = selectedItem.type;
      newWorkQuery.serviceStaffId = selectedItem.assignedTo;
      newWorkQuery.serviceStaffName = selectedItem.assignedToName;
    }

    setWorkQueries(prev => [newWorkQuery, ...prev]);
    
    // Reset form
    setNewQuery({
      type: "task",
      title: "",
      description: "",
      relatedId: "",
      priority: "medium",
      category: "work-quality"
    });
    setUploadedFiles([]);
    setIsDialogOpen(false);
    
    toast.success("Work query submitted successfully!");
  };

  // Get statistics
  const statusCounts = {
    pending: workQueries.filter(q => q.status === "pending").length,
    "in-progress": workQueries.filter(q => q.status === "in-progress").length,
    resolved: workQueries.filter(q => q.status === "resolved").length,
    rejected: workQueries.filter(q => q.status === "rejected").length
  };

  const priorityCounts = {
    low: workQueries.filter(q => q.priority === "low").length,
    medium: workQueries.filter(q => q.priority === "medium").length,
    high: workQueries.filter(q => q.priority === "high").length,
    critical: workQueries.filter(q => q.priority === "critical").length
  };

  const typeCounts = {
    task: workQueries.filter(q => q.type === "task").length,
    service: workQueries.filter(q => q.type === "service").length
  };

  const serviceTypeCounts = {
    cleaning: workQueries.filter(q => q.serviceType === "cleaning").length,
    "waste-management": workQueries.filter(q => q.serviceType === "waste-management").length,
    "parking-management": workQueries.filter(q => q.serviceType === "parking-management").length,
    "security": workQueries.filter(q => q.serviceType === "security").length,
    "maintenance": workQueries.filter(q => q.serviceType === "maintenance").length
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Work Query Management" 
        subtitle="Report and track issues with assigned tasks and facility services"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{workQueries.length}</div>
              <p className="text-xs text-muted-foreground">All queries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Task Queries</CardTitle>
              <User className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{typeCounts.task}</div>
              <p className="text-xs text-muted-foreground">Employee task issues</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Queries</CardTitle>
              <Sparkles className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{typeCounts.service}</div>
              <p className="text-xs text-muted-foreground">Facility service issues</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
        </div>

        {/* Service Type Distribution */}
        <div className="grid gap-4 md:grid-cols-5">
          {Object.entries(serviceTypeCounts).map(([type, count]) => {
            if (count === 0) return null;
            const Icon = serviceIcons[type];
            return (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {serviceTypeLabels[type]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground">
                    {typeCounts.service > 0 ? Math.round((count / typeCounts.service) * 100) : 0}% of service queries
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Header with Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Work Queries</CardTitle>
                <CardDescription>
                  Manage and track issues with employee tasks and facility services
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Query
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Work Query</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitQuery} className="space-y-6">
                      {/* Query Type Selection */}
                      <div className="grid gap-4">
                        <h3 className="text-lg font-semibold">Query Type</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            newQuery.type === "task" 
                              ? "border-purple-500 bg-purple-50" 
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setNewQuery(prev => ({ ...prev, type: "task", relatedId: "" }))}>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <User className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <div className="font-medium">Task Related</div>
                                <div className="text-sm text-muted-foreground">Issues with employee assigned tasks</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            newQuery.type === "service" 
                              ? "border-blue-500 bg-blue-50" 
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setNewQuery(prev => ({ ...prev, type: "service", relatedId: "" }))}>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Sparkles className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">Service Related</div>
                                <div className="text-sm text-muted-foreground">Issues with facility services</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Basic Information */}
                      <div className="grid gap-4">
                        <h3 className="text-lg font-semibold">Query Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Query Title *</Label>
                            <Input
                              id="title"
                              value={newQuery.title}
                              onChange={(e) => setNewQuery(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Brief description of the issue"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select 
                              value={newQuery.category} 
                              onValueChange={(value) => setNewQuery(prev => ({ ...prev, category: value }))}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category} value={category}>
                                    {categoryLabels[category]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Detailed Description *</Label>
                          <Textarea
                            id="description"
                            value={newQuery.description}
                            onChange={(e) => setNewQuery(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Provide detailed information about the issue, including specific problems, impact, and any relevant context..."
                            rows={4}
                            required
                          />
                        </div>
                      </div>

                      {/* Related Item Selection */}
                      <div className="grid gap-4">
                        <h3 className="text-lg font-semibold">
                          Related {newQuery.type === "task" ? "Task" : "Service"}
                        </h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="relatedItem">
                            Select {newQuery.type === "task" ? "Task" : "Service"} *
                          </Label>
                          <Select 
                            value={newQuery.relatedId} 
                            onValueChange={handleRelatedItemSelect}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Choose ${newQuery.type === "task" ? "assigned task" : "facility service"}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {getRelatedItems().map(item => (
                                <SelectItem 
                                  key={'taskId' in item ? item.taskId : item.serviceId} 
                                  value={'taskId' in item ? item.taskId : item.serviceId}
                                >
                                  <div className="flex flex-col">
                                    <span>{item.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {newQuery.type === "task" 
                                        ? `Assigned to: ${(item as AssignedTask).assignedToName}`
                                        : `Type: ${serviceTypeLabels[(item as FacilityService).type]}`
                                      }
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Selected Item Details */}
                        {getSelectedRelatedItem() && (
                          <div className="p-4 border rounded-lg bg-gray-50">
                            <Label className="font-semibold">Selected {newQuery.type === "task" ? "Task" : "Service"} Details</Label>
                            <div className="mt-2 space-y-2 text-sm">
                              <div><strong>Title:</strong> {getSelectedRelatedItem()?.title}</div>
                              <div><strong>Description:</strong> {getSelectedRelatedItem()?.description}</div>
                              {newQuery.type === "task" ? (
                                <div><strong>Assigned To:</strong> {(getSelectedRelatedItem() as AssignedTask).assignedToName}</div>
                              ) : (
                                <div>
                                  <strong>Service Type:</strong> 
                                  <ServiceTypeBadge type={(getSelectedRelatedItem() as FacilityService).type} />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority Level *</Label>
                          <Select 
                            value={newQuery.priority} 
                            onValueChange={(value) => setNewQuery(prev => ({ ...prev, priority: value as any }))}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low Priority</SelectItem>
                              <SelectItem value="medium">Medium Priority</SelectItem>
                              <SelectItem value="high">High Priority</SelectItem>
                              <SelectItem value="critical">Critical Priority</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* File Upload Section */}
                      <div className="grid gap-4">
                        <h3 className="text-lg font-semibold">Supporting Evidence</h3>
                        
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Upload screenshots, photos, documents, or other proof (Max 5 files, 10MB each)
                          </p>
                          <Input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                          />
                          <Label htmlFor="file-upload">
                            <Button variant="outline" className="mt-4" asChild>
                              <span>Choose Files</span>
                            </Button>
                          </Label>
                        </div>

                        {/* Uploaded Files List */}
                        {uploadedFiles.length > 0 && (
                          <div className="space-y-3">
                            <Label>Uploaded Files ({uploadedFiles.length}/5)</Label>
                            <div className="space-y-2">
                              {uploadedFiles.map((file, index) => (
                                <FilePreview 
                                  key={index} 
                                  file={file} 
                                  onRemove={() => handleRemoveFile(index)} 
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="flex gap-2 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                          Submit Query
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search queries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="task">Task Related</SelectItem>
                    <SelectItem value="service">Service Related</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Actions</Label>
                <Button variant="outline" className="w-full" onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setTypeFilter("all");
                }}>
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Queries Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Related To</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Proof Files</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueries.map((query) => (
                  <TableRow key={query.id}>
                    <TableCell className="font-medium">{query.queryId}</TableCell>
                    <TableCell>
                      <QueryTypeBadge type={query.type} />
                      {query.serviceType && (
                        <div className="mt-1">
                          <ServiceTypeBadge type={query.serviceType} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">{query.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {query.description.substring(0, 50)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium text-sm">{query.relatedTo}</div>
                        <div className="text-xs text-muted-foreground">{query.relatedId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {query.type === "task" ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">{query.employeeName}</div>
                            <div className="text-xs text-muted-foreground">{query.employeeId}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">{query.serviceStaffName}</div>
                            <div className="text-xs text-muted-foreground">{query.serviceStaffId}</div>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {categoryLabels[query.category]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={query.priority} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={query.status} />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(query.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(query.createdAt).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{query.proofFiles.length}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Query Details - {query.queryId}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Query Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="font-semibold">Query Type</Label>
                                <div className="mt-1">
                                  <QueryTypeBadge type={query.type} />
                                </div>
                              </div>
                              <div>
                                <Label className="font-semibold">Category</Label>
                                <Badge className="mt-1">{categoryLabels[query.category]}</Badge>
                              </div>
                              <div>
                                <Label className="font-semibold">Priority</Label>
                                <div className="mt-1">
                                  <PriorityBadge priority={query.priority} />
                                </div>
                              </div>
                              <div>
                                <Label className="font-semibold">Status</Label>
                                <div className="mt-1">
                                  <StatusBadge status={query.status} />
                                </div>
                              </div>
                            </div>

                            {/* Related Item Information */}
                            <div>
                              <Label className="font-semibold">
                                Related {query.type === "task" ? "Task" : "Service"}
                              </Label>
                              <div className="mt-1 p-3 border rounded-lg">
                                <div className="font-medium">{query.relatedTo}</div>
                                <div className="text-sm text-muted-foreground">ID: {query.relatedId}</div>
                                {query.serviceType && (
                                  <div className="mt-2">
                                    <ServiceTypeBadge type={query.serviceType} />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Assigned To Information */}
                            <div>
                              <Label className="font-semibold">
                                {query.type === "task" ? "Assigned Employee" : "Service Staff"}
                              </Label>
                              <div className="flex items-center gap-2 mt-1 p-3 border rounded-lg">
                                {query.type === "task" ? (
                                  <>
                                    <User className="h-4 w-4" />
                                    <div>
                                      <div className="font-medium">{query.employeeName}</div>
                                      <div className="text-sm text-muted-foreground">{query.employeeId}</div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="h-4 w-4" />
                                    <div>
                                      <div className="font-medium">{query.serviceStaffName}</div>
                                      <div className="text-sm text-muted-foreground">{query.serviceStaffId}</div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <Label className="font-semibold">Description</Label>
                              <p className="mt-1 text-sm whitespace-pre-wrap">{query.description}</p>
                            </div>

                            {/* Proof Files */}
                            {query.proofFiles.length > 0 && (
                              <div>
                                <Label className="font-semibold">Supporting Evidence</Label>
                                <div className="grid gap-2 mt-2">
                                  {query.proofFiles.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                          <FileIcon type={file.type} />
                                        </div>
                                        <div>
                                          <div className="font-medium">{file.name}</div>
                                          <div className="text-xs text-muted-foreground">
                                            {file.size} • {file.type} • {new Date(file.uploadDate).toLocaleDateString()}
                                          </div>
                                        </div>
                                      </div>
                                      <Button size="sm" variant="outline">
                                        Download
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Superadmin Response */}
                            {query.superadminResponse && (
                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <Label className="font-semibold text-blue-900">Superadmin Response</Label>
                                <p className="mt-1 text-sm text-blue-800 whitespace-pre-wrap">
                                  {query.superadminResponse}
                                </p>
                                {query.responseDate && (
                                  <div className="text-xs text-blue-600 mt-2">
                                    Responded on: {new Date(query.responseDate).toLocaleString()}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredQueries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No queries found</h3>
                <p>No work queries match your current filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default WorkQuery;