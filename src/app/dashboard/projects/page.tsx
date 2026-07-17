import Link from "next/link"
import { getProjects } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your workspaces and products.
          </p>
        </div>
        <Link href="/dashboard/projects/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>A list of all projects you have access to.</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No projects found. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project: any) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-mono font-medium">{project.code}</TableCell>
                    <TableCell className="font-semibold">{project.name}</TableCell>
                    <TableCell>
                      <Badge variant={project.status === "Active" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.owner?.full_name || "Unknown"}</TableCell>
                    <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
