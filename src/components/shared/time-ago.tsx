"use client";

import { formatDistanceToNow } from "date-fns";
import { useMounted } from "@/hooks/use-mounted";

export function TimeAgo({ date }: { date: Date }) {
  const mounted = useMounted();
  if (!mounted) return <span className="text-muted-foreground">...</span>;
  return (
    <span className="text-muted-foreground">
      {formatDistanceToNow(date, { addSuffix: true })}
    </span>
  );
}
