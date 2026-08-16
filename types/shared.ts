/** GET /api/courses 응답 아이템 */
export type CourseListItem = {
  id: number;
  title: string;
  description: string | null;
  region: string;
  theme: string;
  lifeCycleTags: string[];    // 한국어 표시명
  duration: string;
  createdAt: Date;
  placeCount: number;
  reviewCount: number;
  avgRating: number | null;
};

/** GET /api/courses/:id 포함 장소 */
export type CoursePlaceItem = {
  order: number;
  place: {
    id: number;
    name: string;
    address: string;
    lat: number;
    lng: number;
    category: string;
    phone: string | null;
    hours: string | null;
    image: string | null;
    tags: string[];
  };
};

/** GET /api/courses/:id 응답 */
export type CourseDetail = CourseListItem & {
  places: CoursePlaceItem[];
  isFavorited: boolean;
};

/** POST /api/reviews 응답 */
export type ReviewResponse = {
  id: number;
  userId: number;
  courseId: number;
  rating: number;
  content: string;
  createdAt: Date;
};

/** GET /api/courses/:id/reviews 응답 아이템 */
export type ReviewItem = {
  id: number;
  rating: number;
  content: string;
  createdAt: Date;
  user: { id: number; name: string };
};
