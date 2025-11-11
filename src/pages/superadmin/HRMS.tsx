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
import { CheckCircle, XCircle, Search, Download, Upload, Plus, Edit, Trash2, User, Calendar, FileText, Eye, Sheet, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
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
  workingDays: number;
  paidDays: number;
  lopDays: number;
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

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Show</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span>entries per page</span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span>
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Updated Departments
const departments = [
  "Housekeeping Management", 
  "Security Management", 
  "Parking Management", 
  "Waste Management", 
  "STP Tank Cleaning", 
  "Consumables Management"
];

const positions = {
  "Housekeeping Management": ["Housekeeping Supervisor", "Cleaner", "Floor Manager", "Sanitation Officer"],
  "Security Management": ["Security Guard", "Security Supervisor", "Security Manager", "CCTV Operator"],
  "Parking Management": ["Parking Attendant", "Parking Supervisor", "Valet", "Parking Manager"],
  "Waste Management": ["Waste Collector", "Waste Supervisor", "Recycling Officer", "Waste Manager"],
  "STP Tank Cleaning": ["STP Operator", "Cleaning Technician", "STP Supervisor", "Maintenance Manager"],
  "Consumables Management": ["Store Keeper", "Inventory Manager", "Supply Coordinator", "Procurement Officer"]
};

const generateIndianPhone = () => `9${Math.floor(100000000 + Math.random() * 900000000)}`;
const generateAadhar = () => `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;

// Updated Initial Data with Provided Names
const initialEmployees: Employee[] = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "PRAVIN GAIKWAD",
    email: "pravin.gaikwad@company.com",
    phone: "9876543210",
    aadharNumber: "1234 5678 9012",
    department: "Housekeeping Management",
    position: "Housekeeping Supervisor",
    joinDate: "2023-01-15",
    status: "active",
    salary: 25000,
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
    name: "KAILASH WAGHMARE",
    email: "kailash.waghmare@company.com",
    phone: "9876543211",
    aadharNumber: "2345 6789 0123",
    department: "Security Management",
    position: "Security Supervisor",
    joinDate: "2022-03-10",
    status: "active",
    salary: 22000,
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
    name: "KALPNA RATHOD",
    email: "kalpna.rathod@company.com",
    phone: "9876543212",
    aadharNumber: "3456 7890 1234",
    department: "Housekeeping Management",
    position: "Cleaner",
    joinDate: "2021-06-20",
    status: "active",
    salary: 18000,
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
  },
  {
    id: 4,
    employeeId: "EMP004",
    name: "GUNDU GHORGANE",
    email: "gundu.ghorgane@company.com",
    phone: "9876543213",
    aadharNumber: "4567 8901 2345",
    department: "Parking Management",
    position: "Parking Supervisor",
    joinDate: "2023-03-15",
    status: "active",
    salary: 20000,
    uan: "101234567893",
    esicNumber: "231234567893",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2023-03-15",
        expiryDate: "2030-03-15",
        status: "valid"
      }
    ]
  },
  {
    id: 5,
    employeeId: "EMP005",
    name: "GOVIND PILEWAD",
    email: "govind.pilewad@company.com",
    phone: "9876543214",
    aadharNumber: "5678 9012 3456",
    department: "Waste Management",
    position: "Waste Supervisor",
    joinDate: "2022-08-01",
    status: "active",
    salary: 21000,
    uan: "101234567894",
    esicNumber: "231234567894",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2022-08-01",
        expiryDate: "2030-08-01",
        status: "valid"
      }
    ]
  },
  {
    id: 6,
    employeeId: "EMP006",
    name: "LALJI KUMAR",
    email: "lalji.kumar@company.com",
    phone: "9876543215",
    aadharNumber: "6789 0123 4567",
    department: "STP Tank Cleaning",
    position: "STP Operator",
    joinDate: "2023-02-10",
    status: "active",
    salary: 23000,
    uan: "101234567895",
    esicNumber: "231234567895",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2023-02-10",
        expiryDate: "2030-02-10",
        status: "valid"
      }
    ]
  },
  {
    id: 7,
    employeeId: "EMP007",
    name: "KHUSHBOO",
    email: "khushboo@company.com",
    phone: "9876543216",
    aadharNumber: "7890 1234 5678",
    department: "Consumables Management",
    position: "Store Keeper",
    joinDate: "2021-11-15",
    status: "active",
    salary: 19000,
    uan: "101234567896",
    esicNumber: "231234567896",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2021-11-15",
        expiryDate: "2024-11-15",
        status: "expiring"
      }
    ]
  },
  {
    id: 8,
    employeeId: "EMP008",
    name: "SHOBHA RATHOD",
    email: "shobha.rathod@company.com",
    phone: "9876543217",
    aadharNumber: "8901 2345 6789",
    department: "Housekeeping Management",
    position: "Cleaner",
    joinDate: "2023-04-20",
    status: "active",
    salary: 18000,
    uan: "101234567897",
    esicNumber: "231234567897",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2023-04-20",
        expiryDate: "2030-04-20",
        status: "valid"
      }
    ]
  },
  {
    id: 9,
    employeeId: "EMP009",
    name: "RAJARAM S",
    email: "rajaram.s@company.com",
    phone: "9876543218",
    aadharNumber: "9012 3456 7890",
    department: "Security Management",
    position: "Security Guard",
    joinDate: "2023-07-01",
    status: "active",
    salary: 17000,
    uan: "101234567898",
    esicNumber: "231234567898",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2023-07-01",
        expiryDate: "2030-07-01",
        status: "valid"
      }
    ]
  },
  {
    id: 10,
    employeeId: "EMP010",
    name: "SWAPNIL S",
    email: "swapnil.s@company.com",
    phone: "9876543219",
    aadharNumber: "0123 4567 8901",
    department: "Parking Management",
    position: "Parking Attendant",
    joinDate: "2023-05-15",
    status: "active",
    salary: 16000,
    uan: "101234567899",
    esicNumber: "231234567899",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2023-05-15",
        expiryDate: "2030-05-15",
        status: "valid"
      }
    ]
  },
  {
    id: 11,
    employeeId: "EMP011",
    name: "RUPALI VAIRGAR",
    email: "rupali.vairgar@company.com",
    phone: "9876543220",
    aadharNumber: "1123 4567 8901",
    department: "Waste Management",
    position: "Waste Collector",
    joinDate: "2023-06-10",
    status: "active",
    salary: 16500,
    uan: "101234567900",
    esicNumber: "231234567900",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2023-06-10",
        expiryDate: "2030-06-10",
        status: "valid"
      }
    ]
  },
  {
    id: 12,
    employeeId: "EMP012",
    name: "MANISHA ADHAVE",
    email: "manisha.adhave@company.com",
    phone: "9876543221",
    aadharNumber: "1223 4567 8901",
    department: "STP Tank Cleaning",
    position: "Cleaning Technician",
    joinDate: "2023-08-15",
    status: "active",
    salary: 17500,
    uan: "101234567901",
    esicNumber: "231234567901",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2023-08-15",
        expiryDate: "2030-08-15",
        status: "valid"
      }
    ]
  },
  {
    id: 13,
    employeeId: "EMP013",
    name: "DHURABAI ADE",
    email: "dhurabai.ade@company.com",
    phone: "9876543222",
    aadharNumber: "1323 4567 8901",
    department: "Consumables Management",
    position: "Inventory Manager",
    joinDate: "2022-12-01",
    status: "active",
    salary: 24000,
    uan: "101234567902",
    esicNumber: "231234567902",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2022-12-01",
        expiryDate: "2030-12-01",
        status: "valid"
      }
    ]
  },
  {
    id: 14,
    employeeId: "EMP014",
    name: "ASHWINI KATAKR",
    email: "ashwini.katakr@company.com",
    phone: "9876543223",
    aadharNumber: "1423 4567 8901",
    department: "Housekeeping Management",
    position: "Sanitation Officer",
    joinDate: "2023-09-20",
    status: "active",
    salary: 22000,
    uan: "101234567903",
    esicNumber: "231234567903",
    documents: [
      {
        id: 1,
        type: "Aadhar Card",
        name: "aadhar_card.pdf",
        uploadDate: "2023-09-20",
        expiryDate: "2030-09-20",
        status: "valid"
      }
    ]
  }
];

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    employee: "PRAVIN GAIKWAD",
    employeeId: "EMP001",
    type: "Sick Leave",
    from: "2024-01-15",
    to: "2024-01-16",
    reason: "Fever and cold",
    status: "pending"
  },
  {
    id: 2,
    employee: "KAILASH WAGHMARE",
    employeeId: "EMP002",
    type: "Vacation",
    from: "2024-02-01",
    to: "2024-02-05",
    reason: "Family vacation",
    status: "approved"
  },
  {
    id: 3,
    employee: "KALPNA RATHOD",
    employeeId: "EMP003",
    type: "Emergency Leave",
    from: "2024-01-20",
    to: "2024-01-20",
    reason: "Medical emergency",
    status: "rejected"
  },
  {
    id: 4,
    employee: "GUNDU GHORGANE",
    employeeId: "EMP004",
    type: "Personal Leave",
    from: "2024-01-25",
    to: "2024-01-26",
    reason: "Personal work",
    status: "pending"
  },
  {
    id: 5,
    employee: "GOVIND PILEWAD",
    employeeId: "EMP005",
    type: "Sick Leave",
    from: "2024-01-18",
    to: "2024-01-19",
    reason: "Health issues",
    status: "approved"
  },
  {
    id: 6,
    employee: "LALJI KUMAR",
    employeeId: "EMP006",
    type: "Casual Leave",
    from: "2024-01-22",
    to: "2024-01-22",
    reason: "Family function",
    status: "pending"
  }
];

const initialAttendance: Attendance[] = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "PRAVIN GAIKWAD",
    date: "2024-01-10",
    checkIn: "08:55",
    checkOut: "17:00",
    status: "present"
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "KAILASH WAGHMARE",
    date: "2024-01-10",
    checkIn: "09:15",
    checkOut: "17:00",
    status: "late"
  },
  {
    id: 3,
    employeeId: "EMP003",
    employeeName: "KALPNA RATHOD",
    date: "2024-01-10",
    checkIn: "09:00",
    checkOut: "13:00",
    status: "half-day"
  },
  {
    id: 4,
    employeeId: "EMP004",
    employeeName: "GUNDU GHORGANE",
    date: "2024-01-10",
    checkIn: "09:00",
    checkOut: "17:00",
    status: "present"
  },
  {
    id: 5,
    employeeId: "EMP005",
    employeeName: "GOVIND PILEWAD",
    date: "2024-01-10",
    checkIn: "09:00",
    checkOut: "17:00",
    status: "present"
  },
  {
    id: 6,
    employeeId: "EMP006",
    employeeName: "LALJI KUMAR",
    date: "2024-01-10",
    checkIn: "08:55",
    checkOut: "17:00",
    status: "present"
  },
  {
    id: 7,
    employeeId: "EMP007",
    employeeName: "KHUSHBOO",
    date: "2024-01-10",
    checkIn: "09:20",
    checkOut: "17:00",
    status: "late"
  },
  {
    id: 8,
    employeeId: "EMP008",
    employeeName: "SHOBHA RATHOD",
    date: "2024-01-10",
    checkIn: "09:00",
    checkOut: "17:00",
    status: "present"
  },
  {
    id: 9,
    employeeId: "EMP009",
    employeeName: "RAJARAM S",
    date: "2024-01-10",
    checkIn: "09:00",
    checkOut: "17:00",
    status: "present"
  },
  {
    id: 10,
    employeeId: "EMP010",
    employeeName: "SWAPNIL S",
    date: "2024-01-10",
    checkIn: "09:05",
    checkOut: "17:00",
    status: "present"
  },
  {
    id: 11,
    employeeId: "EMP011",
    employeeName: "RUPALI VAIRGAR",
    date: "2024-01-10",
    checkIn: "09:00",
    checkOut: "17:00",
    status: "present"
  },
  {
    id: 12,
    employeeId: "EMP012",
    employeeName: "MANISHA ADHAVE",
    date: "2024-01-10",
    checkIn: "08:50",
    checkOut: "17:00",
    status: "present"
  },
  {
    id: 13,
    employeeId: "EMP013",
    employeeName: "DHURABAI ADE",
    date: "2024-01-10",
    checkIn: "09:00",
    checkOut: "17:00",
    status: "present"
  },
  {
    id: 14,
    employeeId: "EMP014",
    employeeName: "ASHWINI KATAKR",
    date: "2024-01-10",
    checkIn: "09:10",
    checkOut: "17:00",
    status: "late"
  }
];

const initialPayroll: Payroll[] = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "PRAVIN GAIKWAD",
    month: "January 2024",
    basicSalary: 17500,
    allowances: 5000,
    deductions: 2500,
    netSalary: 20000,
    status: "processed",
    paymentDate: "2024-01-31",
    bankAccount: "XXXXXX1234",
    ifscCode: "SBIN0000123"
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "KAILASH WAGHMARE",
    month: "January 2024",
    basicSalary: 15400,
    allowances: 4500,
    deductions: 2400,
    netSalary: 17500,
    status: "pending",
    bankAccount: "XXXXXX5678",
    ifscCode: "HDFC0000456"
  },
  {
    id: 3,
    employeeId: "EMP003",
    employeeName: "KALPNA RATHOD",
    month: "January 2024",
    basicSalary: 12600,
    allowances: 4000,
    deductions: 2100,
    netSalary: 14500,
    status: "processed",
    paymentDate: "2024-01-31",
    bankAccount: "XXXXXX9012",
    ifscCode: "ICIC0000789"
  },
  {
    id: 4,
    employeeId: "EMP004",
    employeeName: "GUNDU GHORGANE",
    month: "January 2024",
    basicSalary: 14000,
    allowances: 4500,
    deductions: 2300,
    netSalary: 16200,
    status: "processed",
    paymentDate: "2024-01-31",
    bankAccount: "XXXXXX3456",
    ifscCode: "SBIN0000789"
  },
  {
    id: 5,
    employeeId: "EMP005",
    employeeName: "GOVIND PILEWAD",
    month: "January 2024",
    basicSalary: 14700,
    allowances: 4700,
    deductions: 2400,
    netSalary: 17000,
    status: "pending",
    bankAccount: "XXXXXX7890",
    ifscCode: "HDFC0000123"
  },
  {
    id: 6,
    employeeId: "EMP006",
    employeeName: "LALJI KUMAR",
    month: "January 2024",
    basicSalary: 16100,
    allowances: 5200,
    deductions: 2600,
    netSalary: 18700,
    status: "processed",
    paymentDate: "2024-01-31",
    bankAccount: "XXXXXX2345",
    ifscCode: "ICIC0000123"
  }
];

const initialPerformance: Performance[] = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "PRAVIN GAIKWAD",
    department: "Housekeeping Management",
    kpi: 85,
    rating: 4.5,
    reviewDate: "2024-01-05",
    feedback: "Excellent performance in maintaining cleanliness standards"
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "KAILASH WAGHMARE",
    department: "Security Management",
    kpi: 92,
    rating: 4.8,
    reviewDate: "2024-01-05",
    feedback: "Outstanding work in security monitoring and vigilance"
  },
  {
    id: 3,
    employeeId: "EMP003",
    employeeName: "KALPNA RATHOD",
    department: "Housekeeping Management",
    kpi: 78,
    rating: 4.2,
    reviewDate: "2024-01-05",
    feedback: "Good cleaning work with attention to detail"
  },
  {
    id: 4,
    employeeId: "EMP004",
    employeeName: "GUNDU GHORGANE",
    department: "Parking Management",
    kpi: 88,
    rating: 4.6,
    reviewDate: "2024-01-05",
    feedback: "Excellent parking management and customer service"
  },
  {
    id: 5,
    employeeId: "EMP005",
    employeeName: "GOVIND PILEWAD",
    department: "Waste Management",
    kpi: 95,
    rating: 4.9,
    reviewDate: "2024-01-05",
    feedback: "Outstanding waste management and recycling efforts"
  },
  {
    id: 6,
    employeeId: "EMP006",
    employeeName: "LALJI KUMAR",
    department: "STP Tank Cleaning",
    kpi: 82,
    rating: 4.3,
    reviewDate: "2024-01-05",
    feedback: "Good technical skills in STP operations"
  },
  {
    id: 7,
    employeeId: "EMP007",
    employeeName: "KHUSHBOO",
    department: "Consumables Management",
    kpi: 90,
    rating: 4.7,
    reviewDate: "2024-01-05",
    feedback: "Excellent inventory management and organization"
  }
];

const initialShifts: Shift[] = [
  {
    id: 1,
    name: "Morning Shift",
    startTime: "06:00",
    endTime: "14:00",
    employees: ["EMP001", "EMP003", "EMP008", "EMP014"]
  },
  {
    id: 2,
    name: "Evening Shift",
    startTime: "14:00",
    endTime: "22:00",
    employees: ["EMP002", "EMP004", "EMP009", "EMP010"]
  },
  {
    id: 3,
    name: "Night Shift",
    startTime: "22:00",
    endTime: "06:00",
    employees: ["EMP005", "EMP006", "EMP011", "EMP012", "EMP013"]
  }
];

const initialSalaryStructures: SalaryStructure[] = [
  {
    id: 1,
    employeeId: "EMP001",
    basic: 17500,
    hra: 3500,
    da: 2625,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 3500,
    otherAllowances: 1750,
    pf: 2100,
    esic: 262.5,
    professionalTax: 200,
    tds: 0,
    otherDeductions: 0,
    workingDays: 26,
    paidDays: 24,
    lopDays: 2
  },
  {
    id: 2,
    employeeId: "EMP002",
    basic: 15400,
    hra: 3080,
    da: 2310,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 3080,
    otherAllowances: 1540,
    pf: 1848,
    esic: 231,
    professionalTax: 200,
    tds: 0,
    otherDeductions: 0,
    workingDays: 26,
    paidDays: 25,
    lopDays: 1
  },
  {
    id: 3,
    employeeId: "EMP003",
    basic: 12600,
    hra: 2520,
    da: 1890,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 2520,
    otherAllowances: 1260,
    pf: 1512,
    esic: 189,
    professionalTax: 200,
    tds: 0,
    otherDeductions: 0,
    workingDays: 26,
    paidDays: 23,
    lopDays: 3
  },
  {
    id: 4,
    employeeId: "EMP004",
    basic: 14000,
    hra: 2800,
    da: 2100,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 2800,
    otherAllowances: 1400,
    pf: 1680,
    esic: 210,
    professionalTax: 200,
    tds: 0,
    otherDeductions: 0,
    workingDays: 26,
    paidDays: 26,
    lopDays: 0
  },
  {
    id: 5,
    employeeId: "EMP005",
    basic: 14700,
    hra: 2940,
    da: 2205,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 2940,
    otherAllowances: 1470,
    pf: 1764,
    esic: 220.5,
    professionalTax: 200,
    tds: 0,
    otherDeductions: 0,
    workingDays: 26,
    paidDays: 25,
    lopDays: 1
  },
  {
    id: 6,
    employeeId: "EMP006",
    basic: 16100,
    hra: 3220,
    da: 2415,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 3220,
    otherAllowances: 1610,
    pf: 1932,
    esic: 241.5,
    professionalTax: 200,
    tds: 0,
    otherDeductions: 0,
    workingDays: 26,
    paidDays: 26,
    lopDays: 0
  },
  {
    id: 7,
    employeeId: "EMP007",
    basic: 13300,
    hra: 2660,
    da: 1995,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 2660,
    otherAllowances: 1330,
    pf: 1596,
    esic: 199.5,
    professionalTax: 200,
    tds: 0,
    otherDeductions: 0,
    workingDays: 26,
    paidDays: 24,
    lopDays: 2
  }
];

const initialSalarySlips: SalarySlip[] = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "PRAVIN GAIKWAD",
    month: "January 2024",
    paidDays: 24,
    designation: "Housekeeping Supervisor",
    uan: "101234567890",
    esicNumber: "231234567890",
    earnings: {
      basic: 17500,
      da: 2625,
      hra: 3500,
      cca: 1600,
      washing: 800,
      leave: 0,
      medical: 1250,
      bonus: 0,
      otherAllowances: 1750
    },
    deductions: {
      pf: 2100,
      esic: 262.5,
      monthlyDeductions: 0,
      mlwf: 25,
      professionalTax: 200
    },
    netSalary: 20000,
    generatedDate: "2024-01-31"
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "KAILASH WAGHMARE",
    month: "January 2024",
    paidDays: 25,
    designation: "Security Supervisor",
    uan: "101234567891",
    esicNumber: "231234567891",
    earnings: {
      basic: 15400,
      da: 2310,
      hra: 3080,
      cca: 1600,
      washing: 800,
      leave: 0,
      medical: 1250,
      bonus: 0,
      otherAllowances: 1540
    },
    deductions: {
      pf: 1848,
      esic: 231,
      monthlyDeductions: 0,
      mlwf: 25,
      professionalTax: 200
    },
    netSalary: 17500,
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
          salary: Number(values[headers.indexOf('salary')]) || 18000,
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

// Calculate Employee Attendance Function
const calculateEmployeeAttendance = (employeeId: string, month: string, attendanceData: Attendance[]) => {
  const monthAttendance = attendanceData.filter(record => 
    record.employeeId === employeeId && 
    record.date.startsWith(month)
  );
  
  const totalDays = monthAttendance.length;
  const presentDays = monthAttendance.filter(record => 
    record.status === 'present' || record.status === 'late'
  ).length;
  const halfDays = monthAttendance.filter(record => 
    record.status === 'half-day'
  ).length;
  const absentDays = monthAttendance.filter(record => 
    record.status === 'absent'
  ).length;
  
  // Calculate paid days (present + 0.5 for half days)
  const paidDays = presentDays + (halfDays * 0.5);
  const workingDays = 26; // Standard working days per month
  const lopDays = workingDays - paidDays;
  
  return {
    totalDays,
    presentDays,
    halfDays,
    absentDays,
    paidDays,
    workingDays,
    lopDays
  };
};

// Enhanced SalaryStructuresTable Component with Attendance Integration
const SalaryStructuresTable = ({ 
  employees, 
  salaryStructures, 
  attendance,
  selectedMonth,
  onUpdateSalaryStructure 
}: { 
  employees: Employee[];
  salaryStructures: SalaryStructure[];
  attendance: Attendance[];
  selectedMonth: string;
  onUpdateSalaryStructure: (employeeId: string, updates: Partial<SalaryStructure>) => void;
}) => {
  const calculateProRatedSalary = (basicSalary: number, paidDays: number, workingDays: number) => {
    return (basicSalary / workingDays) * paidDays;
  };

  const calculateSalaryComponents = (basicSalary: number, paidDays: number, workingDays: number) => {
    const proRatedBasic = calculateProRatedSalary(basicSalary, paidDays, workingDays);
    
    return {
      basic: proRatedBasic,
      hra: proRatedBasic * 0.2, // 20% of basic
      da: proRatedBasic * 0.15,  // 15% of basic
      conveyance: paidDays >= 15 ? 1600 : (1600 / workingDays) * paidDays, // Full conveyance if 15+ days worked
      medical: 1250, // Fixed medical allowance
      specialAllowance: proRatedBasic * 0.2, // 20% of basic
      otherAllowances: proRatedBasic * 0.1, // 10% of basic
      pf: Math.min(proRatedBasic * 0.12, 1800), // 12% of basic, max ₹1800
      esic: proRatedBasic * 0.0075, // 0.75% of basic
      professionalTax: paidDays > 0 ? 200 : 0, // Professional tax only if worked
      workingDays,
      paidDays,
      lopDays: workingDays - paidDays
    };
  };

  const handleAutoCalculate = (employeeId: string, basicSalary: number) => {
    const attendanceData = calculateEmployeeAttendance(employeeId, selectedMonth, attendance);
    const components = calculateSalaryComponents(basicSalary, attendanceData.paidDays, attendanceData.workingDays);
    onUpdateSalaryStructure(employeeId, components);
  };

  const handleWorkingDaysChange = (employeeId: string, workingDays: number) => {
    const structure = salaryStructures.find(s => s.employeeId === employeeId);
    if (structure) {
      const paidDays = Math.min(structure.paidDays, workingDays);
      const lopDays = workingDays - paidDays;
      
      onUpdateSalaryStructure(employeeId, {
        workingDays,
        paidDays,
        lopDays
      });
    }
  };

  const handlePaidDaysChange = (employeeId: string, paidDays: number) => {
    const structure = salaryStructures.find(s => s.employeeId === employeeId);
    if (structure) {
      const validatedPaidDays = Math.min(paidDays, structure.workingDays);
      const lopDays = structure.workingDays - validatedPaidDays;
      
      onUpdateSalaryStructure(employeeId, {
        paidDays: validatedPaidDays,
        lopDays
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Salary Structures with Attendance Integration</h3>
          <p className="text-sm text-muted-foreground">
            Working days and paid days are automatically calculated from attendance records
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Selected Month: {new Date(selectedMonth + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Basic</TableHead>
            <TableHead>HRA</TableHead>
            <TableHead>DA</TableHead>
            <TableHead>Conveyance</TableHead>
            <TableHead>Medical</TableHead>
            <TableHead>Special Allowance</TableHead>
            <TableHead>PF</TableHead>
            <TableHead>ESIC</TableHead>
            <TableHead>Prof. Tax</TableHead>
            <TableHead>Net Salary</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.filter(emp => emp.status === "active").map((employee) => {
            const structure = salaryStructures.find(s => s.employeeId === employee.employeeId);
            const attendanceData = calculateEmployeeAttendance(employee.employeeId, selectedMonth, attendance);
            
            if (!structure) return null;

            const totalEarnings = 
              (structure.basic || 0) + 
              (structure.hra || 0) + 
              (structure.da || 0) + 
              (structure.conveyance || 0) + 
              (structure.medical || 0) + 
              (structure.specialAllowance || 0) + 
              (structure.otherAllowances || 0);

            const totalDeductions = 
              (structure.pf || 0) + 
              (structure.esic || 0) + 
              (structure.professionalTax || 0) + 
              (structure.tds || 0) + 
              (structure.otherDeductions || 0);

            const netSalary = totalEarnings - totalDeductions;

            return (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  <div>{employee.name}</div>
                  <div className="text-sm text-muted-foreground">{employee.employeeId}</div>
                </TableCell>
                
                {/* Attendance Summary */}
                <TableCell>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Working:</span>
                      <Input
                        type="number"
                        value={structure.workingDays}
                        onChange={(e) => handleWorkingDaysChange(employee.employeeId, Number(e.target.value))}
                        className="w-16 h-6 text-xs"
                        min="0"
                        max="31"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span>Paid:</span>
                      <Input
                        type="number"
                        value={structure.paidDays}
                        onChange={(e) => handlePaidDaysChange(employee.employeeId, Number(e.target.value))}
                        className="w-16 h-6 text-xs"
                        min="0"
                        max={structure.workingDays}
                      />
                    </div>
                    <div className="flex justify-between text-destructive">
                      <span>LOP:</span>
                      <span>{structure.lopDays}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Salary Components */}
                <TableCell>
                  <Input
                    type="number"
                    value={structure.basic}
                    onChange={(e) => onUpdateSalaryStructure(employee.employeeId, { basic: Number(e.target.value) })}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>₹{(structure.hra || 0).toLocaleString()}</TableCell>
                <TableCell>₹{(structure.da || 0).toLocaleString()}</TableCell>
                <TableCell>₹{(structure.conveyance || 0).toLocaleString()}</TableCell>
                <TableCell>₹{(structure.medical || 0).toLocaleString()}</TableCell>
                <TableCell>₹{(structure.specialAllowance || 0).toLocaleString()}</TableCell>
                <TableCell>₹{(structure.pf || 0).toLocaleString()}</TableCell>
                <TableCell>₹{(structure.esic || 0).toLocaleString()}</TableCell>
                <TableCell>₹{(structure.professionalTax || 0).toLocaleString()}</TableCell>
                
                {/* Net Salary */}
                <TableCell className="font-semibold">
                  ₹{netSalary.toLocaleString()}
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAutoCalculate(employee.employeeId, employee.salary)}
                    >
                      Auto Calculate
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const currentAttendance = calculateEmployeeAttendance(employee.employeeId, selectedMonth, attendance);
                        onUpdateSalaryStructure(employee.employeeId, {
                          workingDays: currentAttendance.workingDays,
                          paidDays: currentAttendance.paidDays,
                          lopDays: currentAttendance.lopDays
                        });
                      }}
                    >
                      Sync Attendance
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Salary Calculation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium">Total Employees</div>
              <div>{employees.filter(emp => emp.status === "active").length}</div>
            </div>
            <div>
              <div className="font-medium">Total Monthly Salary</div>
              <div>₹{employees.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="font-medium">Total LOP Days</div>
              <div className="text-destructive">
                {salaryStructures.reduce((sum, s) => sum + (s.lopDays || 0), 0)}
              </div>
            </div>
            <div>
              <div className="font-medium">Adjusted Salary</div>
              <div>₹{
                salaryStructures.reduce((sum, structure) => {
                  const totalEarnings = 
                    (structure.basic || 0) + 
                    (structure.hra || 0) + 
                    (structure.da || 0) + 
                    (structure.conveyance || 0) + 
                    (structure.medical || 0) + 
                    (structure.specialAllowance || 0) + 
                    (structure.otherAllowances || 0);
                  const totalDeductions = 
                    (structure.pf || 0) + 
                    (structure.esic || 0) + 
                    (structure.professionalTax || 0);
                  return sum + (totalEarnings - totalDeductions);
                }, 0).toLocaleString()
              }</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Salary Slip Card Component
const SalarySlipCard = ({ slip, salaryStructure }: { slip: SalarySlip; salaryStructure?: SalaryStructure }) => {
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

        {/* Employee Details with Attendance */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div><strong>Name:</strong> {slip.employeeName}</div>
            <div><strong>Designation:</strong> {slip.designation}</div>
            {salaryStructure && (
              <>
                <div><strong>Working Days:</strong> {salaryStructure.workingDays}</div>
                <div><strong>Paid Days:</strong> {salaryStructure.paidDays}</div>
                <div><strong>LOP Days:</strong> {salaryStructure.lopDays}</div>
              </>
            )}
          </div>
          <div>
            <div><strong>Employee ID:</strong> {slip.employeeId}</div>
            <div><strong>UAN:</strong> {slip.uan}</div>
            <div><strong>ESIC NO:</strong> {slip.esicNumber}</div>
            <div><strong>Payment Date:</strong> {slip.generatedDate}</div>
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
                amount > 0 && (
                  <div key={key} className="flex justify-between">
                    <span>{key.toUpperCase().replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span>₹{amount.toLocaleString()}</span>
                  </div>
                )
              ))}
              <div className="flex justify-between font-bold border-t-2 border-gray-300 pt-2">
                <span>TOTAL EARNINGS</span>
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
                amount > 0 && (
                  <div key={key} className="flex justify-between">
                    <span>{key.toUpperCase().replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span>₹{amount.toLocaleString()}</span>
                  </div>
                )
              ))}
              <div className="flex justify-between font-bold border-t-2 border-gray-300 pt-2">
                <span>TOTAL DEDUCTIONS</span>
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
          {salaryStructure && salaryStructure.lopDays > 0 && (
            <div className="text-sm text-destructive mt-2">
              Note: Salary adjusted for {salaryStructure.lopDays} Loss of Pay day(s)
            </div>
          )}
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

// Payroll Section Component
const PayrollSection = ({ 
  employees, 
  payroll, 
  salaryStructures, 
  salarySlips, 
  attendance,
  selectedMonth,
  onProcessPayroll,
  onGenerateSalary,
  onBulkSalaryGenerate,
  onUpdateSalaryStructure
}: { 
  employees: Employee[];
  payroll: Payroll[];
  salaryStructures: SalaryStructure[];
  salarySlips: SalarySlip[];
  attendance: Attendance[];
  selectedMonth: string;
  onProcessPayroll: (id: number) => void;
  onGenerateSalary: (employeeId: string) => void;
  onBulkSalaryGenerate: () => void;
  onUpdateSalaryStructure: (employeeId: string, updates: Partial<SalaryStructure>) => void;
}) => {
  const [activePayrollTab, setActivePayrollTab] = useState("salary-slips");
  const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
  const [selectedEmployeeForSalary, setSelectedEmployeeForSalary] = useState<string>("");

  // Pagination state for payroll tables
  const [payrollPage, setPayrollPage] = useState(1);
  const [payrollItemsPerPage, setPayrollItemsPerPage] = useState(5);
  const [salarySlipsPage, setSalarySlipsPage] = useState(1);
  const [salarySlipsItemsPerPage, setSalarySlipsItemsPerPage] = useState(3);

  const payrollSummary = {
    total: payroll.reduce((sum, p) => sum + p.netSalary, 0),
    processed: payroll.filter(p => p.status === "processed").length,
    pending: payroll.filter(p => p.status === "pending").length
  };

  // Paginated payroll data
  const paginatedPayroll = payroll.slice(
    (payrollPage - 1) * payrollItemsPerPage,
    payrollPage * payrollItemsPerPage
  );

  // Paginated salary slips data
  const paginatedSalarySlips = salarySlips.slice(
    (salarySlipsPage - 1) * salarySlipsItemsPerPage,
    salarySlipsPage * salarySlipsItemsPerPage
  );

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
              <Button onClick={onBulkSalaryGenerate}>
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
                        onChange={(e) => {/* Handle month change */}}
                      />
                    </FormField>
                    <Button 
                      onClick={() => {
                        onGenerateSalary(selectedEmployeeForSalary);
                        setSalaryDialogOpen(false);
                      }}
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
                {paginatedSalarySlips.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No salary slips generated yet. Generate your first salary slip.
                  </div>
                ) : (
                  paginatedSalarySlips.map((slip) => {
                    const salaryStructure = salaryStructures.find(s => s.employeeId === slip.employeeId);
                    return (
                      <SalarySlipCard key={slip.id} slip={slip} salaryStructure={salaryStructure} />
                    );
                  })
                )}
              </div>
              
              {/* Pagination for Salary Slips */}
              {salarySlips.length > 0 && (
                <Pagination
                  currentPage={salarySlipsPage}
                  totalPages={Math.ceil(salarySlips.length / salarySlipsItemsPerPage)}
                  totalItems={salarySlips.length}
                  itemsPerPage={salarySlipsItemsPerPage}
                  onPageChange={setSalarySlipsPage}
                  onItemsPerPageChange={setSalarySlipsItemsPerPage}
                />
              )}
            </TabsContent>

            <TabsContent value="salary-structures" className="space-y-4">
              <SalaryStructuresTable 
                employees={employees} 
                salaryStructures={salaryStructures}
                attendance={attendance}
                selectedMonth={selectedMonth}
                onUpdateSalaryStructure={onUpdateSalaryStructure}
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
                  {paginatedPayroll.map((pay) => (
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
                        <Badge variant={pay.status === "processed" ? "default" : "secondary"}>
                          {pay.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pay.status === "pending" && (
                          <Button 
                            size="sm" 
                            onClick={() => onProcessPayroll(pay.id)}
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
              
              {/* Pagination for Payroll Records */}
              {payroll.length > 0 && (
                <Pagination
                  currentPage={payrollPage}
                  totalPages={Math.ceil(payroll.length / payrollItemsPerPage)}
                  totalItems={payroll.length}
                  itemsPerPage={payrollItemsPerPage}
                  onPageChange={setPayrollPage}
                  onItemsPerPageChange={setPayrollItemsPerPage}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
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
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // Current month in YYYY-MM format
  );
  
  // Pagination states for different tabs
  const [employeesPage, setEmployeesPage] = useState(1);
  const [employeesItemsPerPage, setEmployeesItemsPerPage] = useState(5);
  const [leaveRequestsPage, setLeaveRequestsPage] = useState(1);
  const [leaveRequestsItemsPerPage, setLeaveRequestsItemsPerPage] = useState(5);
  const [attendancePage, setAttendancePage] = useState(1);
  const [attendanceItemsPerPage, setAttendanceItemsPerPage] = useState(5);
  const [performancePage, setPerformancePage] = useState(1);
  const [performanceItemsPerPage, setPerformanceItemsPerPage] = useState(5);

  // Enhanced New Employee Form State
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    aadharNumber: "",
    department: "",
    position: "",
    salary: "",
    photo: null as File | null,
    siteName: "",
    dateOfBirth: "",
    dateOfJoining: "",
    dateOfExit: "",
    bloodGroup: "",
    permanentAddress: "",
    permanentPincode: "",
    localAddress: "",
    localPincode: "",
    // Bank Details
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    // Family Details for ESIC
    fatherName: "",
    motherName: "",
    spouseName: "",
    numberOfChildren: "",
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    // Nominee Details
    nomineeName: "",
    nomineeRelation: "",
    // Uniform Details
    pantSize: "",
    shirtSize: "",
    capSize: "",
    idCardIssued: false,
    westcoatIssued: false,
    apronIssued: false,
    // Signatures
    employeeSignature: null as File | null,
    authorizedSignature: null as File | null
  });

  // New Shift Form State
  const [newShift, setNewShift] = useState({
    name: "",
    startTime: "06:00",
    endTime: "14:00",
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
      joinDate: newEmployee.dateOfJoining || new Date().toISOString().split('T')[0],
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
      basic: Number(newEmployee.salary) * 0.7,
      hra: Number(newEmployee.salary) * 0.2,
      da: Number(newEmployee.salary) * 0.15,
      conveyance: 1600,
      medical: 1250,
      specialAllowance: Number(newEmployee.salary) * 0.2,
      otherAllowances: Number(newEmployee.salary) * 0.1,
      pf: Number(newEmployee.salary) * 0.12,
      esic: Number(newEmployee.salary) * 0.0075,
      professionalTax: 200,
      tds: 0,
      otherDeductions: 0,
      workingDays: 26,
      paidDays: 26,
      lopDays: 0
    };

    setEmployees([...employees, employee]);
    setSalaryStructures([...salaryStructures, defaultSalaryStructure]);
    
    // Reset form
    setNewEmployee({ 
      name: "", 
      email: "", 
      phone: "", 
      aadharNumber: "", 
      department: "", 
      position: "", 
      salary: "",
      photo: null,
      siteName: "",
      dateOfBirth: "",
      dateOfJoining: "",
      dateOfExit: "",
      bloodGroup: "",
      permanentAddress: "",
      permanentPincode: "",
      localAddress: "",
      localPincode: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      fatherName: "",
      motherName: "",
      spouseName: "",
      numberOfChildren: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      nomineeName: "",
      nomineeRelation: "",
      pantSize: "",
      shirtSize: "",
      capSize: "",
      idCardIssued: false,
      westcoatIssued: false,
      apronIssued: false,
      employeeSignature: null,
      authorizedSignature: null
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
    setNewShift({ name: "", startTime: "06:00", endTime: "14:00", employees: [] });
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

  // Signature Upload Functions
  const handleSignatureUpload = (type: 'employee' | 'authorized', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'employee') {
        setNewEmployee({...newEmployee, employeeSignature: file});
      } else {
        setNewEmployee({...newEmployee, authorizedSignature: file});
      }
      toast.success(`${type === 'employee' ? 'Employee' : 'Authorized'} signature uploaded successfully!`);
    }
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
      paidDays: salaryStructure.paidDays,
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

  // Filtered and paginated data
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    (employeesPage - 1) * employeesItemsPerPage,
    employeesPage * employeesItemsPerPage
  );

  const paginatedLeaveRequests = leaveRequests.slice(
    (leaveRequestsPage - 1) * leaveRequestsItemsPerPage,
    leaveRequestsPage * leaveRequestsItemsPerPage
  );

  const paginatedAttendance = attendance.slice(
    (attendancePage - 1) * attendanceItemsPerPage,
    attendancePage * attendanceItemsPerPage
  );

  const paginatedPerformance = performance.slice(
    (performancePage - 1) * performanceItemsPerPage,
    performancePage * performanceItemsPerPage
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
                    {paginatedEmployees.map((employee) => (
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

                {/* Pagination for Employees */}
                {filteredEmployees.length > 0 && (
                  <Pagination
                    currentPage={employeesPage}
                    totalPages={Math.ceil(filteredEmployees.length / employeesItemsPerPage)}
                    totalItems={filteredEmployees.length}
                    itemsPerPage={employeesItemsPerPage}
                    onPageChange={setEmployeesPage}
                    onItemsPerPageChange={setEmployeesItemsPerPage}
                  />
                )}
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
                {/* Header Section */}
                <div className="border-2 border-gray-300 p-6 mb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold">SK ENTERPRISES</div>
                        <div className="text-sm text-muted-foreground">Housekeeping • Parking • Waste Management</div>
                        <div className="text-lg font-semibold mt-2">Employee Joining Form</div>
                      </div>
                      
                      <div className="flex justify-between items-start">
                        <div className="border-2 border-dashed border-gray-400 w-24 h-32 flex items-center justify-center text-xs text-muted-foreground text-center p-2">
                          Photo
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div className="text-sm font-semibold">New Joining</div>
                          <div className="text-sm">
                            Code No. / Ref No.: <span className="border-b border-gray-400 inline-block min-w-[100px]">SK-___________</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-8">
                  {/* Employee Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Employee Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Site Name" id="siteName">
                        <Input
                          id="siteName"
                          value={newEmployee.siteName}
                          onChange={(e) => setNewEmployee({...newEmployee, siteName: e.target.value})}
                          placeholder="Enter site name"
                        />
                      </FormField>
                      
                      <FormField label="Name" id="name" required>
                        <Input
                          id="name"
                          value={newEmployee.name}
                          onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                          placeholder="Enter full name"
                          required
                        />
                      </FormField>
                      
                      <FormField label="Date of Birth" id="dateOfBirth">
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={newEmployee.dateOfBirth}
                          onChange={(e) => setNewEmployee({...newEmployee, dateOfBirth: e.target.value})}
                        />
                      </FormField>
                      
                      <FormField label="Date of Joining" id="dateOfJoining">
                        <Input
                          id="dateOfJoining"
                          type="date"
                          value={newEmployee.dateOfJoining}
                          onChange={(e) => setNewEmployee({...newEmployee, dateOfJoining: e.target.value})}
                        />
                      </FormField>
                      
                      <FormField label="Date of Exit" id="dateOfExit">
                        <Input
                          id="dateOfExit"
                          type="date"
                          value={newEmployee.dateOfExit}
                          onChange={(e) => setNewEmployee({...newEmployee, dateOfExit: e.target.value})}
                        />
                      </FormField>
                      
                      <FormField label="Contact No." id="phone">
                        <Input
                          id="phone"
                          value={newEmployee.phone}
                          onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </FormField>
                      
                      <FormField label="Blood Group" id="bloodGroup">
                        <Input
                          id="bloodGroup"
                          value={newEmployee.bloodGroup}
                          onChange={(e) => setNewEmployee({...newEmployee, bloodGroup: e.target.value})}
                          placeholder="Enter blood group"
                        />
                      </FormField>
                      
                      <FormField label="Email" id="email" required>
                        <Input
                          id="email"
                          type="email"
                          value={newEmployee.email}
                          onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                          placeholder="Enter email address"
                          required
                        />
                      </FormField>
                      
                      <FormField label="Aadhar Number" id="aadharNumber" required>
                        <Input
                          id="aadharNumber"
                          value={newEmployee.aadharNumber}
                          onChange={(e) => setNewEmployee({...newEmployee, aadharNumber: e.target.value})}
                          placeholder="Enter Aadhar number"
                          required
                        />
                      </FormField>
                    </div>
                    
                    <FormField label="Permanent Address" id="permanentAddress">
                      <Textarea
                        id="permanentAddress"
                        value={newEmployee.permanentAddress}
                        onChange={(e) => setNewEmployee({...newEmployee, permanentAddress: e.target.value})}
                        placeholder="Enter permanent address"
                      />
                    </FormField>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Pin Code" id="permanentPincode">
                        <Input
                          id="permanentPincode"
                          value={newEmployee.permanentPincode}
                          onChange={(e) => setNewEmployee({...newEmployee, permanentPincode: e.target.value})}
                          placeholder="Enter pin code"
                        />
                      </FormField>
                    </div>
                    
                    <FormField label="Local Address" id="localAddress">
                      <Textarea
                        id="localAddress"
                        value={newEmployee.localAddress}
                        onChange={(e) => setNewEmployee({...newEmployee, localAddress: e.target.value})}
                        placeholder="Enter local address"
                      />
                    </FormField>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Pin Code" id="localPincode">
                        <Input
                          id="localPincode"
                          value={newEmployee.localPincode}
                          onChange={(e) => setNewEmployee({...newEmployee, localPincode: e.target.value})}
                          placeholder="Enter pin code"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Bank Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Bank Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Bank Name" id="bankName">
                        <Input
                          id="bankName"
                          value={newEmployee.bankName}
                          onChange={(e) => setNewEmployee({...newEmployee, bankName: e.target.value})}
                          placeholder="Enter bank name"
                        />
                      </FormField>
                      
                      <FormField label="Account Number" id="accountNumber">
                        <Input
                          id="accountNumber"
                          value={newEmployee.accountNumber}
                          onChange={(e) => setNewEmployee({...newEmployee, accountNumber: e.target.value})}
                          placeholder="Enter account number"
                        />
                      </FormField>
                      
                      <FormField label="IFSC Code" id="ifscCode">
                        <Input
                          id="ifscCode"
                          value={newEmployee.ifscCode}
                          onChange={(e) => setNewEmployee({...newEmployee, ifscCode: e.target.value})}
                          placeholder="Enter IFSC code"
                        />
                      </FormField>
                      
                      <FormField label="Branch Name" id="branchName">
                        <Input
                          id="branchName"
                          value={newEmployee.branchName}
                          onChange={(e) => setNewEmployee({...newEmployee, branchName: e.target.value})}
                          placeholder="Enter branch name"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Family Details for ESIC Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Family Details for ESIC</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Father's Name" id="fatherName">
                        <Input
                          id="fatherName"
                          value={newEmployee.fatherName}
                          onChange={(e) => setNewEmployee({...newEmployee, fatherName: e.target.value})}
                          placeholder="Enter father's name"
                        />
                      </FormField>
                      
                      <FormField label="Mother's Name" id="motherName">
                        <Input
                          id="motherName"
                          value={newEmployee.motherName}
                          onChange={(e) => setNewEmployee({...newEmployee, motherName: e.target.value})}
                          placeholder="Enter mother's name"
                        />
                      </FormField>
                      
                      <FormField label="Spouse Name" id="spouseName">
                        <Input
                          id="spouseName"
                          value={newEmployee.spouseName}
                          onChange={(e) => setNewEmployee({...newEmployee, spouseName: e.target.value})}
                          placeholder="Enter spouse name"
                        />
                      </FormField>
                      
                      <FormField label="Number of Children" id="numberOfChildren">
                        <Input
                          id="numberOfChildren"
                          type="number"
                          value={newEmployee.numberOfChildren}
                          onChange={(e) => setNewEmployee({...newEmployee, numberOfChildren: e.target.value})}
                          placeholder="Enter number of children"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Emergency Contact</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Emergency Contact Name" id="emergencyContactName">
                        <Input
                          id="emergencyContactName"
                          value={newEmployee.emergencyContactName}
                          onChange={(e) => setNewEmployee({...newEmployee, emergencyContactName: e.target.value})}
                          placeholder="Enter emergency contact name"
                        />
                      </FormField>
                      
                      <FormField label="Emergency Contact Phone" id="emergencyContactPhone">
                        <Input
                          id="emergencyContactPhone"
                          value={newEmployee.emergencyContactPhone}
                          onChange={(e) => setNewEmployee({...newEmployee, emergencyContactPhone: e.target.value})}
                          placeholder="Enter emergency contact phone"
                        />
                      </FormField>
                      
                      <FormField label="Relation" id="emergencyContactRelation">
                        <Input
                          id="emergencyContactRelation"
                          value={newEmployee.emergencyContactRelation}
                          onChange={(e) => setNewEmployee({...newEmployee, emergencyContactRelation: e.target.value})}
                          placeholder="Enter relation"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Nominee Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Nominee Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Nominee Name" id="nomineeName">
                        <Input
                          id="nomineeName"
                          value={newEmployee.nomineeName}
                          onChange={(e) => setNewEmployee({...newEmployee, nomineeName: e.target.value})}
                          placeholder="Enter nominee name"
                        />
                      </FormField>
                      
                      <FormField label="Nominee Relation" id="nomineeRelation">
                        <Input
                          id="nomineeRelation"
                          value={newEmployee.nomineeRelation}
                          onChange={(e) => setNewEmployee({...newEmployee, nomineeRelation: e.target.value})}
                          placeholder="Enter nominee relation"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Uniform Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Uniform Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Pant Size" id="pantSize">
                        <Select value={newEmployee.pantSize} onValueChange={(value) => setNewEmployee({...newEmployee, pantSize: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pant size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="28">28</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="32">32</SelectItem>
                            <SelectItem value="34">34</SelectItem>
                            <SelectItem value="36">36</SelectItem>
                            <SelectItem value="38">38</SelectItem>
                            <SelectItem value="40">40</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>
                      
                      <FormField label="Shirt Size" id="shirtSize">
                        <Select value={newEmployee.shirtSize} onValueChange={(value) => setNewEmployee({...newEmployee, shirtSize: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shirt size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="S">S</SelectItem>
                            <SelectItem value="M">M</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                            <SelectItem value="XL">XL</SelectItem>
                            <SelectItem value="XXL">XXL</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>
                      
                      <FormField label="Cap Size" id="capSize">
                        <Select value={newEmployee.capSize} onValueChange={(value) => setNewEmployee({...newEmployee, capSize: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cap size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="S">S</SelectItem>
                            <SelectItem value="M">M</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                            <SelectItem value="XL">XL</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="idCardIssued"
                          checked={newEmployee.idCardIssued}
                          onChange={(e) => setNewEmployee({...newEmployee, idCardIssued: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="idCardIssued">ID Card Issued</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="westcoatIssued"
                          checked={newEmployee.westcoatIssued}
                          onChange={(e) => setNewEmployee({...newEmployee, westcoatIssued: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="westcoatIssued">Westcoat Issued</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="apronIssued"
                          checked={newEmployee.apronIssued}
                          onChange={(e) => setNewEmployee({...newEmployee, apronIssued: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="apronIssued">Apron Issued</Label>
                      </div>
                    </div>
                  </div>

                  {/* Employment Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Employment Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Department" id="department">
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
                      </FormField>
                      
                      <FormField label="Position" id="position">
                        <Input
                          id="position"
                          value={newEmployee.position}
                          onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                          placeholder="Enter position"
                        />
                      </FormField>
                      
                      <FormField label="Monthly Salary (₹)" id="salary">
                        <Input
                          id="salary"
                          type="number"
                          value={newEmployee.salary}
                          onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                          placeholder="Enter monthly salary"
                        />
                      </FormField>
                      
                      <FormField label="Upload Photo" id="photo">
                        <Input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewEmployee({...newEmployee, photo: e.target.files?.[0] || null})}
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Signatures Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Signatures</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField label="Employee Signature" id="employeeSignature">
                          <div className="border-2 border-dashed rounded-lg p-6 text-center">
                            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Upload employee signature
                            </p>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSignatureUpload('employee', e)}
                              className="hidden"
                              id="employee-signature-upload"
                            />
                            <Label htmlFor="employee-signature-upload">
                              <Button variant="outline" className="mt-4" asChild>
                                <span>Upload Signature</span>
                              </Button>
                            </Label>
                            {newEmployee.employeeSignature && (
                              <p className="mt-2 text-sm text-green-600">
                                Signature uploaded
                              </p>
                            )}
                          </div>
                        </FormField>
                      </div>
                      
                      <div className="space-y-4">
                        <FormField label="Authorized Signature" id="authorizedSignature">
                          <div className="border-2 border-dashed rounded-lg p-6 text-center">
                            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Upload authorized signature
                            </p>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSignatureUpload('authorized', e)}
                              className="hidden"
                              id="authorized-signature-upload"
                            />
                            <Label htmlFor="authorized-signature-upload">
                              <Button variant="outline" className="mt-4" asChild>
                                <span>Upload Signature</span>
                              </Button>
                            </Label>
                            {newEmployee.authorizedSignature && (
                              <p className="mt-2 text-sm text-green-600">
                                Signature uploaded
                              </p>
                            )}
                          </div>
                        </FormField>
                      </div>
                    </div>
                  </div>

                  {/* Document Upload Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Document Upload</h3>
                    
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
                        <div>• ESIC Family Details</div>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleAddEmployee} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Employee
                  </Button>
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
                    {paginatedAttendance.map((record) => (
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

                {/* Pagination for Attendance */}
                {attendance.length > 0 && (
                  <Pagination
                    currentPage={attendancePage}
                    totalPages={Math.ceil(attendance.length / attendanceItemsPerPage)}
                    totalItems={attendance.length}
                    itemsPerPage={attendanceItemsPerPage}
                    onPageChange={setAttendancePage}
                    onItemsPerPageChange={setAttendanceItemsPerPage}
                  />
                )}
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
                    {paginatedLeaveRequests.map((leave) => (
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

                {/* Pagination for Leave Requests */}
                {leaveRequests.length > 0 && (
                  <Pagination
                    currentPage={leaveRequestsPage}
                    totalPages={Math.ceil(leaveRequests.length / leaveRequestsItemsPerPage)}
                    totalItems={leaveRequests.length}
                    itemsPerPage={leaveRequestsItemsPerPage}
                    onPageChange={setLeaveRequestsPage}
                    onItemsPerPageChange={setLeaveRequestsItemsPerPage}
                  />
                )}
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
            <PayrollSection 
              employees={employees}
              payroll={payroll}
              salaryStructures={salaryStructures}
              salarySlips={salarySlips}
              attendance={attendance}
              selectedMonth={selectedMonth}
              onProcessPayroll={handleProcessPayroll}
              onGenerateSalary={handleGenerateSalary}
              onBulkSalaryGenerate={handleBulkSalaryGenerate}
              onUpdateSalaryStructure={handleUpdateSalaryStructure}
            />
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
                    {paginatedPerformance.map((perf) => (
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

                {/* Pagination for Performance */}
                {performance.length > 0 && (
                  <Pagination
                    currentPage={performancePage}
                    totalPages={Math.ceil(performance.length / performanceItemsPerPage)}
                    totalItems={performance.length}
                    itemsPerPage={performanceItemsPerPage}
                    onPageChange={setPerformancePage}
                    onItemsPerPageChange={setPerformanceItemsPerPage}
                  />
                )}
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