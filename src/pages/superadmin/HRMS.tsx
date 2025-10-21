import { useState } from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Search, Download, Upload, Plus, Edit, Trash2, User, Calendar, FileText, Eye, Sheet } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Types
interface Employee {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  aadharNumber: string;
  department: string;
  position: string;
  joinDate: string;
  status: "active" | "inactive";
  salary: number;
  photo?: string;
  documents: Document[];
  uan?: string;
  esicNumber?: string;
}

interface Document {
  id: number;
  type: string;
  name: string;
  uploadDate: string;
  expiryDate: string;
  status: "valid" | "expired" | "expiring";
  fileUrl?: string;
}

interface LeaveRequest {
  id: number;
  employee: string;
  employeeId: string;
  type: string;
  from: string;
  to: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

interface Attendance {
  id: number;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "present" | "absent" | "late" | "half-day";
}

interface Payroll {
  id: number;
  employeeId: string;
  employeeName: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "processed" | "pending";
  paymentDate?: string;
  bankAccount: string;
  ifscCode: string;
}

interface Performance {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  kpi: number;
  rating: number;
  reviewDate: string;
  feedback: string;
}

interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  employees: string[];
}

interface SalaryStructure {
  id: number;
  employeeId: string;
  basic: number;
  hra: number;
  da: number;
  conveyance: number;
  medical: number;
  specialAllowance: number;
  otherAllowances: number;
  pf: number;
  esic: number;
  professionalTax: number;
  tds: number;
  otherDeductions: number;
}

interface SalarySlip {
  id: number;
  employeeId: string;
  employeeName: string;
  month: string;
  paidDays: number;
  designation: string;
  uan: string;
  esicNumber: string;
  earnings: {
    basic: number;
    da: number;
    hra: number;
    cca: number;
    washing: number;
    leave: number;
    medical: number;
    bonus: number;
    otherAllowances: number;
  };
  deductions: {
    pf: number;
    esic: number;
    monthlyDeductions: number;
    mlwf: number;
    professionalTax: number;
  };
  netSalary: number;
  generatedDate: string;
}

// Indian Dummy Data
const indianNames = {
  male: ["Rajesh Kumar", "Amit Sharma", "Sanjay Patel", "Vikram Singh", "Arun Reddy", "Mohan Das", "Suresh Iyer", "Prakash Joshi"],
  female: ["Priya Sharma", "Anjali Singh", "Sunita Reddy", "Kavita Patel", "Meera Iyer", "Laxmi Kumar", "Sonia Das", "Neha Joshi"]
};

const departments = ["IT", "HR", "Finance", "Operations", "Marketing", "Sales", "Production", "Quality Control"];
const positions = {
  IT: ["Software Engineer", "Senior Developer", "Team Lead", "Project Manager"],
  HR: ["HR Executive", "HR Manager", "Recruiter", "Training Manager"],
  Finance: ["Accountant", "Financial Analyst", "Finance Manager"],
  Operations: ["Operations Executive", "Operations Manager", "Logistics Head"],
  Marketing: ["Marketing Executive", "Digital Marketer", "Marketing Manager"],
  Sales: ["Sales Executive", "Sales Manager", "Business Development"],
  Production: ["Production Worker", "Production Supervisor", "Production Manager"],
  "Quality Control": ["QC Inspector", "QC Manager"]
};

