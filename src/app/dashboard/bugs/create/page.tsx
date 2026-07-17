import { getProjects } from "@/app/actions"
import BugForm from "./BugForm"

export default async function CreateBugPage() {
  const projects = await getProjects()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report Bug</h1>
        </div>
      </div>
      
      <BugForm projects={projects} />
    </div>
  )
}
