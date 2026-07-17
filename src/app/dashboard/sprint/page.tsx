import { getFeatures } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const COLUMNS = [
  { id: "Backlog", title: "Backlog" },
  { id: "Planned", title: "Planned" },
  { id: "In Progress", title: "In Progress" },
  { id: "Code Review", title: "Review" },
  { id: "Testing", title: "Testing" },
  { id: "Ready", title: "Ready" },
  { id: "Released", title: "Released" },
]

export default async function SprintBoardPage() {
  const features = await getFeatures()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive"
      case "High": return "warning" 
      case "Medium": return "default"
      case "Low": return "secondary"
      default: return "outline"
    }
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sprint Board</h1>
        <p className="text-muted-foreground mt-1">
          Kanban view of all features by status.
        </p>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-h-[600px]">
          {COLUMNS.map((column) => {
            const columnFeatures = features.filter((f: any) => f.status === column.id)
            
            return (
              <div key={column.id} className="flex-shrink-0 w-80 bg-muted/50 rounded-lg flex flex-col">
                <div className="p-3 font-semibold text-sm flex justify-between items-center border-b">
                  {column.title}
                  <Badge variant="secondary">{columnFeatures.length}</Badge>
                </div>
                <div className="flex-1 p-2 space-y-3 overflow-y-auto">
                  {columnFeatures.map((feature: any) => (
                    <Card key={feature.id} className="cursor-pointer hover:border-primary transition-colors">
                      <CardHeader className="p-3 pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-mono text-muted-foreground">{feature.project?.code}</span>
                          <Badge variant={getPriorityColor(feature.priority) as any} className="text-[10px] px-1 py-0 h-4">
                            {feature.priority}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm leading-tight">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 text-xs text-muted-foreground">
                        <div className="flex justify-between items-center mt-2">
                          <span>{feature.feature_type}</span>
                          <span className="truncate max-w-[100px]">{feature.assignee?.full_name || "Unassigned"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
