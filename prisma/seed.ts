import bcrypt from "bcrypt";
import { PrismaClient, LifeStageTag } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 시드 데이터 삽입 시작 (CONTENT.md 기준)...");

  // 모든 테이블 초기화 (시퀀스도 리셋)
  await prisma.$executeRaw`TRUNCATE TABLE notices, reviews, favorites, course_items, courses, places, users RESTART IDENTITY CASCADE`;
  console.log("🗑️ 기존 데이터 초기화 완료");

  // ─────────────────────────────────────────────────────
  // 1. Places  P01~P20  (화성시 관광지)
  // ─────────────────────────────────────────────────────
  const placesData = [
    {
      name: "용주사(효행박물관)",
      address: "경기도 화성시 용주로 136",
      lat: 37.2013, lng: 126.9912,
      category: "역사·문화",
      phone: "031-234-0040",
      hours: "상시 개방",
      image: "places/yongjusa.jpg",
      tags: ["역사", "문화", "사찰", "효행", "템플스테이"],
    },
    {
      name: "화성 융릉과 건릉",
      address: "경기도 화성시 효행로481번길 21",
      lat: 37.2028, lng: 126.9894,
      category: "역사·문화",
      phone: "031-222-0142",
      hours: "09:00~18:00 (월 휴무)",
      image: "places/yunggeon-neung.jpg",
      tags: ["역사", "왕릉", "무장애편의시설", "산책", "유네스코"],
    },
    {
      name: "화성시공예문화관",
      address: "경기도 화성시 우정읍 고온리안길 24-9",
      lat: 37.1695, lng: 126.8128,
      category: "체험·액티비티",
      phone: "031-366-8224",
      hours: "09:00~18:00 (월 휴무)",
      image: "places/craft-center.jpg",
      tags: ["체험", "공예", "어린이", "교육", "전시"],
    },
    {
      name: "매향리평화기념관·평화생태공원",
      address: "경기도 화성시 우정읍 고온리안길 24-11",
      lat: 37.1701, lng: 126.8126,
      category: "역사·문화",
      phone: "031-5189-7410",
      hours: "10:00~18:00 (월 휴무)",
      image: "places/maehyang-peace.jpg",
      tags: ["역사", "평화", "생태", "무장애편의시설", "반려동물동반가능"],
    },
    {
      name: "서해랑제부도해상케이블카",
      address: "경기도 화성시 서신면 전곡항로 1-10",
      lat: 37.1854, lng: 126.7113,
      category: "자연·경관",
      phone: "1833-4997",
      hours: "09:00~19:00 (주말·공휴일 20:00)",
      image: "places/seohaerang-cablecar.jpg",
      tags: ["케이블카", "서해", "경관", "반려동물동반가능", "한국관광100선"],
    },
    {
      name: "제부도 워터워크",
      address: "경기도 화성시 서신면 송교리 377-46",
      lat: 37.1746, lng: 126.7281,
      category: "자연·경관",
      phone: "031-355-3924",
      hours: "상시 개방 (물때 확인 필요)",
      image: "places/jebu-waterwalk.jpg",
      tags: ["바다", "갯벌", "포토스팟", "조망"],
    },
    {
      name: "제부리어촌체험마을",
      address: "경기도 화성시 서신면 해안길 210",
      lat: 37.1720, lng: 126.7242,
      category: "체험·액티비티",
      phone: "0507-1306-6604",
      hours: "10:00~22:00 (물때 따라 변동)",
      image: "places/jebu-village.jpg",
      tags: ["갯벌체험", "어촌", "가족", "어린이"],
    },
    {
      name: "제부도 빨간등대",
      address: "경기도 화성시 서신면 제부리 289-20",
      lat: 37.1706, lng: 126.7251,
      category: "자연·경관",
      phone: "031-357-3724",
      hours: "상시 개방",
      image: "places/jebu-lighthouse.jpg",
      tags: ["포토스팟", "노을", "서해", "산책"],
    },
    {
      name: "전곡항·제부마리나 요트체험",
      address: "경기도 화성시 서신면 전곡항로 5",
      lat: 37.1857, lng: 126.7102,
      category: "체험·액티비티",
      phone: null,
      hours: "운항 시간표 별도 확인",
      image: "places/jeongok-marina.jpg",
      tags: ["요트", "마리나", "레저", "서해"],
    },
    {
      name: "궁평항 수산물직판장",
      address: "경기도 화성시 서신면 궁평항로 1049-24",
      lat: 37.1935, lng: 126.7199,
      category: "미식·시장",
      phone: "031-355-9692",
      hours: "08:00~22:00 (A동 화요일·B동 수요일 휴무)",
      image: "places/gungpyeong-market.jpg",
      tags: ["해산물", "시장", "맛집", "대하"],
    },
    {
      name: "궁평오솔로관광지",
      address: "경기도 화성시 서신면 궁평리 511-3",
      lat: 37.1943, lng: 126.7196,
      category: "자연·경관",
      phone: "031-369-2069",
      hours: "상시 개방",
      image: "places/gungpyeong-sol.jpg",
      tags: ["해송숲", "산책", "서해", "낙조", "반려동물동반가능"],
    },
    {
      name: "남양성모성지",
      address: "경기도 화성시 남양읍 남양성지로 112",
      lat: 37.2144, lng: 126.7812,
      category: "역사·문화",
      phone: "031-356-5880",
      hours: "산책로 09:00~18:00 / 대성당 09:30~16:00",
      image: "places/namyang-shrine.jpg",
      tags: ["성지", "건축", "산책", "사색"],
    },
    {
      name: "소다미술관",
      address: "경기도 화성시 효행로707번길 30",
      lat: 37.2143, lng: 126.9834,
      category: "예술·전시",
      phone: "0507-1420-9127",
      hours: "10:00~18:00 (일·월 휴무)",
      image: "places/soda-museum.jpg",
      tags: ["미술관", "예술", "전시", "무장애편의시설"],
    },
    {
      name: "화성 공룡알화석산지",
      address: "경기도 화성시 송산면 공룡로 659",
      lat: 37.2200, lng: 126.7545,
      category: "자연·경관",
      phone: "031-5189-3805",
      hours: "09:00~17:00 (월 휴무)",
      image: "places/dinosaur-fossil.jpg",
      tags: ["화석", "공룡", "교육", "자연", "어린이"],
    },
    {
      name: "화성시 역사박물관",
      address: "경기도 화성시 향남읍 행정동로 96",
      lat: 37.2091, lng: 126.8556,
      category: "역사·문화",
      phone: "031-5189-7038",
      hours: "10:00~18:00 (월 휴무)",
      image: "places/history-museum.jpg",
      tags: ["박물관", "역사", "교육", "문화"],
    },
    {
      name: "비봉습지공원",
      address: "경기도 화성시 비봉면 유포리",
      lat: 37.2536, lng: 126.8233,
      category: "자연·경관",
      phone: "031-8047-5078",
      hours: "10:00~18:00 (월 휴무)",
      image: "places/bibong-wetland.jpg",
      tags: ["습지", "생태", "산책", "자연"],
    },
    {
      name: "발안만세시장",
      address: "경기도 화성시 향남읍 평2길 7 일대",
      lat: 37.2062, lng: 126.8531,
      category: "미식·시장",
      phone: "031-352-0120",
      hours: "09:00~21:00 (상설, 5일장 5·10일)",
      image: "places/balan-market.jpg",
      tags: ["시장", "5일장", "특산물", "반려동물동반가능"],
    },
    {
      name: "화성시 우리꽃식물원",
      address: "경기도 화성시 팔탄면 3.1만세로 777-17",
      lat: 37.2384, lng: 126.8943,
      category: "자연·경관",
      phone: "031-5189-6160",
      hours: "09:00~18:00 (계절별 상이)",
      image: "places/flower-garden.jpg",
      tags: ["식물원", "꽃", "자생화", "온실", "자연"],
    },
    {
      name: "제부도 전통양조",
      address: "경기도 화성시 서신면 제부로 441-7",
      lat: 37.1755, lng: 126.7265,
      category: "체험·액티비티",
      phone: "010-7732-2771",
      hours: "09:00~17:00 (일·월 휴무, 체험 사전예약)",
      image: "places/jebu-brewery.jpg",
      tags: ["발효체험", "양조", "공예", "포도식초"],
    },
    {
      name: "서해마루 유스호스텔",
      address: "경기도 화성시 서신면 궁평관광로153번길 39",
      lat: 37.1941, lng: 126.7193,
      category: "숙박",
      phone: "031-357-0924",
      hours: "체크인 15:00 / 체크아웃 11:00",
      image: "places/seohae-hostel.jpg",
      tags: ["숙박", "유스호스텔", "가족", "수영장"],
    },
  ];

  await prisma.place.createMany({ data: placesData });
  const createdPlaces = await prisma.place.findMany({ orderBy: { id: "asc" }, select: { id: true } });
  console.log(`✅ Place ${createdPlaces.length}개 삽입 완료`);

  // Place ID 헬퍼: P(n) → 실제 DB id (1-indexed)
  const P = (n: number) => createdPlaces[n - 1].id;

  // ─────────────────────────────────────────────────────
  // 2. Courses  C01~C08
  // ─────────────────────────────────────────────────────
  const coursesData: {
    id: number;
    title: string;
    description: string;
    region: string;
    theme: string;
    lifeCycleTags: LifeStageTag[];
    duration: string;
    estimatedTime: number;
    placeIds: number[];
  }[] = [
    {
      id: 1,
      title: "화성 올인원 패키지 — 역사와 바다, 오감 여행",
      description:
        "조선 왕실의 효심이 깃든 융릉·건릉에서 출발해 평화생태공원을 거닐고, 서해 절경 해상케이블카로 하루를 마무리하는 화성 대표 코스. 역사·자연·미식을 한 번에 경험할 수 있는 올인원 패키지 여행.",
      region: "화성시 전역",
      theme: "역사, 자연, 미식",
      lifeCycleTags: [
        LifeStageTag.COUPLE_NEWLYWED,
        LifeStageTag.MIDDLE_AGED,
        LifeStageTag.YOUNG_SOLO,
      ],
      duration: "당일 (약 6시간)",
      estimatedTime: 360,
      placeIds: [P(2), P(4), P(5)],
    },
    {
      id: 2,
      title: "화성 쉼표 여행 — 온천·해송·발효 힐링 코스",
      description:
        "무봉산 자연휴양림 산림욕으로 하루를 열고, 율암온천의 따뜻한 용천수로 피로를 풀며, 서해 해송 숲 궁평오솔로에서 산책으로 여정을 마무리하는 힐링 코스. 몸과 마음의 재충전이 필요한 모든 이에게 추천.",
      region: "화성시 동탄·서신 일대",
      theme: "힐링, 온천, 자연",
      lifeCycleTags: [
        LifeStageTag.COUPLE_NEWLYWED,
        LifeStageTag.MIDDLE_AGED,
        LifeStageTag.SENIOR,
      ],
      duration: "1박 2일",
      estimatedTime: 1440,
      placeIds: [P(11), P(10), P(16)],
    },
    {
      id: 3,
      title: "화성 감성 여행 — 예술과 바다에 물들다",
      description:
        "이색 사립미술관 소다미술관에서 시작해 마리오 보타의 건축미가 빛나는 남양성모성지를 거닌 뒤, 서해랑케이블카와 제부도 워터워크에서 인생 사진을 완성하는 감성 포토 코스.",
      region: "화성시 봉담·남양·서신 일대",
      theme: "감성, 포토, 예술, 해양",
      lifeCycleTags: [
        LifeStageTag.YOUNG_SOLO,
        LifeStageTag.COUPLE_NEWLYWED,
      ],
      duration: "당일 (약 7시간)",
      estimatedTime: 420,
      placeIds: [P(13), P(12), P(5), P(6)],
    },
    {
      id: 4,
      title: "제부도 원데이 트립 — 바다와 갯벌, 노을 여행",
      description:
        "하루 두 번 열리는 바다 위 제부도 워터워크에서 시작해 갯벌 체험, 어촌 밥상, 빨간등대 노을까지 제부도 한 곳에서 자연·미식·포토를 모두 즐기는 가족 친화 코스.",
      region: "화성시 서신면 제부도",
      theme: "해양, 갯벌 체험, 노을, 가족",
      lifeCycleTags: [
        LifeStageTag.CHILDREN_FAMILY,
        LifeStageTag.COUPLE_NEWLYWED,
        LifeStageTag.YOUNG_SOLO,
      ],
      duration: "당일 (약 6시간)",
      estimatedTime: 360,
      placeIds: [P(6), P(7), P(8)],
    },
    {
      id: 5,
      title: "펫프렌들리 화성 — 댕댕이와 함께하는 바다 여행",
      description:
        "반려견 전용 시설이 갖춰진 발안만세시장을 시작으로 해송 숲 궁평오솔로에서 산책을 즐기고, 밀물·썰물이 빚어내는 갯벌에서 반려견과 특별한 하루를 보내는 펫프렌들리 코스.",
      region: "화성시 향남·서신 일대",
      theme: "반려동물, 자연, 산책, 해양",
      lifeCycleTags: [
        LifeStageTag.PET_FAMILY,
        LifeStageTag.YOUNG_SOLO,
        LifeStageTag.COUPLE_NEWLYWED,
      ],
      duration: "1박 2일",
      estimatedTime: 1440,
      placeIds: [P(17), P(11), P(10)],
    },
    {
      id: 6,
      title: "화성 시간여행 — 공룡시대에서 조선까지",
      description:
        "화성시 역사박물관 도슨트 투어로 역사 여정을 시작하고, 일제강점기 평화의 흔적 매향리공원을 지나, 수천만 년 전 공룡알화석산지에서 지구의 시간을 되새기는 역사·교육 중심 코스.",
      region: "화성시 향남·우정·송산 일대",
      theme: "역사, 교육, 문화유산",
      lifeCycleTags: [
        LifeStageTag.CHILDREN_FAMILY,
        LifeStageTag.TEEN,
        LifeStageTag.MIDDLE_AGED,
      ],
      duration: "당일 (약 7시간)",
      estimatedTime: 420,
      placeIds: [P(15), P(4), P(14)],
    },
    {
      id: 7,
      title: "그린&소울 로드 — 꽃과 습지, 사색의 치유 여행",
      description:
        "한국 자생화 300여 종이 피어나는 우리꽃식물원에서 사계절 꽃향기를 누리고, 고요한 남양성모성지에서 사색을 즐기며, 비봉습지공원 갈대 산책로를 걸으며 일상의 피로를 내려놓는 느린 여행.",
      region: "화성시 팔탄·남양·비봉 일대",
      theme: "자연, 힐링, 사색, 꽃",
      lifeCycleTags: [
        LifeStageTag.COUPLE_NEWLYWED,
        LifeStageTag.MIDDLE_AGED,
        LifeStageTag.SENIOR,
      ],
      duration: "1박 2일",
      estimatedTime: 1440,
      placeIds: [P(18), P(12), P(16)],
    },
    {
      id: 8,
      title: "무장애 힐링 여행 — 누구에게나 열린 화성 코스",
      description:
        "휠체어 동선이 확보된 소다미술관·융릉·남양성모성지를 거쳐 서해랑케이블카의 장쾌한 서해 조망을 즐기고, 무장애 산책로가 정비된 매향리평화생태공원으로 마무리하는 배리어프리 코스.",
      region: "화성시 봉담·남양·서신 일대",
      theme: "무장애, 힐링, 역사, 자연",
      lifeCycleTags: [
        LifeStageTag.SENIOR,
        LifeStageTag.MIDDLE_AGED,
        LifeStageTag.CHILDREN_FAMILY,
      ],
      duration: "당일 (약 7시간)",
      estimatedTime: 420,
      placeIds: [P(13), P(2), P(5), P(4)],
    },
  ];

  for (const { id: _id, placeIds, ...courseData } of coursesData) {
    const course = await prisma.course.create({ data: courseData });
    await prisma.courseItem.createMany({
      data: placeIds.map((placeId, i) => ({
        courseId: course.id,
        placeId,
        order: i + 1,
      })),
    });
  }
  console.log(`✅ Course ${coursesData.length}개 + CourseItem 삽입 완료`);

  // ─────────────────────────────────────────────────────
  // 3. Test Users
  // ─────────────────────────────────────────────────────
  const SALT = 10;
  await Promise.all([
    prisma.user.upsert({
      where: { email: "test1@nadle.kr" },
      update: {},
      create: {
        email: "test1@nadle.kr",
        passwordHash: await bcrypt.hash("Test1234!", SALT),
        name: "김나들",
        lifeStageTags: [LifeStageTag.INFANT_FAMILY, LifeStageTag.CHILDREN_FAMILY],
      },
    }),
    prisma.user.upsert({
      where: { email: "test2@nadle.kr" },
      update: {},
      create: {
        email: "test2@nadle.kr",
        passwordHash: await bcrypt.hash("Test5678!", SALT),
        name: "이코스",
        lifeStageTags: [LifeStageTag.SENIOR, LifeStageTag.MIDDLE_AGED],
      },
    }),
  ]);
  console.log("✅ 테스트 User 2명 삽입 완료");

  // ─────────────────────────────────────────────────────
  // 4. Notices
  // ─────────────────────────────────────────────────────
  const noticesData = [
    {
      title: "서비스 오픈 안내",
      content:
        "생애주기별 여가 나들이 코스 추천 플랫폼 '나들이코스'가 정식 오픈되었습니다. " +
        "화성시 대표 관광지를 생애주기별로 큐레이션한 8개 코스를 지금 바로 만나보세요.",
    },
    {
      title: "신규 코스 추가 안내",
      content:
        "펫프렌들리 코스와 무장애 힐링 코스가 새롭게 추가되었습니다. " +
        "반려동물 동반 가능 시설과 휠체어 접근 가능 동선을 꼼꼼히 확인하여 구성하였습니다.",
    },
    {
      title: "카카오맵 연동 기능 안내",
      content:
        "코스 상세 페이지에서 장소별 위치와 이동 동선을 카카오맵으로 확인할 수 있습니다. " +
        "마커를 클릭하면 장소 정보가 표시됩니다.",
    },
  ];
  for (const notice of noticesData) {
    await prisma.notice.create({ data: notice });
  }
  console.log(`✅ Notice ${noticesData.length}개 삽입 완료`);
  console.log("🎉 시드 완료!");
}

main()
  .catch((e) => { console.error("❌ 시드 실패:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
