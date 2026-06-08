import { useParams } from "react-router-dom";
import StandardDescriptionForm from "../../components/forms/StandardDescriptionForm";

export default function StandardDescriptionEditor({ mode }) {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="border-b pb-5 text-2xl font-semibold tracking-tight text-foreground">
        {mode === "new" ? "Create Standard Description" : "Edit Description"}
      </h1>

      <StandardDescriptionForm mode={mode} id={id} />
    </div>
  );
}
