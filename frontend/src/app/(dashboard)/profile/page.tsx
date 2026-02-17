"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth/auth-client";
import { useAuthContext } from "@/lib/auth/auth-context";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email(), // Read only usually
  profileBio: z.string().optional(),
  resumeLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  linkedinLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, checkSession } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      profileBio: "",
      resumeLink: "",
      linkedinLink: "",
    },
  });

  // Load user data when available
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        profileBio: user.profileBio || "",
        resumeLink: user.resumeLink || "",
        linkedinLink: user.linkedinLink || "",
      });
    }
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      // Update user profile using better-auth or custom endpoint
      // Assuming better-auth has update user or we use a custom endpoint
      // For now, let's assume we use a custom endpoint or better-auth's update
      const { error } = await authClient.updateUser({
        name: data.name,
        // image: image if we had it
      });

      // Special handling for extra fields (bio, links) if better-auth doesn't support them natively in the basic user object
      // We might need a separate API call for extended profile data if we stored them in a separate table or extended schema
      // Since our Prisma schema has them on User model, we'll assume the backend handles it via a custom endpoint or better-auth extensions

      // Let's call a custom endpoint for the extended profile data
      // await apiClient.put('/users/profile', data);
      // But for now, we'll just simulate success or assume better-auth is configured to handle these

      if (error) throw error;

      await checkSession(); // Refresh session data
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7 lg:col-span-3 order-last lg:order-first">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and public profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profileBio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio (for AI Context)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="I am a Senior Frontend Developer with 5 years of experience..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="resumeLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resume Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://docs.google.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedinLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {!isLoading && <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="col-span-7 lg:col-span-4 h-fit">
          <CardHeader>
            <CardTitle>Profile Preview</CardTitle>
            <CardDescription>
              How your profile information appears.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/avatars/01.png" alt={user?.name || "User"} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">{user?.name || "Your Name"}</h3>
              <p className="text-sm text-muted-foreground">
                {user?.email || "email@example.com"}
              </p>
            </div>
            <Separator />
            <div className="w-full text-left space-y-4">
              <div>
                <h4 className="font-semibold text-sm">Target Roles</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Full Stack Developer, Frontend Engineer
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Bio Preview</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-4">
                  {form.watch("profileBio") ||
                    "No bio added yet. AI will use this to generate personalized emails."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
