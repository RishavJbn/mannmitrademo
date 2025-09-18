import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Mic, Video, Wind } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { PlaceHolderImages } from "@/lib/placeholder-images";

const resourceCategories = [
  { title: "Breathing Exercises", icon: Wind, imageId: "resources-breathing" },
  { title: "Meditation Audio", icon: Mic, imageId: "resources-yoga" },
  { title: "Helpful Articles", icon: BookOpen, imageId: "resources-journaling" },
  { title: "Informative Videos", icon: Video, imageId: "home-calm-illustration" },
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Resource Library</h1>
        <p className="text-muted-foreground mt-2">Tools and knowledge to support your journey.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resourceCategories.map((category) => {
          const resourceImage = PlaceHolderImages.find(p => p.id === category.imageId);
          return (
            <Link href="#" key={category.title}>
              <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <CardHeader className="p-0">
                  {resourceImage && (
                    <Image
                      src={resourceImage.imageUrl}
                      alt={resourceImage.description}
                      width={400}
                      height={300}
                      className="object-cover w-full h-40 group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={resourceImage.imageHint}
                    />
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <category.icon className="text-primary h-5 w-5" />
                    <span>{category.title}</span>
                  </CardTitle>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

       <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold font-headline">More Coming Soon</h2>
            <p className="text-muted-foreground mt-2">We are constantly working to bring you more resources in English and Hindi.</p>
        </div>
    </div>
  );
}
