import { filterOptions } from "@/config";
import { Fragment, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

function ProductFilter({ filters, handleFilter }) {
  const [collapsed, setCollapsed] = useState({});

  const toggleSection = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getActiveCount = (keyItem) => {
    if (!filters || !filters[keyItem]) return 0;
    return filters[keyItem].length;
  };

  const totalActive = Object.keys(filters || {}).reduce(
    (sum, key) => sum + (filters[key]?.length || 0), 0
  );

  return (
    <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-sm">
              <SlidersHorizontal className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold tracking-tight">Filters</h2>
          </div>
          {totalActive > 0 && (
            <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              {totalActive}
            </span>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="divide-y">
        {Object.keys(filterOptions).map((keyItem, idx) => {
          const active = getActiveCount(keyItem);
          const isCollapsed = collapsed[keyItem];

          return (
            <Fragment key={keyItem}>
              <div>
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(keyItem)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold capitalize">{keyItem}</h3>
                    {active > 0 && (
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                        {active}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                      isCollapsed ? "-rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Options */}
                {!isCollapsed && (
                  <div className="px-5 pb-4 grid gap-2.5">
                    {filterOptions[keyItem].map((option) => {
                      const isChecked =
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1;

                      return (
                        <Label
                          key={option.id}
                          className={`flex items-center gap-3 cursor-pointer text-sm font-medium rounded-lg px-3 py-2 transition-all duration-150 ${
                            isChecked
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted/60 text-foreground/80 hover:text-foreground"
                          }`}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => handleFilter(keyItem, option.id)}
                            className="rounded data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          {option.label}
                        </Label>
                      );
                    })}
                  </div>
                )}
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ProductFilter;
