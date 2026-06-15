import { Wizard } from "@/components/Wizard";
import { WizardProvider } from "@/components/WizardContext";
import { getAllTemplates } from "@/lib/templates";

export default function Home() {
  const templates = getAllTemplates(process.env.NODE_ENV === "development");

  return (
    <WizardProvider templates={templates}>
      <main>
        <Wizard />
      </main>
    </WizardProvider>
  );
}
