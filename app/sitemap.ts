import type { MetadataRoute } from "next";
import { getFindings } from "@/lib/findings";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];

  const baseUrl = new URL(siteUrl);
  const lastModified = new Date();

  return [
    { url: new URL("/", baseUrl).toString(), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: new URL("/research", baseUrl).toString(), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: new URL("/writing", baseUrl).toString(), lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...getFindings().map((finding) => ({
      url: new URL(`/research/${finding.slug}`, baseUrl).toString(),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
