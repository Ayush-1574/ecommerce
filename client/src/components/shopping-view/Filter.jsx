import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border">
      <div className="p-5 border-b">
        <h2 className="text-lg font-bold tracking-tight">Filters</h2>
      </div>
      <div className="p-5 space-y-5">
        {Object.keys(filterOptions).map((keyItem, idx) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {keyItem}
              </h3>
              <div className="grid gap-2.5">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex items-center gap-3 cursor-pointer text-sm font-medium hover:text-primary transition-colors"
                  >
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                      className="rounded"
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            {idx < Object.keys(filterOptions).length - 1 && <Separator />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
