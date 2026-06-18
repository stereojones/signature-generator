import { Wizard } from "@/components/Wizard";
import { WizardProvider } from "@/components/WizardContext";
import { getAllSignatureVariants } from "@/lib/templates";
import { getVisibleBrands } from "@/templates/brands";

export default function Home() {
  const includeDrafts = process.env.NODE_ENV === "development";
  const brands = getVisibleBrands(includeDrafts);
  const signatures = getAllSignatureVariants(includeDrafts);

  return (
    <WizardProvider brands={brands} signatures={signatures}>
      <main>
        <Wizard />
      </main>
    </WizardProvider>
  );
}
