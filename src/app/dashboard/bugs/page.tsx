import { getBugs } from "@/app/actions"
import { BugsClient } from "./bugs-client"

export default async function BugsPage() {
  const bugs = await getBugs()
  return <BugsClient bugs={bugs} />
}
