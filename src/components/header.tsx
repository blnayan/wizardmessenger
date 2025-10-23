import { ThemeModeToggle } from "./theme-mode-toggle";
import { cn } from "@/lib/utils";

export function Header({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header className={cn("flex-0", className)} {...props}>
      <div className="flex flex-row">
        <div className="flex-1"></div>
        <div className="flex flex-row flex-0 px-3 py-2">
          <ThemeModeToggle />
        </div>
      </div>
    </header>
  );
}
