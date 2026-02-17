import { Task } from "@/types";
import { format } from "date-fns";
import { CheckCircle2, Clock } from "lucide-react";

interface UpcomingTasksProps {
  tasks?: Task[];
}

export function UpcomingTasks({ tasks = [] }: UpcomingTasksProps) {
  // Mock data if no tasks provided
  const displayTasks =
    tasks.length > 0
      ? tasks
      : [
          {
            id: "1",
            title: "Follow up application",
            deadline: new Date(Date.now() + 86400000).toISOString(),
            job: { companyName: "Microsoft" },
          },
          {
            id: "2",
            title: "Prepare for interview",
            deadline: new Date(Date.now() + 172800000).toISOString(),
            job: { companyName: "Amazon" },
          },
          {
            id: "3",
            title: "Submit assessment",
            deadline: new Date(Date.now() + 432000000).toISOString(),
            job: { companyName: "Spotify" },
          },
        ];

  return (
    <div className="space-y-6">
      {displayTasks.map((task: any) => (
        <div
          key={task.id}
          className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
        >
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{task.title}</p>
              <p className="text-xs text-muted-foreground">
                {task.job?.companyName || "General Task"}
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {format(new Date(task.deadline), "MMM d")}
          </div>
        </div>
      ))}
    </div>
  );
}
