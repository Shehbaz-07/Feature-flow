import { getFeatures } from "@/app/actions"
import { FeaturesClient } from "./features-client"

export default async function FeaturesPage() {
  const features = await getFeatures()
  return <FeaturesClient features={features} />
}
