# API 명세서 — 생애주기별 여가 나들이 코스 추천 플랫폼

> 모든 응답의 Content-Type은 `application/json`.  
> 에러 응답 형식은 `{ "error": "<message>" }` 로 통일.

---

## 공통 규칙

| 항목 | 내용 |
|------|------|
| Base URL | `http://localhost:3000` (개발) |
| 인증 방식 | NextAuth v5 JWT 세션 쿠키(`authjs.session-token`) 또는 응답 body의 `token` |
| 날짜 형식 | ISO 8601 (`2025-01-01T00:00:00.000Z`) |
| 생애주기 태그 허용값 | `영유아 동반`, `어린이 동반`, `청소년`, `청년·1인`, `커플·신혼`, `중장년`, `시니어`, `반려동물 동반` |

---

## 1. 인증 (AUTH)

### POST /api/auth/register

| 항목 | 내용 |
|------|------|
| 설명 | 회원가입 (`/api/auth/signup` → 변경) |
| 인증 필요 | ✗ |

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "secure1234",
  "name": "홍길동",
  "lifeStageTags": ["영유아 동반", "어린이 동반"]
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | string | ✓ | 유효한 이메일 형식 |
| password | string | ✓ | 최소 8자 |
| name | string | ✓ | 공백 불가 |
| lifeStageTags | string[] | ✗ | 허용 태그 목록 내 값만 가능 |

**Response 201**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "lifeStageTags": ["영유아 동반", "어린이 동반"],
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "token": "<jwt>"
}
```

**Error Responses**

| 코드 | 조건 |
|------|------|
| 400 | email 형식 오류 / password 8자 미만 / 필수 필드 누락 / 잘못된 lifeStageTags 값 |
| 409 | 중복 이메일 |

---

### POST /api/auth/login

| 항목 | 내용 |
|------|------|
| 설명 | 로그인 |
| 인증 필요 | ✗ |

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "secure1234"
}
```

