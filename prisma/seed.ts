import bcrypt from "bcrypt";

// Prisma 7 — import from generated output path
// @ts-ignore path resolved after first `prisma generate`
import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 시드 데이터 삽입 시작...");

  // ──────────────────────────────────────────
  // 1. Regions (시/도 레벨)
  // ──────────────────────────────────────────
  const [seoul, gyeonggi, busan] = await Promise.all([
    prisma.region.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: "서울특별시" },
    }),
    prisma.region.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, name: "경기도" },
    }),
    prisma.region.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, name: "부산광역시" },
    }),
  ]);

  // 시/군/구 레벨 (자기참조 예시)
  const [jongno, yongsan, suwon, haeundae] = await Promise.all([
    prisma.region.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, name: "종로구", parent_region_id: seoul.id },
    }),
    prisma.region.upsert({
      where: { id: 5 },
      update: {},
      create: { id: 5, name: "용산구", parent_region_id: seoul.id },
    }),
    prisma.region.upsert({
      where: { id: 6 },
      update: {},
      create: { id: 6, name: "수원시", parent_region_id: gyeonggi.id },
    }),
    prisma.region.upsert({
      where: { id: 7 },
      update: {},
      create: { id: 7, name: "해운대구", parent_region_id: busan.id },
    }),
  ]);

  console.log("✅ Region 삽입 완료");

  // ──────────────────────────────────────────
  // 2. Themes
  // ──────────────────────────────────────────
  const [themeNature, themeCulture, themeFood, themeIndoor] = await Promise.all([
    prisma.theme.upsert({ where: { name: "자연" }, update: {}, create: { name: "자연" } }),
    prisma.theme.upsert({ where: { name: "문화" }, update: {}, create: { name: "문화" } }),
    prisma.theme.upsert({ where: { name: "맛집" }, update: {}, create: { name: "맛집" } }),
    prisma.theme.upsert({ where: { name: "실내외" }, update: {}, create: { name: "실내외" } }),
  ]);

  console.log("✅ Theme 삽입 완료");

  // ──────────────────────────────────────────
  // 3. LifeStageTags
  // ──────────────────────────────────────────
  const [tagInfant, tagPet, tagSenior, tagCouple, tagSolo] = await Promise.all([
    prisma.lifeStageTag.upsert({ where: { name: "영유아 동반" }, update: {}, create: { name: "영유아 동반" } }),
    prisma.lifeStageTag.upsert({ where: { name: "반려동물 동반" }, update: {}, create: { name: "반려동물 동반" } }),
    prisma.lifeStageTag.upsert({ where: { name: "시니어" }, update: {}, create: { name: "시니어" } }),
    prisma.lifeStageTag.upsert({ where: { name: "커플" }, update: {}, create: { name: "커플" } }),
    prisma.lifeStageTag.upsert({ where: { name: "혼자" }, update: {}, create: { name: "혼자" } }),
  ]);

  console.log("✅ LifeStageTag 삽입 완료");

  // ──────────────────────────────────────────
  // 4. Places (실제 위경도 포함)
  // ──────────────────────────────────────────
  const placesData = [
    // 서울 종로구
    {
      name: "경복궁",
      address: "서울특별시 종로구 사직로 161",
      lat: 37.5796,
      lng: 126.9770,
      region_id: jongno.id,
      category: "역사/문화",
      description: "조선 왕조의 정궁으로 서울의 대표 문화유산",
    },
    {
      name: "북촌한옥마을",
      address: "서울특별시 종로구 계동길 37",
      lat: 37.5826,
      lng: 126.9851,
      region_id: jongno.id,
      category: "역사/문화",
      description: "전통 한옥이 밀집한 서울 대표 문화 명소",
    },
    {
      name: "청계천",
      address: "서울특별시 종로구 청계광장로 1",
      lat: 37.5700,
      lng: 126.9777,
      region_id: jongno.id,
      category: "자연/산책",
      description: "도심 속 산책로이자 시민 휴식 공간",
    },
    // 서울 용산구
    {
      name: "국립중앙박물관",
      address: "서울특별시 용산구 서빙고로 137",
      lat: 37.5238,
      lng: 126.9805,
      region_id: yongsan.id,
      category: "박물관",
      description: "우리나라 최대 규모의 국립 박물관",
    },
    {
      name: "이태원 거리",
      address: "서울특별시 용산구 이태원로 177",
      lat: 37.5349,
      lng: 126.9945,
      region_id: yongsan.id,
      category: "맛집/쇼핑",
      description: "다국적 음식과 문화가 공존하는 거리",
    },
    // 경기 수원
    {
      name: "수원화성",
      address: "경기도 수원시 장안구 영화동 320-2",
      lat: 37.2882,
      lng: 127.0133,
      region_id: suwon.id,
      category: "역사/문화",
      description: "유네스코 세계문화유산, 조선 후기 성곽",
    },
    {
      name: "광교호수공원",
      address: "경기도 수원시 영통구 광교호수공원로 180",
      lat: 37.2908,
      lng: 127.0488,
      region_id: suwon.id,
      category: "자연/산책",
      description: "수원 최대 규모 호수공원, 반려동물 동반 가능",
    },
    // 부산 해운대
    {
      name: "해운대 해수욕장",
      address: "부산광역시 해운대구 해운대해변로 264",
      lat: 35.1587,
      lng: 129.1604,
      region_id: haeundae.id,
      category: "자연/해변",
      description: "국내 최대 규모의 해수욕장",
    },
    {
      name: "해동용궁사",
      address: "부산광역시 기장군 기장읍 용궁길 86",
      lat: 35.1877,
      lng: 129.2220,
      region_id: haeundae.id,
      category: "역사/문화",
      description: "바다 위에 세워진 아름다운 사찰",
    },
    {
      name: "광안리 어묵·분식 골목",
      address: "부산광역시 수영구 광안동 광안해변로 219",
      lat: 35.1530,
      lng: 129.1186,
      region_id: haeundae.id,
      category: "맛집",
      description: "부산 명물 어묵과 분식을 즐길 수 있는 골목",
    },
  ];

  const places: Record<string, { id: number }> = {};
  for (const data of placesData) {
    const place = await prisma.place.upsert({
      where: {
        // name+address 복합 upsert 대신 findFirst로 처리
        id: (await prisma.place.findFirst({ where: { name: data.name } }))?.id ?? 0,
      },
      update: {},
      create: data,
    });
    places[data.name] = place;
  }

  console.log("✅ Place 삽입 완료");

  // ──────────────────────────────────────────
  // 5. Test Users
  // ──────────────────────────────────────────
  const SALT_ROUNDS = 10;
  const [userA, userB] = await Promise.all([
    prisma.user.upsert({
      where: { email: "test1@nadle.kr" },
      update: {},
      create: {
        email: "test1@nadle.kr",
        password_hash: await bcrypt.hash("Test1234!", SALT_ROUNDS),
        name: "김나들",
        life_stage: "영유아_부모",
        family_type: "핵가족",
      },
    }),
    prisma.user.upsert({
      where: { email: "test2@nadle.kr" },
      update: {},
      create: {
        email: "test2@nadle.kr",
        password_hash: await bcrypt.hash("Test5678!", SALT_ROUNDS),
        name: "이코스",
        life_stage: "시니어",
        family_type: "2인가구",
      },
    }),
  ]);

  console.log("✅ User 삽입 완료");

  // ──────────────────────────────────────────
  // 6. Courses + CoursePlaces + CourseTags
  // ──────────────────────────────────────────

  // Course 1: 서울 종로 역사문화 코스 (영유아 동반)
  const course1 = await prisma.course.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "서울 종로 역사문화 나들이",
      description: "경복궁부터 북촌한옥마을까지, 아이와 함께하는 서울 역사 탐방 코스",
      region_id: jongno.id,
      theme_id: themeCulture.id,
      estimated_minutes: 210,
      created_by: userA.id,
    },
  });

  await prisma.coursPlace.createMany({
    data: [
      { course_id: course1.id, place_id: places["경복궁"].id, order_index: 1, travel_minutes_to_next: 20 },
      { course_id: course1.id, place_id: places["북촌한옥마을"].id, order_index: 2, travel_minutes_to_next: 15 },
      { course_id: course1.id, place_id: places["청계천"].id, order_index: 3, travel_minutes_to_next: null },
    ],
    skipDuplicates: true,
  });

  await prisma.courseTag.createMany({
    data: [
      { course_id: course1.id, tag_id: tagInfant.id },
      { course_id: course1.id, tag_id: tagCouple.id },
    ],
    skipDuplicates: true,
  });

  // Course 2: 용산 박물관·문화 코스 (시니어)
  const course2 = await prisma.course.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: "용산 박물관 & 이태원 문화 탐방",
      description: "국립중앙박물관 관람 후 이태원 거리에서 다양한 맛집 탐방",
      region_id: yongsan.id,
      theme_id: themeFood.id,
      estimated_minutes: 180,
      created_by: userB.id,
    },
  });

  await prisma.coursPlace.createMany({
    data: [
      { course_id: course2.id, place_id: places["국립중앙박물관"].id, order_index: 1, travel_minutes_to_next: 25 },
      { course_id: course2.id, place_id: places["이태원 거리"].id, order_index: 2, travel_minutes_to_next: null },
    ],
    skipDuplicates: true,
  });

  await prisma.courseTag.createMany({
    data: [{ course_id: course2.id, tag_id: tagSenior.id }],
    skipDuplicates: true,
  });

  // Course 3: 수원 역사 + 자연 코스 (반려동물)
  const course3 = await prisma.course.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      title: "수원화성 & 광교호수 반려동물 산책",
      description: "세계문화유산 화성 성곽길을 걷고 광교호수공원에서 반려동물과 여유로운 산책",
      region_id: suwon.id,
      theme_id: themeNature.id,
      estimated_minutes: 240,
      created_by: userA.id,
    },
  });

  await prisma.coursPlace.createMany({
    data: [
      { course_id: course3.id, place_id: places["수원화성"].id, order_index: 1, travel_minutes_to_next: 30 },
      { course_id: course3.id, place_id: places["광교호수공원"].id, order_index: 2, travel_minutes_to_next: null },
    ],
    skipDuplicates: true,
  });

  await prisma.courseTag.createMany({
    data: [
      { course_id: course3.id, tag_id: tagPet.id },
      { course_id: course3.id, tag_id: tagSolo.id },
    ],
    skipDuplicates: true,
  });

  // Course 4: 부산 해양 + 문화 코스 (커플)
  const course4 = await prisma.course.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      title: "부산 해안 커플 나들이",
      description: "해동용궁사에서 영적 분위기를 느끼고, 해운대 해수욕장에서 낭만적인 시간을 보내는 코스",
      region_id: haeundae.id,
      theme_id: themeNature.id,
      estimated_minutes: 200,
      created_by: userB.id,
    },
  });

  await prisma.coursPlace.createMany({
    data: [
      { course_id: course4.id, place_id: places["해동용궁사"].id, order_index: 1, travel_minutes_to_next: 40 },
      { course_id: course4.id, place_id: places["해운대 해수욕장"].id, order_index: 2, travel_minutes_to_next: null },
    ],
    skipDuplicates: true,
  });

  await prisma.courseTag.createMany({
    data: [{ course_id: course4.id, tag_id: tagCouple.id }],
    skipDuplicates: true,
  });

  // Course 5: 부산 맛집 탐방 (혼자)
  const course5 = await prisma.course.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      title: "부산 해안 맛집 혼자 여행",
      description: "광안리 어묵·분식 골목에서 혼자만의 부산 맛집 탐방 후 해운대에서 마무리",
      region_id: haeundae.id,
      theme_id: themeFood.id,
      estimated_minutes: 150,
      created_by: userA.id,
    },
  });

  await prisma.coursPlace.createMany({
    data: [
      { course_id: course5.id, place_id: places["광안리 어묵·분식 골목"].id, order_index: 1, travel_minutes_to_next: 20 },
      { course_id: course5.id, place_id: places["해운대 해수욕장"].id, order_index: 2, travel_minutes_to_next: null },
    ],
    skipDuplicates: true,
  });

  await prisma.courseTag.createMany({
    data: [{ course_id: course5.id, tag_id: tagSolo.id }],
    skipDuplicates: true,
  });

  console.log("✅ Course + CoursePlace + CourseTag 삽입 완료");
  console.log("🎉 시드 데이터 삽입 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 시드 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
