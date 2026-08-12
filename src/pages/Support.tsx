import { LifeBuoy } from "lucide-react";
import { EmptyState } from "../components/ui/Feedback";

export default function Support() {
  return (
    <EmptyState
      icon={LifeBuoy}
      title="Centre support prêt à connecter"
      description="Cette page peut accueillir une FAQ, un formulaire de ticket ou une intégration de messagerie."
    />
  );
}
