import { Shield } from "lucide-react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      <div>
        <h1 className="text-[22px] font-bold tracking-[-0.035em] leading-tight">{title}</h1>
        {description && <p className="mt-1 text-[13px] text-muted-foreground font-[420]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
