import { useOutletContext } from "react-router-dom";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { StatCard } from "@/components/shared/StatCard";
import { 
  Users, 
  Shield, 
  Building2, 
  Briefcase, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Plus, 
  Search, 
  Download, 
  Filter, 
  Calendar, 
  Clock, 
  Wrench, 
  DollarSign, 
  UserCheck, 
  CalendarDays, 
  BarChart3, 
  Users as UsersIcon, 
  HardHat, 
  Truck, 
  ArrowUpDown, 
  FileText,
  Settings,
  Hammer,
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Home,
  Key,
  Car,
  Trash2,
  Droplets,
  ShoppingCart,
  RefreshCw,
  Send,
  Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

// Indian names dummy data
const indianNames = {
  male: ["Rajesh Kumar", "Amit Sharma", "Sanjay Patel", "Vikram Singh", "Arun Reddy", "Mohan Das", "Suresh Iyer", "Prakash Joshi", "Deepak Mehta", "Kiran Nair"],
  female: ["Priya Sharma", "Anjali Singh", "Sunita Reddy", "Kavita Patel", "Meera Iyer", "Laxmi Kumar", "Sonia Das", "Neha Joshi", "Pooja Mehta", "Ritu Nair"],
  sites: [
    "ALYSSUM DEVELOPERS PVT. LTD.",
    "ARYA ASSOCIATES",
    "ASTITVA ASSET MANAGEMENT LLP",
    "A.T.C COMMERCIAL PREMISES CO. OPERATIVE SOCIETY LTD",
    "BAHIRAT ESTATE LLP",
    "CHITRALI PROPERTIES PVT LTD",
    "Concretely Infra Llp",
    "COORTUS ADVISORS LLP",
    "CUSHMAN & WAKEFIELD PROPERTY MANAGEMENT SERVICES INDIA PVT. LTD.",
    "DAKSHA INFRASTRUCTURE PVT. LTD."
  ],
  departments: [
    "Housekeeping", 
    "Security", 
    "Parking", 
    "Waste Management", 
    "STP Tank Cleaning", 
    "Consumables"
  ],
  machinery: [
    "Floor Scrubber", "Vacuum Cleaner", "Pressure Washer", "Security Vehicle", "Parking Barrier", "Waste Compactor",
    "Sewage Pump", "Water Treatment Plant", "Generator", "Air Compressor", "Cleaning Cart", "Surveillance System"
  ],
  parties: ["ABC Construction", "XYZ Builders", "Modern Constructions", "Elite Developers", "Prime Infrastructure", "Metro Builders"]
};

// Extended dummy data with detailed reports for Admin
const extendedDummyData = {
  dashboardStats: {
    admin: {
      totalManagers: 6,
      totalSupervisors: 15,
      totalEmployees: 120,
      totalSites: 10,
      activeTasks: 18,
      pendingLeaves: 12,
      presentToday: 98,
      absentToday: 22,
      activeMachinery: 25,
      totalDebtors: 4,
      todayAttendance: "81.7%",
      machineryUnderMaintenance: 3,
      totalOutstanding: 850000
    }
  },

  // Attendance Data
  attendanceReports: [
    {
      id: '1',
      site: 'ALYSSUM DEVELOPERS PVT. LTD.',
      date: '2024-01-15',
      totalEmployees: 18,
      present: 15,
      absent: 3,
      lateArrivals: 2,
      earlyDepartures: 1,
      attendanceRate: '83.3%',
      shortage: 3,
      departmentBreakdown: [
        { department: 'Housekeeping', present: 5, total: 6, rate: '83.3%' },
        { department: 'Security', present: 3, total: 3, rate: '100%' },
        { department: 'Parking', present: 2, total: 2, rate: '100%' },
        { department: 'Waste Management', present: 3, total: 4, rate: '75.0%' },
        { department: 'STP Tank Cleaning', present: 1, total: 2, rate: '50.0%' },
        { department: 'Consumables', present: 1, total: 1, rate: '100%' }
      ]
    },
    {
      id: '2',
      site: 'ARYA ASSOCIATES',
      date: '2024-01-15',
      totalEmployees: 15,
      present: 13,
      absent: 2,
      lateArrivals: 1,
      earlyDepartures: 0,
      attendanceRate: '86.7%',
      shortage: 2,
      departmentBreakdown: [
        { department: 'Housekeeping', present: 4, total: 5, rate: '80.0%' },
        { department: 'Security', present: 3, total: 3, rate: '100%' },
        { department: 'Parking', present: 2, total: 2, rate: '100%' },
        { department: 'Waste Management', present: 2, total: 2, rate: '100%' },
        { department: 'STP Tank Cleaning', present: 1, total: 2, rate: '50.0%' },
        { department: 'Consumables', present: 1, total: 1, rate: '100%' }
      ]
    },
    {
      id: '3',
      site: 'ASTITVA ASSET MANAGEMENT LLP',
      date: '2024-01-15',
      totalEmployees: 16,
      present: 14,
      absent: 2,
      lateArrivals: 1,
      earlyDepartures: 1,
      attendanceRate: '87.5%',
      shortage: 2,
      departmentBreakdown: [
        { department: 'Housekeeping', present: 5, total: 6, rate: '83.3%' },
        { department: 'Security', present: 3, total: 3, rate: '100%' },
        { department: 'Parking', present: 2, total: 2, rate: '100%' },
        { department: 'Waste Management', present: 2, total: 2, rate: '100%' },
        { department: 'STP Tank Cleaning', present: 1, total: 2, rate: '50.0%' },
        { department: 'Consumables', present: 1, total: 1, rate: '100%' }
      ]
    }
  ],

  // Employee-wise attendance data
  employeeAttendance: [
    {
      id: '1',
      employeeId: 'EMP001',
      name: 'Rajesh Kumar',
      department: 'Housekeeping',
      site: 'ALYSSUM DEVELOPERS PVT. LTD.',
      date: '2024-01-15',
      checkIn: '08:30 AM',
      checkOut: '05:30 PM',
      status: 'present',
      lateBy: '0 mins',
      earlyDeparture: '0 mins',
      totalHours: '9h 0m',
      overtime: '0 mins'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      name: 'Priya Sharma',
      department: 'Security',
      site: 'ALYSSUM DEVELOPERS PVT. LTD.',
      date: '2024-01-15',
      checkIn: '08:00 AM',
      checkOut: '08:00 PM',
      status: 'present',
      lateBy: '0 mins',
      earlyDeparture: '0 mins',
      totalHours: '12h 0m',
      overtime: '4h 0m'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      name: 'Amit Sharma',
      department: 'Parking',
      site: 'ARYA ASSOCIATES',
      date: '2024-01-15',
      checkIn: '07:45 AM',
      checkOut: '04:45 PM',
      status: 'present',
      lateBy: '0 mins',
      earlyDeparture: '0 mins',
      totalHours: '9h 0m',
      overtime: '0 mins'
    },
    {
      id: '4',
      employeeId: 'EMP004',
      name: 'Sanjay Patel',
      department: 'Waste Management',
      site: 'ASTITVA ASSET MANAGEMENT LLP',
      date: '2024-01-15',
      checkIn: '08:15 AM',
      checkOut: '05:15 PM',
      status: 'present',
      lateBy: '0 mins',
      earlyDeparture: '0 mins',
      totalHours: '9h 0m',
      overtime: '0 mins'
    },
    {
      id: '5',
      employeeId: 'EMP005',
      name: 'Anjali Singh',
      department: 'STP Tank Cleaning',
      site: 'ALYSSUM DEVELOPERS PVT. LTD.',
      date: '2024-01-15',
      checkIn: '08:45 AM',
      checkOut: '05:45 PM',
      status: 'present',
      lateBy: '0 mins',
      earlyDeparture: '0 mins',
      totalHours: '9h 0m',
      overtime: '0 mins'
    },
    {
      id: '6',
      employeeId: 'EMP006',
      name: 'Vikram Singh',
      department: 'Consumables',
      site: 'ARYA ASSOCIATES',
      date: '2024-01-15',
      checkIn: '09:05 AM',
      checkOut: '06:05 PM',
      status: 'present',
      lateBy: '5 mins',
      earlyDeparture: '0 mins',
      totalHours: '9h 0m',
      overtime: '0 mins'
    },
    {
      id: '7',
      employeeId: 'EMP007',
      name: 'Sunita Reddy',
      department: 'Housekeeping',
      site: 'ASTITVA ASSET MANAGEMENT LLP',
      date: '2024-01-15',
      checkIn: '08:35 AM',
      checkOut: '05:25 PM',
      status: 'present',
      lateBy: '5 mins',
      earlyDeparture: '5 mins',
      totalHours: '8h 50m',
      overtime: '0 mins'
    },
    {
      id: '8',
      employeeId: 'EMP008',
      name: 'Kiran Nair',
      department: 'Security',
      site: 'ALYSSUM DEVELOPERS PVT. LTD.',
      date: '2024-01-15',
      checkIn: '08:00 AM',
      checkOut: '08:00 PM',
      status: 'present',
      lateBy: '0 mins',
      earlyDeparture: '0 mins',
      totalHours: '12h 0m',
      overtime: '4h 0m'
    },
    {
      id: '9',
      employeeId: 'EMP009',
      name: 'Mohan Das',
      department: 'Parking',
      site: 'ARYA ASSOCIATES',
      date: '2024-01-15',
      checkIn: '07:50 AM',
      checkOut: '04:40 PM',
      status: 'present',
      lateBy: '0 mins',
      earlyDeparture: '20 mins',
      totalHours: '8h 50m',
      overtime: '0 mins'
    },
    {
      id: '10',
      employeeId: 'EMP010',
      name: 'Suresh Iyer',
      department: 'Waste Management',
      site: 'ALYSSUM DEVELOPERS PVT. LTD.',
      date: '2024-01-15',
      checkIn: '-',
      checkOut: '-',
      status: 'absent',
      lateBy: '-',
      earlyDeparture: '-',
      totalHours: '0h',
      overtime: '0 mins'
    }
  ],

  // Daily summary data
  dailySummary: {
    date: '2024-01-15',
    totalEmployees: 120,
    present: 98,
    absent: 22,
    lateArrivals: 8,
    halfDays: 3,
    earlyDepartures: 4,
    overallAttendance: '81.7%',
    siteWiseSummary: [
      { site: 'ALYSSUM DEVELOPERS PVT. LTD.', present: 15, total: 18, rate: '83.3%' },
      { site: 'ARYA ASSOCIATES', present: 13, total: 15, rate: '86.7%' },
      { site: 'ASTITVA ASSET MANAGEMENT LLP', present: 14, total: 16, rate: '87.5%' },
      { site: 'A.T.C COMMERCIAL PREMISES CO. OPERATIVE SOCIETY LTD', present: 12, total: 14, rate: '85.7%' },
      { site: 'BAHIRAT ESTATE LLP', present: 11, total: 12, rate: '91.7%' }
    ],
    departmentWiseSummary: [
      { department: 'Housekeeping', present: 32, total: 38, rate: '84.2%' },
      { department: 'Security', present: 20, total: 20, rate: '100%' },
      { department: 'Parking', present: 14, total: 14, rate: '100%' },
      { department: 'Waste Management', present: 16, total: 18, rate: '88.9%' },
      { department: 'STP Tank Cleaning', present: 10, total: 16, rate: '62.5%' },
      { department: 'Consumables', present: 6, total: 6, rate: '100%' }
    ]
  },

  // Site Machinery Reports Data
  machineryReports: [
    {
      id: '1',
      machineryId: 'MACH001',
      name: 'Industrial Floor Scrubber',
      type: 'Floor Scrubber',
      model: 'Tennant T7',
      site: 'ALYSSUM DEVELOPERS PVT. LTD.',
      status: 'active',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-10',
      operator: 'Rajesh Kumar',
      operatorPhone: '9876543210',
      purchaseDate: '2023-05-15',
      warrantyUntil: '2025-05-15',
      hoursOperated: 450,
      fuelConsumption: 'Electric',
      remarks: 'Excellent condition. Daily cleaning operations ongoing.',
      maintenanceHistory: [
        { date: '2024-01-10', type: 'Routine', cost: 8000, technician: 'Technical Team A' },
        { date: '2023-12-15', type: 'Brush Replacement', cost: 5000, technician: 'Technical Team B' }
      ]
    },
    {
      id: '2',
      machineryId: 'MACH002',
      name: 'Commercial Vacuum Cleaner',
      type: 'Vacuum Cleaner',
      model: 'Karcher B 40',
      site: 'ARYA ASSOCIATES',
      status: 'active',
      lastMaintenance: '2024-01-08',
      nextMaintenance: '2024-02-08',
      operator: 'Sunita Reddy',
      operatorPhone: '9876543211',
      purchaseDate: '2023-06-20',
      warrantyUntil: '2025-06-20',
      hoursOperated: 320,
      fuelConsumption: 'Electric',
      remarks: 'Good working condition. Regular filter changes done.',
      maintenanceHistory: [
        { date: '2024-01-08', type: 'Filter Replacement', cost: 3000, technician: 'Technical Team A' }
      ]
    },
    {
      id: '3',
      machineryId: 'MACH003',
      name: 'Security Patrol Vehicle',
      type: 'Security Vehicle',
      model: 'Mahindra Bolero',
      site: 'ASTITVA ASSET MANAGEMENT LLP',
      status: 'active',
      lastMaintenance: '2024-01-12',
      nextMaintenance: '2024-02-12',
      operator: 'Priya Sharma',
      operatorPhone: '9876543212',
      purchaseDate: '2023-07-10',
      warrantyUntil: '2025-07-10',
      hoursOperated: 1250,
      fuelConsumption: '12km/l',
      remarks: 'Patrol vehicle in good condition. Regular security rounds ongoing.',
      maintenanceHistory: [
        { date: '2024-01-12', type: 'Routine Service', cost: 8500, technician: 'Technical Team B' }
      ]
    },
    {
      id: '4',
      machineryId: 'MACH004',
      name: 'Automatic Parking Barrier',
      type: 'Parking Barrier',
      model: 'FAAC XT4',
      site: 'A.T.C COMMERCIAL PREMISES CO. OPERATIVE SOCIETY LTD',
      status: 'maintenance',
      lastMaintenance: '2024-01-13',
      nextMaintenance: '2024-01-25',
      operator: 'Amit Sharma',
      operatorPhone: '9876543213',
      purchaseDate: '2023-08-15',
      warrantyUntil: '2025-08-15',
      hoursOperated: 2890,
      fuelConsumption: 'Electric',
      remarks: 'Motor replacement in progress. Expected completion in 2 days.',
      maintenanceHistory: [
        { date: '2024-01-13', type: 'Motor Repair', cost: 12000, technician: 'Technical Team C' }
      ]
    },
    {
      id: '5',
      machineryId: 'MACH005',
      name: 'Waste Compactor Truck',
      type: 'Waste Compactor',
      model: 'Tata Ace HT',
      site: 'ALYSSUM DEVELOPERS PVT. LTD.',
      status: 'active',
      lastMaintenance: '2024-01-09',
      nextMaintenance: '2024-02-09',
      operator: 'Sanjay Patel',
      operatorPhone: '9876543214',
      purchaseDate: '2023-09-05',
      warrantyUntil: '2025-09-05',
      hoursOperated: 980,
      fuelConsumption: '10km/l',
      remarks: 'Efficient waste collection. Regular compaction operations.',
      maintenanceHistory: [
        { date: '2024-01-09', type: 'Routine', cost: 11000, technician: 'Technical Team A' }
      ]
    }
  ],

  // Outstanding Debtors Reports Data
  debtorReports: [
    {
      id: '1',
      partyId: 'PARTY001',
      partyName: 'ABC Construction',
      contactPerson: 'Ramesh Gupta',
      phone: '9876543210',
      email: 'ramesh@abcconstruction.com',
      address: '123 Business Park, Mumbai',
      totalAmount: 450000,
      pendingAmount: 150000,
      lastPaymentDate: '2024-01-10',
      lastPaymentAmount: 100000,
      dueDate: '2024-01-30',
      overdueDays: 0,
      status: 'pending',
      creditLimit: 500000,
      paymentHistory: [
        { date: '2024-01-10', amount: 100000, mode: 'Bank Transfer', reference: 'REF001' },
        { date: '2023-12-15', amount: 100000, mode: 'Cheque', reference: 'REF002' },
        { date: '2023-11-20', amount: 100000, mode: 'Bank Transfer', reference: 'REF003' }
      ]
    },
    {
      id: '2',
      partyId: 'PARTY002',
      partyName: 'XYZ Builders',
      contactPerson: 'Suresh Mehta',
      phone: '9876543211',
      email: 'suresh@xyzbuilders.com',
      address: '456 Corporate Tower, Delhi',
      totalAmount: 320000,
      pendingAmount: 120000,
      lastPaymentDate: '2024-01-05',
      lastPaymentAmount: 80000,
      dueDate: '2024-01-25',
      overdueDays: 0,
      status: 'pending',
      creditLimit: 400000,
      paymentHistory: [
        { date: '2024-01-05', amount: 80000, mode: 'UPI', reference: 'REF004' },
        { date: '2023-12-10', amount: 80000, mode: 'Bank Transfer', reference: 'REF005' },
        { date: '2023-11-25', amount: 80000, mode: 'Cheque', reference: 'REF006' }
      ]
    }
  ],

  // Recent Activities Data
  recentActivities: [
    {
      id: '1',
      user: 'Rajesh Kumar',
      action: 'Checked in at ALYSSUM DEVELOPERS',
      timestamp: '10 minutes ago',
      type: 'attendance'
    },
    {
      id: '2',
      user: 'System',
      action: 'Daily attendance report generated',
      timestamp: '30 minutes ago',
      type: 'system'
    },
    {
      id: '3',
      user: 'Priya Sharma',
      action: 'Updated security logs',
      timestamp: '1 hour ago',
      type: 'user'
    },
    {
      id: '4',
      user: 'Admin',
      action: 'Approved leave request - Amit Sharma',
      timestamp: '2 hours ago',
      type: 'approval'
    },
    {
      id: '5',
      user: 'Sanjay Patel',
      action: 'Submitted waste management report',
      timestamp: '3 hours ago',
      type: 'user'
    }
  ]
};

// Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage 
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
      <div className="flex items-center space-x-2">
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
        
        {/* Page numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}

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

const AdminDashboard = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const [stats, setStats] = useState(extendedDummyData.dashboardStats.admin);
  const [attendanceReports, setAttendanceReports] = useState(extendedDummyData.attendanceReports);
  const [employeeAttendance, setEmployeeAttendance] = useState(extendedDummyData.employeeAttendance);
  const [dailySummary, setDailySummary] = useState(extendedDummyData.dailySummary);
  const [machineryReports, setMachineryReports] = useState(extendedDummyData.machineryReports);
  const [debtorReports, setDebtorReports] = useState(extendedDummyData.debtorReports);
  const [recentActivities, setRecentActivities] = useState(extendedDummyData.recentActivities);
  
  // Pagination states
  const [attendancePage, setAttendancePage] = useState(1);
  const [employeePage, setEmployeePage] = useState(1);
  const [machineryPage, setMachineryPage] = useState(1);
  const [debtorPage, setDebtorPage] = useState(1);
  const itemsPerPage = 5;

  // Search and filter states for Attendance
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [siteFilter, setSiteFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-15',
    end: '2024-01-15'
  });

  // Search and filter states for Machinery
  const [machinerySearch, setMachinerySearch] = useState('');
  const [machineryStatusFilter, setMachineryStatusFilter] = useState('all');
  const [machinerySiteFilter, setMachinerySiteFilter] = useState('all');
  const [machineryTypeFilter, setMachineryTypeFilter] = useState('all');

  // Search and filter states for Debtors
  const [debtorSearch, setDebtorSearch] = useState('');
  const [debtorStatusFilter, setDebtorStatusFilter] = useState('all');

  // Filter functions for Attendance
  const filteredAttendance = attendanceReports.filter(site =>
    site.site.toLowerCase().includes(attendanceSearch.toLowerCase())
  );

  const filteredEmployeeAttendance = employeeAttendance.filter(employee =>
    employee.name.toLowerCase().includes(employeeSearch.toLowerCase()) &&
    (siteFilter === 'all' || employee.site === siteFilter) &&
    (departmentFilter === 'all' || employee.department === departmentFilter) &&
    (statusFilter === 'all' || employee.status === statusFilter)
  );

  // Filter functions for Machinery
  const filteredMachinery = machineryReports.filter(machine =>
    machine.name.toLowerCase().includes(machinerySearch.toLowerCase()) &&
    (machineryStatusFilter === 'all' || machine.status === machineryStatusFilter) &&
    (machinerySiteFilter === 'all' || machine.site === machinerySiteFilter) &&
    (machineryTypeFilter === 'all' || machine.type === machineryTypeFilter)
  );

  // Filter functions for Debtors
  const filteredDebtors = debtorReports.filter(debtor =>
    debtor.partyName.toLowerCase().includes(debtorSearch.toLowerCase()) &&
    (debtorStatusFilter === 'all' || debtor.status === debtorStatusFilter)
  );

  // Pagination calculations
  const attendanceTotalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
  const employeeTotalPages = Math.ceil(filteredEmployeeAttendance.length / itemsPerPage);
  const machineryTotalPages = Math.ceil(filteredMachinery.length / itemsPerPage);
  const debtorTotalPages = Math.ceil(filteredDebtors.length / itemsPerPage);

  const paginatedAttendance = filteredAttendance.slice(
    (attendancePage - 1) * itemsPerPage,
    attendancePage * itemsPerPage
  );

  const paginatedEmployeeAttendance = filteredEmployeeAttendance.slice(
    (employeePage - 1) * itemsPerPage,
    employeePage * itemsPerPage
  );

  const paginatedMachinery = filteredMachinery.slice(
    (machineryPage - 1) * itemsPerPage,
    machineryPage * itemsPerPage
  );

  const paginatedDebtors = filteredDebtors.slice(
    (debtorPage - 1) * itemsPerPage,
    debtorPage * itemsPerPage
  );

  // Quick action handlers
  const handleDownloadReport = () => {
    toast.success('Attendance report downloaded successfully');
  };

  const handleSyncAttendance = () => {
    toast.success('Attendance data synced successfully');
  };

  const handleSendReminders = () => {
    toast.success('Attendance reminders sent to all staff');
  };

  const handleApproveAll = () => {
    toast.success('All pending attendance approved');
  };

  const handleGeneratePayroll = () => {
    toast.success('Payroll generation started');
  };

  // Export handlers
  const handleExportAttendance = (type: string) => {
    toast.success(`${type} attendance report exported successfully`);
  };

  const handleExportMachinery = () => {
    toast.success('Machinery report exported successfully');
  };

  const handleExportDebtors = () => {
    toast.success('Debtors report exported successfully');
  };

  // Get unique values for filters
  const uniqueSites = [...new Set(employeeAttendance.map(emp => emp.site))];
  const uniqueDepartments = [...new Set(employeeAttendance.map(emp => emp.department))];
  const uniqueMachinerySites = [...new Set(machineryReports.map(machine => machine.site))];
  const uniqueTypes = [...new Set(machineryReports.map(machine => machine.type))];

  // Calculate totals
  const totalOutstanding = debtorReports.reduce((sum, debtor) => sum + debtor.pendingAmount, 0);
  const activeMachineryCount = machineryReports.filter(m => m.status === 'active').length;
  const maintenanceMachineryCount = machineryReports.filter(m => m.status === 'maintenance').length;
  const idleMachineryCount = machineryReports.filter(m => m.status === 'idle').length;

  // Department icons mapping
  const departmentIcons = {
    'Housekeeping': Home,
    'Security': Shield,
    'Parking': Car,
    'Waste Management': Trash2,
    'STP Tank Cleaning': Droplets,
    'Consumables': ShoppingCart
  };

  // Activity icons mapping
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case 'system':
        return <BarChart3 className="h-4 w-4 text-green-500" />;
      case 'user':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'approval':
        return <CheckCircle2 className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Admin Dashboard" 
        subtitle="System administration and management"
        onMenuClick={onMenuClick}
      />

      <div className="p-6 space-y-6">
        {/* Quick Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border p-4"
        >
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleDownloadReport}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            
            <Button 
              onClick={handleSyncAttendance}
              className="flex items-center gap-2"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4" />
              Sync Data
            </Button>
            
            <Button 
              onClick={handleSendReminders}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Send className="h-4 w-4" />
              Send Reminders
            </Button>
            
            <Button 
              onClick={handleApproveAll}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve All
            </Button>

            <Button 
              onClick={handleGeneratePayroll}
              className="flex items-center gap-2"
              variant="outline"
            >
              <FileText className="h-4 w-4" />
              Generate Payroll
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Managers"
            value={stats.totalManagers}
            icon={Briefcase}
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />
          <StatCard
            title="Total Supervisors"
            value={stats.totalSupervisors}
            icon={Shield}
            trend={{ value: 8, isPositive: true }}
            delay={0.1}
          />
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            trend={{ value: 15, isPositive: true }}
            delay={0.2}
          />
          <StatCard
            title="Total Sites"
            value={stats.totalSites}
            icon={Building2}
            trend={{ value: 5, isPositive: true }}
            delay={0.3}
          />
        </div>

        {/* Department Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                All facility management departments with current workforce distribution
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {dailySummary.departmentWiseSummary.map((dept) => {
                  const IconComponent = departmentIcons[dept.department as keyof typeof departmentIcons] || Users;
                  return (
                    <Card key={dept.department} className="text-center">
                      <CardContent className="p-4">
                        <IconComponent className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm font-medium">{dept.department}</p>
                        <p className="text-2xl font-bold">{dept.present}</p>
                        <p className="text-xs text-muted-foreground">/{dept.total}</p>
                        <Badge variant={
                          parseFloat(dept.rate) > 90 ? 'default' :
                          parseFloat(dept.rate) > 80 ? 'secondary' : 'destructive'
                        } className="mt-1">
                          {dept.rate}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {activity.user}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activity Summary */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Today's Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Present: </span>
                      <span className="font-medium">{dailySummary.present}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Absent: </span>
                      <span className="font-medium">{dailySummary.absent}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Late: </span>
                      <span className="font-medium">{dailySummary.lateArrivals}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Half Days: </span>
                      <span className="font-medium">{dailySummary.halfDays}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Attendance Overview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Attendance Overview
                </CardTitle>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{dailySummary.present}</div>
                      <div className="text-sm text-muted-foreground">Present</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">{dailySummary.absent}</div>
                      <div className="text-sm text-muted-foreground">Absent</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{dailySummary.lateArrivals}</div>
                      <div className="text-sm text-muted-foreground">Late Arrivals</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{dailySummary.overallAttendance}</div>
                      <div className="text-sm text-muted-foreground">Overall Rate</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Site-wise Progress */}
                <div className="space-y-4">
                  <h4 className="font-medium">Site-wise Attendance</h4>
                  {dailySummary.siteWiseSummary.map((site, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{site.site}</span>
                        <span className={parseFloat(site.rate) > 85 ? "text-green-600" : "text-orange-600"}>
                          {site.present}/{site.total} ({site.rate})
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            parseFloat(site.rate) > 90 ? "bg-green-600" :
                            parseFloat(site.rate) > 85 ? "bg-blue-600" :
                            parseFloat(site.rate) > 80 ? "bg-orange-500" : "bg-red-600"
                          }`}
                          style={{ width: site.rate }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Attendance Reports Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Attendance Management System</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Comprehensive attendance tracking and reporting across all facility management departments
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-32"
                  />
                  <span>to</span>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-32"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="site-wise" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="site-wise" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Site-wise
                  </TabsTrigger>
                  <TabsTrigger value="employee-wise" className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4" />
                    Employee-wise
                  </TabsTrigger>
                  <TabsTrigger value="daily-summary" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Daily Summary
                  </TabsTrigger>
                </TabsList>

                {/* Site-wise Attendance Tab */}
                <TabsContent value="site-wise" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by site name..."
                          value={attendanceSearch}
                          onChange={(e) => setAttendanceSearch(e.target.value)}
                          className="w-64"
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleExportAttendance('Site-wise')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Site Name</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total Employees</TableHead>
                          <TableHead>Present</TableHead>
                          <TableHead>Absent</TableHead>
                          <TableHead>Late Arrivals</TableHead>
                          <TableHead>Early Departures</TableHead>
                          <TableHead>Attendance Rate</TableHead>
                          <TableHead>Shortage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedAttendance.map((site) => (
                          <TableRow key={site.id}>
                            <TableCell className="font-medium">{site.site}</TableCell>
                            <TableCell>{site.date}</TableCell>
                            <TableCell>{site.totalEmployees}</TableCell>
                            <TableCell className="text-green-600">{site.present}</TableCell>
                            <TableCell className="text-red-600">{site.absent}</TableCell>
                            <TableCell className="text-orange-600">{site.lateArrivals}</TableCell>
                            <TableCell className="text-orange-600">{site.earlyDepartures}</TableCell>
                            <TableCell>
                              <Badge variant={
                                parseFloat(site.attendanceRate) > 90 ? 'default' :
                                parseFloat(site.attendanceRate) > 80 ? 'secondary' : 'destructive'
                              }>
                                {site.attendanceRate}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-red-600 font-medium">{site.shortage}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Pagination
                    currentPage={attendancePage}
                    totalPages={attendanceTotalPages}
                    onPageChange={setAttendancePage}
                    totalItems={filteredAttendance.length}
                    itemsPerPage={itemsPerPage}
                  />
                </TabsContent>

                {/* Employee-wise Attendance Tab */}
                <TabsContent value="employee-wise" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by employee name..."
                          value={employeeSearch}
                          onChange={(e) => setEmployeeSearch(e.target.value)}
                          className="w-64"
                        />
                      </div>
                      <Select value={siteFilter} onValueChange={setSiteFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="All Sites" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sites</SelectItem>
                          {uniqueSites.map(site => (
                            <SelectItem key={site} value={site}>{site}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {uniqueDepartments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="half-day">Half Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleExportAttendance('Employee-wise')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Site</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Late By</TableHead>
                          <TableHead>Early Departure</TableHead>
                          <TableHead>Total Hours</TableHead>
                          <TableHead>Overtime</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedEmployeeAttendance.map((employee) => {
                          const IconComponent = departmentIcons[employee.department as keyof typeof departmentIcons] || Users;
                          return (
                            <TableRow key={employee.id}>
                              <TableCell className="font-medium">{employee.employeeId}</TableCell>
                              <TableCell className="font-medium">{employee.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                                  {employee.department}
                                </div>
                              </TableCell>
                              <TableCell>{employee.site}</TableCell>
                              <TableCell>{employee.date}</TableCell>
                              <TableCell>
                                <div className={`flex items-center gap-1 ${
                                  employee.checkIn !== '-' && employee.checkIn > '09:00 AM' ? 'text-orange-600' : 'text-green-600'
                                }`}>
                                  <Clock className="h-3 w-3" />
                                  {employee.checkIn}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className={`flex items-center gap-1 ${
                                  employee.checkOut !== '-' && employee.checkOut < '06:00 PM' ? 'text-orange-600' : 'text-green-600'
                                }`}>
                                  <Clock className="h-3 w-3" />
                                  {employee.checkOut}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  employee.status === 'present' ? 'default' :
                                  employee.status === 'absent' ? 'destructive' : 'secondary'
                                }>
                                  {employee.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className={employee.lateBy !== '-' && employee.lateBy !== '0 mins' ? 'text-orange-600' : 'text-green-600'}>
                                  {employee.lateBy}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className={employee.earlyDeparture !== '-' && employee.earlyDeparture !== '0 mins' ? 'text-orange-600' : 'text-green-600'}>
                                  {employee.earlyDeparture}
                                </span>
                              </TableCell>
                              <TableCell>{employee.totalHours}</TableCell>
                              <TableCell>
                                <span className={employee.overtime !== '0 mins' ? 'text-blue-600' : 'text-gray-600'}>
                                  {employee.overtime}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <Pagination
                    currentPage={employeePage}
                    totalPages={employeeTotalPages}
                    onPageChange={setEmployeePage}
                    totalItems={filteredEmployeeAttendance.length}
                    itemsPerPage={itemsPerPage}
                  />
                </TabsContent>

                {/* Daily Summary Tab */}
                <TabsContent value="daily-summary" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Daily Attendance Summary - {dailySummary.date}</h3>
                      <p className="text-sm text-muted-foreground">Overall organization attendance overview</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleExportAttendance('Daily Summary')}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Site-wise Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Site-wise Attendance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {dailySummary.siteWiseSummary.map((site, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{site.site}</span>
                                <span className={parseFloat(site.rate) > 85 ? "text-green-600" : "text-orange-600"}>
                                  {site.present}/{site.total} ({site.rate})
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    parseFloat(site.rate) > 90 ? "bg-green-600" :
                                    parseFloat(site.rate) > 85 ? "bg-blue-600" :
                                    parseFloat(site.rate) > 80 ? "bg-orange-500" : "bg-red-600"
                                  }`}
                                  style={{ width: site.rate }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Department-wise Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Department-wise Attendance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {dailySummary.departmentWiseSummary.map((dept, index) => {
                            const IconComponent = departmentIcons[dept.department as keyof typeof departmentIcons] || Users;
                            return (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{dept.department}</span>
                                  </div>
                                  <span className={parseFloat(dept.rate) > 85 ? "text-green-600" : "text-orange-600"}>
                                    {dept.present}/{dept.total} ({dept.rate})
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      parseFloat(dept.rate) > 90 ? "bg-green-600" :
                                      parseFloat(dept.rate) > 85 ? "bg-blue-600" :
                                      parseFloat(dept.rate) > 80 ? "bg-orange-500" : "bg-red-600"
                                    }`}
                                    style={{ width: dept.rate }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Site Machinery Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Site Machinery Reports</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  All facility management machinery with current status and maintenance details
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportMachinery}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search machinery by name..."
                    value={machinerySearch}
                    onChange={(e) => setMachinerySearch(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={machineryStatusFilter} onValueChange={setMachineryStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                    <SelectItem value="idle">Idle</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={machinerySiteFilter} onValueChange={setMachinerySiteFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Sites" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    {uniqueMachinerySites.map(site => (
                      <SelectItem key={site} value={site}>{site}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Machinery Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Active Machinery</p>
                        <p className="text-2xl font-bold text-green-600">{activeMachineryCount}</p>
                        <p className="text-xs text-green-600">Ready for operation</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-800">Under Maintenance</p>
                        <p className="text-2xl font-bold text-orange-600">{maintenanceMachineryCount}</p>
                        <p className="text-xs text-orange-600">Being serviced</p>
                      </div>
                      <Settings className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">Idle Machinery</p>
                        <p className="text-2xl font-bold text-blue-600">{idleMachineryCount}</p>
                        <p className="text-xs text-blue-600">Awaiting assignment</p>
                      </div>
                      <Package className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Machinery Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Machinery ID</TableHead>
                      <TableHead>Name & Model</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Last Maintenance</TableHead>
                      <TableHead>Next Maintenance</TableHead>
                      <TableHead>Hours Operated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMachinery.map((machine) => (
                      <TableRow key={machine.id}>
                        <TableCell className="font-medium">{machine.machineryId}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{machine.name}</div>
                            <div className="text-sm text-muted-foreground">{machine.model}</div>
                          </div>
                        </TableCell>
                        <TableCell>{machine.type}</TableCell>
                        <TableCell>{machine.site}</TableCell>
                        <TableCell>
                          <Badge variant={
                            machine.status === 'active' ? 'default' :
                            machine.status === 'maintenance' ? 'secondary' : 'outline'
                          }>
                            {machine.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{machine.operator}</div>
                            <div className="text-sm text-muted-foreground">{machine.operatorPhone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{machine.lastMaintenance}</TableCell>
                        <TableCell>
                          <div className={`font-medium ${
                            new Date(machine.nextMaintenance) < new Date() ? 'text-red-600' :
                            'text-green-600'
                          }`}>
                            {machine.nextMaintenance}
                          </div>
                        </TableCell>
                        <TableCell>{machine.hoursOperated.toLocaleString()} hrs</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Pagination
                currentPage={machineryPage}
                totalPages={machineryTotalPages}
                onPageChange={setMachineryPage}
                totalItems={filteredMachinery.length}
                itemsPerPage={itemsPerPage}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Outstanding Debtors Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Outstanding Debtors Reports</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Parties/customers with outstanding balances and payment details
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportDebtors}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by party name..."
                    value={debtorSearch}
                    onChange={(e) => setDebtorSearch(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={debtorStatusFilter} onValueChange={setDebtorStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Total Outstanding</p>
                        <p className="text-2xl font-bold text-red-600">
                          ₹{totalOutstanding.toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Total Parties</p>
                        <p className="text-2xl font-bold">{debtorReports.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Pending</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {debtorReports.filter(d => d.status === 'pending').length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Overdue</p>
                        <p className="text-2xl font-bold text-red-600">
                          {debtorReports.filter(d => d.status === 'overdue').length}
                        </p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Debtors Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Party ID</TableHead>
                      <TableHead>Party Name</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Pending Amount</TableHead>
                      <TableHead>Last Payment</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDebtors.map((debtor) => (
                      <TableRow key={debtor.id}>
                        <TableCell className="font-medium">{debtor.partyId}</TableCell>
                        <TableCell className="font-medium">{debtor.partyName}</TableCell>
                        <TableCell>{debtor.contactPerson}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{debtor.phone}</div>
                            <div className="text-muted-foreground">{debtor.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>₹{debtor.totalAmount.toLocaleString()}</TableCell>
                        <TableCell className="font-medium text-red-600">
                          ₹{debtor.pendingAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{debtor.lastPaymentDate}</div>
                            <div className="text-muted-foreground">₹{debtor.lastPaymentAmount.toLocaleString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${
                            debtor.status === 'overdue' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {debtor.dueDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={debtor.status === 'overdue' ? 'destructive' : 'secondary'}>
                            {debtor.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Pagination
                currentPage={debtorPage}
                totalPages={debtorTotalPages}
                onPageChange={setDebtorPage}
                totalItems={filteredDebtors.length}
                itemsPerPage={itemsPerPage}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;