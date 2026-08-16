import { LifeStageTag } from "@/app/generated/prisma/client";

/** API 입출력에서 사용하는 한국어 표시명 ↔ Prisma enum 대응표 */
export const LIFE_STAGE_LABELS: Record<LifeStageTag, string> = {
  [LifeStageTag.INFANT_FAMILY]:   "영유아 동반",
  [LifeStageTag.CHILDREN_FAMILY]: "어린이 동반",
  [LifeStageTag.TEEN]:            "청소년",
  [LifeStageTag.YOUNG_SOLO]:      "청년·1인",
  [LifeStageTag.COUPLE_NEWLYWED]: "커플·신혼",
  [LifeStageTag.MIDDLE_AGED]:     "중장년",
  [LifeStageTag.SENIOR]:          "시니어",
  [LifeStageTag.PET_FAMILY]:      "반려동물 동반",
};

const LABEL_TO_TAG = new Map(
  Object.entries(LIFE_STAGE_LABELS).map(([k, v]) => [v, k as LifeStageTag])
);

/** 허용된 한국어 표시명 목록 */
export const VALID_LIFE_STAGE_LABELS = new Set(Object.values(LIFE_STAGE_LABELS));

/** 한국어 표시명 → LifeStageTag enum (유효하지 않으면 undefined) */
export function koreanToTag(label: string): LifeStageTag | undefined {
  return LABEL_TO_TAG.get(label);
}

/** LifeStageTag enum → 한국어 표시명 */
export function tagToKorean(tag: LifeStageTag): string {
  return LIFE_STAGE_LABELS[tag];
}

/** 한국어 배열 → LifeStageTag[] (잘못된 값 포함 시 null 반환) */
export function parseLifeStageTags(arr: string[]): LifeStageTag[] | null {
  const result: LifeStageTag[] = [];
  for (const label of arr) {
    const tag = koreanToTag(label);
    if (!tag) return null;
    result.push(tag);
  }
  return result;
}

/** LifeStageTag[] → 한국어 배열 (JSON 직렬화용) */
export function serializeLifeStageTags(tags: LifeStageTag[]): string[] {
  return tags.map(tagToKorean);
}
