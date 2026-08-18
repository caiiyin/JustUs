export interface Restaurant {
  name: string;
  address: string;
  category: string;
  phone: string;
}

export const RESTAURANTS: Restaurant[] = [
  { name: "훈장골", address: "경기도 화성시 만세구 향남읍 행정서로3길 9", category: "한식", phone: "031-366-5998" },
  { name: "황도면옥", address: "경기도 화성시 병점구 세자로 489 (안녕동)", category: "분식", phone: "031-225-0111" },
  { name: "화성별궁", address: "경기도 화성시 병점구 세자로 469 (안녕동)", category: "한식", phone: "031-221-6700" },
  { name: "화성별관", address: "경기도 화성시 병점구 세자로 473 (안녕동)", category: "분식", phone: "031-222-3401" },
  { name: "화성(하)휴게소(이비가짬뽕)", address: "경기도 화성시 만세구 팔탄면 서해안고속도로 301-1", category: "분식", phone: "031-353-8140" },
  { name: "홍천덤바우록계탕", address: "경기도 화성시 만세구 남양읍 역골중앙로41번길 42", category: "한식", phone: "031-366-7880" },
  { name: "해조식당", address: "경기도 화성시 만세구 서신면 제부로 377", category: "횟집", phone: "031-356-3639" },
  { name: "한상차림 코다리명가", address: "경기도 화성시 병점구 세자로442번길 30 (안녕동)", category: "한식", phone: "031-222-1887" },
  { name: "한보가든", address: "경기도 화성시 만세구 팔탄면 3.1만세로771번길 25", category: "식육(숯불구이)", phone: "031-354-1005" },
  { name: "포레스트 호수공원점", address: "경기도 화성시 동탄구 동탄순환대로3길 28-14 (송동)", category: "외국음식전문점", phone: "031-374-6636" },
  { name: "평가옥", address: "경기도 화성시 동탄구 동탄기흥로257번가길 6 (방교동)", category: "한식", phone: "031-376-1578" },
  { name: "페트로스", address: "경기도 화성시 효행구 정남면 세자로 286", category: "중국식", phone: "031-352-7150" },
  { name: "어림(魚林)", address: "경기도 화성시 동탄구 동탄오산로 86-8 (오산동)", category: "한식", phone: "031-372-7622" },
  { name: "탐드", address: "경기도 화성시 동탄구 동탄기흥로520번가길 40 (영천동)", category: "경양식", phone: "031-376-0416" },
  { name: "초동집", address: "경기도 화성시 효행구 봉담읍 매봉로 341", category: "한식", phone: "031-293-9898" },
  { name: "청춘냉면1996", address: "경기도 화성시 효행구 봉담읍 샘마을길 36", category: "냉면집", phone: "031-298-4081" },
  { name: "진수성찬", address: "경기도 화성시 동탄구 왕배산1길 8-6 (목동)", category: "한식", phone: "031-8043-5820" },
  { name: "진리옥 본점", address: "경기도 화성시 만세구 향남읍 행정서로3길 13", category: "식육(숯불구이)", phone: "031-8059-4399" },
  { name: "주식회사 인천생갈비 본관", address: "경기도 화성시 동탄구 동탄역로 124 (오산동)", category: "식육(숯불구이)", phone: "031-375-1112" },
  { name: "제암종가집가든", address: "경기도 화성시 만세구 향남읍 제암고주로 9", category: "식육(숯불구이)", phone: "031-354-5020" },
  { name: "정담명가 남원추어탕", address: "경기도 화성시 병점구 효행로 486 (안녕동)", category: "한식", phone: "031-235-2235" },
  { name: "전국5대짬뽕연화산", address: "경기도 화성시 동탄구 금곡로 257 (금곡동)", category: "중국식", phone: "031-372-7881" },
  { name: "장지리 오리농장", address: "경기도 화성시 동탄구 장지남길3번길 6-2 (장지동)", category: "식육(숯불구이)", phone: "031-377-3222" },
  { name: "장쟁이쌈선생", address: "경기도 화성시 병점구 세자로441번길 3 (안녕동)", category: "한식", phone: "031-238-0035" },
  { name: "이가네삼계탕", address: "경기도 화성시 병점구 병점로81번길 9 (진안동)", category: "한식", phone: "031-222-6804" },
  { name: "이가네 짬뽕맛집", address: "경기도 화성시 만세구 장안면 3.1만세로 545", category: "중국식", phone: "031-351-3511" },
  { name: "윤딱 정통춘천닭갈비", address: "경기도 화성시 동탄구 동탄순환대로3가길 14-11 (송동)", category: "식육(숯불구이)", phone: "070-8277-5399" },
  { name: "우테일러", address: "경기도 화성시 동탄구 장지안길 82 (장지동)", category: "식육(숯불구이)", phone: "031-376-9692" },
  { name: "옛순대국", address: "경기도 화성시 만세구 팔탄면 3.1만세로 745", category: "한식", phone: "031-353-8281" },
  { name: "영천두툼한숯불갈비", address: "경기도 화성시 병점구 병점로81번길 17 (진안동)", category: "식육(숯불구이)", phone: "031-224-4421" },
  { name: "여명본점", address: "경기도 화성시 효행구 정남면 세자로303번길 11-8", category: "한식", phone: "031-366-4466" },
  { name: "엄니토종추어탕", address: "경기도 화성시 만세구 남양읍 남양시장로25번길 59", category: "한식", phone: "031-366-8835" },
  { name: "어인마니산삼궁", address: "경기도 화성시 동탄구 금곡로 257 (금곡동)", category: "한식", phone: "031-374-3351" },
  { name: "양심장어 본점", address: "경기도 화성시 동탄구 동탄중심상가2길 29 (반송동)", category: "한식", phone: "031-613-4050" },
  { name: "안녕맛집 바다향 왕코다리", address: "경기도 화성시 병점구 세자로 480 (안녕동)", category: "한식", phone: "031-232-9233" },
  { name: "쌈촌", address: "경기도 화성시 효행구 봉담읍 동화길 93-8", category: "한식", phone: "031-297-8937" },
  { name: "신창기업(주)발리오스컨트리클럽", address: "경기도 화성시 만세구 팔탄면 3.1만세로 641-28", category: "한식", phone: "031-352-5061" },
  { name: "신라스테이 동탄 카페", address: "경기도 화성시 동탄구 노작로 161 (반송동)", category: "뷔페식", phone: "031-8036-9000" },
  { name: "수향한정식", address: "경기도 화성시 동탄구 풀무골로60번길 4-16 (중동)", category: "한식", phone: "031-374-7725" },
  { name: "송탄나여사부대찌개화성점", address: "경기도 화성시 만세구 남양읍 주석로 228-3", category: "한식", phone: "031-366-7012" },
  { name: "송원한정식", address: "경기도 화성시 병점구 용주로 127 (송산동)", category: "한식", phone: "031-234-8786" },
  { name: "송도갈매기동탄점", address: "경기도 화성시 병점구 동탄지성로 210 (능동)", category: "식육(숯불구이)", phone: "031-238-0022" },
  { name: "송담추어탕", address: "경기도 화성시 효행구 봉담읍 세자로 423", category: "탕류(보신용)", phone: "031-233-8388" },
  { name: "소플러스 동탄역점", address: "경기도 화성시 동탄구 동탄대로 446 (동탄역)", category: "식육(숯불구이)", phone: "031-377-4700" },
  { name: "소담뜰", address: "경기도 화성시 만세구 향남읍 배터길 14", category: "식육(숯불구이)", phone: "031-8059-7667" },
  { name: "샤브연리지 동탄능동점", address: "경기도 화성시 병점구 동탄지성로 210 (능동)", category: "한식", phone: "031-221-0530" },
  { name: "삿뽀로동탄점", address: "경기도 화성시 동탄구 10용사로 358 (능동)", category: "일식", phone: "031-8003-5651" },
  { name: "삼성낙지칼국수", address: "경기도 화성시 만세구 서신면 바다뜰길 100", category: "분식", phone: "031-356-9077" },
  { name: "산뜨락 동탄점", address: "경기도 화성시 동탄구 장지남길 31 (장지동)", category: "한식", phone: "0507-1427-4434" },
  { name: "비스트로", address: "경기도 화성시 효행구 정남면 세자로 286", category: "한식", phone: "031-350-4712" },
  { name: "부촌", address: "경기도 화성시 동탄구 동탄대로 495 (오산동)", category: "식육(숯불구이)", phone: "031-377-1501" },
  { name: "본수원갈비 병점점", address: "경기도 화성시 병점구 병점중앙로211번길 35 (진안동)", category: "식육(숯불구이)", phone: "031-224-8434" },
  { name: "본가갈비탕", address: "경기도 화성시 효행구 비봉면 화성로1616번길 8", category: "한식", phone: "031-356-9266" },
  { name: "본가 장수촌", address: "경기도 화성시 만세구 남양읍 신남안길 264", category: "한식", phone: "031-356-5866" },
  { name: "본가 부대찌개", address: "경기도 화성시 병점구 세자로 451 (안녕동)", category: "한식", phone: "031-234-5505" },
  { name: "복사꽃피는집(화성융건릉점)", address: "경기도 화성시 병점구 세자로 477 (안녕동)", category: "한식", phone: "031-239-8899" },
  { name: "백호참치", address: "경기도 화성시 만세구 향남읍 상신하길로298번길 7-7", category: "일식", phone: "031-353-6123" },
  { name: "무봉산장", address: "경기도 화성시 동탄구 풀무골로77번길 1 (중동)", category: "한식", phone: "031-375-3934" },
  { name: "몽연", address: "경기도 화성시 동탄구 노작로 195 (반송동)", category: "중국식", phone: "031-613-9991" },
  { name: "명품간장게장", address: "경기도 화성시 만세구 남양읍 남양성지로 103", category: "한식", phone: "031-355-7660" },
  { name: "매송(하)휴게소(매송한상)", address: "경기도 화성시 효행구 매송면 서해안고속도로 315", category: "한식", phone: "031-296-1501" },
  { name: "망향비빔국수", address: "경기도 화성시 병점구 효행로1156번길 11 (병점동)", category: "분식", phone: "031-273-3575" },
  { name: "맛집 산골통닭", address: "경기도 화성시 동탄구 동탄순환대로29길 64 (영천동)", category: "호프/통닭", phone: "031-376-1770" },
  { name: "만석궁", address: "경기도 화성시 병점구 안녕길 6 (안녕동)", category: "식육(숯불구이)", phone: "031-233-3344" },
  { name: "두꺼비한우정육식당", address: "경기도 화성시 병점구 반월남길 5 (반월동)", category: "식육(숯불구이)", phone: "031-223-8003" },
  { name: "동해복집", address: "경기도 화성시 동탄구 삼성1로 160 (석우동)", category: "복어취급", phone: "031-8015-3111" },
  { name: "동탄백합칼국수", address: "경기도 화성시 동탄구 동탄역로 122 (오산동)", category: "한식", phone: "031-373-1566" },
  { name: "동천홍 봉담점", address: "경기도 화성시 효행구 봉담읍 삼천병마로 1079-12", category: "중국식", phone: "031-297-0881" },
  { name: "동오정", address: "경기도 화성시 만세구 향남읍 향봉로10번길 2-1", category: "한식", phone: "031-366-4488" },
  { name: "동신참치", address: "경기도 화성시 동탄구 노작로 193 (반송동)", category: "일식", phone: "031-8003-0004" },
  { name: "돈까스 클럽", address: "경기도 화성시 효행구 봉담읍 세자로 408", category: "경양식", phone: "031-237-5859" },
  { name: "덕림전통육개장냉면", address: "경기도 화성시 효행구 봉담읍 노루고개길 19", category: "한식", phone: "031-227-0008" },
  { name: "대보유통(주)화성(하)휴게소(양식당)", address: "경기도 화성시 만세구 팔탄면 서해안고속도로 301-1", category: "경양식", phone: "031-353-8140" },
  { name: "대보유통(주)화성(상)휴게소(한식)", address: "경기도 화성시 만세구 팔탄면 서해안고속도로 302", category: "한식", phone: "031-353-8143" },
  { name: "대궐숯불장어촌", address: "경기도 화성시 동탄구 장지남길3번길 6-2 (장지동)", category: "한식", phone: "031-378-6707" },
  { name: "대게나라동탄점", address: "경기도 화성시 동탄구 메타폴리스로 53 (반송동)", category: "한식", phone: "031-8003-6262" },
  { name: "다락골 소머리국밥 방교본점", address: "경기도 화성시 동탄구 동탄기흥로 147-15 (방교동)", category: "한식", phone: "031-377-3450" },
  { name: "농가의하루", address: "경기도 화성시 동탄구 왕배산1길 3-16 (목동)", category: "경양식", phone: "031-373-8843" },
  { name: "금수정", address: "경기도 화성시 동탄구 동탄역로 102 (오산동)", category: "한식", phone: "070-8691-4810" },
  { name: "구좌리얼크니손칼국수", address: "경기도 화성시 병점구 세자로 481 (안녕동)", category: "분식", phone: "031-234-2247" },
  { name: "곤드레밥집", address: "경기도 화성시 동탄구 10용사로 404 (반송동)", category: "한식", phone: "031-8003-2777" },
  { name: "고기의 즐거움", address: "경기도 화성시 동탄구 동탄원천로 163 (반송동)", category: "식육(숯불구이)", phone: "031-8015-5575" },
  { name: "경복궁동탄점", address: "경기도 화성시 동탄구 10용사로 358 (능동)", category: "한식", phone: "031-8003-3080" },
  { name: "건강밥상 심마니", address: "경기도 화성시 만세구 꽃내음1길 19-22 (새솔동)", category: "한식", phone: "031-357-6477" },
  { name: "개수리막국수 화성안녕점", address: "경기도 화성시 병점구 효행로 439-2 (안녕동)", category: "한식", phone: "031-223-7250" },
  { name: "갈비명가", address: "경기도 화성시 만세구 향남읍 솔태상두길 2", category: "식육(숯불구이)", phone: "031-366-0092" },
  { name: "가야밀면&수제돈까스", address: "경기도 화성시 효행구 봉담읍 삼천병마로 1079-12", category: "경양식", phone: "031-297-6045" },
  { name: "(주)칠보농원", address: "경기도 화성시 효행구 매송면 화성로 2419-10", category: "식육(숯불구이)", phone: "031-292-0005" },
  { name: "(주)미각", address: "경기도 화성시 동탄구 큰재봉길 23-12 (석우동)", category: "식육(숯불구이)", phone: "031-8003-8292" },
  { name: "(주)관악 레스토랑", address: "경기도 화성시 동탄구 중리길 183 (청계동)", category: "경양식", phone: "031-8047-8031" },
];

