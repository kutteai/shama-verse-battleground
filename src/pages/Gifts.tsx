
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Mic, Crown, Award, Flame, Star, Heart, Gem, Plus, Trash2, Edit, Search } from "lucide-react";
import { toast } from "sonner";

// Mock gift data
const mockGifts = [
  { 
    id: 1, 
    name: "Golden Mic", 
    icon: <Mic className="h-8 w-8 text-yellow-500" />, 
    value: 50, 
    description: "Show support with this high-value golden microphone.", 
    popularity: 85
  },
  { 
    id: 2, 
    name: "Crown", 
    icon: <Crown className="h-8 w-8 text-purple-500" />, 
    value: 100, 
    description: "Crown your favorite artist with this royal gift.", 
    popularity: 92
  },
  { 
    id: 3, 
    name: "Trophy", 
    icon: <Award className="h-8 w-8 text-blue-500" />, 
    value: 75, 
    description: "Award excellence with this prestigious trophy.", 
    popularity: 78
  },
  { 
    id: 4, 
    name: "Fire", 
    icon: <Flame className="h-8 w-8 text-red-500" />, 
    value: 20, 
    description: "Let them know their freestyle is fire!", 
    popularity: 95
  },
  { 
    id: 5, 
    name: "Star", 
    icon: <Star className="h-8 w-8 text-yellow-400" />, 
    value: 30, 
    description: "Show appreciation with a shining star.", 
    popularity: 88
  },
  { 
    id: 6, 
    name: "Heart", 
    icon: <Heart className="h-8 w-8 text-pink-500" />, 
    value: 15, 
    description: "Send love with this heartfelt gift.", 
    popularity: 91
  },
  { 
    id: 7, 
    name: "Diamond", 
    icon: <Gem className="h-8 w-8 text-cyan-400" />, 
    value: 200, 
    description: "The ultimate premium gift for the best of the best.", 
    popularity: 70
  }
];

// Gift stats data
const giftTransactions = [
  { month: "Jan", transactions: 12500 },
  { month: "Feb", transactions: 14200 },
  { month: "Mar", transactions: 15800 },
  { month: "Apr", transactions: 17900 },
  { month: "May", transactions: 19500 },
  { month: "Jun", transactions: 22100 },
];

const Gifts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddGiftOpen, setIsAddGiftOpen] = useState(false);
  const [newGift, setNewGift] = useState({
    name: "",
    value: "",
    description: ""
  });

  const filteredGifts = mockGifts.filter(gift => 
    gift.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddGift = () => {
    // Add validation here in a real app
    toast.success(`New gift "${newGift.name}" added successfully!`);
    setIsAddGiftOpen(false);
    setNewGift({ name: "", value: "", description: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gifts Management</h1>
          <p className="text-muted-foreground">Create and manage gift options and monetization.</p>
        </div>

        <Tabs defaultValue="gifts" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="gifts">Gift Items</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="settings">Pricing Settings</TabsTrigger>
            </TabsList>
            
            <Dialog open={isAddGiftOpen} onOpenChange={setIsAddGiftOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Add New Gift
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Gift</DialogTitle>
                  <DialogDescription>
                    Add a new gift option for users to purchase and send.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newGift.name}
                      onChange={(e) => setNewGift({...newGift, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">
                      Value ($)
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      value={newGift.value}
                      onChange={(e) => setNewGift({...newGift, value: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={newGift.description}
                      onChange={(e) => setNewGift({...newGift, description: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddGiftOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddGift}>Add Gift</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="gifts" className="space-y-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search gifts..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGifts.map((gift) => (
                <Card key={gift.id} className="hoverable-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-lg">{gift.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 bg-muted rounded-lg">
                        {gift.icon}
                      </div>
                      <div>
                        <div className="text-2xl font-bold">${gift.value}</div>
                        <div className="text-sm text-muted-foreground">
                          Popularity: {gift.popularity}%
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{gift.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      ID: {gift.id}
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gift Transactions</CardTitle>
                  <CardDescription>Total gift purchases per month</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {/* Simplified chart for the sake of the example */}
                  <div className="h-full flex items-end gap-4 pt-10">
                    {giftTransactions.map((item, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-shama-primary rounded-t-md" 
                          style={{ 
                            height: `${(item.transactions / 25000) * 100}%`,
                            minHeight: '20px' 
                          }}
                        ></div>
                        <span className="text-xs font-medium">{item.month}</span>
                        <span className="text-xs text-muted-foreground">${(item.transactions/1000).toFixed(1)}k</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Gifted Items</CardTitle>
                  <CardDescription>Most popular gifts by transaction volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockGifts
                      .sort((a, b) => b.popularity - a.popularity)
                      .slice(0, 5)
                      .map((gift, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-lg">
                            {gift.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{gift.name}</div>
                            <div className="text-sm text-muted-foreground">${gift.value} each</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{gift.popularity}%</div>
                            <div className="text-sm text-muted-foreground">popularity</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Full Report</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Gift Pricing Settings</CardTitle>
                <CardDescription>Configure monetization and platform fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                    <Input id="platform-fee" defaultValue="10" type="number" min="0" max="100" />
                    <p className="text-xs text-muted-foreground">Percentage retained by platform</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creator-cut">Creator Cut (%)</Label>
                    <Input id="creator-cut" defaultValue="90" type="number" min="0" max="100" />
                    <p className="text-xs text-muted-foreground">Percentage given to content creators</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-withdrawal">Minimum Withdrawal Amount ($)</Label>
                  <Input id="min-withdrawal" defaultValue="25" type="number" min="0" />
                  <p className="text-xs text-muted-foreground">Minimum balance required for withdrawal</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payout-schedule">Default Payout Schedule</Label>
                  <select id="payout-schedule" className="w-full border p-2 rounded-md">
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="monthly" selected>Monthly</option>
                  </select>
                  <p className="text-xs text-muted-foreground">Default schedule for automatic payouts</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Gifts;
