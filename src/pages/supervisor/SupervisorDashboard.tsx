import React, { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  FileText, 
  AlertTriangle,
  Clock,
  TrendingUp,
  MessageSquare,
  Calendar,
  BarChart3,
  Plus,
  Download,
  Search,
  RefreshCw
} from "lucide-react";

// Define types for the data
interface DashboardStats {
  totalEmployees: number;
  assignedTasks: number;
  completedTasks: number;
  pendingReports: number;
  attendanceRate: number;
  overtimeHours: number;
  productivity: number;
  pendingRequests: number;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  employee: string;
  priority: string;
  timestamp: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: string;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  assignedTo: string;
  priority: string;
  progress: number;
}

interface OutletContext {
  onMenuClick: () => void;
}

const SupervisorDashboard = () => {
  const { onMenuClick } = useOutletContext<OutletContext>();
  
  // State for data with proper types
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    assignedTasks: 0,
    completedTasks: 0,
    pendingReports: 0,
    attendanceRate: 0,
    overtimeHours: 0,
    productivity: 0,
    pendingRequests: 0
  });
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Replace with your API calls
      const [statsRes, activitiesRes, teamRes, tasksRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/activities/recent'),
        fetch('/api/team/members'),
        fetch('/api/tasks/upcoming')
      ]);

      setStats((await statsRes.json()) || {
        totalEmployees: 0,
        assignedTasks: 0,
        completedTasks: 0,
        pendingReports: 0,
        attendanceRate: 0,
        overtimeHours: 0,
        productivity: 0,
        pendingRequests: 0
      });
      setActivities((await activitiesRes.json()) || []);
      setTeam((await teamRes.json()) || []);
      setTasks((await tasksRes.json()) || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search
  const filteredData = {
    activities: activities.filter(item => 
      item.message?.toLowerCase().includes(search.toLowerCase()) ||
      item.employee?.toLowerCase().includes(search.toLowerCase())
    ),
    tasks: tasks.filter(item =>
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.assignedTo?.toLowerCase().includes(search.toLowerCase())
    )
  };

  // Simple action handlers
  const handleAction = (action: string, id?: string) => {
    const actions: { [key: string]: (id?: string) => void } = {
      assignTask: () => alert('Opening task assignment...'),
      generateReport: () => alert('Generating report...'),
      approveRequests: () => window.location.href = '/approvals',
      scheduleMeeting: () => window.location.href = '/meetings/schedule',
      performanceReview: () => window.location.href = '/performance/reviews',
      exportData: () => alert('Exporting data...'),
      viewAllActivities: () => window.location.href = '/activities',
      manageEmployees: () => window.location.href = '/employees',
      viewTask: (id?: string) => window.location.href = `/tasks/${id}`,
      viewEmployee: (id?: string) => window.location.href = `/employees/${id}`
    };
    
    if (actions[action]) {
      actions[action](id);
    }
  };

  // Simple styling helpers
  const getColor = (type: string, value: string) => {
    const colors: { [key: string]: { [key: string]: string } } = {
      priority: {
        high: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
        medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        low: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      },
      status: {
        active: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
        'on leave': 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
        remote: 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
      },
      icon: {
        task: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        approval: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
        completion: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
      },
      progress: {
        high: 'bg-red-600 dark:bg-red-500',
        medium: 'bg-yellow-500 dark:bg-yellow-400',
        low: 'bg-blue-600 dark:bg-blue-500'
      }
    };
    
    return colors[type]?.[value] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  };

  // Format time simply
  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader 
        title="Supervisor Dashboard" 
        subtitle="Manage team and operations"
        onMenuClick={onMenuClick}
      />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>
          <Button onClick={loadData} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Employees" value={stats.totalEmployees || 0} icon={Users} />
          <StatCard title="Assigned Tasks" value={stats.assignedTasks || 0} icon={ClipboardList} />
          <StatCard title="Completed Tasks" value={stats.completedTasks || 0} icon={CheckCircle2} />
          <StatCard title="Pending Reports" value={stats.pendingReports || 0} icon={FileText} />
          <StatCard title="Attendance Rate" value={`${stats.attendanceRate || 0}%`} icon={Users} />
          <StatCard title="Overtime Hours" value={stats.overtimeHours || 0} icon={Clock} />
          <StatCard title="Productivity" value={`${stats.productivity || 0}%`} icon={TrendingUp} />
          <StatCard title="Pending Requests" value={stats.pendingRequests || 0} icon={AlertTriangle} />
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activities & Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activities */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Recent Activities
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleAction('viewAllActivities')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredData.activities.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-full ${getColor('icon', activity.type)}`}>
                      {activity.type === 'task' && <ClipboardList className="h-4 w-4" />}
                      {activity.type === 'approval' && <FileText className="h-4 w-4" />}
                      {activity.type === 'completion' && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(activity.timestamp)} • {activity.employee}
                      </p>
                    </div>
                    <Badge className={getColor('priority', activity.priority)}>
                      {activity.priority}
                    </Badge>
                  </div>
                ))}
                {filteredData.activities.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No activities found</p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredData.tasks.map(task => (
                  <div key={task.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-500">
                          Due: {task.dueDate} • {task.assignedTo}
                        </p>
                      </div>
                      <Badge className={getColor('priority', task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getColor('progress', task.priority)}`}
                        style={{ width: `${task.progress || 0}%` }}
                      />
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-3"
                      onClick={() => handleAction('viewTask', task.id)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
                {filteredData.tasks.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No tasks found</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Team
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleAction('manageEmployees')}>
                    Manage
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {team.map(member => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleAction('viewEmployee', member.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                        {member.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <Badge className={getColor('status', member.status)}>
                      {member.status}
                    </Badge>
                  </div>
                ))}
                {team.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No team members</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleAction('assignTask')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Task
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleAction('generateReport')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleAction('approveRequests')}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Requests
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleAction('scheduleMeeting')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleAction('exportData')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;