type MedicineRouteProps = {
  scrollToTop: () => void;
}

export default function MedicineRoute({ scrollToTop }: MedicineRouteProps) {
  scrollToTop();
  return (
    <h1>Medicine</h1>
  );
}
