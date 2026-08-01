"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslation } from "@/lib/i18n/context"

interface ProjectsClientProps {
  projects: any[]
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.projects.title}</h1>
          <p className="text-muted-foreground mt-1">
            {t.projects.subtitle}
          </p>
        </div>
        <Link href="/dashboard/projects/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t.projects.newProject}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.projects.allProjects}</CardTitle>
          <CardDescription>{t.projects.allProjectsDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {t.projects.noProjects}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.projects.colCode}</TableHead>
                  <TableHead>{t.projects.colName}</TableHead>
                  <TableHead>{t.projects.colStatus}</TableHead>
                  <TableHead>{t.projects.colOwner}</TableHead>
                  <TableHead>{t.projects.colCreatedAt}</TableHead>
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
                    <TableCell>{project.owner?.full_name || t.projects.unknown}</TableCell>
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
