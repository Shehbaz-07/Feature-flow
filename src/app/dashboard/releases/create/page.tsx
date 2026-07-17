import { getProjects } from "@/app/actions"
import ReleaseForm from "./ReleaseForm"

export default async function CreateReleasePage() {
  const projects = await getProjects()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Release</h1>
        </div>
      </div>
      
      <ReleaseForm projects={projects} />
    </div>
  )
}
