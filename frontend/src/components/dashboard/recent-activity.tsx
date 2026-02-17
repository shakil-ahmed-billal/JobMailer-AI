import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentActivity() {
  // Mock data for now, replace with API call
  const activities = [
    {
      id: "1",
      user: { name: "You", image: "/avatars/01.png" },
      action: "applied to",
      target: "Software Engineer at Google",
      time: "2 hours ago",
    },
    {
      id: "2",
      user: { name: "AI", image: "/avatars/02.png" },
      action: "generated email for",
      target: "Frontend Dev at Meta",
      time: "4 hours ago",
    },
    {
      id: "3",
      user: { name: "System", image: "/avatars/03.png" },
      action: "updated status for",
      target: "Netflix Application",
      time: "Yesterday",
    },
  ];

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.image} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name}{" "}
              <span className="text-muted-foreground font-normal">
                {activity.action}
              </span>{" "}
              {activity.target}
            </p>
            <p className="text-sm text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
