import { prisma } from "@/lib/prisma";
import { serializeLifeStageTags } from "@/lib/constants";
import AllCoursesMap, { type MapCourse } from "@/components/AllCoursesMap";
import BottomNav from "@/components/layout/BottomNav";

async function getMapData(): Promise<MapCourse[]> {
  const courses = await prisma.course.findMany({
    include: {
      courseItems: {
        include: { place: true },
        orderBy: { order: "asc" },
      },
    },
  });

  return courses
    .filter((c) => c.courseItems.length > 0)
    .map((c) => ({
      id: c.id,
      title: c.title,
      theme: c.theme,
      region: c.region,
      lifeCycleTags: serializeLifeStageTags(c.lifeCycleTags),
      places: c.courseItems.map(({ place }) => ({
        id: place.id,
        name: place.name,
        lat: place.lat,
        lng: place.lng,
        address: place.address,
      })),
    }));
}

export default async function MapPage() {
  const courses = await getMapData();

  return (
    <>
      <div className="flex flex-col" style={{ height: "100dvh" }}>
        <header className="flex-none bg-white px-4 pt-12 pb-4 lg:pt-6 border-b border-gray-100 z-40 flex items-center justify-between" style={{ height: 64 }}>
          <h1 className="text-lg font-bold text-gray-900">코스 지도</h1>
          <span className="text-sm text-gray-400">{courses.length}개 코스</span>
        </header>

        <div className="flex-1 overflow-hidden">
          <AllCoursesMap courses={courses} />
        </div>
      </div>

      <BottomNav />
    </>
  );
}
