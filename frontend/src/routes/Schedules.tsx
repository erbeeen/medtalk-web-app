type ScheduleRouteProps = {
  scrollToTop: () => void;
}

export default function ScheduleRoute({ scrollToTop }: ScheduleRouteProps) {
  scrollToTop();
  return (
    <h1>Schedule</h1>
  );
}
