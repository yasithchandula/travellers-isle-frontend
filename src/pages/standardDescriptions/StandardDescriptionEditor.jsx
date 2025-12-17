import { useParams } from "react-router-dom";
import StandardDescriptionForm from "../../components/forms/StandardDescriptionForm";

export default function StandardDescriptionEditor({ mode }) {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-serif text-ti-forest mb-6">
        {mode === "new" ? "Create Standard Description" : "Edit Description"}
      </h1>

      <StandardDescriptionForm mode={mode} id={id} />
    </div>
  );
}
