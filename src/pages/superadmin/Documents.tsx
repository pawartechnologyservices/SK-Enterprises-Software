import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, FileText, Download, Eye, Trash2, Edit, FileUp } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Types
interface Document {
  id: string;
  name: string;
  type: "PDF" | "XLSX" | "DOCX" | "JPG" | "PNG";
  size: string;
  uploadedBy: string;
  date: string;
  category: "uploaded" | "generated" | "template";
  description?: string;
}

interface Template {
  id: string;
  name: string;
  type: string;
  description: string;
  lastModified: string;
}

interface Format {
  id: string;
  name: string;
  type: string;
  description: string;
  size: string;
}

// Dummy Data
const initialDocuments: Document[] = [
  {
    id: "1",
    name: "Employee Joining Form",
    type: "PDF",
    size: "2.4 MB",
    uploadedBy: "Admin User",
    date: "2024-01-15",
    category: "uploaded",
    description: "Standard employee joining form"
  },
  {
    id: "2",
    name: "Monthly Salary Report",
    type: "XLSX",
    size: "1.8 MB",
    uploadedBy: "HR Manager",
    date: "2024-01-14",
    category: "generated",
    description: "Automated salary report for January"
  },
  {
    id: "3",
    name: "Invoice Template",
    type: "DOCX",
    size: "0.8 MB",
    uploadedBy: "Finance Team",
    date: "2024-01-13",
    category: "template",
    description: "Standard invoice template"
  },
  {
    id: "4",
    name: "Attendance Sheet",
    type: "XLSX",
    size: "1.2 MB",
    uploadedBy: "Operations",
    date: "2024-01-12",
    category: "uploaded",
    description: "Monthly attendance record"
  },
  {
    id: "5",
    name: "Experience Certificate",
    type: "DOCX",
    size: "0.9 MB",
    uploadedBy: "HR Manager",
    date: "2024-01-11",
    category: "template",
    description: "Employee experience certificate template"
  }
];

const templates: Template[] = [
  {
    id: "1",
    name: "Employee Joining Form",
    type: "PDF Template",
    description: "Standard employee onboarding form",
    lastModified: "2024-01-10"
  },
  {
    id: "2",
    name: "Salary Slip",
    type: "DOCX Template",
    description: "Monthly salary slip template",
    lastModified: "2024-01-09"
  },
  {
    id: "3",
    name: "Invoice Template",
    type: "DOCX Template",
    description: "Professional invoice template",
    lastModified: "2024-01-08"
  },
  {
    id: "4",
    name: "Attendance Report",
    type: "XLSX Template",
    description: "Monthly attendance reporting template",
    lastModified: "2024-01-07"
  }
];

const formatLibrary: Format[] = [
  {
    id: "1",
    name: "PDF Format",
    type: "PDF",
    description: "Portable Document Format",
    size: "Standard"
  },
  {
    id: "2",
    name: "Excel Spreadsheet",
    type: "XLSX",
    description: "Microsoft Excel format",
    size: "Standard"
  },
  {
    id: "3",
    name: "Word Document",
    type: "DOCX",
    description: "Microsoft Word format",
    size: "Standard"
  },
  {
    id: "4",
    name: "JPEG Image",
    type: "JPG",
    description: "Joint Photographic Experts Group",
    size: "Standard"
  }
];

// Main Component
const Documents = () => {
  const [activeTab, setActiveTab] = useState("all-documents");

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Documents Management" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <StatsCards />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="all-documents">All Documents</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="generate">Generate Documents</TabsTrigger>
            <TabsTrigger value="formats">Format Library</TabsTrigger>
          </TabsList>

          <TabsContent value="all-documents">
            <AllDocumentsSection />
          </TabsContent>

          <TabsContent value="templates">
            <TemplatesSection />
          </TabsContent>

          <TabsContent value="generate">
            <GenerateDocumentsSection />
          </TabsContent>

          <TabsContent value="formats">
            <FormatLibrarySection />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

// Stats Cards Component
const StatsCards = () => {
  const documents = initialDocuments;
  
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard title="Total Documents" value={documents.length} />
      <StatCard title="Uploaded" value={documents.filter(d => d.category === "uploaded").length} className="text-primary" />
      <StatCard title="Templates" value={documents.filter(d => d.category === "template").length} className="text-accent" />
      <StatCard title="Generated" value={documents.filter(d => d.category === "generated").length} className="text-green-600" />
    </div>
  );
};

