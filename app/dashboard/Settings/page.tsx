"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
<<<<<<< HEAD
import DashboardLayout from "../SavedPage/layout";
=======
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b

export default function AccountSettingsPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true);

  const handleSave = () => {
    console.log({ name, email, password, notifyEmail });
    alert("Settings saved!");
  };

  return (
<<<<<<< HEAD
    <DashboardLayout>
=======
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your profile, security, and notification preferences.
        </p>
      </div>

      {/* Profile Section */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between border rounded-lg p-4">
            <span className="text-sm text-gray-700 font-medium">Email Notifications</span>
            <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-6 py-2 text-base">
          Save Changes
        </Button>
      </div>
    </div>
<<<<<<< HEAD
    </DashboardLayout>
=======
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b
  );
}