const generateIndianPhone = () => `9${Math.floor(100000000 + Math.random() * 900000000)}`;
const generateAadhar = () => `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;

// Initial Data with Indian Names
const initialEmployees: Employee[] = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@company.com",
    phone: "9876543210",
    aadharNumber: "1234 5678 9012",
    department: "IT",
    position: "Senior Developer",
    joinDate: "2023-01-15",
    status: "active",
    salary: 85000,
    uan: "101234567890",
    esicNumber: "231234567890",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2023-01-15",
        expiryDate: "2030-01-15",
        status: "valid"
      },
      {
        id: 2,
        type: "PAN Card",
        name: "pan_card.pdf",
        uploadDate: "2023-01-15",
        expiryDate: "2030-01-15",
        status: "valid"
      }
    ]
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Priya Sharma",
    email: "priya.sharma@company.com",
    phone: "9876543211",
    aadharNumber: "2345 6789 0123",
    department: "HR",
    position: "HR Manager",
    joinDate: "2022-03-10",
    status: "active",
    salary: 75000,
    uan: "101234567891",
    esicNumber: "231234567891",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2022-03-10",
        expiryDate: "2024-03-10",
        status: "expiring"
      }
    ]
  },
  {
    id: 3,
    employeeId: "EMP003",
    name: "Amit Patel",
    email: "amit.patel@company.com",
    phone: "9876543212",
    aadharNumber: "3456 7890 1234",
    department: "Finance",
    position: "Finance Manager",
    joinDate: "2021-06-20",
    status: "active",
    salary: 90000,
    uan: "101234567892",
    esicNumber: "231234567892",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2021-06-20",
        expiryDate: "2021-12-20",
        status: "expired"
      }
    ]
  }
];

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    employee: "Rajesh Kumar",
    employeeId: "EMP001",
    type: "Sick Leave",
    from: "2024-01-15",
    to: "2024-01-16",
    reason: "Fever and cold",
    status: "pending"
  },
  {
    id: 2,
    employee: "Priya Sharma",
    employeeId: "EMP002",
    type: "Vacation",
    from: "2024-02-01",
    to: "2024-02-05",
    reason: "Family vacation",
    status: "approved"
  },
  {
    id: 3,
    employee: "Amit Patel",
    employeeId: "EMP003",
    type: "Emergency Leave",
    from: "2024-01-20",
    to: "2024-01-20",
    reason: "Medical emergency",
    status: "rejected"
  }
];

const initialAttendance: Attendance[] = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "Rajesh Kumar",
    date: "2024-01-10",
    checkIn: "09:00",
    checkOut: "17:00",
    status: "present"
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "Priya Sharma",
    date: "2024-01-10",
    checkIn: "09:15",
    checkOut: "17:00",
    status: "late"
  },
  {
    id: 3,
    employeeId: "EMP003",
    employeeName: "Amit Patel",
    date: "2024-01-10",
    checkIn: "09:00",
    checkOut: "13:00",
    status: "half-day"
  }
];

const initialPayroll: Payroll[] = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "Rajesh Kumar",
    month: "January 2024",
    basicSalary: 70833,
    allowances: 10000,
    deductions: 5000,
    netSalary: 75833,
    status: "processed",
    paymentDate: "2024-01-31",
    bankAccount: "XXXXXX1234",
    ifscCode: "SBIN0000123"
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "Priya Sharma",
    month: "January 2024",
    basicSalary: 62500,
    allowances: 8000,
    deductions: 4500,
    netSalary: 66000,
    status: "pending",
    bankAccount: "XXXXXX5678",
    ifscCode: "HDFC0000456"
  },
  {
    id: 3,
    employeeId: "EMP003",
    employeeName: "Amit Patel",
    month: "January 2024",
    basicSalary: 75000,
    allowances: 12000,
    deductions: 6000,
    netSalary: 81000,
    status: "processed",
    paymentDate: "2024-01-31",
    bankAccount: "XXXXXX9012",
    ifscCode: "ICIC0000789"
  }
];

const initialPerformance: Performance[] = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "Rajesh Kumar",
    department: "IT",
    kpi: 85,
    rating: 4.5,
    reviewDate: "2024-01-05",
    feedback: "Excellent performance in project delivery"
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "Priya Sharma",
    department: "HR",
    kpi: 92,
    rating: 4.8,
    reviewDate: "2024-01-05",
    feedback: "Outstanding work in recruitment and employee engagement"
  },
  {
    id: 3,
    employeeId: "EMP003",
    employeeName: "Amit Patel",
    department: "Finance",
    kpi: 78,
    rating: 4.2,
    reviewDate: "2024-01-05",
    feedback: "Good financial management and reporting"
  }
];

const initialShifts: Shift[] = [
  {
    id: 1,
    name: "Morning Shift",
    startTime: "09:00",
    endTime: "17:00",
    employees: ["EMP001", "EMP002"]
  },
  {
    id: 2,
    name: "Evening Shift",
    startTime: "14:00",
    endTime: "22:00",
    employees: ["EMP003"]
  }
];

const initialSalaryStructures: SalaryStructure[] = [
  {
    id: 1,
    employeeId: "EMP001",
    basic: 42500,
    hra: 17000,
    da: 12750,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 8500,
    otherAllowances: 4250,
    pf: 5100,
    esic: 637.5,
    professionalTax: 200,
    tds: 0,
    otherDeductions: 0
  },
  {
    id: 2,
    employeeId: "EMP002",
    basic: 37500,
    hra: 15000,
    da: 11250,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 7500,
    otherAllowances: 3750,
    pf: 4500,
    esic: 562.5,
    professionalTax: 200,
    tds: 0,
    otherDeductions: 0
  },
  {
    id: 3,
    employeeId: "EMP003",
    basic: 45000,
    hra: 18000,
    da: 13500,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 9000,
    otherAllowances: 4500,
    pf: 5400,
    esic: 675,
    professionalTax: 200,
    tds: 0,
    otherDeductions: 0
  }
];

const initialSalarySlips: SalarySlip[] = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "Rajesh Kumar",
    month: "January 2024",
    paidDays: 26,
    designation: "Senior Developer",
    uan: "101234567890",
    esicNumber: "231234567890",
    earnings: {
      basic: 42500,
      da: 12750,
      hra: 17000,
      cca: 1600,
      washing: 800,
      leave: 0,
      medical: 1250,
      bonus: 0,
      otherAllowances: 4250
    },
    deductions: {
      pf: 5100,
      esic: 637.5,
      monthlyDeductions: 0,
      mlwf: 25,
      professionalTax: 200
    },
    netSalary: 75833,
    generatedDate: "2024-01-31"
  }
];

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
    <Label htmlFor={id}>
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
    {children}
  </div>
);

const AssignTaskDialog = ({ open, onOpenChange, onSubmit }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Assign Task
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Assign New Task</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Task Title" id="task-title" required>
          <Input id="task-title" name="task-title" placeholder="Enter task title" required />
        </FormField>
        <FormField label="Description" id="description" required>
          <Textarea id="description" name="description" placeholder="Enter task description" required />
        </FormField>
        <FormField label="Assign To" id="assign-to" required>
          <Select name="assign-to" required>
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager-a">Manager A</SelectItem>
              <SelectItem value="supervisor-a">Supervisor A</SelectItem>
              <SelectItem value="supervisor-b">Supervisor B</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Priority" id="priority" required>
          <Select name="priority" required>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Deadline" id="deadline" required>
          <Input id="deadline" name="deadline" type="date" required />
        </FormField>
        <Button type="submit" className="w-full">Assign Task</Button>
      </form>
    </DialogContent>
  </Dialog>
);

// Excel Import/Export Functions
const exportToExcel = (data: any[], filename: string) => {
  // Convert data to CSV format
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(value => 
      typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    ).join(',')
  );
  const csv = [headers, ...rows].join('\n');
  
  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  toast.success(`${filename} exported successfully!`);
};

const importFromExcel = (file: File, setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>) => {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const lines = content.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const newEmployees: Employee[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const employee: Employee = {
          id: initialEmployees.length + i,
          employeeId: `EMP${String(initialEmployees.length + i).padStart(3, '0')}`,
          name: values[headers.indexOf('name')] || '',
          email: values[headers.indexOf('email')] || '',
          phone: values[headers.indexOf('phone')] || generateIndianPhone(),
          aadharNumber: values[headers.indexOf('aadharNumber')] || generateAadhar(),
          department: values[headers.indexOf('department')] || departments[Math.floor(Math.random() * departments.length)],
          position: values[headers.indexOf('position')] || '',
          joinDate: values[headers.indexOf('joinDate')] || new Date().toISOString().split('T')[0],
          status: 'active',
          salary: Number(values[headers.indexOf('salary')]) || 30000,
          uan: `1012345678${String(initialEmployees.length + i).padStart(2, '0')}`,
          esicNumber: `2312345678${String(initialEmployees.length + i).padStart(2, '0')}`,
          documents: []
        };
        
        newEmployees.push(employee);
      }
      
      setEmployees(prev => [...prev, ...newEmployees]);
      toast.success(`Successfully imported ${newEmployees.length} employees!`);
    } catch (error) {
      toast.error('Error importing Excel file. Please check the format.');
      console.error('Import error:', error);
    }
  };
  
  reader.onerror = () => {
    toast.error('Error reading file');
  };
  
  reader.readAsText(file);
};

// Excel Import Dialog Component
const ExcelImportDialog = ({ 
  open, 
  onOpenChange, 
  onImport 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onImport: (file: File) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = () => {
    if (file) {
      onImport(file);
      setFile(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Employees from Excel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Sheet className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Upload Excel/CSV file with employee data
            </p>
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="excel-upload"
            />
            <Label htmlFor="excel-upload">
              <Button variant="outline" className="mt-4" asChild>
                <span>Choose File</span>
              </Button>
            </Label>
            {file && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {file.name}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Expected CSV Format:</Label>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>• Columns: name, email, phone, aadharNumber, department, position, salary</div>
              <div>• First row should be headers</div>
              <div>• File should be UTF-8 encoded</div>
            </div>
          </div>
          
          <Button 
            onClick={handleImport} 
            disabled={!file}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Employees
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Salary Slip Card Component
const SalarySlipCard = ({ slip }: { slip: SalarySlip }) => {
  const totalEarnings = Object.values(slip.earnings).reduce((sum, amount) => sum + amount, 0);
  const totalDeductions = Object.values(slip.deductions).reduce((sum, amount) => sum + amount, 0);

  return (
    <Card className="border-2">
      <CardContent className="p-6">
        {/* Company Header */}
        <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
          <div className="text-sm text-gray-600 mb-2">
            Wages Slip Rule 27(2) Maharashtra Minimum Wages Rules, 1963
          </div>
          <div className="text-xl font-bold">S K ENTERPRISES</div>
          <div className="text-sm text-gray-600">
            Office No 505, Global Square, Deccan College Road, Yerwada, Pune 411006
          </div>
          <div className="font-semibold mt-2">
            SALARY FOR THE MONTH OF {slip.month.toUpperCase()}
          </div>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div><strong>Name:</strong> {slip.employeeName}</div>
            <div><strong>Paid Days:</strong> {slip.paidDays}</div>
          </div>
          <div>
            <div><strong>Designation:</strong> {slip.designation}</div>
            <div><strong>ESIC NO:</strong> {slip.esicNumber}</div>
            <div><strong>UAN:</strong> {slip.uan}</div>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="grid grid-cols-2 gap-8">
          {/* Earnings */}
          <div>
            <div className="font-bold text-center border-b-2 border-gray-300 pb-2 mb-4">
              EARNINGS
            </div>
            <div className="space-y-2">
              {Object.entries(slip.earnings).map(([key, amount]) => (
                <div key={key} className="flex justify-between">
                  <span>{key.toUpperCase()}</span>
                  <span>₹{amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t-2 border-gray-300 pt-2">
                <span>TOTAL</span>
                <span>₹{totalEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <div className="font-bold text-center border-b-2 border-gray-300 pb-2 mb-4">
              DEDUCTIONS
            </div>
            <div className="space-y-2">
              {Object.entries(slip.deductions).map(([key, amount]) => (
                <div key={key} className="flex justify-between">
                  <span>{key.toUpperCase()}</span>
                  <span>₹{amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t-2 border-gray-300 pt-2">
                <span>TOTAL DEDUCTION</span>
                <span>₹{totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Payable */}
        <div className="text-center border-t-2 border-gray-300 mt-6 pt-4">
          <div className="font-bold text-lg">
            NET PAYABLE: ₹{slip.netSalary.toLocaleString()}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 mt-6">
          <div className="mb-2">for S K Enterprises</div>
          <div>Auth. Sign.</div>
          <div className="italic mt-2">
            THIS IS COMPUTER GENERATED SLIP NOT REQUIRED SIGNATURE & STAMP
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Salary Structures Table Component
const SalaryStructuresTable = ({ 
  employees, 
  salaryStructures, 
  onUpdateSalaryStructure 
}: { 
  employees: Employee[];
  salaryStructures: SalaryStructure[];
  onUpdateSalaryStructure: (employeeId: string, updates: Partial<SalaryStructure>) => void;
}) => {
  const calculateSalaryComponents = (basicSalary: number) => {
    return {
      basic: basicSalary * 0.5,
      hra: basicSalary * 0.2,
      da: basicSalary * 0.15,
      conveyance: 1600,
      medical: 1250,
      specialAllowance: basicSalary * 0.1,
      otherAllowances: basicSalary * 0.05,
      pf: basicSalary * 0.12,
      esic: basicSalary * 0.0075,
      professionalTax: 200
    };
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Basic</TableHead>
          <TableHead>HRA</TableHead>
          <TableHead>DA</TableHead>
          <TableHead>Conveyance</TableHead>
          <TableHead>Medical</TableHead>
          <TableHead>Special Allowance</TableHead>
          <TableHead>PF</TableHead>
          <TableHead>ESIC</TableHead>
          <TableHead>Professional Tax</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.filter(emp => emp.status === "active").map((employee) => {
          const structure = salaryStructures.find(s => s.employeeId === employee.employeeId);
          return (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                <div>{employee.name}</div>
                <div className="text-sm text-muted-foreground">{employee.employeeId}</div>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={structure?.basic || 0}
                  onChange={(e) => onUpdateSalaryStructure(employee.employeeId, { basic: Number(e.target.value) })}
                />
              </TableCell>
              <TableCell>₹{(structure?.hra || 0).toLocaleString()}</TableCell>
              <TableCell>₹{(structure?.da || 0).toLocaleString()}</TableCell>
              <TableCell>₹{(structure?.conveyance || 0).toLocaleString()}</TableCell>
              <TableCell>₹{(structure?.medical || 0).toLocaleString()}</TableCell>
              <TableCell>₹{(structure?.specialAllowance || 0).toLocaleString()}</TableCell>
              <TableCell>₹{(structure?.pf || 0).toLocaleString()}</TableCell>
              <TableCell>₹{(structure?.esic || 0).toLocaleString()}</TableCell>
              <TableCell>₹{(structure?.professionalTax || 0).toLocaleString()}</TableCell>
              <TableCell>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    const components = calculateSalaryComponents(employee.salary);
                    onUpdateSalaryStructure(employee.employeeId, components);
                  }}
                >
                  Auto Calculate
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

// Main HRMS Component
const HRMS = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);
  const [payroll, setPayroll] = useState<Payroll[]>(initialPayroll);
  const [performance, setPerformance] = useState<Performance[]>(initialPerformance);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>(initialSalaryStructures);
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>(initialSalarySlips);
  const [activeTab, setActiveTab] = useState("employees");
  const [searchTerm, setSearchTerm] = useState("");
  const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedEmployeeForSalary, setSelectedEmployeeForSalary] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // Current month in YYYY-MM format
  );
  
  // New Employee Form State
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    aadharNumber: "",
    department: "",
    position: "",
    salary: "",
    photo: null as File | null
  });

  // New Shift Form State
  const [newShift, setNewShift] = useState({
    name: "",
    startTime: "09:00",
    endTime: "17:00",
    employees: [] as string[]
  });

  // Document Upload State
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);

  // Employee Management Functions
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.aadharNumber) {
      toast.error("Please fill all required fields");
      return;
    }

    const employee: Employee = {
      id: employees.length + 1,
      employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      aadharNumber: newEmployee.aadharNumber,
      department: newEmployee.department,
      position: newEmployee.position,
      joinDate: new Date().toISOString().split('T')[0],
      status: "active",
      salary: Number(newEmployee.salary),
      uan: `1012345678${String(employees.length + 1).padStart(2, '0')}`,
      esicNumber: `2312345678${String(employees.length + 1).padStart(2, '0')}`,
      documents: uploadedDocuments.map((doc, index) => ({
        id: index + 1,
        type: doc.name.split('.')[0],
        name: doc.name,
        uploadDate: new Date().toISOString().split('T')[0],
        expiryDate: "2025-12-31",
        status: "valid" as const
      }))
    };

    // Create default salary structure for new employee
    const defaultSalaryStructure: SalaryStructure = {
      id: salaryStructures.length + 1,
      employeeId: employee.employeeId,
      basic: Number(newEmployee.salary) * 0.5,
      hra: Number(newEmployee.salary) * 0.2,
      da: Number(newEmployee.salary) * 0.15,
      conveyance: 1600,
      medical: 1250,
      specialAllowance: Number(newEmployee.salary) * 0.1,
      otherAllowances: Number(newEmployee.salary) * 0.05,
      pf: Number(newEmployee.salary) * 0.12,
      esic: Number(newEmployee.salary) * 0.0075,
      professionalTax: 200,
      tds: 0,
      otherDeductions: 0
    };

    setEmployees([...employees, employee]);
    setSalaryStructures([...salaryStructures, defaultSalaryStructure]);
    setNewEmployee({ 
      name: "", 
      email: "", 
      phone: "", 
      aadharNumber: "", 
      department: "", 
      position: "", 
      salary: "",
      photo: null 
    });
    setUploadedDocuments([]);
    toast.success("Employee added successfully!");
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    toast.success("Employee deleted successfully!");
  };

  // Excel Import/Export Functions
  const handleExportEmployees = () => {
    const exportData = employees.map(emp => ({
      employeeId: emp.employeeId,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      aadharNumber: emp.aadharNumber,
      department: emp.department,
      position: emp.position,
      joinDate: emp.joinDate,
      status: emp.status,
      salary: emp.salary,
      uan: emp.uan,
      esicNumber: emp.esicNumber
    }));
    exportToExcel(exportData, 'employees_data');
  };

  const handleImportEmployees = (file: File) => {
    importFromExcel(file, setEmployees);
  };

  const handleExportPayroll = () => {
    exportToExcel(payroll, 'payroll_data');
  };

  const handleExportAttendance = () => {
    exportToExcel(attendance, 'attendance_data');
  };

  // Leave Management Functions
  const handleLeaveAction = (id: number, action: "approved" | "rejected") => {
    setLeaveRequests(leaveRequests.map(leave => 
      leave.id === id ? { ...leave, status: action } : leave
    ));
    toast.success(`Leave request ${action}!`);
  };

  // Payroll Functions
  const handleProcessPayroll = (id: number) => {
    setPayroll(payroll.map(pay => 
      pay.id === id ? { 
        ...pay, 
        status: "processed", 
        paymentDate: new Date().toISOString().split('T')[0] 
      } : pay
    ));
    toast.success("Payroll processed successfully!");
  };

  // Shift Management Functions
  const handleAddShift = () => {
    if (!newShift.name) {
      toast.error("Please enter shift name");
      return;
    }

    const shift: Shift = {
      id: shifts.length + 1,
      name: newShift.name,
      startTime: newShift.startTime,
      endTime: newShift.endTime,
      employees: newShift.employees
    };

    setShifts([...shifts, shift]);
    setNewShift({ name: "", startTime: "09:00", endTime: "17:00", employees: [] });
    toast.success("Shift created successfully!");
  };

  // Document Upload Functions
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments = Array.from(files);
      setUploadedDocuments(prev => [...prev, ...newDocuments]);
      toast.success(`${newDocuments.length} document(s) uploaded successfully!`);
    }
  };

  const handleRemoveDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // Salary Management Functions
  const handleGenerateSalary = (employeeId: string) => {
    const employee = employees.find(emp => emp.employeeId === employeeId);
    const salaryStructure = salaryStructures.find(s => s.employeeId === employeeId);
    
    if (!employee || !salaryStructure) {
      toast.error("Employee or salary structure not found");
      return;
    }

    // Calculate total earnings and deductions
    const totalEarnings = 
      salaryStructure.basic + 
      salaryStructure.hra + 
      salaryStructure.da + 
      salaryStructure.conveyance + 
      salaryStructure.medical + 
      salaryStructure.specialAllowance + 
      salaryStructure.otherAllowances;

    const totalDeductions = 
      salaryStructure.pf + 
      salaryStructure.esic + 
      salaryStructure.professionalTax + 
      salaryStructure.tds + 
      salaryStructure.otherDeductions;

    const netSalary = totalEarnings - totalDeductions;

    // Create new salary slip
    const newSalarySlip: SalarySlip = {
      id: salarySlips.length + 1,
      employeeId: employee.employeeId,
      employeeName: employee.name,
      month: new Date(selectedMonth + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      paidDays: 26, // This should be calculated from attendance
      designation: employee.position,
      uan: employee.uan || "101234567890",
      esicNumber: employee.esicNumber || "231234567890",
      earnings: {
        basic: salaryStructure.basic,
        da: salaryStructure.da,
        hra: salaryStructure.hra,
        cca: salaryStructure.conveyance,
        washing: 800, // Fixed amount
        leave: 0,
        medical: salaryStructure.medical,
        bonus: 0,
        otherAllowances: salaryStructure.otherAllowances
      },
      deductions: {
        pf: salaryStructure.pf,
        esic: salaryStructure.esic,
        monthlyDeductions: salaryStructure.otherDeductions,
        mlwf: 25, // Fixed amount
        professionalTax: salaryStructure.professionalTax
      },
      netSalary: netSalary,
      generatedDate: new Date().toISOString().split('T')[0]
    };

    setSalarySlips(prev => [...prev, newSalarySlip]);
    toast.success(`Salary slip generated for ${employee.name}`);
  };

  const handleBulkSalaryGenerate = () => {
    const activeEmployees = employees.filter(emp => emp.status === "active");
    
    activeEmployees.forEach(employee => {
      handleGenerateSalary(employee.employeeId);
    });
    
    toast.success(`Salary slips generated for ${activeEmployees.length} employees`);
  };

  const handleUpdateSalaryStructure = (employeeId: string, updates: Partial<SalaryStructure>) => {
    setSalaryStructures(prev => 
      prev.map(structure => 
        structure.employeeId === employeeId 
          ? { ...structure, ...updates }
          : structure
      )
    );
    toast.success("Salary structure updated successfully!");
  };

  // Utility Functions
  const getStatusColor = (status: string) => {
    switch(status) {
      case "approved": case "active": case "processed": case "present": return "default";
      case "rejected": case "inactive": case "absent": return "destructive";
      case "pending": case "late": case "expiring": return "secondary";
      case "expired": return "destructive";
      case "half-day": return "outline";
      default: return "outline";
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reports Data
  const attendanceSummary = {
    present: attendance.filter(a => a.status === "present").length,
    absent: attendance.filter(a => a.status === "absent").length,
    late: attendance.filter(a => a.status === "late").length,
    halfDay: attendance.filter(a => a.status === "half-day").length,
    total: attendance.length
  };

  const payrollSummary = {
    total: payroll.reduce((sum, p) => sum + p.netSalary, 0),
    processed: payroll.filter(p => p.status === "processed").length,
    pending: payroll.filter(p => p.status === "pending").length
  };

  const documentExpiryReport = employees.flatMap(emp =>
    emp.documents.map(doc => ({
      employee: emp.name,
      document: doc.type,
      expiryDate: doc.expiryDate,
      status: doc.status
    }))
  );

  // Payroll Section Component
  const PayrollSection = () => {
    const [activePayrollTab, setActivePayrollTab] = useState("salary-slips");

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{payrollSummary.total.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{payrollSummary.processed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{payrollSummary.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Salary Slips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{salarySlips.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>Payroll Management</div>
              <div className="flex gap-2">
                <Button onClick={handleBulkSalaryGenerate}>
                  <Download className="mr-2 h-4 w-4" />
                  Bulk Generate
                </Button>
                <Dialog open={salaryDialogOpen} onOpenChange={setSalaryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Generate Salary
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Generate Salary Slip</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <FormField label="Select Employee" id="employee">
                        <Select value={selectedEmployeeForSalary} onValueChange={setSelectedEmployeeForSalary}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.filter(emp => emp.status === "active").map(emp => (
                              <SelectItem key={emp.id} value={emp.employeeId}>
                                {emp.name} ({emp.employeeId})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>
                      <FormField label="Select Month" id="month">
                        <Input
                          type="month"
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                        />
                      </FormField>
                      <Button 
                        onClick={() => handleGenerateSalary(selectedEmployeeForSalary)}
                        disabled={!selectedEmployeeForSalary}
                        className="w-full"
                      >
                        Generate Salary Slip
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activePayrollTab} onValueChange={setActivePayrollTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="salary-slips">Salary Slips</TabsTrigger>
                <TabsTrigger value="salary-structures">Salary Structures</TabsTrigger>
                <TabsTrigger value="payroll-records">Payroll Records</TabsTrigger>
              </TabsList>

              <TabsContent value="salary-slips" className="space-y-4">
                <div className="grid gap-4">
                  {salarySlips.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No salary slips generated yet. Generate your first salary slip.
                    </div>
                  ) : (
                    salarySlips.map((slip) => (
                      <SalarySlipCard key={slip.id} slip={slip} />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="salary-structures" className="space-y-4">
                <SalaryStructuresTable 
                  employees={employees} 
                  salaryStructures={salaryStructures}
                  onUpdateSalaryStructure={handleUpdateSalaryStructure}
                />
              </TabsContent>

              <TabsContent value="payroll-records" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>Allowances</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Bank Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payroll.map((pay) => (
                      <TableRow key={pay.id}>
                        <TableCell className="font-medium">{pay.employeeName}</TableCell>
                        <TableCell>{pay.month}</TableCell>
                        <TableCell>₹{pay.basicSalary.toLocaleString()}</TableCell>
                        <TableCell>₹{pay.allowances.toLocaleString()}</TableCell>
                        <TableCell>₹{pay.deductions.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold">₹{pay.netSalary.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>Acc: {pay.bankAccount}</div>
                            <div>IFSC: {pay.ifscCode}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(pay.status)}>
                            {pay.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {pay.status === "pending" && (
                            <Button 
                              size="sm" 
                              onClick={() => handleProcessPayroll(pay.id)}
                            >
                              Process
                            </Button>
                          )}
                          {pay.status === "processed" && pay.paymentDate && (
                            <Badge variant="outline">
                              Paid on {pay.paymentDate}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="HRMS - Human Resource Management" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 w-full">
          <TabsList className="w-full justify-start flex-wrap h-auto">
            <TabsTrigger value="employees" className="flex-1 min-w-[120px]">Employees</TabsTrigger>
            <TabsTrigger value="onboarding" className="flex-1 min-w-[120px]">Onboarding</TabsTrigger>
            <TabsTrigger value="attendance" className="flex-1 min-w-[120px]">Attendance</TabsTrigger>
            <TabsTrigger value="leave" className="flex-1 min-w-[120px]">Leave Management</TabsTrigger>
            <TabsTrigger value="shifts" className="flex-1 min-w-[120px]">Shift Roster</TabsTrigger>
            <TabsTrigger value="payroll" className="flex-1 min-w-[120px]">Payroll</TabsTrigger>
            <TabsTrigger value="performance" className="flex-1 min-w-[120px]">Performance</TabsTrigger>
            <TabsTrigger value="reports" className="flex-1 min-w-[120px]">Reports</TabsTrigger>
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setImportDialogOpen(true)}
                >
                  <Sheet className="mr-2 h-4 w-4" />
                  Import Excel
                </Button>
                <Button variant="outline" onClick={handleExportEmployees}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Excel
                </Button>
                <Button onClick={() => setActiveTab("onboarding")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </div>
            </div>

            <ExcelImportDialog 
              open={importDialogOpen}
              onOpenChange={setImportDialogOpen}
              onImport={handleImportEmployees}
            />

            <div className="grid gap-4 md:grid-cols-4">
              <StatCard title="Total Employees" value={employees.length} />
              <StatCard 
                title="Active" 
                value={employees.filter(e => e.status === "active").length} 
                className="text-primary" 
              />
              <StatCard 
                title="Departments" 
                value={new Set(employees.map(e => e.department)).size} 
                className="text-primary" 
              />
              <StatCard 
                title="Monthly Salary" 
                value={employees.reduce((sum, emp) => sum + emp.salary, 0)} 
                className="text-primary" 
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Employee Database</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.employeeId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {employee.name}
                          </div>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.joinDate}</TableCell>
                        <TableCell>₹{employee.salary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(employee.status)}>
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Employee Details - {employee.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div><strong>Employee ID:</strong> {employee.employeeId}</div>
                                    <div><strong>Email:</strong> {employee.email}</div>
                                    <div><strong>Phone:</strong> {employee.phone}</div>
                                    <div><strong>Aadhar:</strong> {employee.aadharNumber}</div>
                                    <div><strong>Department:</strong> {employee.department}</div>
                                    <div><strong>Position:</strong> {employee.position}</div>
                                    <div><strong>UAN:</strong> {employee.uan}</div>
                                    <div><strong>ESIC:</strong> {employee.esicNumber}</div>
                                  </div>
                                  <div>
                                    <strong>Documents:</strong>
                                    <div className="mt-2 space-y-2">
                                      {employee.documents.map(doc => (
                                        <div key={doc.id} className="flex justify-between items-center p-2 border rounded">
                                          <span>{doc.type}</span>
                                          <Badge variant={getStatusColor(doc.status)}>
                                            {doc.status}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteEmployee(employee.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onboarding Tab */}
          <TabsContent value="onboarding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Digital Onboarding & Document Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Add New Employee</h3>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={newEmployee.name}
                            onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newEmployee.email}
                            onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={newEmployee.phone}
                            onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="aadhar">Aadhar Number *</Label>
                          <Input
                            id="aadhar"
                            value={newEmployee.aadharNumber}
                            onChange={(e) => setNewEmployee({...newEmployee, aadharNumber: e.target.value})}
                            placeholder="Enter Aadhar number"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select 
                            value={newEmployee.department} 
                            onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position">Position</Label>
                          <Input
                            id="position"
                            value={newEmployee.position}
                            onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                            placeholder="Enter position"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salary">Monthly Salary (₹)</Label>
                        <Input
                          id="salary"
                          type="number"
                          value={newEmployee.salary}
                          onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                          placeholder="Enter monthly salary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="photo">Upload Photo</Label>
                        <Input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewEmployee({...newEmployee, photo: e.target.files?.[0] || null})}
                        />
                      </div>
                      <Button onClick={handleAddEmployee}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Employee
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Document Upload</h3>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag and drop documents here or click to browse
                      </p>
                      <Input
                        type="file"
                        multiple
                        onChange={handleDocumentUpload}
                        className="hidden"
                        id="document-upload"
                      />
                      <Label htmlFor="document-upload">
                        <Button variant="outline" className="mt-4" asChild>
                          <span>Browse Files</span>
                        </Button>
                      </Label>
                    </div>
                    
                    {/* Uploaded Documents List */}
                    {uploadedDocuments.length > 0 && (
                      <div className="space-y-2">
                        <Label>Uploaded Documents</Label>
                        <div className="space-y-2">
                          {uploadedDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm">{doc.name}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveDocument(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label>Required Documents</Label>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>• Aadhar Card</div>
                        <div>• PAN Card</div>
                        <div>• Educational Certificates</div>
                        <div>• Experience Letters</div>
                        <div>• Bank Details</div>
                        <div>• Passport Size Photo</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Attendance Management</h2>
              <Button variant="outline" onClick={handleExportAttendance}>
                <Download className="mr-2 h-4 w-4" />
                Export Attendance
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <StatCard title="Present Today" value={attendanceSummary.present} className="text-primary" />
              <StatCard title="Absent Today" value={attendanceSummary.absent} className="text-destructive" />
              <StatCard title="Late Today" value={attendanceSummary.late} className="text-secondary" />
              <StatCard title="Half Day" value={attendanceSummary.halfDay} className="text-muted-foreground" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Records</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.employeeName}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.checkIn}</TableCell>
                        <TableCell>{record.checkOut}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Management Tab */}
          <TabsContent value="leave" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <StatCard title="Total Requests" value={leaveRequests.length} />
              <StatCard 
                title="Pending" 
                value={leaveRequests.filter(l => l.status === "pending").length} 
                className="text-muted-foreground" 
              />
              <StatCard 
                title="Approved" 
                value={leaveRequests.filter(l => l.status === "approved").length} 
                className="text-primary" 
              />
              <StatCard 
                title="Rejected" 
                value={leaveRequests.filter(l => l.status === "rejected").length} 
                className="text-destructive" 
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell className="font-medium">{leave.employee}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{leave.type}</Badge>
                        </TableCell>
                        <TableCell>{leave.from}</TableCell>
                        <TableCell>{leave.to}</TableCell>
                        <TableCell>{leave.reason}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(leave.status)}>
                            {leave.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {leave.status === "pending" && (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleLeaveAction(leave.id, "approved")}
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleLeaveAction(leave.id, "rejected")}
                              >
                                <XCircle className="mr-1 h-3 w-3" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shift Roster Tab */}
          <TabsContent value="shifts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shift & Roster Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Create Shift</h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shiftName">Shift Name</Label>
                        <Input 
                          id="shiftName" 
                          placeholder="Morning Shift" 
                          value={newShift.name}
                          onChange={(e) => setNewShift({...newShift, name: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input 
                            id="startTime" 
                            type="time" 
                            value={newShift.startTime}
                            onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endTime">End Time</Label>
                          <Input 
                            id="endTime" 
                            type="time" 
                            value={newShift.endTime}
                            onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Assign Employees</Label>
                        <Select 
                          onValueChange={(value) => setNewShift({
                            ...newShift, 
                            employees: [...newShift.employees, value]
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select employees" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map(emp => (
                              <SelectItem key={emp.id} value={emp.employeeId}>
                                {emp.name} ({emp.employeeId})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {newShift.employees.length > 0 && (
                          <div className="space-y-2">
                            <Label>Assigned Employees:</Label>
                            {newShift.employees.map(empId => {
                              const emp = employees.find(e => e.employeeId === empId);
                              return (
                                <div key={empId} className="flex justify-between items-center p-2 border rounded">
                                  <span>{emp?.name}</span>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setNewShift({
                                      ...newShift,
                                      employees: newShift.employees.filter(id => id !== empId)
                                    })}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <Button onClick={handleAddShift}>
                        Create Shift
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Current Shifts</h3>
                    <div className="space-y-3">
                      {shifts.map((shift) => (
                        <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{shift.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {shift.startTime} - {shift.endTime}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {shift.employees.length} employees assigned
                            </div>
                          </div>
                          <Badge>{shift.employees.length} employees</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Tab */}
          <TabsContent value="payroll">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Payroll Management</h2>
              <Button variant="outline" onClick={handleExportPayroll}>
                <Download className="mr-2 h-4 w-4" />
                Export Payroll
              </Button>
            </div>
            <PayrollSection />
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Evaluation & KPIs</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>KPI Score</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Review Date</TableHead>
                      <TableHead>Feedback</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performance.map((perf) => (
                      <TableRow key={perf.id}>
                        <TableCell className="font-medium">{perf.employeeName}</TableCell>
                        <TableCell>{perf.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${perf.kpi}%` }}
                              />
                            </div>
                            {perf.kpi}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {perf.rating}/5
                          </Badge>
                        </TableCell>
                        <TableCell>{perf.reviewDate}</TableCell>
                        <TableCell className="max-w-xs truncate">{perf.feedback}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">HR Reports</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportEmployees}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Employees
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export All Reports
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Attendance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Attendance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Present:</span>
                      <span className="font-medium">{attendanceSummary.present}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Absent:</span>
                      <span className="font-medium text-destructive">{attendanceSummary.absent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late:</span>
                      <span className="font-medium text-secondary">{attendanceSummary.late}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Half Day:</span>
                      <span className="font-medium text-muted-foreground">{attendanceSummary.halfDay}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Total Records:</span>
                      <span className="font-medium">{attendanceSummary.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payroll Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Payroll Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-medium">₹{payrollSummary.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processed:</span>
                      <span className="font-medium text-primary">{payrollSummary.processed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending:</span>
                      <span className="font-medium text-muted-foreground">{payrollSummary.pending}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Department-wise Staff */}
              <Card>
                <CardHeader>
                  <CardTitle>Department-wise Staff Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(employees.map(e => e.department))).map(dept => (
                      <div key={dept} className="flex justify-between items-center">
                        <span>{dept}</span>
                        <Badge>
                          {employees.filter(e => e.department === dept).length} employees
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Document Expiry */}
              <Card>
                <CardHeader>
                  <CardTitle>Document Expiry Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documentExpiryReport.slice(0, 5).map((doc, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div>
                          <div className="font-medium">{doc.employee}</div>
                          <div className="text-muted-foreground">{doc.document}</div>
                        </div>
                        <Badge variant={getStatusColor(doc.status)}>
                          {doc.expiryDate}
                        </Badge>
                      </div>
                    ))}
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

export default HRMS;