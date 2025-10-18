import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { motion } from "motion/react";

interface NydusTabsProps {
  id: string;
  selectedTab: any;
  setSelectedTab: (tab: any) => void;
  items: Record<string, string>;
  className?: string;
}

export const NydusTabs = ({
  id,
  selectedTab,
  setSelectedTab,
  items,
  className,
}: NydusTabsProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between size-full gap-1 bg-transparent rounded-lg p-1",
        className
      )}
    >
      {Object.entries(items).map(([key, value]) => (
        <button
          key={key}
          className="relative flex flex-col items-center justify-center size-full p-0.5 text-white cursor-pointer"
          onClick={() => setSelectedTab(value)}
        >
          {selectedTab === value && (
            <motion.span
              layoutId={`${id}-bg-color`}
              className="absolute inset-0 bg-white rounded-md"
              transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
            />
          )}
          <p
            className={cn(
              "z-10 transition-all duration-300",
              selectedTab === value && "text-black"
            )}
          >
            {capitalizeFirstLetter(value)}
          </p>
        </button>
      ))}
    </div>
  );
};
