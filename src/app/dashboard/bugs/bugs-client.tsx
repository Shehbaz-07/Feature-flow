"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslation } from "@/lib/i18n/context"

interface BugsClientProps {
  bugs: any[]
}

export function BugsClient({ bugs }: BugsClientProps) {
  const { t } = useTranslation()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive"
      case "High": return "warning" 
      case "Medium": return "default"
      case "Low": return "secondary"
      default: return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "default"
      case "Closed": return "outline"
      case "In Progress": return "secondary"
      case "Open": return "destructive"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.bugs.title}</h1>
          <p className="text-muted-foreground mt-1">
            {t.bugs.subtitle}
          </p>
        </div>
        <Link href="/dashboard/bugs/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t.bugs.reportBug}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.bugs.allBugs}</CardTitle>
        </CardHeader>
        <CardContent>
          {bugs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {t.bugs.noBugs}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.bugs.colProject}</TableHead>
                  <TableHead>{t.bugs.colTitle}</TableHead>
                  <TableHead>{t.bugs.colStatus}</TableHead>
                  <TableHead>{t.bugs.colSeverity}</TableHead>
                  <TableHead>{t.bugs.colReporter}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bugs.map((bug: any) => (
                  <TableRow key={bug.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {bug.project?.code}
                    </TableCell>
                    <TableCell className="font-semibold">{bug.title}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(bug.status) as any}>
                        {bug.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(bug.severity) as any}>
                        {bug.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{bug.reporter?.full_name || t.bugs.unknown}</TableCell>
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
