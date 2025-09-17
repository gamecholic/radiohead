import { getCategories, getStationsByCategory } from "@/lib/api";
import { Carousel } from "@/components/carousel";
import { Station } from "@/lib/types";

export const revalidate = 7 * 24 * 60 * 60; // Revalidate every week

export async function CategorySection() {
  try {
    // Fetch categories
    const categories = await getCategories();

    // Fetch stations for each category
    const stationsByCategory: Record<string, Station[]> = {};
    for (const category of categories) {
      const categoryStations = await getStationsByCategory(category.name);
      stationsByCategory[category.name] = categoryStations;
    }

    // Filter out categories with no stations
    const categoriesWithStations = categories.filter(
      (c) => stationsByCategory[c.name]?.length
    );

    if (categoriesWithStations.length === 0) {
      return null;
    }

    return (
      <section className="w-full">
        {categoriesWithStations.map((category) => (
          <div
            key={category.name}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{
              animationDelay: `${
                categoriesWithStations.indexOf(category) * 100
              }ms`,
            }}
          >
            <Carousel
              title={category.name}
              stations={stationsByCategory[category.name] || []}
            />
          </div>
        ))}
      </section>
    );
  } catch (error) {
    console.error("Error loading category section:", error);
    return null;
  }
}
