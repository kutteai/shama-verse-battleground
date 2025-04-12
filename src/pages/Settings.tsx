
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  Clock, 
  Settings2, 
  ShieldAlert, 
  Tag, 
  DollarSign, 
  UserCheck, 
  Flag, 
  ToggleLeft,
  Webhooks,
  Users,
  Award,
  Filter
} from "lucide-react";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  
  // Challenge settings
  const [challengeDuration, setChallengeDuration] = useState(7);
  const [votingWindow, setVotingWindow] = useState(24);
  const [minChallengeFee, setMinChallengeFee] = useState(5);
  const [maxChallengeFee, setMaxChallengeFee] = useState(500);
  
  // Content moderation settings
  const [autoModeration, setAutoModeration] = useState(true);
  const [moderationLevel, setModerationLevel] = useState("medium");
  const [nsfwDetection, setNsfwDetection] = useState(true);
  const [profanityFilter, setProfanityFilter] = useState(true);
  
  // Monetization settings
  const [platformFeePercent, setPlatformFeePercent] = useState(10);
  const [creatorCutPercent, setCreatorCutPercent] = useState(90);
  const [minPayout, setMinPayout] = useState(25);
  const [payoutFrequency, setPayoutFrequency] = useState("monthly");
  
  // Referral settings
  const [referralActive, setReferralActive] = useState(false);
  const [referralReward, setReferralReward] = useState(5);
  const [referrerBonus, setReferrerBonus] = useState(10);
  
  // Feature flags
  const [premiumChallenges, setPremiumChallenges] = useState(true);
  const [teamBattles, setTeamBattles] = useState(false);
  const [liveStreaming, setLiveStreaming] = useState(false);
  const [nftMinting, setNftMinting] = useState(false);
  
  const handleSaveSettings = (section) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success(`${section} settings saved successfully!`);
    }, 800);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and parameters.</p>
        </div>
        
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Clock size={16} />
              <span>Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-2">
              <ShieldAlert size={16} />
              <span>Moderation</span>
            </TabsTrigger>
            <TabsTrigger value="monetization" className="flex items-center gap-2">
              <DollarSign size={16} />
              <span>Monetization</span>
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <UserCheck size={16} />
              <span>Referrals</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <ToggleLeft size={16} />
              <span>Features</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Webhooks size={16} />
              <span>API</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Challenge Settings */}
          <TabsContent value="challenges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Challenge Configuration</CardTitle>
                <CardDescription>Set default parameters for user challenges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="challenge-duration">Default Challenge Duration (days)</Label>
                    <span className="text-sm font-medium">{challengeDuration} days</span>
                  </div>
                  <Slider 
                    id="challenge-duration"
                    min={1} 
                    max={30} 
                    step={1}
                    value={[challengeDuration]}
                    onValueChange={(values) => setChallengeDuration(values[0])}
                  />
                  <p className="text-xs text-muted-foreground">How long challenges remain open by default</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="voting-window">Voting Window After Challenge Ends (hours)</Label>
                    <span className="text-sm font-medium">{votingWindow} hours</span>
                  </div>
                  <Slider 
                    id="voting-window"
                    min={1} 
                    max={72} 
                    step={1}
                    value={[votingWindow]}
                    onValueChange={(values) => setVotingWindow(values[0])}
                  />
                  <p className="text-xs text-muted-foreground">How long voting remains open after a challenge ends</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-challenge-fee">Minimum Challenge Fee ($)</Label>
                    <Input 
                      id="min-challenge-fee" 
                      type="number"
                      value={minChallengeFee}
                      onChange={(e) => setMinChallengeFee(parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">Minimum amount for paid challenges</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-challenge-fee">Maximum Challenge Fee ($)</Label>
                    <Input 
                      id="max-challenge-fee" 
                      type="number"
                      value={maxChallengeFee}
                      onChange={(e) => setMaxChallengeFee(parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">Maximum amount for paid challenges</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-challenge-extension">Allow Challenge Extension</Label>
                      <p className="text-xs text-muted-foreground">Let users extend challenge duration</p>
                    </div>
                    <Switch id="allow-challenge-extension" defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="require-challenger-approval">Require Challenger Approval</Label>
                      <p className="text-xs text-muted-foreground">User must approve challenge requests</p>
                    </div>
                    <Switch id="require-challenger-approval" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={() => handleSaveSettings("Challenge")} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Challenge Categories</CardTitle>
                <CardDescription>Manage available challenge categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {["Battle", "Showcase", "Freestyle", "Technical", "Theme", "Remix"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Switch id={`category-${category}`} defaultChecked />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={() => handleSaveSettings("Categories")} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Content Moderation Settings */}
          <TabsContent value="moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation Settings</CardTitle>
                <CardDescription>Configure automatic content moderation and filtering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-moderation">Auto-Moderation</Label>
                      <p className="text-xs text-muted-foreground">Automatically filter potentially inappropriate content</p>
                    </div>
                    <Switch 
                      id="auto-moderation" 
                      checked={autoModeration}
                      onCheckedChange={setAutoModeration} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="moderation-level">Moderation Strictness</Label>
                  <Select 
                    value={moderationLevel}
                    onValueChange={setModerationLevel}
                    disabled={!autoModeration}
                  >
                    <SelectTrigger id="moderation-level">
                      <SelectValue placeholder="Select strictness level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Flag only obvious violations</SelectItem>
                      <SelectItem value="medium">Medium - Balance between permissive and strict</SelectItem>
                      <SelectItem value="high">High - Strict content standards</SelectItem>
                      <SelectItem value="extreme">Extreme - Block anything potentially questionable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="nsfw-detection">NSFW Content Detection</Label>
                      <p className="text-xs text-muted-foreground">Automatically detect and flag adult content</p>
                    </div>
                    <Switch 
                      id="nsfw-detection" 
                      checked={nsfwDetection}
                      onCheckedChange={setNsfwDetection}
                      disabled={!autoModeration}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="profanity-filter">Profanity Filter</Label>
                      <p className="text-xs text-muted-foreground">Filter out profanity in text content</p>
                    </div>
                    <Switch 
                      id="profanity-filter" 
                      checked={profanityFilter}
                      onCheckedChange={setProfanityFilter}
                      disabled={!autoModeration}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="flagged-action">Action for Flagged Content</Label>
                  <Select defaultValue="queue">
                    <SelectTrigger id="flagged-action">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="queue">Add to moderation queue (requires approval)</SelectItem>
                      <SelectItem value="hide">Hide until approved</SelectItem>
                      <SelectItem value="block">Block permanently</SelectItem>
                      <SelectItem value="warn">Display with warning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={() => handleSaveSettings("Moderation")} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Monetization Settings */}
          <TabsContent value="monetization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Fee Configuration</CardTitle>
                <CardDescription>Set platform fees and revenue sharing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                      <span className="text-sm font-medium">{platformFeePercent}%</span>
                    </div>
                    <Slider 
                      id="platform-fee"
                      min={0} 
                      max={50} 
                      step={1}
                      value={[platformFeePercent]}
                      onValueChange={(values) => {
                        setPlatformFeePercent(values[0]);
                        setCreatorCutPercent(100 - values[0]);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">Percentage retained by platform from transactions</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="creator-cut">Creator Cut (%)</Label>
                      <span className="text-sm font-medium">{creatorCutPercent}%</span>
                    </div>
                    <Slider 
                      id="creator-cut"
                      min={50} 
                      max={100} 
                      step={1}
                      value={[creatorCutPercent]}
                      onValueChange={(values) => {
                        setCreatorCutPercent(values[0]);
                        setPlatformFeePercent(100 - values[0]);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">Percentage given to content creators</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min-payout">Minimum Payout Amount ($)</Label>
                  <Input 
                    id="min-payout" 
                    type="number"
                    value={minPayout}
                    onChange={(e) => setMinPayout(parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">Minimum balance required for withdrawal</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payout-frequency">Default Payout Frequency</Label>
                  <Select 
                    id="payout-frequency"
                    value={payoutFrequency}
                    onValueChange={setPayoutFrequency}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stripe-mode">Stripe Mode</Label>
                  <Select defaultValue="test">
                    <SelectTrigger id="stripe-mode">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Test Mode</SelectItem>
                      <SelectItem value="live">Live Mode</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Warning: Only switch to Live mode in production</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={() => handleSaveSettings("Monetization")} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Referrals Settings */}
          <TabsContent value="referrals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Referral Program Settings</CardTitle>
                <CardDescription>Configure the user referral program</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="referral-active">Enable Referral Program</Label>
                      <p className="text-xs text-muted-foreground">Allow users to invite others with incentives</p>
                    </div>
                    <Switch 
                      id="referral-active" 
                      checked={referralActive}
                      onCheckedChange={setReferralActive} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="referral-reward">New User Reward ($)</Label>
                  <Input 
                    id="referral-reward" 
                    type="number"
                    value={referralReward}
                    onChange={(e) => setReferralReward(parseInt(e.target.value))}
                    disabled={!referralActive}
                  />
                  <p className="text-xs text-muted-foreground">Credit given to new users who sign up via referral</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="referrer-bonus">Referrer Bonus ($)</Label>
                  <Input 
                    id="referrer-bonus" 
                    type="number"
                    value={referrerBonus}
                    onChange={(e) => setReferrerBonus(parseInt(e.target.value))}
                    disabled={!referralActive}
                  />
                  <p className="text-xs text-muted-foreground">Credit given to existing users who refer others</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="referral-eligibility">Referral Eligibility</Label>
                  <Select defaultValue="all" disabled={!referralActive}>
                    <SelectTrigger id="referral-eligibility">
                      <SelectValue placeholder="Select eligibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active Users Only</SelectItem>
                      <SelectItem value="challenge">Users with Challenge History</SelectItem>
                      <SelectItem value="paid">Users who made purchases</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={() => handleSaveSettings("Referrals")} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Feature Flag Settings */}
          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature Flag Management</CardTitle>
                <CardDescription>Enable or disable platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="premium-challenges" className="text-base font-medium">Premium Challenges</Label>
                      <p className="text-sm text-muted-foreground">Allow higher-value paid challenge battles</p>
                    </div>
                    <Switch 
                      id="premium-challenges" 
                      checked={premiumChallenges}
                      onCheckedChange={setPremiumChallenges} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="team-battles" className="text-base font-medium">Team Battles</Label>
                      <p className="text-sm text-muted-foreground">Allow users to form teams for challenges</p>
                    </div>
                    <Switch 
                      id="team-battles" 
                      checked={teamBattles}
                      onCheckedChange={setTeamBattles} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="live-streaming" className="text-base font-medium">Live Streaming</Label>
                      <p className="text-sm text-muted-foreground">Allow real-time freestyle performances</p>
                    </div>
                    <Switch 
                      id="live-streaming" 
                      checked={liveStreaming}
                      onCheckedChange={setLiveStreaming} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="nft-minting" className="text-base font-medium">NFT Minting</Label>
                      <p className="text-sm text-muted-foreground">Allow users to mint performances as NFTs</p>
                    </div>
                    <Switch 
                      id="nft-minting" 
                      checked={nftMinting}
                      onCheckedChange={setNftMinting} 
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Experimental Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="ai-judging" className="text-base font-medium">AI-Assisted Judging</Label>
                        <p className="text-sm text-muted-foreground">Use AI to help evaluate challenge performances</p>
                      </div>
                      <Switch id="ai-judging" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="beat-maker" className="text-base font-medium">Built-in Beat Maker</Label>
                        <p className="text-sm text-muted-foreground">Allow users to create beats on platform</p>
                      </div>
                      <Switch id="beat-maker" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={() => handleSaveSettings("Features")} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* API Settings */}
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Manage API keys and external services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="stripe-key">Stripe API Key</Label>
                  <Input id="stripe-key" type="password" value="sk_test_••••••••••••••••••••••••" readOnly />
                  <p className="text-xs text-muted-foreground">For payment processing (hidden for security)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aws-key">AWS S3 Key</Label>
                  <Input id="aws-key" type="password" value="AKIA••••••••••••••••" readOnly />
                  <p className="text-xs text-muted-foreground">For media storage (hidden for security)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input id="openai-key" type="password" value="sk-••••••••••••••••••••••••" readOnly />
                  <p className="text-xs text-muted-foreground">For AI moderation features (hidden for security)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input id="webhook-url" type="text" defaultValue="https://api.shamachallenge.com/webhook" />
                  <p className="text-xs text-muted-foreground">For receiving external service notifications</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Regenerate Keys</Button>
                <Button onClick={() => handleSaveSettings("API")} disabled={loading}>
                  {loading ? "Saving..." : "Save Keys"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
