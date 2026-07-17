import { getProjects } from "@/app/actions"
import FeatureForm from "./FeatureForm"

export default async function CreateFeaturePage() {
  const projects = await getProjects()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Feature</h1>
        </div>
      </div>
      
      <FeatureForm projects={projects} />
    </div>
  )
}
