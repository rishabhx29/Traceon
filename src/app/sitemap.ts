import type { MetadataRoute } from "next";
import dbConnect from "@/lib/db/connection";
import { ProfileAnalysis } from "@/lib/db/models/ProfileAnalysis";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/home`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/repo`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/profile-analytics`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/docs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    await dbConnect();
    const profiles = await ProfileAnalysis.find({})
      .select("username lastAnalyzedAt")
      .lean();

    const profileRoutes: MetadataRoute.Sitemap = profiles
      .filter((profile) => profile.username)
      .map((profile) => ({
        url: `${baseUrl}/profile/${profile.username}`,
        lastModified: profile.lastAnalyzedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }));

    return [...staticRoutes, ...profileRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap:", error);
    // Still return static routes if the database is unavailable
    return staticRoutes;
  }
}
