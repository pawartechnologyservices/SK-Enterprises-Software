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
  ShoppingCart
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
import { useState, useMemo } from "react";
import { toast } from "sonner";

// Recharts for charts
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Indian names dummy data
const indianNames = {
  male: ["Rajesh Kumar", "Amit Sharma", "Sanjay Patel", "Vikram Singh", "Arun Reddy", "Mohan Das", "Suresh Iyer", "Prakash Joshi", "Deepak Mehta", "Kiran Nair"],
  female: ["Priya Sharma", "Anjali Singh", "Sunita Reddy", "Kavita Patel", "Meera Iyer", "Laxmi Kumar", "Sonia Das", "Neha Joshi", "Pooja Mehta", "Ritu Nair"],
  sites: [
    "GLOBAL SQUARE, YERWADA (HOUSEKEEPING)",
    "GLOBAL SQUARE, YERWADA (SECURITY)", 
    "MANGALWAR PETH",
    "GANGA TRUENO (HOUSEKEEPING)",
    "K.P. BUNGLOW (HOUSEKEEPING)",
    "ALYSSUM DEVELOPERS PVT. LTD.",
    "ARYA ASSOCIATES",
    "ASTITVA ASSET MANAGEMENT LLP",
    "A.T.C COMMERCIAL PREMISES CO. OPERATIVE SOCIETY LTD",
    "BAHIRAT ESTATE LLP"
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

// Extended dummy data with detailed reports
const extendedDummyData = {
  dashboardStats: {
    superadmin: {
      totalManagers: 8,
      totalSupervisors: 12,
      totalEmployees: 85,
      totalSites: 35,
      activeTasks: 23,
      pendingLeaves: 7,
      presentToday: 72,
      absentToday: 13,
      activeMachinery: 18,
      totalDebtors: 6,
      todayAttendance: "84.7%",
      machineryUnderMaintenance: 4,
      totalOutstanding: 1850000
    }
  },

  // Attendance Data
  attendanceReports: [
    {
      id: '1',
      site: 'GLOBAL SQUARE, YERWADA (HOUSEKEEPING)',
      date: '2024-01-15',
      totalEmployees: 15,
      present: 13,
      absent: 2,
      lateArrivals: 1,
      earlyDepartures: 0,
      attendanceRate: '86.7%',
      shortage: 2,
      services: 'Housekeeping Services'
    },
    {
      id: '2',
      site: 'GLOBAL SQUARE, YERWADA (SECURITY)',
      date: '2024-01-15',
      totalEmployees: 8,
      present: 8,
      absent: 0,
      lateArrivals: 0,
      earlyDepartures: 0,
      attendanceRate: '100%',
      shortage: 0,
      services: 'Security Services'
    },
    {
      id: '3',
      site: 'MANGALWAR PETH',
      date: '2024-01-15',
      totalEmployees: 12,
      present: 10,
      absent: 2,
      lateArrivals: 1,
      earlyDepartures: 1,
      attendanceRate: '83.3%',
      shortage: 2,
      services: 'Housekeeping & Maintenance'
    },
    {
      id: '4',
      site: 'GANGA TRUENO (HOUSEKEEPING)',
      date: '2024-01-15',
      totalEmployees: 10,
      present: 9,
      absent: 1,
      lateArrivals: 0,
      earlyDepartures: 0,
      attendanceRate: '90.0%',
      shortage: 1,
      services: 'Housekeeping Services'
    },
    {
      id: '5',
      site: 'K.P. BUNGLOW (HOUSEKEEPING)',
      date: '2024-01-15',
      totalEmployees: 6,
      present: 5,
      absent: 1,
      lateArrivals: 0,
      earlyDepartures: 0,
      attendanceRate: '83.3%',
      shortage: 1,
      services: 'Housekeeping Services'
    },
    {
      id: '6',
      site: 'ALYSSUM DEVELOPERS PVT. LTD.',
      date: '2024-01-15',
      totalEmployees: 25,
      present: 21,
      absent: 4,
      lateArrivals: 2,
      earlyDepartures: 1,
      attendanceRate: '84.0%',
      shortage: 4,
      services: 'Complete Facility Management'
    },
    {
      id: '7',
      site: 'ARYA ASSOCIATES',
      date: '2024-01-15',
      totalEmployees: 20,
      present: 18,
      absent: 2,
      lateArrivals: 1,
      earlyDepartures: 0,
      attendanceRate: '90.0%',
      shortage: 2,
      services: 'Security & Housekeeping'
    },
    {
      id: '8',
      site: 'ASTITVA ASSET MANAGEMENT LLP',
      date: '2024-01-15',
      totalEmployees: 22,
      present: 19,
      absent: 3,
      lateArrivals: 2,
      earlyDepartures: 1,
      attendanceRate: '86.4%',
      shortage: 3,
      services: 'Complete Facility Management'
    }
  ],

  // Employee-wise attendance data
  employeeAttendance: [
    {
      id: '1',
      employeeId: 'EMP001',
      name: 'Rajesh Kumar',
      department: 'Housekeeping',
      site: 'GLOBAL SQUARE, YERWADA (HOUSEKEEPING)',
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
      site: 'GLOBAL SQUARE, YERWADA (SECURITY)',
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
      department: 'Housekeeping',
      site: 'MANGALWAR PETH',
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
      department: 'Housekeeping',
      site: 'GANGA TRUENO (HOUSEKEEPING)',
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
      department: 'Housekeeping',
      site: 'K.P. BUNGLOW (HOUSEKEEPING)',
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
      department: 'Housekeeping',
      site: 'GLOBAL SQUARE, YERWADA (HOUSEKEEPING)',
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
      site: 'MANGALWAR PETH',
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
      site: 'GLOBAL SQUARE, YERWADA (SECURITY)',
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
      department: 'Housekeeping',
      site: 'GANGA TRUENO (HOUSEKEEPING)',
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
      department: 'Housekeeping',
      site: 'K.P. BUNGLOW (HOUSEKEEPING)',
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
    totalEmployees: 85,
    present: 72,
    absent: 13,
    lateArrivals: 6,
    halfDays: 2,
    earlyDepartures: 3,
    overallAttendance: '84.7%',
    siteWiseSummary: [
      { site: 'GLOBAL SQUARE, YERWADA (HOUSEKEEPING)', present: 13, total: 15, rate: '86.7%' },
      { site: 'GLOBAL SQUARE, YERWADA (SECURITY)', present: 8, total: 8, rate: '100%' },
      { site: 'MANGALWAR PETH', present: 10, total: 12, rate: '83.3%' },
      { site: 'GANGA TRUENO (HOUSEKEEPING)', present: 9, total: 10, rate: '90.0%' },
      { site: 'K.P. BUNGLOW (HOUSEKEEPING)', present: 5, total: 6, rate: '83.3%' },
      { site: 'ALYSSUM DEVELOPERS PVT. LTD.', present: 21, total: 25, rate: '84.0%' },
      { site: 'ARYA ASSOCIATES', present: 18, total: 20, rate: '90.0%' },
      { site: 'ASTITVA ASSET MANAGEMENT LLP', present: 19, total: 22, rate: '86.4%' }
    ],
    departmentWiseSummary: [
      { department: 'Housekeeping', present: 26, total: 31, rate: '83.9%' },
      { department: 'Security', present: 16, total: 16, rate: '100%' },
      { department: 'Parking', present: 9, total: 9, rate: '100%' },
      { department: 'Waste Management', present: 12, total: 14, rate: '85.7%' },
      { department: 'STP Tank Cleaning', present: 7, total: 11, rate: '63.6%' },
      { department: 'Consumables', present: 4, total: 4, rate: '100%' }
    ]
  },

  // Site Machinery Reports Data with new departments
  machineryReports: [
    // Housekeeping Machinery
    {
      id: '1',
      machineryId: 'MACH001',
      name: 'Industrial Floor Scrubber',
      type: 'Floor Scrubber',
      model: 'Tennant T7',
      site: 'GLOBAL SQUARE, YERWADA (HOUSEKEEPING)',
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
      site: 'MANGALWAR PETH',
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

    // Security Machinery
    {
      id: '3',
      machineryId: 'MACH003',
      name: 'Security Patrol Vehicle',
      type: 'Security Vehicle',
      model: 'Mahindra Bolero',
      site: 'GLOBAL SQUARE, YERWADA (SECURITY)',
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

    // Parking Machinery
    {
      id: '4',
      machineryId: 'MACH004',
      name: 'Automatic Parking Barrier',
      type: 'Parking Barrier',
      model: 'FAAC XT4',
      site: 'ALYSSUM DEVELOPERS PVT. LTD.',
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

    // Waste Management Machinery
    {
      id: '5',
      machineryId: 'MACH005',
      name: 'Waste Compactor Truck',
      type: 'Waste Compactor',
      model: 'Tata Ace HT',
      site: 'GANGA TRUENO (HOUSEKEEPING)',
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
    },

    // STP Tank Cleaning Machinery
    {
      id: '6',
      machineryId: 'MACH006',
      name: 'Sewage Treatment Plant Pump',
      type: 'Sewage Pump',
      model: 'KSB Etaline',
      site: 'ARYA ASSOCIATES',
      status: 'active',
      lastMaintenance: '2024-01-07',
      nextMaintenance: '2024-02-07',
      operator: 'Anjali Singh',
      operatorPhone: '9876543215',
      purchaseDate: '2023-10-12',
      warrantyUntil: '2025-10-12',
      hoursOperated: 1560,
      fuelConsumption: 'Electric',
      remarks: 'STP operating at optimal efficiency. Regular water quality checks.',
      maintenanceHistory: [
        { date: '2024-01-07', type: 'Routine Service', cost: 18500, technician: 'Technical Team B' }
      ]
    },
    {
      id: '7',
      machineryId: 'MACH007',
      name: 'Water Treatment Plant',
      type: 'Water Treatment Plant',
      model: 'ION Exchange System',
      site: 'ASTITVA ASSET MANAGEMENT LLP',
      status: 'active',
      lastMaintenance: '2024-01-11',
      nextMaintenance: '2024-02-11',
      operator: 'Kiran Nair',
      operatorPhone: '9876543216',
      purchaseDate: '2023-11-20',
      warrantyUntil: '2025-11-20',
      hoursOperated: 890,
      fuelConsumption: 'Electric',
      remarks: 'Water purification system working efficiently. TDS levels optimal.',
      maintenanceHistory: [
        { date: '2024-01-11', type: 'Filter Replacement', cost: 22000, technician: 'Technical Team C' }
      ]
    },

    // Consumables Machinery
    {
      id: '8',
      machineryId: 'MACH008',
      name: 'Industrial Generator',
      type: 'Generator',
      model: 'Cummins 500 kVA',
      site: 'K.P. BUNGLOW (HOUSEKEEPING)',
      status: 'idle',
      lastMaintenance: '2024-01-06',
      nextMaintenance: '2024-02-06',
      operator: 'Vikram Singh',
      operatorPhone: '9876543217',
      purchaseDate: '2023-12-01',
      warrantyUntil: '2025-12-01',
      hoursOperated: 120,
      fuelConsumption: '25L/hr',
      remarks: 'Backup generator. Ready for use during power outages.',
      maintenanceHistory: [
        { date: '2024-01-06', type: 'Routine Check', cost: 15000, technician: 'Technical Team A' }
      ]
    },
    {
      id: '9',
      machineryId: 'MACH009',
      name: 'Air Compressor',
      type: 'Air Compressor',
      model: 'Atlas Copco GA7',
      site: 'GLOBAL SQUARE, YERWADA (HOUSEKEEPING)',
      status: 'active',
      lastMaintenance: '2024-01-14',
      nextMaintenance: '2024-02-14',
      operator: 'Mohan Das',
      operatorPhone: '9876543218',
      purchaseDate: '2023-08-25',
      warrantyUntil: '2025-08-25',
      hoursOperated: 750,
      fuelConsumption: 'Electric',
      remarks: 'Providing compressed air for various operations. Running smoothly.',
      maintenanceHistory: [
        { date: '2024-01-14', type: 'Oil Change', cost: 8000, technician: 'Technical Team B' }
      ]
    },
    {
      id: '10',
      machineryId: 'MACH010',
      name: 'High Pressure Washer',
      type: 'Pressure Washer',
      model: 'Karcher HD 7/15',
      site: 'MANGALWAR PETH',
      status: 'maintenance',
      lastMaintenance: '2024-01-13',
      nextMaintenance: '2024-01-23',
      operator: 'Suresh Iyer',
      operatorPhone: '9876543219',
      purchaseDate: '2023-09-15',
      warrantyUntil: '2025-09-15',
      hoursOperated: 280,
      fuelConsumption: 'Electric',
      remarks: 'Nozzle replacement in progress. Will be operational tomorrow.',
      maintenanceHistory: [
        { date: '2024-01-13', type: 'Nozzle Replacement', cost: 4500, technician: 'Technical Team C' }
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
      totalAmount: 850000,
      pendingAmount: 250000,
      lastPaymentDate: '2024-01-10',
      lastPaymentAmount: 150000,
      dueDate: '2024-01-30',
      overdueDays: 0,
      status: 'pending',
      creditLimit: 1000000,
      paymentHistory: [
        { date: '2024-01-10', amount: 150000, mode: 'Bank Transfer', reference: 'REF001' },
        { date: '2023-12-15', amount: 200000, mode: 'Cheque', reference: 'REF002' },
        { date: '2023-11-20', amount: 250000, mode: 'Bank Transfer', reference: 'REF003' }
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
      totalAmount: 620000,
      pendingAmount: 180000,
      lastPaymentDate: '2024-01-05',
      lastPaymentAmount: 120000,
      dueDate: '2024-01-25',
      overdueDays: 0,
      status: 'pending',
      creditLimit: 800000,
      paymentHistory: [
        { date: '2024-01-05', amount: 120000, mode: 'UPI', reference: 'REF004' },
        { date: '2023-12-10', amount: 160000, mode: 'Bank Transfer', reference: 'REF005' },
        { date: '2023-11-25', amount: 160000, mode: 'Cheque', reference: 'REF006' }
      ]
    },
    {
      id: '3',
      partyId: 'PARTY003',
      partyName: 'Modern Constructions',
      contactPerson: 'Anil Kapoor',
      phone: '9876543212',
      email: 'anil@modernconst.com',
      address: '789 Tech Park, Bangalore',
      totalAmount: 720000,
      pendingAmount: 320000,
      lastPaymentDate: '2023-12-28',
      lastPaymentAmount: 130000,
      dueDate: '2024-01-15',
      overdueDays: 0,
      status: 'overdue',
      creditLimit: 1000000,
      paymentHistory: [
        { date: '2023-12-28', amount: 130000, mode: 'Bank Transfer', reference: 'REF007' },
        { date: '2023-11-30', amount: 135000, mode: 'Cheque', reference: 'REF008' },
        { date: '2023-10-31', amount: 135000, mode: 'Bank Transfer', reference: 'REF009' }
      ]
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

// Chart color constants
const CHART_COLORS = {
  present: '#10b981',
  absent: '#ef4444',
  late: '#f59e0b',
  sites: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#84cc16', '#f97316']
};

const SuperAdminDashboard = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const [stats, setStats] = useState(extendedDummyData.dashboardStats.superadmin);
  const [attendanceReports, setAttendanceReports] = useState(extendedDummyData.attendanceReports);
  const [employeeAttendance, setEmployeeAttendance] = useState(extendedDummyData.employeeAttendance);
  const [dailySummary, setDailySummary] = useState(extendedDummyData.dailySummary);
  const [machineryReports, setMachineryReports] = useState(extendedDummyData.machineryReports);
  const [debtorReports, setDebtorReports] = useState(extendedDummyData.debtorReports);
  
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

  // Prepare site-wise chart data for all sites with responsive labels
  const prepareSiteWiseChartData = useMemo(() => {
    return filteredAttendance.map((site, index) => {
      // Create shortened labels for different screen sizes
      const fullSiteName = site.site;
      let shortLabel = fullSiteName;
      
      if (fullSiteName.includes('GLOBAL SQUARE')) {
        shortLabel = fullSiteName.includes('HOUSEKEEPING') ? 'GLOBAL SQ (HK)' : 'GLOBAL SQ (SEC)';
      } else if (fullSiteName.includes('MANGALWAR')) {
        shortLabel = 'MANGALWAR';
      } else if (fullSiteName.includes('GANGA TRUENO')) {
        shortLabel = 'GANGA TRUENO';
      } else if (fullSiteName.includes('K.P. BUNGLOW')) {
        shortLabel = 'K.P. BUNGLOW';
      } else if (fullSiteName.includes('ALYSSUM')) {
        shortLabel = 'ALYSSUM';
      } else if (fullSiteName.includes('ARYA')) {
        shortLabel = 'ARYA';
      } else if (fullSiteName.includes('ASTITVA')) {
        shortLabel = 'ASTITVA';
      } else {
        // Generic shortening for other sites
        shortLabel = fullSiteName.split(',')[0].substring(0, 12);
      }
      
      return {
        name: shortLabel,
        fullName: fullSiteName,
        present: site.present,
        absent: site.absent,
        total: site.totalEmployees,
        attendanceRate: parseFloat(site.attendanceRate),
        lateArrivals: site.lateArrivals,
        services: site.services,
        fill: CHART_COLORS.sites[index % CHART_COLORS.sites.length]
      };
    });
  }, [filteredAttendance]);

  // Prepare pie chart data for site distribution
  const prepareSitePieData = useMemo(() => {
    return filteredAttendance.map((site, index) => {
      // Create shortened labels for pie chart
      const fullSiteName = site.site;
      let shortLabel = fullSiteName;
      
      if (fullSiteName.includes('GLOBAL SQUARE')) {
        shortLabel = fullSiteName.includes('HOUSEKEEPING') ? 'G.SQ (HK)' : 'G.SQ (SEC)';
      } else if (fullSiteName.includes('MANGALWAR')) {
        shortLabel = 'MANGALWAR';
      } else if (fullSiteName.includes('GANGA TRUENO')) {
        shortLabel = 'G.TRUENO';
      } else if (fullSiteName.includes('K.P. BUNGLOW')) {
        shortLabel = 'K.P.BUNG';
      } else if (fullSiteName.includes('ALYSSUM')) {
        shortLabel = 'ALYSSUM';
      } else if (fullSiteName.includes('ARYA')) {
        shortLabel = 'ARYA';
      } else if (fullSiteName.includes('ASTITVA')) {
        shortLabel = 'ASTITVA';
      } else {
        // Generic shortening for other sites
        shortLabel = fullSiteName.split(',')[0].substring(0, 8);
      }
      
      return {
        name: shortLabel,
        fullName: fullSiteName,
        value: site.present,
        total: site.totalEmployees,
        attendanceRate: site.attendanceRate,
        services: site.services,
        fill: CHART_COLORS.sites[index % CHART_COLORS.sites.length]
      };
    });
  }, [filteredAttendance]);

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-sm mb-2">{data.fullName}</p>
          <p className="text-xs text-muted-foreground mb-2">{data.services}</p>
          <div className="space-y-1 text-sm">
            <p className="flex justify-between">
              <span className="text-green-600">Present:</span>
              <span className="font-medium">{data.present}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-red-600">Absent:</span>
              <span className="font-medium">{data.absent}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{data.total}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-blue-600">Attendance Rate:</span>
              <span className="font-medium">{data.attendanceRate}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-sm mb-2">{data.fullName}</p>
          <p className="text-xs text-muted-foreground mb-2">{data.services}</p>
          <div className="space-y-1 text-sm">
            <p className="flex justify-between">
              <span className="text-green-600">Present Employees:</span>
              <span className="font-medium">{data.value}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Total Employees:</span>
              <span className="font-medium">{data.total}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-blue-600">Attendance Rate:</span>
              <span className="font-medium">{data.attendanceRate}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Customized axis tick for bar chart to handle responsive labels
  const CustomizedAxisTick = (props: any) => {
    const { x, y, payload } = props;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="end"
          fill="#6b7280"
          fontSize={12}
          transform="rotate(-35)"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Super Admin Dashboard" 
        subtitle="Complete system overview and management"
        onMenuClick={onMenuClick}
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            trend={{ value: 8, isPositive: true }}
            delay={0}
          />
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={UserCheck}
            trend={{ value: 5, isPositive: true }}
            delay={0.1}
          />
          <StatCard
            title="Active Machinery"
            value={activeMachineryCount}
            icon={Wrench}
            trend={{ value: 3, isPositive: true }}
            delay={0.2}
          />
          <StatCard
            title="Outstanding Amount"
            value={`₹${(totalOutstanding / 100000).toFixed(1)}L`}
            icon={FileText}
            trend={{ value: 8, isPositive: false }}
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
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg">Department Overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                All facility management departments with current workforce distribution
              </p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {dailySummary.departmentWiseSummary.map((dept) => {
                  const IconComponent = departmentIcons[dept.department as keyof typeof departmentIcons] || Users;
                  return (
                    <Card key={dept.department} className="text-center">
                      <CardContent className="p-3 sm:p-4">
                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-xs sm:text-sm font-medium">{dept.department}</p>
                        <p className="text-xl sm:text-2xl font-bold">{dept.present}</p>
                        <p className="text-xs text-muted-foreground">/{dept.total}</p>
                        <Badge variant={
                          parseFloat(dept.rate) > 90 ? 'default' :
                          parseFloat(dept.rate) > 80 ? 'secondary' : 'destructive'
                        } className="mt-1 text-xs">
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

        {/* Attendance Reports Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg">Attendance Management System</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Comprehensive attendance tracking and reporting across all facility management departments
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 flex-1 sm:flex-none">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-28 sm:w-32"
                  />
                  <span className="text-sm">to</span>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-28 sm:w-32"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <Tabs defaultValue="site-wise" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="site-wise" className="flex items-center gap-2 text-xs sm:text-sm">
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    Site-wise
                  </TabsTrigger>
                  <TabsTrigger value="employee-wise" className="flex items-center gap-2 text-xs sm:text-sm">
                    <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    Employee-wise
                  </TabsTrigger>
                  <TabsTrigger value="daily-summary" className="flex items-center gap-2 text-xs sm:text-sm">
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                    Daily Summary
                  </TabsTrigger>
                </TabsList>

                {/* Site-wise Attendance Tab */}
                <TabsContent value="site-wise" className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <div className="flex items-center gap-2 flex-1">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by site name..."
                          value={attendanceSearch}
                          onChange={(e) => setAttendanceSearch(e.target.value)}
                          className="w-full sm:w-64"
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleExportAttendance('Site-wise')} className="w-full sm:w-auto">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  {/* Site-wise Charts Section */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
                    {/* Bar Chart - Site-wise Attendance */}
                    <Card className="xl:col-span-1">
                      <CardHeader className="pb-4 px-4 sm:px-6">
                        <CardTitle className="text-base sm:text-lg">Site-wise Attendance Overview</CardTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Present vs Absent employees across all sites
                        </p>
                      </CardHeader>
                      <CardContent className="px-2 sm:px-4">
                        <div className="w-full h-64 sm:h-80 lg:h-96">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={prepareSiteWiseChartData}
                              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                              barSize={30}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                              <XAxis 
                                dataKey="name" 
                                tick={<CustomizedAxisTick />}
                                interval={0}
                                height={80}
                              />
                              <YAxis 
                                fontSize={12} 
                                tick={{ fill: '#6b7280' }}
                                width={40}
                              />
                              <Tooltip content={<CustomBarTooltip />} />
                              <Legend 
                                wrapperStyle={{ 
                                  paddingTop: '20px',
                                  fontSize: '12px'
                                }}
                              />
                              <Bar 
                                dataKey="present" 
                                name="Present Employees" 
                                fill={CHART_COLORS.present} 
                                radius={[4, 4, 0, 0]}
                              />
                              <Bar 
                                dataKey="absent" 
                                name="Absent Employees" 
                                fill={CHART_COLORS.absent} 
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pie Chart - Site Distribution */}
                    <Card className="xl:col-span-1">
                      <CardHeader className="pb-4 px-4 sm:px-6">
                        <CardTitle className="text-base sm:text-lg">Workforce Distribution by Site</CardTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Employee distribution across different sites
                        </p>
                      </CardHeader>
                      <CardContent className="px-2 sm:px-4">
                        <div className="w-full h-64 sm:h-80 lg:h-96">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={prepareSitePieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(1)}%`}
                                outerRadius={80}
                                innerRadius={40}
                                fill="#8884d8"
                                dataKey="value"
                                paddingAngle={2}
                              >
                                {prepareSitePieData.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.fill}
                                    stroke="#ffffff"
                                    strokeWidth={2}
                                  />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomPieTooltip />} />
                              <Legend 
                                wrapperStyle={{ 
                                  paddingTop: '10px',
                                  fontSize: '11px'
                                }}
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Attendance Table */}
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[200px]">Site Name</TableHead>
                            <TableHead className="min-w-[120px]">Services</TableHead>
                            <TableHead className="min-w-[100px]">Date</TableHead>
                            <TableHead className="min-w-[80px]">Total</TableHead>
                            <TableHead className="min-w-[80px]">Present</TableHead>
                            <TableHead className="min-w-[80px]">Absent</TableHead>
                            <TableHead className="min-w-[80px]">Late</TableHead>
                            <TableHead className="min-w-[100px]">Early Departures</TableHead>
                            <TableHead className="min-w-[100px]">Attendance Rate</TableHead>
                            <TableHead className="min-w-[80px]">Shortage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedAttendance.map((site) => (
                            <TableRow key={site.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium min-w-[200px]">
                                <div>
                                  <p className="font-semibold text-sm">{site.site.split(',')[0]}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {site.site.split(',').slice(1).join(',')}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="min-w-[120px]">
                                <Badge variant="outline" className="text-xs bg-blue-50">
                                  {site.services}
                                </Badge>
                              </TableCell>
                              <TableCell className="min-w-[100px]">{site.date}</TableCell>
                              <TableCell className="min-w-[80px] font-medium">{site.totalEmployees}</TableCell>
                              <TableCell className="min-w-[80px] text-green-600 font-semibold">{site.present}</TableCell>
                              <TableCell className="min-w-[80px] text-red-600 font-semibold">{site.absent}</TableCell>
                              <TableCell className="min-w-[80px]">
                                <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">
                                  {site.lateArrivals}
                                </Badge>
                              </TableCell>
                              <TableCell className="min-w-[100px]">
                                <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">
                                  {site.earlyDepartures}
                                </Badge>
                              </TableCell>
                              <TableCell className="min-w-[100px]">
                                <Badge variant={
                                  parseFloat(site.attendanceRate) > 90 ? 'default' :
                                  parseFloat(site.attendanceRate) > 80 ? 'secondary' : 'destructive'
                                } className="font-medium text-xs">
                                  {site.attendanceRate}
                                </Badge>
                              </TableCell>
                              <TableCell className="min-w-[80px] text-red-600 font-semibold">{site.shortage}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
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
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 w-full">
                      <div className="flex items-center gap-2 flex-1 w-full sm:w-64">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by employee name..."
                          value={employeeSearch}
                          onChange={(e) => setEmployeeSearch(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Select value={siteFilter} onValueChange={setSiteFilter}>
                          <SelectTrigger className="w-full sm:w-40">
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
                          <SelectTrigger className="w-full sm:w-40">
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
                          <SelectTrigger className="w-full sm:w-40">
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
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleExportAttendance('Employee-wise')} className="w-full sm:w-auto">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[100px]">Employee ID</TableHead>
                            <TableHead className="min-w-[120px]">Name</TableHead>
                            <TableHead className="min-w-[120px]">Department</TableHead>
                            <TableHead className="min-w-[150px]">Site</TableHead>
                            <TableHead className="min-w-[100px]">Date</TableHead>
                            <TableHead className="min-w-[100px]">Check In</TableHead>
                            <TableHead className="min-w-[100px]">Check Out</TableHead>
                            <TableHead className="min-w-[100px]">Status</TableHead>
                            <TableHead className="min-w-[100px]">Late By</TableHead>
                            <TableHead className="min-w-[120px]">Early Departure</TableHead>
                            <TableHead className="min-w-[100px]">Total Hours</TableHead>
                            <TableHead className="min-w-[100px]">Overtime</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedEmployeeAttendance.map((employee) => {
                            const IconComponent = departmentIcons[employee.department as keyof typeof departmentIcons] || Users;
                            return (
                              <TableRow key={employee.id} className="hover:bg-muted/50">
                                <TableCell className="font-medium min-w-[100px]">{employee.employeeId}</TableCell>
                                <TableCell className="font-medium min-w-[120px]">{employee.name}</TableCell>
                                <TableCell className="min-w-[120px]">
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                                    {employee.department}
                                  </div>
                                </TableCell>
                                <TableCell className="min-w-[150px]">
                                  <div>
                                    <p className="text-sm font-medium">{employee.site.split(',')[0]}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {employee.site.split(',').slice(1).join(',')}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell className="min-w-[100px]">{employee.date}</TableCell>
                                <TableCell className="min-w-[100px]">
                                  <div className={`flex items-center gap-1 ${
                                    employee.checkIn !== '-' && employee.checkIn > '09:00 AM' ? 'text-orange-600' : 'text-green-600'
                                  }`}>
                                    <Clock className="h-3 w-3" />
                                    {employee.checkIn}
                                  </div>
                                </TableCell>
                                <TableCell className="min-w-[100px]">
                                  <div className={`flex items-center gap-1 ${
                                    employee.checkOut !== '-' && employee.checkOut < '06:00 PM' ? 'text-orange-600' : 'text-green-600'
                                  }`}>
                                    <Clock className="h-3 w-3" />
                                    {employee.checkOut}
                                  </div>
                                </TableCell>
                                <TableCell className="min-w-[100px]">
                                  <Badge variant={
                                    employee.status === 'present' ? 'default' :
                                    employee.status === 'absent' ? 'destructive' : 'secondary'
                                  } className="text-xs">
                                    {employee.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="min-w-[100px]">
                                  <span className={employee.lateBy !== '-' && employee.lateBy !== '0 mins' ? 'text-orange-600 font-medium text-xs' : 'text-green-600 text-xs'}>
                                    {employee.lateBy}
                                  </span>
                                </TableCell>
                                <TableCell className="min-w-[120px]">
                                  <span className={employee.earlyDeparture !== '-' && employee.earlyDeparture !== '0 mins' ? 'text-orange-600 font-medium text-xs' : 'text-green-600 text-xs'}>
                                    {employee.earlyDeparture}
                                  </span>
                                </TableCell>
                                <TableCell className="min-w-[100px] font-medium text-xs">{employee.totalHours}</TableCell>
                                <TableCell className="min-w-[100px]">
                                  <span className={employee.overtime !== '0 mins' ? 'text-blue-600 font-medium text-xs' : 'text-gray-600 text-xs'}>
                                    {employee.overtime}
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <Pagination
                    currentPage={employeePage}
                    totalPages={employeeTotalPages}
                    onPageChange={setEmployeePage}
                    totalItems={filteredEmployeeAttendance.length}
                    itemsPerPage={itemsPerPage}
                  />

                  {/* Employee Attendance Summary Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Total Employees</p>
                            <p className="text-2xl font-bold">{filteredEmployeeAttendance.length}</p>
                          </div>
                          <UsersIcon className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Present</p>
                            <p className="text-2xl font-bold text-green-600">
                              {filteredEmployeeAttendance.filter(emp => emp.status === 'present').length}
                            </p>
                          </div>
                          <UserCheck className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Absent</p>
                            <p className="text-2xl font-bold text-red-600">
                              {filteredEmployeeAttendance.filter(emp => emp.status === 'absent').length}
                            </p>
                          </div>
                          <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Late Arrivals</p>
                            <p className="text-2xl font-bold text-orange-600">
                              {filteredEmployeeAttendance.filter(emp => emp.lateBy !== '-' && emp.lateBy !== '0 mins').length}
                            </p>
                          </div>
                          <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Daily Summary Tab */}
                <TabsContent value="daily-summary" className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">Daily Attendance Summary - {dailySummary.date}</h3>
                      <p className="text-sm text-muted-foreground">Overall organization attendance overview</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleExportAttendance('Daily Summary')} className="w-full sm:w-auto">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Site-wise Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Site-wise Attendance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
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
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
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
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg">Site Machinery Reports</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  All facility management machinery with current status and detailed remarks
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportMachinery} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1 w-full">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search machinery by name..."
                    value={machinerySearch}
                    onChange={(e) => setMachinerySearch(e.target.value)}
                    className="w-full sm:w-64"
                  />
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <Select value={machineryStatusFilter} onValueChange={setMachineryStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
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
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="All Sites" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sites</SelectItem>
                      {uniqueMachinerySites.map(site => (
                        <SelectItem key={site} value={site}>{site}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={machineryTypeFilter} onValueChange={setMachineryTypeFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {uniqueTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

             {/* Machinery Status Overview */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {/* Active Machinery */}
  <Card className="bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            Active Machinery
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-300">
            {activeMachineryCount}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">
            Ready for operation
          </p>
        </div>
        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-300" />
      </div>
    </CardContent>
  </Card>

  {/* Under Maintenance */}
  <Card className="bg-orange-50 border-orange-200 dark:bg-orange-900 dark:border-orange-700">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
            Under Maintenance
          </p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-300">
            {maintenanceMachineryCount}
          </p>
          <p className="text-xs text-orange-600 dark:text-orange-400">
            Being serviced
          </p>
        </div>
        <Settings className="h-8 w-8 text-orange-600 dark:text-orange-300" />
      </div>
    </CardContent>
  </Card>

  {/* Idle Machinery */}
  <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-700">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Idle Machinery
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
            {idleMachineryCount}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Awaiting assignment
          </p>
        </div>
        <Package className="h-8 w-8 text-blue-600 dark:text-blue-300" />
      </div>
    </CardContent>
  </Card>
</div>

              {/* Machinery Table */}
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Machinery ID</TableHead>
                        <TableHead className="min-w-[150px]">Name & Model</TableHead>
                        <TableHead className="min-w-[120px]">Type</TableHead>
                        <TableHead className="min-w-[150px]">Site</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[120px]">Operator</TableHead>
                        <TableHead className="min-w-[120px]">Last Maintenance</TableHead>
                        <TableHead className="min-w-[120px]">Next Maintenance</TableHead>
                        <TableHead className="min-w-[100px]">Hours Operated</TableHead>
                        <TableHead className="min-w-[200px]">Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedMachinery.map((machine) => (
                        <TableRow key={machine.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium min-w-[100px]">{machine.machineryId}</TableCell>
                          <TableCell className="min-w-[150px]">
                            <div>
                              <div className="font-medium">{machine.name}</div>
                              <div className="text-sm text-muted-foreground">{machine.model}</div>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[120px]">{machine.type}</TableCell>
                          <TableCell className="min-w-[150px]">
                            <div>
                              <p className="text-sm font-medium">{machine.site.split(',')[0]}</p>
                              <p className="text-xs text-muted-foreground">
                                {machine.site.split(',').slice(1).join(',')}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[100px]">
                            <Badge variant={
                              machine.status === 'active' ? 'default' :
                              machine.status === 'maintenance' ? 'secondary' : 'outline'
                            } className="text-xs">
                              {machine.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="min-w-[120px]">
                            <div>
                              <div className="font-medium">{machine.operator}</div>
                              <div className="text-sm text-muted-foreground">{machine.operatorPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[120px]">{machine.lastMaintenance}</TableCell>
                          <TableCell className="min-w-[120px]">
                            <div className={`font-medium ${
                              new Date(machine.nextMaintenance) < new Date() ? 'text-red-600' :
                              'text-green-600'
                            }`}>
                              {machine.nextMaintenance}
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[100px]">{machine.hoursOperated.toLocaleString()} hrs</TableCell>
                          <TableCell className="min-w-[200px] max-w-[200px]">
                            <div className="text-sm text-muted-foreground truncate" title={machine.remarks}>
                              {machine.remarks.length > 80 ? machine.remarks.substring(0, 80) + '...' : machine.remarks}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Pagination
                currentPage={machineryPage}
                totalPages={machineryTotalPages}
                onPageChange={setMachineryPage}
                totalItems={filteredMachinery.length}
                itemsPerPage={itemsPerPage}
              />

              {/* Detailed Machinery Cards */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {paginatedMachinery.map((machine) => (
                  <Card key={machine.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{machine.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{machine.type} • {machine.site}</p>
                        </div>
                        <Badge variant={
                          machine.status === 'active' ? 'default' :
                          machine.status === 'maintenance' ? 'secondary' : 'outline'
                        }>
                          {machine.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Operator:</span>
                            <p>{machine.operator}</p>
                          </div>
                          <div>
                            <span className="font-medium">Hours Operated:</span>
                            <p>{machine.hoursOperated.toLocaleString()} hrs</p>
                          </div>
                          <div>
                            <span className="font-medium">Last Maintenance:</span>
                            <p>{machine.lastMaintenance}</p>
                          </div>
                          <div>
                            <span className="font-medium">Next Maintenance:</span>
                            <p className={
                              new Date(machine.nextMaintenance) < new Date() ? 'text-red-600 font-medium' : ''
                            }>
                              {machine.nextMaintenance}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-2">Remarks:</h4>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {machine.remarks}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Maintenance History:</h4>
                          <div className="space-y-2">
                            {machine.maintenanceHistory.slice(0, 2).map((history, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{history.date} - {history.type}</span>
                                <span className="font-medium">₹{history.cost.toLocaleString()}</span>
                              </div>
                            ))}
                            {machine.maintenanceHistory.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{machine.maintenanceHistory.length - 2} more records
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Outstanding Debtors Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader className="px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg">Outstanding Debtors Reports</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Parties/customers with outstanding balances and payment details
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 flex-1 sm:flex-none">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-28 sm:w-32"
                  />
                  <span className="text-sm">to</span>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-28 sm:w-32"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleExportDebtors} className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-2 flex-1 w-full">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by party name..."
                    value={debtorSearch}
                    onChange={(e) => setDebtorSearch(e.target.value)}
                    className="w-full sm:w-64"
                  />
                </div>
                <Select value={debtorStatusFilter} onValueChange={setDebtorStatusFilter} classNnoame="w-full sm:w-40">
                  <SelectTrigger>
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
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Total Outstanding</p>
                        <p className="text-2xl font-bold text-red-600">
                          ₹{(totalOutstanding / 100000).toFixed(1)}L
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Party ID</TableHead>
                        <TableHead className="min-w-[150px]">Party Name</TableHead>
                        <TableHead className="min-w-[120px]">Contact Person</TableHead>
                        <TableHead className="min-w-[150px]">Contact Info</TableHead>
                        <TableHead className="min-w-[120px]">Total Amount</TableHead>
                        <TableHead className="min-w-[120px]">Pending Amount</TableHead>
                        <TableHead className="min-w-[120px]">Last Payment</TableHead>
                        <TableHead className="min-w-[100px]">Due Date</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[120px]">Credit Limit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedDebtors.map((debtor) => (
                        <TableRow key={debtor.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium min-w-[100px]">{debtor.partyId}</TableCell>
                          <TableCell className="font-medium min-w-[150px]">{debtor.partyName}</TableCell>
                          <TableCell className="min-w-[120px]">{debtor.contactPerson}</TableCell>
                          <TableCell className="min-w-[150px]">
                            <div className="text-sm">
                              <div>{debtor.phone}</div>
                              <div className="text-muted-foreground">{debtor.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[120px]">₹{debtor.totalAmount.toLocaleString()}</TableCell>
                          <TableCell className="min-w-[120px] font-medium text-red-600">
                            ₹{debtor.pendingAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="min-w-[120px]">
                            <div className="text-sm">
                              <div>{debtor.lastPaymentDate}</div>
                              <div className="text-muted-foreground">₹{debtor.lastPaymentAmount.toLocaleString()}</div>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[100px]">
                            <div className={`font-medium ${
                              debtor.status === 'overdue' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {debtor.dueDate}
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[100px]">
                            <Badge variant={debtor.status === 'overdue' ? 'destructive' : 'secondary'} className="text-xs">
                              {debtor.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="min-w-[120px]">₹{debtor.creditLimit.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Pagination
                currentPage={debtorPage}
                totalPages={debtorTotalPages}
                onPageChange={setDebtorPage}
                totalItems={filteredDebtors.length}
                itemsPerPage={itemsPerPage}
              />

              {/* Detailed Debtor Cards */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {paginatedDebtors.map((debtor) => (
                  <Card key={debtor.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{debtor.partyName}</CardTitle>
                          <p className="text-sm text-muted-foreground">{debtor.contactPerson}</p>
                        </div>
                        <Badge variant={debtor.status === 'overdue' ? 'destructive' : 'secondary'}>
                          {debtor.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Phone:</span>
                            <p>{debtor.phone}</p>
                          </div>
                          <div>
                            <span className="font-medium">Email:</span>
                            <p className="truncate">{debtor.email}</p>
                          </div>
                          <div>
                            <span className="font-medium">Total Amount:</span>
                            <p>₹{debtor.totalAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Pending Amount:</span>
                            <p className="text-red-600 font-medium">₹{debtor.pendingAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Due Date:</span>
                            <p className={
                              debtor.status === 'overdue' ? 'text-red-600 font-medium' : ''
                            }>
                              {debtor.dueDate}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Credit Limit:</span>
                            <p>₹{debtor.creditLimit.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-2">Recent Payments:</h4>
                          <div className="space-y-2">
                            {debtor.paymentHistory.slice(0, 2).map((payment, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{payment.date} - {payment.mode}</span>
                                <span className="text-green-600 font-medium">₹{payment.amount.toLocaleString()}</span>
                              </div>
                            ))}
                            {debtor.paymentHistory.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{debtor.paymentHistory.length - 2} more payments
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;