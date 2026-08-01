import { getReleases } from "@/app/actions"
import { ReleasesClient } from "./releases-client"

export default async function ReleasesPage() {
  const releases = await getReleases()
  return <ReleasesClient releases={releases} />
}