**Response 200**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "lifeStageTags": ["영유아 동반"],
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "token": "<jwt>"
}
```

**Error Responses**

| 코드 | 조건 |
|------|------|
| 400 | 필수 필드 누락 |
| 401 | 이메일 미존재 또는 비밀번호 불일치 |

---

## 2. 코스 (COURSE)

### GET /api/courses

| 항목 | 내용 |
|------|------|
| 설명 | 코스 목록 조회 (필터 · 정렬 · 페이징) |
| 인증 필요 | ✗ |

**Query Parameters**

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| lifeStage | string | — | 생애주기 태그 (한국어 표시명) |
| region | string | — | 지역 (부분 일치) |
| theme | string | — | 테마 (부분 일치) |
| sort | string | `latest` | `latest` / `popular` (즐겨찾기 수) / `rating` (평균 평점) |
| page | number | `1` | 페이지 번호 |
| limit | number | `10` | 페이지당 항목 수 (최대 50) |

**Response 200**
```json
{
  "courses": [
    {
      "id": 1,
      "title": "화성 올인원 패키지 — 역사와 바다, 오감 여행",
      "description": "...",
      "region": "화성시 전역",
      "theme": "역사, 자연, 미식",
      "lifeCycleTags": ["커플·신혼", "중장년", "청년·1인"],
      "duration": "당일 (약 6시간)",
      "estimatedTime": 360,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "placeCount": 3,
      "reviewCount": 2,
      "favoriteCount": 5,
      "avgRating": 4.5
    }
  ],
  "total": 8,
  "page": 1,
  "totalPages": 1
}
```

---

### GET /api/courses/:id

| 항목 | 내용 |
|------|------|
| 설명 | 코스 상세 조회 (포함 장소 순서 포함) |
| 인증 필요 | ✗ (로그인 시 isFavorited 반영) |

**Response 200**
```json
{
  "course": {
    "id": 1,
    "title": "화성 올인원 패키지 — 역사와 바다, 오감 여행",
    "description": "...",
    "region": "화성시 전역",
    "theme": "역사, 자연, 미식",
    "lifeCycleTags": ["커플·신혼", "중장년", "청년·1인"],
    "duration": "당일 (약 6시간)",
    "estimatedTime": 360,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "places": [
      {
        "order": 1,
        "place": {
          "id": 2,
          "name": "화성 융릉과 건릉",
          "address": "경기도 화성시 효행로481번길 21",
          "lat": 37.2028,
          "lng": 126.9894,
          "category": "역사·문화",
          "phone": "031-222-0142",
          "hours": "09:00~18:00 (월 휴무)",
          "image": "places/yunggeon-neung.jpg",
          "tags": ["역사", "왕릉"]
        }
      }
    ],
    "reviewCount": 2,
    "avgRating": 4.5,
    "isFavorited": false
  }
}
```

**Error Responses**

| 코드 | 조건 |
|------|------|
| 404 | 코스 미존재 |

---

### GET /api/courses/:id/reviews

| 항목 | 내용 |
|------|------|
| 설명 | 코스 리뷰 목록 조회 (평균 평점 포함) |
| 인증 필요 | ✗ |

**Response 200**
```json
{
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "content": "정말 좋은 코스입니다!",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "user": { "id": 1, "name": "홍길동" }
    }
  ],
  "avgRating": 4.5,
  "total": 2
}
```

---

## 3. 즐겨찾기 (FAVORITE)

> 기존 `POST/DELETE /api/courses/:id/favorite` + `GET /api/me/favorites`를 단일 리소스로 통합

### GET /api/favorites

| 항목 | 내용 |
|------|------|
| 설명 | 내 즐겨찾기 코스 목록 |
| 인증 필요 | ✓ |

**Response 200**
```json
{
  "favorites": [
    {
      "id": 1,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "course": {
        "id": 1,
        "title": "화성 올인원 패키지 — 역사와 바다, 오감 여행",
        "region": "화성시 전역",
        "theme": "역사, 자연, 미식",
        "lifeCycleTags": ["커플·신혼"],
        "duration": "당일 (약 6시간)",
        "estimatedTime": 360
      }
    }
  ],
  "total": 1
}
```

---

### POST /api/favorites

| 항목 | 내용 |
|------|------|
| 설명 | 즐겨찾기 추가 |
| 인증 필요 | ✓ |

**Request Body**
```json
{ "courseId": 1 }
```

**Response 201**
```json
{ "message": "즐겨찾기에 추가되었습니다." }
```

**Error Responses**

| 코드 | 조건 |
|------|------|
| 401 | 미인증 |
| 404 | 코스 미존재 |
| 409 | 이미 즐겨찾기 추가됨 |

---

### DELETE /api/favorites

| 항목 | 내용 |
|------|------|
| 설명 | 즐겨찾기 삭제 |
| 인증 필요 | ✓ |

`courseId`는 쿼리스트링(`?courseId=1`) 또는 Request Body(`{"courseId":1}`) 둘 다 허용.

**Response 200**
```json
{ "message": "즐겨찾기가 삭제되었습니다." }
```

**Error Responses**

| 코드 | 조건 |
|------|------|
| 401 | 미인증 |
| 404 | 즐겨찾기 미존재 |

---

## 4. 리뷰 (REVIEW)

### POST /api/reviews

| 항목 | 내용 |
|------|------|
| 설명 | 리뷰 작성 |
| 인증 필요 | ✓ |

**Request Body**
```json
{
  "courseId": 1,
  "rating": 5,
  "content": "정말 좋은 코스입니다!"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| courseId | number | ✓ | 코스 ID |
| rating | number | ✓ | 1~5 정수 |
| content | string | ✓ | 리뷰 내용 |

**Response 201**
```json
{
  "review": {
    "id": 1,
    "userId": 1,
    "courseId": 1,
    "rating": 5,
    "content": "정말 좋은 코스입니다!",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses**

| 코드 | 조건 |
|------|------|
| 400 | 필수 필드 누락 / rating 범위 오류(1~5 외) / content 공백 |
| 401 | 미인증 |
| 404 | 코스 미존재 |

---

## 5. 마이페이지 (USERS/ME)

### GET /api/users/me

| 항목 | 내용 |
|------|------|
| 설명 | 내 프로필 조회 (`/api/me` → 변경) |
| 인증 필요 | ✓ |

**Response 200**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "lifeStageTags": ["영유아 동반"],
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH /api/users/me

| 항목 | 내용 |
|------|------|
| 설명 | 내 프로필 수정 (`/api/me` → 변경) |
| 인증 필요 | ✓ |

**Request Body** (변경할 필드만 포함)
```json
{
  "name": "홍길순",
  "lifeStageTags": ["커플·신혼"]
}
```

**Response 200**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길순",
    "lifeStageTags": ["커플·신혼"],
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses**

| 코드 | 조건 |
|------|------|
| 400 | name 공백 / 잘못된 lifeStageTags 값 |
| 401 | 미인증 |

---

### GET /api/users/me/reviews

| 항목 | 내용 |
|------|------|
| 설명 | 내가 작성한 리뷰 목록 |
| 인증 필요 | ✓ |

**Response 200**
```json
{
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "content": "정말 좋은 코스입니다!",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "course": { "id": 1, "title": "화성 올인원 패키지 — ...", "region": "화성시 전역" }
    }
  ],
  "total": 1
}
```

---

## 6. 공지사항 (NOTICE)

### GET /api/notices

| 항목 | 내용 |
|------|------|
| 설명 | 공지사항 목록 (최신순) |
| 인증 필요 | ✗ |

**Response 200**
```json
{
  "notices": [
    {
      "id": 1,
      "title": "서비스 오픈 안내",
      "content": "생애주기별 여가 나들이 코스 추천 플랫폼...",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "total": 3
}
```

---

## QA 시나리오 (갱신)

| # | 시나리오 | 엔드포인트 | 예상 결과 |
|---|---------|-----------|---------|
| QA-1 | 신규 회원가입 | POST /api/auth/register | 201 + user + token |
| QA-2 | 중복 이메일 가입 | POST /api/auth/register | 409 + `이미 사용 중인 이메일입니다.` |
| QA-3 | 생애주기+지역 필터링 | GET /api/courses?lifeStage=커플·신혼&region=화성 | 해당 태그·지역 코스만 반환 |
| QA-4 | 비로그인 즐겨찾기 요청 | POST /api/favorites | 401 + `인증되지 않은 요청입니다.` |
| QA-5 | 별점 없이 리뷰 제출 | POST /api/reviews (rating 없음) | 400 + `rating은 1~5 정수로 입력해주세요.` |
| QA-6 | 3곳 포함 코스 순서 확인 | GET /api/courses/4 | places 배열 order 1→2→3 순 |
| QA-7 | 인기순 페이징 | GET /api/courses?sort=popular&page=1&limit=3 | total, page, totalPages 포함 |
| QA-8 | 내 리뷰 목록 | GET /api/users/me/reviews | reviews 배열 + total |
| QA-9 | 공지사항 목록 | GET /api/notices | 3개 공지 반환 |

---

## 변경 이력

| 버전 | 변경 내용 |
|------|---------|
| v2 | `/api/auth/signup` → `/api/auth/register` 경로 변경 |
| v2 | `/api/me`, `/api/me/favorites` → `/api/users/me`, `/api/favorites` 통합 |
| v2 | `Course.estimatedTime` 필드 추가 (분 단위 정수) |
| v2 | `/api/courses` 정렬(`sort`) · 페이징(`page`, `limit`, `totalPages`) 추가 |
| v2 | `/api/users/me/reviews` 신규 |
| v2 | `/api/notices` 신규 (Notice 모델) |
| v2 | `GET /api/courses` 응답에 `favoriteCount`, `estimatedTime` 추가 |
