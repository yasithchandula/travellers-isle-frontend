import { CardLoadingSkeleton } from "@/components/common/LoadingStates";

export default function CardSkeleton(props) {
  return <CardLoadingSkeleton variant="media" {...props} />;
}
