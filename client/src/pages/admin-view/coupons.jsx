import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addNewCoupon, deleteCoupon, fetchAllCoupons, editCoupon } from "@/store/admin/coupon-slice";
import { toast } from "sonner";

const couponFormElements = [
  {
    label: "Coupon Code",
    name: "code",
    componentType: "input",
    type: "text",
    placeholder: "Enter unique code (e.g., FESTIVE10)",
  },
  {
    label: "Discount Type",
    name: "discountType",
    componentType: "select",
    options: [
      { id: "percentage", label: "Percentage" },
      { id: "fixed", label: "Fixed Amount" },
    ],
  },
  {
    label: "Discount Value",
    name: "discountValue",
    componentType: "input",
    type: "number",
    placeholder: "Enter the amount or %",
  },
  {
    label: "Minimum Order Amount",
    name: "minOrderAmount",
    componentType: "input",
    type: "number",
    placeholder: "Enter min cart total to apply",
  },
];

const initialFormData = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "0",
};

function AdminCoupons() {
  const [openCreateCouponDialog, setOpenCreateCouponDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  
  const dispatch = useDispatch();
  const { couponList } = useSelector((state) => state.adminCoupon);

  const handleFetchCoupons = () => {
    dispatch(fetchAllCoupons());
  };

  useEffect(() => {
    handleFetchCoupons();
  }, [dispatch]);

  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      dispatch(editCoupon({ id: currentEditedId, formData })).then((data) => {
        if (data?.payload?.success) {
          handleFetchCoupons();
          setOpenCreateCouponDialog(false);
          setFormData(initialFormData);
          setCurrentEditedId(null);
          toast("Coupon updated successfully");
        }
      });
    } else {
      dispatch(addNewCoupon(formData)).then((data) => {
        if (data?.payload?.success) {
          handleFetchCoupons();
          setOpenCreateCouponDialog(false);
          setFormData(initialFormData);
          toast("Coupon added successfully");
        } else {
          toast(data?.payload?.message || "Error creating coupon");
        }
      });
    }
  }

  function handleEditContact(coupon) {
    setCurrentEditedId(coupon.id);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
    });
    setOpenCreateCouponDialog(true);
  }

  function handleDeleteCoupon(id) {
    dispatch(deleteCoupon(id)).then((data) => {
      if (data?.payload?.success) {
        handleFetchCoupons();
        toast("Coupon deleted successfully");
      }
    });
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="mb-5 flex justify-end">
        <Button onClick={() => {
          setOpenCreateCouponDialog(true);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}>
          Add New Coupon
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {couponList && couponList.length > 0 ? (
          couponList.map((coupon) => (
            <Card key={coupon.id} className="relative shadow-sm rounded-xl hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold tracking-wider">{coupon.code}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">{coupon.discountType}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="font-medium">
                    {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Min Order:</span>
                  <span className="font-medium">${coupon.minOrderAmount}</span>
                </div>
                
                <div className="flex space-x-2 w-full pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => handleEditContact(coupon)}>
                    Edit
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleDeleteCoupon(coupon.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-1 md:col-span-2 lg:col-span-3 text-center block text-muted-foreground pt-4">No coupons created.</p>
        )}
      </div>

      <Sheet open={openCreateCouponDialog} onOpenChange={setOpenCreateCouponDialog}>
        <SheetContent side="right" className="overflow-auto bg-background/95 backdrop-blur-md border-l">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId ? "Edit Coupon" : "Add New Coupon"}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId ? "Edit" : "Add"}
              formControls={couponFormElements}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AdminCoupons;
