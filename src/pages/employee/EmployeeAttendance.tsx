import { useOutletContext } from "react-router-dom";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle2, XCircle, Play, Square, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  breakStart?: string;
  breakEnd?: string;
  totalBreakTime?: string;
  status: "present" | "absent" | "late" | "half-day";
  workHours: string;
  actualWorkHours?: string;
}

interface CurrentSession {
  isCheckedIn: boolean;
  isOnBreak: boolean;
  checkInTime?: string;
  breakStartTime?: string;
}

const EmployeeAttendance = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: "1",
      date: "2024-01-10",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      breakStart: "01:00 PM",
      breakEnd: "01:30 PM",
      totalBreakTime: "30 minutes",
      status: "present",
      workHours: "9 hours",
      actualWorkHours: "8.5 hours"
    },
    {
      id: "2",
      date: "2024-01-09",
      checkIn: "09:15 AM",
      checkOut: "06:05 PM",
      breakStart: "01:00 PM",
      breakEnd: "01:45 PM",
      totalBreakTime: "45 minutes",
      status: "late",
      workHours: "8.5 hours",
      actualWorkHours: "7.75 hours"
    },
    {
      id: "3",
      date: "2024-01-08",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      breakStart: "12:30 PM",
      breakEnd: "01:00 PM",
      totalBreakTime: "30 minutes",
      status: "present",
      workHours: "9 hours",
      actualWorkHours: "8.5 hours"
    },
    {
      id: "4",
      date: "2024-01-07",
      checkIn: "-",
      checkOut: "-",
      status: "absent",
      workHours: "0 hours"
    },
    {
      id: "5",
      date: "2024-01-06",
      checkIn: "09:00 AM",
      checkOut: "01:00 PM",
      breakStart: "11:00 AM",
      breakEnd: "11:15 AM",
      totalBreakTime: "15 minutes",
      status: "half-day",
      workHours: "4 hours",
      actualWorkHours: "3.75 hours"
    }
  ]);

  const [currentSession, setCurrentSession] = useState<CurrentSession>({
    isCheckedIn: false,
    isOnBreak: false
  });

  // Load current session from localStorage on component mount
  useEffect(() => {
    const savedSession = localStorage.getItem('currentAttendanceSession');
    if (savedSession) {
      setCurrentSession(JSON.parse(savedSession));
    }
  }, []);

  // Save current session to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentAttendanceSession', JSON.stringify(currentSession));
  }, [currentSession]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleCheckIn = () => {
    const currentTime = getCurrentTime();
    setCurrentSession({
      isCheckedIn: true,
      isOnBreak: false,
      checkInTime: currentTime
    });
  };

  const handleBreakStart = () => {
    const currentTime = getCurrentTime();
    setCurrentSession(prev => ({
      ...prev,
      isOnBreak: true,
      breakStartTime: currentTime
    }));
  };

  const handleBreakEnd = () => {
    const currentTime = getCurrentTime();
    setCurrentSession(prev => ({
      ...prev,
      isOnBreak: false,
      breakStartTime: undefined
    }));
  };

  const handleCheckOut = () => {
    const currentTime = getCurrentTime();
    const currentDate = getCurrentDate();
    
    // Calculate total break time if any breaks were taken
    let totalBreakTime = "0 minutes";
    let actualWorkHours = "8 hours"; // Default calculation
    
    if (currentSession.breakStartTime) {
      // In a real app, you'd calculate the actual time difference
      totalBreakTime = "30 minutes"; // Mock calculation
      actualWorkHours = "7.5 hours"; // Mock calculation
    }

    const newRecord: AttendanceRecord = {
      id: (attendanceRecords.length + 1).toString(),
      date: currentDate,
      checkIn: currentSession.checkInTime || "09:00 AM",
      checkOut: currentTime,
      breakStart: currentSession.breakStartTime,
      breakEnd: currentSession.isOnBreak ? currentTime : undefined,
      totalBreakTime: currentSession.breakStartTime ? totalBreakTime : undefined,
      status: "present",
      workHours: "8 hours",
      actualWorkHours: actualWorkHours
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);
    setCurrentSession({
      isCheckedIn: false,
      isOnBreak: false
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Present</Badge>;
      case "absent":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Absent</Badge>;
      case "late":
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" />Late</Badge>;
      case "half-day":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Half Day</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalPresent = attendanceRecords.filter(r => r.status === "present").length;
  const totalAbsent = attendanceRecords.filter(r => r.status === "absent").length;
  const totalLate = attendanceRecords.filter(r => r.status === "late").length;
  const attendancePercentage = ((totalPresent + totalLate) / attendanceRecords.length * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Attendance" 
        subtitle="Manage your daily attendance and breaks"
        onMenuClick={onMenuClick}
      />

      <div className="p-6 space-y-6">
        {/* Attendance Actions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <CardTitle>Today's Attendance</CardTitle>
              </div>
              <CardDescription>
                {currentSession.isCheckedIn 
                  ? `Checked in at ${currentSession.checkInTime}` 
                  : "Start your work day by checking in"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {!currentSession.isCheckedIn ? (
                  <Button 
                    onClick={handleCheckIn}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                    size="lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Check In
                  </Button>
                ) : (
                  <>
                    {!currentSession.isOnBreak ? (
                      <Button 
                        onClick={handleBreakStart}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-6 text-lg"
                        size="lg"
                      >
                        <Coffee className="h-5 w-5 mr-2" />
                        Start Break
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleBreakEnd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
                        size="lg"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        End Break
                      </Button>
                    )}
                    <Button 
                      onClick={handleCheckOut}
                      variant="destructive"
                      className="px-8 py-6 text-lg"
                      size="lg"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Check Out
                    </Button>
                  </>
                )}
              </div>
              
              {currentSession.isCheckedIn && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Check In Time</p>
                      <p className="font-semibold">{currentSession.checkInTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Status</p>
                      <p className="font-semibold">
                        {currentSession.isOnBreak ? "On Break" : "Working"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Break Started</p>
                      <p className="font-semibold">
                        {currentSession.breakStartTime || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendancePercentage}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{totalPresent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Late Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{totalLate}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{totalAbsent}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <CardTitle>Attendance History</CardTitle>
              </div>
              <CardDescription>Your complete attendance records with break details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg bg-muted/30 gap-4"
                  >
                    <div className="flex-1">
                      <div className="font-semibold mb-2">{record.date}</div>
                      <div className="text-sm text-muted-foreground space-y-2">
                        <div className="flex flex-wrap gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            In: {record.checkIn}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Out: {record.checkOut}
                          </span>
                        </div>
                        {(record.breakStart || record.totalBreakTime) && (
                          <div className="flex flex-wrap gap-4 mt-1">
                            {record.breakStart && (
                              <span className="flex items-center gap-1">
                                <Coffee className="h-3 w-3" />
                                Break: {record.breakStart} - {record.breakEnd || "Ongoing"}
                              </span>
                            )}
                            {record.totalBreakTime && (
                              <span className="flex items-center gap-1 text-blue-600">
                                Break Time: {record.totalBreakTime}
                              </span>
                            )}
                            {record.actualWorkHours && (
                              <span className="flex items-center gap-1 text-green-600">
                                Actual Work: {record.actualWorkHours}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{record.workHours}</span>
                      {getStatusBadge(record.status)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;