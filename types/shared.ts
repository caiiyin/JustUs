// 백엔드 API 응답 타입 (실제 DB 스키마 기반)

export type LifecycleTag =
  | "영유아 동반"
  | "어린이 동반"
  | "청소년"
  | "청년·1인"
  | "커플·신혼"
  | "중장년"
  | "시니어"
  | "반려동물 동반";

export interface CourseListItem {
  id: number;
  title: string;
  description: string | null;
  region: string;
  theme: string;
  lifeCycleTags: LifecycleTag[];
  duration: string;
  estimatedTime: number;
  placeCount: number;
  reviewCount: number;
  favoriteCount: number;
  avgRating: number | null;
}

export interface CoursePlaceItem {
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
}

export interface CourseDetail {
  id: number;
  title: string;
  description: string | null;
  region: string;
  theme: string;
  lifeCycleTags: LifecycleTag[];
  duration: string;
  estimatedTime: number;
  createdAt: string;
  places: CoursePlaceItem[];
  reviewCount: number;
  avgRating: number | null;
  isFavorited: boolean;
}

export interface UserMe {
  id: number;
  name: string;
  email: string;
  lifeStageTags: LifecycleTag[];
  createdAt: string;
}

export interface FavoriteItem {
  id: number;
  courseId: number;
  course: CourseListItem;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface CoursesResponse {
  courses: CourseListItem[];
  total: number;
  page: number;
  totalPages: number;
}
