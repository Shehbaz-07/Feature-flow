import { getFeatures } from "@/app/actions"
import { SprintClient } from "./sprint-client"

export default async function SprintBoardPage() {
  const features = await getFeatures()

  return <SprintClient features={features} />
}
