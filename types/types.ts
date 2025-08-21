export interface PurchaseEntry {
  invoiceNo: string;
  type: string;
  by: string;
  time: string;
  purchaseDate: string;
  totalPrice: string;       // keep as string for display
  discountAmount: string;
  payableAmount: string;
  paidAmount: string;
  dueAmount: string;
  paymentMethod: string;
  receivedAmountBank: string;
  receivedAmountCash: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  fare: string;
  note: string;
}
