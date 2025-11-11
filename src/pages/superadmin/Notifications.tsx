import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const notifications = [
  { id: 1, title: "Task Completed", message: "John Doe completed 'Site Inspection'", time: "5 min ago", type: "success", read: false },
  { id: 2, title: "Leave Request", message: "Jane Smith applied for leave (Jan 20-22)", time: "1 hour ago", type: "info", read: false },
  { id: 3, title: "New Task Started", message: "Mike Johnson started 'Equipment Maintenance'", time: "2 hours ago", type: "info", read: true },
  { id: 4, title: "Document Uploaded", message: "Admin uploaded 'Attendance Report Q1'", time: "3 hours ago", type: "success", read: true },
  { id: 5, title: "Task Overdue", message: "'Monthly Report' is overdue", time: "5 hours ago", type: "warning", read: false },
  { id: 6, title: "Employee Added", message: "Supervisor A added new employee Sarah Williams", time: "1 day ago", type: "info", read: true },
];

const Notifications = () => {
  const handleMarkAllRead = () => {
    toast.success("All notifications marked as read!");
  };

  const handleDelete = (id: number) => {
    toast.success("Notification deleted!");
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case "success": return "default";
      case "warning": return "destructive";
      case "info": return "secondary";
      default: return "outline";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Notifications" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <span className="text-lg font-semibold">
              {unreadCount} Unread Notification{unreadCount !== 1 && "s"}
            </span>
          </div>
          <Button onClick={handleMarkAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={!notification.read ? "border-l-4 border-l-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{notification.title}</h4>
                        <Badge variant={getTypeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;
