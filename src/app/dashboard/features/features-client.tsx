"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslation } from "@/lib/i18n/context"

interface FeaturesClientProps {
  features: any[]
}

export function FeaturesClient({ features }: FeaturesClientProps) {
  const { t } = useTranslation()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive"
      case "High": return "warning" 
      case "Medium": return "default"
      case "Low": return "secondary"
      default: return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Released": return "default"
      case "In Progress": return "secondary"
      case "Backlog": return "outline"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.features.title}</h1>
          <p className="text-muted-foreground mt-1">
            {t.features.subtitle}
          </p>
        </div>
        <Link href="/dashboard/features/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t.features.newFeature}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.features.allFeatures}</CardTitle>
          <CardDescription>{t.features.allFeaturesDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {features.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {t.features.noFeatures}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.features.colProject}</TableHead>
                  <TableHead>{t.features.colTitle}</TableHead>
                  <TableHead>{t.features.colStatus}</TableHead>
                  <TableHead>{t.features.colPriority}</TableHead>
                  <TableHead>{t.features.colAssignee}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feature: any) => (
                  <TableRow key={feature.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {feature.project?.code}
                    </TableCell>
                    <TableCell className="font-semibold">{feature.title}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(feature.status) as any}>
                        {feature.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(feature.priority) as any}>
                        {feature.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{feature.assignee?.full_name || t.features.unassigned}</TableCell>
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
