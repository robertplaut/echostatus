// file: src/app/(dashboard)/users/create/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser } from "@/app/(dashboard)/users/actions";

const TEAMS = ["PMO", "PRODUCT", "ENGINEERING"];
const ROLES = [
  "Engineer",
  "Program Manager",
  "Senior Director of Engineering",
  "Senior Product Manager",
  "VP of PMO",
  "VP of Product",
];

export default function CreateUserPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <form action={createUser}>
        <Card>
          <CardHeader>
            <CardTitle>Create User</CardTitle>
            <CardDescription>
              Fill in the form below to create a new user account. Fields marked
              with <span className="text-destructive">*</span> are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-name">
                  Display Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="display-name"
                  name="display-name"
                  placeholder="Enter display name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Must be lowercase with no spaces or special characters.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">
                  Team <span className="text-destructive">*</span>
                </Label>
                <Select name="team" required>
                  <SelectTrigger id="team">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAMS.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select name="role" required>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="github-username">GitHub Username</Label>
                <Input
                  id="github-username"
                  name="github-username"
                  placeholder="Enter GitHub username"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Create User</Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
