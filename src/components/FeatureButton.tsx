
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FeatureButtonProps {
  to: string;
  icon: ReactNode;
  label: string;
  description?: string;
  className?: string;
}

const FeatureButton = ({
  to,
  icon,
  label,
  description,
  className,
}: FeatureButtonProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "thrive-card hover:scale-105 flex flex-col items-center p-6 gap-4",
        className
      )}
    >
      <div className="thrive-icon-button text-2xl bg-accent text-accent-foreground">
        {icon}
      </div>
      <div className="text-center">
        <h3 className="font-medium text-lg">{label}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </Link>
  );
};

export default FeatureButton;