const REGION_ADDRESS_MAP: Record<string, string[]> = {
  동탄: ["동탄구"],
  서신: ["서신면"],
  제부도: ["서신면"],
  봉담: ["봉담읍"],
  남양: ["남양읍"],
  향남: ["향남읍"],
  팔탄: ["팔탄면"],
  비봉: ["비봉면"],
  매송: ["매송면"],
  병점: ["병점구", "안녕동", "진안동", "병점동"],
};

const CATEGORY_EMOJI: Record<string, string> = {
  "한식": "🍚",
  "분식": "🍜",
  "횟집": "🐟",
  "식육(숯불구이)": "🥩",
  "외국음식전문점": "🌍",
  "중국식": "🥢",
  "일식": "🍣",
  "경양식": "🍽️",
  "뷔페식": "🍱",
  "냉면집": "🍜",
  "탕류(보신용)": "🫕",
  "복어취급": "🐡",
  "호프/통닭": "🍗",
};

export function getCategoryEmoji(category: string): string {
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJI)) {
    if (category.includes(key)) return emoji;
  }
  return "🍽️";
}

export function getRestaurantsByRegion(region: string, limit = 6): Restaurant[] {
  const addressKeywords: string[] = [];

  for (const [regionKey, addressKeys] of Object.entries(REGION_ADDRESS_MAP)) {
    if (region.includes(regionKey)) {
      addressKeywords.push(...addressKeys);
    }
  }

  if (addressKeywords.length === 0) {
    return RESTAURANTS.slice(0, limit);
  }

  return RESTAURANTS
    .filter((r) => addressKeywords.some((kw) => r.address.includes(kw)))
    .slice(0, limit);
}
