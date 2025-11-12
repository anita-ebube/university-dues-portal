import StudentDetailsCard from "./StudentDetailsCard";
import PaymentHistory from "./Payments/PaymentHistoryComponent";

export default function DashboardHome() {
  return (
    <>
      <StudentDetailsCard />
      <PaymentHistory />
    </>
  );
}