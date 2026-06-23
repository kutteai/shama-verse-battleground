import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface NotAvailablePanelProps {
  feature: string
  reason: string
  className?: string
}

// Placeholder for features with no backing data/model yet — kept visible as
// "Coming soon" rather than hidden or removed, so the gap stays honest and visible.
const NotAvailablePanel = ({ feature, reason, className }: NotAvailablePanelProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center text-muted-foreground">
          <Clock className="h-5 w-5 mr-2" />
          {feature}
        </CardTitle>
        <CardDescription>Coming soon</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{reason}</p>
      </CardContent>
    </Card>
  )
}

export default NotAvailablePanel
