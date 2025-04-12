
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertCircle, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FlaggedMessage {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  reason: string;
  timestamp: string;
}

interface MessageModerationProps {
  flaggedMessages: FlaggedMessage[];
}

const MessageModeration = ({ flaggedMessages }: MessageModerationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Shield className="h-5 w-5 mr-2 text-red-500" />
          Flagged Messages
        </CardTitle>
        <CardDescription>
          Review messages that have been flagged for inappropriate content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {flaggedMessages.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No flagged messages to review</p>
          ) : (
            flaggedMessages.map((message) => (
              <div key={message.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium">
                      From: <span className="text-muted-foreground">{message.sender}</span> 
                      <span className="mx-2">→</span>
                      To: <span className="text-muted-foreground">{message.recipient}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                  </div>
                  <Badge variant="destructive" className="flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {message.reason}
                  </Badge>
                </div>
                <p className="text-sm mt-2 p-2 bg-muted rounded-md">{message.content}</p>
                <div className="flex justify-end gap-2 mt-2">
                  <button className="text-xs text-blue-500 hover:underline">Ignore</button>
                  <button className="text-xs text-yellow-500 hover:underline">Warn User</button>
                  <button className="text-xs text-red-500 hover:underline">Block User</button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageModeration;