// All Documents Section
const AllDocumentsSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  const handleUploadDocument = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newDocument: Document = {
      id: Date.now().toString(),
      name: formData.get("document-name") as string,
      type: formData.get("document-type") as Document["type"],
      size: "1.5 MB", // This would be calculated from actual file
      uploadedBy: "Current User",
      date: new Date().toISOString().split('T')[0],
      category: "uploaded",
      description: formData.get("description") as string
    };

    setDocuments(prev => [newDocument, ...prev]);
    toast.success("Document uploaded successfully!");
    setUploadDialogOpen(false);
    (e.target as HTMLFormElement).reset();
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast.success("Document deleted successfully!");
  };

  const handleDownloadDocument = (docName: string) => {
    toast.success(`Downloading ${docName}...`);
    // Actual download logic would go here
  };

  const handleViewDocument = (docName: string) => {
    toast.success(`Opening ${docName}...`);
    // Actual view logic would go here
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      uploaded: "default",
      template: "secondary",
      generated: "outline"
    };
    return colors[category as keyof typeof colors] || "outline";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>All Documents</CardTitle>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUploadDocument} className="space-y-4">
              <FormField label="Document Name" id="document-name" required>
                <Input id="document-name" name="document-name" placeholder="Enter document name" required />
              </FormField>
              <FormField label="Document Type" id="document-type" required>
                <Select name="document-type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="XLSX">Excel (XLSX)</SelectItem>
                    <SelectItem value="DOCX">Word (DOCX)</SelectItem>
                    <SelectItem value="JPG">JPG Image</SelectItem>
                    <SelectItem value="PNG">PNG Image</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Select File" id="file" required>
                <Input id="file" name="file" type="file" required />
              </FormField>
              <FormField label="Description" id="description">
                <Textarea id="description" name="description" placeholder="Enter document description" />
              </FormField>
              <Button type="submit" className="w-full">Upload Document</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search documents..." />
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No documents found
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div>{doc.name}</div>
                        {doc.description && (
                          <div className="text-sm text-muted-foreground">{doc.description}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{doc.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getCategoryColor(doc.category) as "default" | "destructive" | "outline" | "secondary"}>
                      {doc.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>{doc.uploadedBy}</TableCell>
                  <TableCell>{doc.date}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewDocument(doc.name)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDownloadDocument(doc.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Templates Section
const TemplatesSection = () => {
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const handleAddTemplate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Template added successfully!");
    setTemplateDialogOpen(false);
    (e.target as HTMLFormElement).reset();
  };

  const handleUseTemplate = (templateName: string) => {
    toast.success(`Using template: ${templateName}`);
  };

  const handleDownloadTemplate = (templateName: string) => {
    toast.success(`Downloading template: ${templateName}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Document Templates</CardTitle>
          <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Template</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTemplate} className="space-y-4">
                <FormField label="Template Name" id="template-name" required>
                  <Input id="template-name" name="template-name" placeholder="Enter template name" required />
                </FormField>
                <FormField label="Template Type" id="template-type" required>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joining">Joining Form</SelectItem>
                      <SelectItem value="salary">Salary Slip</SelectItem>
                      <SelectItem value="invoice">Invoice Template</SelectItem>
                      <SelectItem value="attendance">Attendance Report</SelectItem>
                      <SelectItem value="experience">Experience Report</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Description" id="template-description" required>
                  <Textarea id="template-description" name="template-description" placeholder="Enter template description" required />
                </FormField>
                <FormField label="Upload Template File" id="template-file" required>
                  <Input id="template-file" type="file" required />
                </FormField>
                <Button type="submit" className="w-full">Add Template</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="relative">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {template.name}
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge variant="outline">{template.type}</Badge>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <div className="text-xs text-muted-foreground">
                    Last modified: {template.lastModified}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleUseTemplate(template.name)}
                      className="flex-1"
                    >
                      Use Template
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadTemplate(template.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Generate Documents Section
const GenerateDocumentsSection = () => {
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const handleGenerateDocument = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const documentType = formData.get("document-type") as string;
    
    toast.success(`Generating ${documentType} document...`);
    setGenerateDialogOpen(false);
    (e.target as HTMLFormElement).reset();
  };

  const quickGenerateOptions = [
    { name: "Salary Slip", type: "DOCX", description: "Generate employee salary slip" },
    { name: "Invoice", type: "PDF", description: "Create professional invoice" },
    { name: "Report", type: "XLSX", description: "Generate data report" },
    { name: "Certificate", type: "DOCX", description: "Create experience certificate" }
  ];

  const handleQuickGenerate = (docType: string) => {
    toast.success(`Generating ${docType}...`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Generate</h3>
              <div className="grid gap-3">
                {quickGenerateOptions.map((option, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleQuickGenerate(option.name)}
                      >
                        Generate
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Custom Document Generation</h3>
              <Card className="p-6">
                <div className="space-y-4">
                  <FormField label="Select Template" id="generate-template">
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salary">Salary Slip Template</SelectItem>
                        <SelectItem value="invoice">Invoice Template</SelectItem>
                        <SelectItem value="report">Report Template</SelectItem>
                        <SelectItem value="certificate">Certificate Template</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  
                  <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" disabled={!selectedTemplate}>
                        <FileUp className="mr-2 h-4 w-4" />
                        Configure & Generate
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate Document</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleGenerateDocument} className="space-y-4">
                        <FormField label="Document Type" id="document-type" required>
                          <Input 
                            id="document-type" 
                            name="document-type" 
                            value={selectedTemplate}
                            readOnly 
                          />
                        </FormField>
                        <FormField label="Output Format" id="output-format" required>
                          <Select name="output-format" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PDF">PDF</SelectItem>
                              <SelectItem value="DOCX">Word Document</SelectItem>
                              <SelectItem value="XLSX">Excel Spreadsheet</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>
                        <FormField label="Document Name" id="generated-doc-name" required>
                          <Input 
                            id="generated-doc-name" 
                            name="generated-doc-name" 
                            placeholder="Enter document name" 
                            required 
                          />
                        </FormField>
                        <Button type="submit" className="w-full">Generate Document</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Format Library Section
const FormatLibrarySection = () => {
  const handleDownloadFormat = (formatName: string) => {
    toast.success(`Downloading ${formatName} format guidelines...`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Format Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {formatLibrary.map((format) => (
              <Card key={format.id} className="relative">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {format.name}
                    <Badge variant="outline">{format.type}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{format.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Size: {format.size}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadFormat(format.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Reusable Components
const StatCard = ({ title, value, className = "" }: { title: string; value: number; className?: string }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${className}`}>{value}</div>
    </CardContent>
  </Card>
);

const SearchBar = ({ value, onChange, placeholder }: { 
  value: string; 
  onChange: (value: string) => void;
  placeholder: string;
}) => (
  <div className="mb-4">
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  </div>
);

const FormField = ({ label, id, children, required = false }: {
  label: string;
  id: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
);

export default Documents;