"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createRelease } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"

export default function ReleaseForm({ projects }: { projects: any[] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      await createRelease(formData)
      toast.success("Release created successfully")
      router.push("/dashboard/releases")
    } catch (error: any) {
      toast.error(error.message || "Failed to create release")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>Release Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input id="version" name="version" placeholder="v1.0.0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Alpha Release" required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_id">Project</Label>
              <Select name="project_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name} ({p.code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="release_type">Type</Label>
              <Select name="release_type" defaultValue="Minor">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Major">Major</SelectItem>
                  <SelectItem value="Minor">Minor</SelectItem>
                  <SelectItem value="Patch">Patch</SelectItem>
                  <SelectItem value="Hotfix">Hotfix</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Release Notes / Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Describe what's in this release..." 
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Link href="/dashboard/releases">
            <Button variant="ghost" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isLoading || projects.length === 0}>
            {isLoading ? "Creating..." : "Create Release"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
