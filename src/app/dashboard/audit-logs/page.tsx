"use client"

import { useEffect, useState } from "react"
import {
  ClipboardList,
  RefreshCw,
  Search,
  ChevronRight,
  Activity,
  User,
  Clock,
  Flag,
  AlertCircle,
  CheckCircle2,
  Pencil,
  PlusCircle,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Settings2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "@/lib/i18n/context"

interface AuditLog {
  id: string
  flag_id: string | null
  action: string
  performed_by: string
  old_value: any
  new_value: any
  timestamp: string
  flag?: { key: string } | null
}

function getActionIcon(action: string) {
  const a = action.toLowerCase()
  if (a.includes("created") || a.includes("create")) return <PlusCircle className="w-4 h-4 text-green-500" />
  if (a.includes("deleted") || a.includes("delete")) return <Trash2 className="w-4 h-4 text-red-500" />
  if (a.includes("enabled")) return <ToggleRight className="w-4 h-4 text-blue-500" />
  if (a.includes("disabled")) return <ToggleLeft className="w-4 h-4 text-orange-500" />
  if (a.includes("rollout")) return <Activity className="w-4 h-4 text-purple-500" />
  if (a.includes("override")) return <Settings2 className="w-4 h-4 text-indigo-500" />
  if (a.includes("updated") || a.includes("update")) return <Pencil className="w-4 h-4 text-yellow-500" />
  return <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
}

function getActionBadge(action: string) {
  const a = action.toLowerCase()
  if (a.includes("deleted") || a.includes("delete")) return "destructive"
  if (a.includes("created") || a.includes("create")) return "default"
  if (a.includes("enabled")) return "secondary"
  return "outline"
}

export default function AuditLogPage() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filtered, setFiltered] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/audit-logs?limit=200")
      if (!res.ok) throw new Error("Failed to load audit logs")
      const data = await res.json()
      setLogs(data)
      setFiltered(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(logs)
      return
    }
    const q = search.toLowerCase()
    setFiltered(
      logs.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.performed_by.toLowerCase().includes(q) ||
          (l.flag?.key ?? "").toLowerCase().includes(q)
      )
    )
  }, [search, logs])

  const formatDate = (ts: string) => {
    const d = new Date(ts)
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return t.auditLogs.justNow
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ClipboardList className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.auditLogs.title}</h1>
            <p className="text-sm text-muted-foreground">
              {t.auditLogs.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4 bg-card flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg"><Activity className="w-5 h-5 text-blue-500" /></div>
          <div>
            <div className="text-2xl font-bold">{logs.length}</div>
            <div className="text-xs text-muted-foreground">{t.auditLogs.totalEvents}</div>
          </div>
        </div>
        <div className="border rounded-xl p-4 bg-card flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg"><PlusCircle className="w-5 h-5 text-green-500" /></div>
          <div>
            <div className="text-2xl font-bold">{logs.filter(l => l.action.toLowerCase().includes("creat")).length}</div>
            <div className="text-xs text-muted-foreground">{t.auditLogs.created}</div>
          </div>
        </div>
        <div className="border rounded-xl p-4 bg-card flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg"><Trash2 className="w-5 h-5 text-red-500" /></div>
          <div>
            <div className="text-2xl font-bold">{logs.filter(l => l.action.toLowerCase().includes("delet")).length}</div>
            <div className="text-xs text-muted-foreground">{t.auditLogs.deleted}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="audit-search"
            placeholder={t.auditLogs.searchPlaceholder}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading} id="audit-refresh-btn">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {t.auditLogs.refresh}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-destructive border border-destructive/30 bg-destructive/10 rounded-lg p-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-xl overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-10"></TableHead>
              <TableHead>{t.auditLogs.colAction}</TableHead>
              <TableHead>{t.auditLogs.colFlag}</TableHead>
              <TableHead>{t.auditLogs.colPerformedBy}</TableHead>
              <TableHead>{t.auditLogs.colTimestamp}</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                  <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">{t.auditLogs.noLogsFound}</p>
                  <p className="text-sm mt-1">{t.auditLogs.noLogsDesc}</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedLog(log)}
                >
                  <TableCell>{getActionIcon(log.action)}</TableCell>
                  <TableCell>
                    <Badge variant={getActionBadge(log.action) as any} className="capitalize">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.flag?.key ? (
                      <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                        <Flag className="w-3 h-3" />
                        {log.flag.key}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      {log.performed_by}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{timeAgo(log.timestamp)}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLog && getActionIcon(selectedLog.action)}
              {t.auditLogs.detailTitle}
            </DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.auditLogs.labelAction}</p>
                  <Badge variant={getActionBadge(selectedLog.action) as any} className="capitalize">
                    {selectedLog.action}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.auditLogs.labelPerformedBy}</p>
                  <p className="font-medium flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {selectedLog.performed_by}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.auditLogs.labelFlag}</p>
                  <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {selectedLog.flag?.key ?? "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.auditLogs.labelTimestamp}</p>
                  <p className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {formatDate(selectedLog.timestamp)}
                  </p>
                </div>
              </div>

              {selectedLog.old_value && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.auditLogs.labelOldValue}</p>
                  <pre className="bg-muted rounded-lg p-3 text-xs overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.old_value, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.new_value && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.auditLogs.labelNewValue}</p>
                  <pre className="bg-muted rounded-lg p-3 text-xs overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.new_value, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
