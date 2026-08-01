"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslation } from "@/lib/i18n/context"

interface ReleasesClientProps {
  releases: any[]
}

export function ReleasesClient({ releases }: ReleasesClientProps) {
  const { t } = useTranslation()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Released": return "default"
      case "In Progress": return "secondary"
      case "Planned": return "outline"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.releases.title}</h1>
          <p className="text-muted-foreground mt-1">
            {t.releases.subtitle}
          </p>
        </div>
        <Link href="/dashboard/releases/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t.releases.newRelease}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.releases.allReleases}</CardTitle>
        </CardHeader>
        <CardContent>
          {releases.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {t.releases.noReleases}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.releases.colProject}</TableHead>
                  <TableHead>{t.releases.colVersion}</TableHead>
                  <TableHead>{t.releases.colName}</TableHead>
                  <TableHead>{t.releases.colStatus}</TableHead>
                  <TableHead>{t.releases.colType}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {releases.map((release: any) => (
                  <TableRow key={release.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {release.project?.code}
                    </TableCell>
                    <TableCell className="font-mono font-medium">{release.version}</TableCell>
                    <TableCell className="font-semibold">{release.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(release.status) as any}>
                        {release.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{release.release_type}</TableCell>
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
