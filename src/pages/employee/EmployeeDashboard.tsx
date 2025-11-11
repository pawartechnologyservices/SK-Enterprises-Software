import React from 'react';
import { ClipboardList, CheckCircle, UserCheck, TrendingUp } from 'lucide-react';

// Define the StatCardProps interface based on the usage
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  className?: string;
}

// StatCard component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, className = '' }) => {
  return (
    <div className={`p-6 rounded-lg border shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full">
          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  // Mock statistics data - replace with actual data from your API/state
  const stats = {
    assignedTasks: 12,
    completedTasks: 8,
    attendanceRate: "95%",
    productivity: "87%"
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back!</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assigned tasks"
          value={stats.assignedTasks}
          icon={ClipboardList}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        />
        <StatCard
          title="Completed tasks"
          value={stats.completedTasks}
          icon={CheckCircle}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        />
        <StatCard
          title="Attendance Rate"
          value={stats.attendanceRate}
          icon={UserCheck}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        />
        <StatCard
          title="Productivity"
          value={stats.productivity}
          icon={TrendingUp}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        />
      </div>

      {/* Additional dashboard content can go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Tasks</h2>
          <div className="space-y-3">
            {/* Task items would go here */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-gray-700 dark:text-gray-300">Task #1</span>
              <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">Pending</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-gray-700 dark:text-gray-300">Task #2</span>
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">Completed</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Overview</h2>
          <div className="space-y-4">
            {/* Performance metrics would go here */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Task Completion</span>
                <span>87%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>On-time Delivery</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;