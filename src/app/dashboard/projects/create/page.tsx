"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProject } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"

export default function CreateProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      await createProject(formData)
      toast.success("Project created successfully")
      router.push("/dashboard/projects")
    } catch (error: any) {
      toast.error(error.message || "Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/projects">
          <Button variant="outline" size="sm">Back</Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Project</h1>
        </div>
      </div>

      <Card>
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Enter the details for the new project. The project code should be short (e.g. FEAT).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" name="name" placeholder="E.g. FeatureFlow Mobile" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Project Code</Label>
                <Input id="code" name="code" placeholder="E.g. FFM" required maxLength={10} className="uppercase" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Describe the purpose of this project..." 
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/dashboard/projects">
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
