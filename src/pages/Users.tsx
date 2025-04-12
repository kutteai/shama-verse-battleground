
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Ban, 
  Mail, 
  AlertCircle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock user data
const mockUsers = [
  { 
    id: 1, 
    username: "MicDropKing", 
    email: "micdropking@example.com", 
    followers: 15420, 
    challenges: 98, 
    rating: 4.9, 
    status: "active" 
  },
  { 
    id: 2, 
    username: "FlowMaster", 
    email: "flowmaster@example.com", 
    followers: 12890, 
    challenges: 76, 
    rating: 4.7, 
    status: "active" 
  },
  { 
    id: 3, 
    username: "BeatSlayer", 
    email: "beatslayer@example.com", 
    followers: 11250, 
    challenges: 64, 
    rating: 4.8, 
    status: "active" 
  },
  { 
    id: 4, 
    username: "RhymeQueen", 
    email: "rhymequeen@example.com", 
    followers: 10780, 
    challenges: 58, 
    rating: 4.6, 
    status: "suspended" 
  },
  { 
    id: 5, 
    username: "VerseBeast", 
    email: "versebeast@example.com", 
    followers: 8950, 
    challenges: 42, 
    rating: 4.5, 
    status: "active" 
  },
  { 
    id: 6, 
    username: "LyricLegend", 
    email: "lyriclegend@example.com", 
    followers: 7840, 
    challenges: 38, 
    rating: 4.7, 
    status: "active" 
  },
  { 
    id: 7, 
    username: "CypherCrusher", 
    email: "cyphercrusher@example.com", 
    followers: 6950, 
    challenges: 31, 
    rating: 4.4, 
    status: "warned" 
  },
  { 
    id: 8, 
    username: "SonicStyler", 
    email: "sonicstyle@example.com", 
    followers: 5820, 
    challenges: 29, 
    rating: 4.3, 
    status: "active" 
  },
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "suspended":
        return "bg-red-500";
      case "warned":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage platform users and their accounts.</p>
        </div>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Search users..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter size={16} />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
                <Button>Add User</Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Followers</TableHead>
                    <TableHead className="hidden md:table-cell">Challenges</TableHead>
                    <TableHead className="hidden sm:table-cell">Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.followers.toLocaleString()}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.challenges}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="flex items-center">
                          {user.rating}
                          <span className="text-yellow-500 ml-1">★</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={`h-2 w-2 rounded-full ${getStatusColor(user.status)} mr-2`}></span>
                          <Badge variant="outline" className="capitalize">
                            {user.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer flex items-center">
                              <Mail className="mr-2 h-4 w-4" />
                              <span>Contact User</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-amber-500 flex items-center">
                              <AlertCircle className="mr-2 h-4 w-4" />
                              <span>Warn User</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-500 flex items-center">
                              <Ban className="mr-2 h-4 w-4" />
                              <span>Suspend Account</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredUsers.length === 0 && (
                <div className="py-6 text-center text-muted-foreground">
                  No users found matching your search criteria.
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing <strong>{filteredUsers.length}</strong> of <strong>{mockUsers.length}</strong> users
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Users;
