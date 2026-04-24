"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import { z } from "zod";

import { ProfileSkeleton } from "@/components/shared/skeletons";
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
import { swrFetcher } from "@/lib/api/client";
import { usersApi } from "@/lib/api/users";
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
  portfolioLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  resumeContent: z.string().optional(),
  skills: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  certifications: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, checkSession } = useAuthContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: profileData,
    isLoading: isProfileLoading,
    mutate: mutateProfile,
  } = useSWR("/users/profile", swrFetcher);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      profileBio: "",
      resumeLink: "",
      linkedinLink: "",
      portfolioLink: "",
      resumeContent: "",
      skills: "",
      experience: "",
      education: "",
      certifications: "",
    },
  });

  // Load profile data into form when fetched
  useEffect(() => {
    if (profileData) {
      form.reset({
        name: profileData.name || "",
        email: profileData.email || "",
        profileBio: profileData.profileBio || "",
        resumeLink: profileData.resumeLink || "",
        linkedinLink: profileData.linkedinLink || "",
        portfolioLink: profileData.portfolioLink || "",
        resumeContent: profileData.resumeContent || "",
        skills: profileData.skills || "",
        experience: profileData.experience || "",
        education: profileData.education || "",
        certifications: profileData.certifications || "",
      });
    } else if (!isProfileLoading && user) {
      // Fallback to user from context if SWR fails or is empty
      form.reset({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [profileData, isProfileLoading, user, form]);

  async function onSubmit(data: ProfileFormValues) {
    setIsUpdating(true);
    try {
      await usersApi.updateProfile(data);
      await mutateProfile(); // Refresh local SWR cache
      await checkSession(); // Refresh session data
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg || "Failed to update profile");
    } finally {
      setIsUpdating(false);
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

  if (isProfileLoading && !profileData) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
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
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <FormField
                      control={form.control}
                      name="portfolioLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://yourportfolio.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold italic">
                      AI Context Data (Resume Details)
                    </h3>

                    <FormField
                      control={form.control}
                      name="resumeContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Resume Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste your complete resume text here..."
                              className="min-h-[200px] font-mono text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="React, Node.js, TypeScript..."
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
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience Summary</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="5+ years of full-stack development..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="education"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Education</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="BS in Computer Science..."
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
                        name="certifications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Certifications</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="AWS Certified Developer..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isUpdating}
                      className="px-8"
                    >
                      {isUpdating && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {!isUpdating && <Save className="mr-2 h-4 w-4" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-fit sticky top-6">
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
                <h3 className="text-xl font-bold font-mono">
                  {form.watch("name") || user?.name || "Your Name"}
                </h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {user?.email || "email@example.com"}
                </p>
              </div>
              <Separator />
              <div className="w-full text-left space-y-4">
                <div>
                  <h4 className="font-semibold text-sm">Bio Preview</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-6 text-justify">
                    {form.watch("profileBio") ||
                      "No bio added yet. AI will use this to generate personalized emails."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
