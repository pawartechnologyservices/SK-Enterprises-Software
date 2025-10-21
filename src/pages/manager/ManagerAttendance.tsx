import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CheckCircle, XCircle, Clock, Download, Filter, BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface AttendanceRecord {
  id: number;
  date: string;
  day: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Absent" | "Half Day" | "Late";
  totalHours: string;
  breaks: number;
  breakDuration: string;
  overtime: string;
}

interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  averageHours: string;
  totalOvertime: string;
  attendanceRate: number;
}

const ManagerAttendance = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    halfDays: 0,
    averageHours: "0.0",
    totalOvertime: "0.0",
    attendanceRate: 0
  });
  
  const [filter, setFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));

  // Generate sample attendance data
  useEffect(() => {
    generateAttendanceData();
  }, [selectedMonth]);

  const generateAttendanceData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const records: AttendanceRecord[] = [];
      const currentDate = new Date(selectedMonth + "-01");
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      let presentCount = 0;
      let lateCount = 0;
      let halfDayCount = 0;
      let totalHours = 0;
      let totalOvertime = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        
        // Skip weekends randomly (approx 20% chance)
        if (date.getDay() === 0 || date.getDay() === 6 || Math.random() < 0.2) {
          if (Math.random() < 0.3) { // 30% chance of working on weekend
            const status = Math.random() < 0.7 ? "Present" : "Late";
            const hours = status === "Present" ? 8.0 + (Math.random() * 0.5) : 7.5 + (Math.random() * 0.5);
            const overtime = Math.max(0, hours - 8.0);
            
            records.push({
              id: day,
              date: date.toISOString().split('T')[0],
              day: date.toLocaleDateString('en-US', { weekday: 'short' }),
              checkIn: generateTime(8, 30, 9, 30),
              checkOut: generateTime(16, 30, 18, 0),
              status: status as any,
              totalHours: hours.toFixed(1),
              breaks: Math.floor(Math.random() * 2) + 1,
              breakDuration: "45m",
              overtime: overtime.toFixed(1)
            });

            if (status === "Present") presentCount++;
            if (status === "Late") lateCount++;
            totalHours += hours;
            totalOvertime += overtime;
          } else {
            records.push({
              id: day,
              date: date.toISOString().split('T')[0],
              day: date.toLocaleDateString('en-US', { weekday: 'short' }),
              checkIn: "-",
              checkOut: "-",
              status: "Absent",
              totalHours: "0.0",
              breaks: 0,
              breakDuration: "0m",
              overtime: "0.0"
            });
          }
        } else {
          // Weekday logic
          const rand = Math.random();
          let status: string;
          let hours: number;

          if (rand < 0.7) {
            status = "Present";
            hours = 8.0 + (Math.random() * 0.5);
            presentCount++;
          } else if (rand < 0.85) {
            status = "Late";
            hours = 7.5 + (Math.random() * 0.5);
            lateCount++;
          } else if (rand < 0.95) {
            status = "Half Day";
            hours = 4.0 + (Math.random() * 1.0);
            halfDayCount++;
          } else {
            status = "Absent";
            hours = 0;
          }

          const overtime = Math.max(0, hours - 8.0);
          
          records.push({
            id: day,
            date: date.toISOString().split('T')[0],
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            checkIn: status !== "Absent" ? generateTime(8, 30, 9, 30) : "-",
            checkOut: status !== "Absent" ? generateTime(16, 30, 18, 0) : "-",
            status: status as any,
            totalHours: hours.toFixed(1),
            breaks: status !== "Absent" ? Math.floor(Math.random() * 2) + 1 : 0,
            breakDuration: status !== "Absent" ? "45m" : "0m",
            overtime: overtime.toFixed(1)
          });

          totalHours += hours;
          totalOvertime += overtime;
        }
      }

      const totalDays = records.length;
      const absentCount = records.filter(r => r.status === "Absent").length;
      const attendanceRate = ((presentCount + lateCount * 0.8 + halfDayCount * 0.5) / totalDays) * 100;

      setAttendanceRecords(records);
      setStats({
        totalDays,
        presentDays: presentCount,
        absentDays: absentCount,
        lateDays: lateCount,
        halfDays: halfDayCount,
        averageHours: (totalHours / (presentCount + lateCount + halfDayCount)).toFixed(1),
        totalOvertime: totalOvertime.toFixed(1),
        attendanceRate: Math.round(attendanceRate)
      });
      setIsLoading(false);
    }, 1000);
  };

  const generateTime = (startHour: number, startMin: number, endHour: number, endMin: number) => {
    const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
    const minute = Math.floor(Math.random() * (endMin - startMin)) + startMin;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const filteredRecords = attendanceRecords.filter(record => {
    if (filter === "all") return true;
    if (filter === "present") return record.status === "Present";
    if (filter === "absent") return record.status === "Absent";
    if (filter === "late") return record.status === "Late";
    if (filter === "halfday") return record.status === "Half Day";
    return true;
  });

  const handleExportData = () => {
    toast.success("Attendance data exported successfully!", {
      action: {
        label: "Download",
        onClick: () => {
          toast.info("Starting download...");
        }
      }
    });
  };

  const handleRequestCorrection = (record: AttendanceRecord) => {
    toast.info(`Correction requested for ${record.date}`, {
      description: "Your request has been submitted for review",
      action: {
        label: "View Status",
        onClick: () => {
          toast.success("Opening correction requests...");
        }
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Present: "bg-green-100 text-green-800 border-green-200",
      Absent: "bg-red-100 text-red-800 border-red-200",
      Late: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Half Day": "bg-blue-100 text-blue-800 border-blue-200"
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      Present: <CheckCircle className="h-4 w-4" />,
      Absent: <XCircle className="h-4 w-4" />,
      Late: <Clock className="h-4 w-4" />,
      "Half Day": <AlertCircle className="h-4 w-4" />
    };
    return icons[status as keyof typeof icons];
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(event.target.value);
  };

  const getCurrentMonthName = () => {
    return new Date(selectedMonth + "-01").toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="My Attendance" 
        subtitle="Track and manage your attendance records"
        onMenuClick={onMenuClick}
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
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDays}</div>
              <p className="text-xs text-muted-foreground">{getCurrentMonthName()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Days</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.presentDays}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.lateDays} late, +{stats.halfDays} half day
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absentDays}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.absentDays / stats.totalDays) * 100)}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">
                Avg. {stats.averageHours}h/day
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Hours/Day</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageHours}h</div>
              <p className="text-xs text-muted-foreground">Daily average</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Overtime</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.totalOvertime}h</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.lateDays}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.lateDays / stats.totalDays) * 100)}% of days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls and Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>
                  Your detailed attendance history for {getCurrentMonthName()}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="halfday">Half Day</option>
                  <option value="absent">Absent</option>
                </select>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="h-10 w-10 bg-muted rounded animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                      <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                    </div>
                    <div className="h-6 bg-muted rounded animate-pulse w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Breaks</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          record.day === 'Sat' || record.day === 'Sun' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {record.day}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {record.checkIn}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {record.checkOut}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(record.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(record.status)}
                            {record.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{record.totalHours}h</span>
                          {parseFloat(record.totalHours) >= 8 && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="font-medium">{record.breaks}</span>
                          <div className="text-xs text-muted-foreground">{record.breakDuration}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            parseFloat(record.overtime) > 0 
                              ? "bg-orange-100 text-orange-800 border-orange-200" 
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }
                        >
                          {record.overtime}h
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRequestCorrection(record)}
                          disabled={record.status === "Absent"}
                        >
                          Request Correction
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!isLoading && filteredRecords.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No records found</h3>
                <p className="text-muted-foreground mt-2">
                  No attendance records match your current filters.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Working Days</span>
                  <span className="font-medium">{stats.totalDays - stats.absentDays} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Hours Worked</span>
                  <span className="font-medium">
                    {((parseFloat(stats.averageHours) * (stats.presentDays + stats.lateDays + stats.halfDays)) || 0).toFixed(1)}h
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average Daily Hours</span>
                  <span className="font-medium">{stats.averageHours}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Overtime Rate</span>
                  <span className="font-medium text-orange-600">
                    {((parseFloat(stats.totalOvertime) / (stats.presentDays + stats.lateDays + stats.halfDays)) || 0).toFixed(1)}h/day
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Punctuality Score</span>
                  <Badge variant="default">
                    {Math.round((stats.presentDays / (stats.presentDays + stats.lateDays)) * 100)}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Consistency</span>
                  <Badge variant="default">
                    {stats.attendanceRate}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Overtime Contribution</span>
                  <Badge variant="default">
                    {stats.totalOvertime}h
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Leave Balance</span>
                  <Badge variant="default">
                    {Math.max(0, 18 - stats.absentDays)} days
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ManagerAttendance;