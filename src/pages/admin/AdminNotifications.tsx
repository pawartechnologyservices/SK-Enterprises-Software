import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "leave" | "task" | "system" | "approval";
  isRead: boolean;
  timestamp: string;
}

const AdminNotifications = () => {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Leave Request",
      message: "Manager John Doe has requested leave from 2024-01-15 to 2024-01-20",
      type: "leave",
      isRead: false,
      timestamp: "2024-01-10 10:30 AM"
    },
    {
      id: "2",
      title: "Task Completed",
      message: "Supervisor Jane Smith completed the quarterly report task",
      type: "task",
      isRead: false,
      timestamp: "2024-01-10 09:15 AM"
    },
    {
      id: "3",
      title: "System Update",
      message: "System maintenance scheduled for tonight at 11 PM",
      type: "system",
      isRead: true,
      timestamp: "2024-01-09 05:00 PM"
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
    );
    toast({
      title: "Success",
      description: "Notification marked as read",
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    toast({
      title: "Success",
      description: "All notifications marked as read",
    });
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Success",
      description: "Notification deleted",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "leave": return "bg-blue-500";
      case "task": return "bg-green-500";
      case "approval": return "bg-yellow-500";
      case "system": return "bg-gray-500";
      default: return "bg-primary";
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Notifications" 
        subtitle="Manage your notifications and alerts"
        onMenuClick={onMenuClick}
      />

      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5" />
                  <CardTitle>All Notifications</CardTitle>
                  {unreadCount > 0 && (
                    <Badge variant="destructive">{unreadCount} New</Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
              </div>
              <CardDescription>
                Stay updated with all activities and requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${
                        notification.isRead ? "bg-background" : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${getTypeColor(notification.type)}`} />
                            <h4 className="font-semibold">{notification.title}</h4>
                            {!notification.isRead && (
                              <Badge variant="secondary" className="text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminNotifications;
