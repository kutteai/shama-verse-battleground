
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Flag, AlertTriangle, CheckCircle, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  receiver: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  flagged: boolean;
  flagReason?: string;
}

interface MessageModerationProps {
  messages: Message[];
  flaggedMessages: Message[];
}

const MessageModeration = ({ messages, flaggedMessages }: MessageModerationProps) => {
  const [activeMessages, setActiveMessages] = useState<Message[]>(messages);
  const [showFlagged, setShowFlagged] = useState<boolean>(false);

  const handleTabChange = (value: string) => {
    if (value === "flagged") {
      setActiveMessages(flaggedMessages);
      setShowFlagged(true);
    } else {
      setActiveMessages(messages);
      setShowFlagged(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          Message Moderation
        </CardTitle>
        <CardDescription>
          Monitor and moderate conversations between users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent Messages</TabsTrigger>
            <TabsTrigger value="flagged">
              Flagged Messages
              {flaggedMessages.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {flaggedMessages.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="mt-4 space-y-4">
            {activeMessages.map((message) => (
              <MessageItem 
                key={message.id} 
                message={message} 
                showFlagReason={false} 
              />
            ))}
          </TabsContent>
          <TabsContent value="flagged" className="mt-4 space-y-4">
            {flaggedMessages.map((message) => (
              <MessageItem 
                key={message.id} 
                message={message} 
                showFlagReason={true} 
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const MessageItem = ({ 
  message, 
  showFlagReason 
}: { 
  message: Message; 
  showFlagReason: boolean;
}) => {
  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
            <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{message.sender.name}</p>
              <span className="text-xs text-muted-foreground">@{message.sender.username}</span>
              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
            </div>
            <p className="text-sm mt-1">{message.content}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">To:</span>
              <Avatar className="h-5 w-5">
                <AvatarImage src={message.receiver.avatar} alt={message.receiver.name} />
                <AvatarFallback>{message.receiver.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{message.receiver.name}</span>
            </div>
            {showFlagReason && message.flagReason && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-xs text-red-600">
                  Flagged for: {message.flagReason}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3 justify-end">
        <Button size="sm" variant="outline" className="h-8 text-xs flex items-center">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approve
        </Button>
        {message.flagged && (
          <Button size="sm" variant="outline" className="h-8 text-xs flex items-center">
            <Flag className="h-3 w-3 mr-1" />
            Mark as Reviewed
          </Button>
        )}
        <Button size="sm" variant="outline" className="h-8 text-xs flex items-center">
          <X className="h-3 w-3 mr-1" />
          Block
        </Button>
      </div>
    </div>
  );
};

export default MessageModeration;
