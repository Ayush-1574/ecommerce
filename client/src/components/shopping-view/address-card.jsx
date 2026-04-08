import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { MapPin, Phone, FileText, Pencil, Trash2 } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-200 rounded-xl hover:shadow-md ${
        selectedId?._id === addressInfo?._id
          ? "ring-2 ring-primary border-primary shadow-md"
          : "hover:border-muted-foreground/30"
      }`}
    >
      <CardContent className="grid p-5 gap-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="space-y-1">
            <Label className="text-sm font-medium">{addressInfo?.address}</Label>
            <p className="text-xs text-muted-foreground">
              {addressInfo?.city} - {addressInfo?.pincode}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <Label className="text-sm">{addressInfo?.phone}</Label>
        </div>
        {addressInfo?.notes && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm text-muted-foreground">{addressInfo?.notes}</Label>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          className="rounded-lg gap-1.5 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          <Pencil className="w-3 h-3" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-lg gap-1.5 text-xs text-red-600 hover:text-red-600 hover:bg-red-50 border-red-200"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
