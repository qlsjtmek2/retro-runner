/**
 * Neon Comic 색상 팔레트
 * PRD에서 정의된 색상 시스템
 */

export const Colors = {
  // 배경
  BG_DARK: 0x0A0A0F,      // 거의 검정
  BG_MID: 0x1A0033,       // 진한 보라

  // 캐릭터
  CHAR_PRIMARY: 0x00F0FF,    // 청록 (캐릭터 주 색상)
  CHAR_SECONDARY: 0xFF00FF,  // 마젠타 (무기)
  CHAR_ACCENT: 0xFFFF00,     // 네온 노랑 (이펙트)

  // UI & 이펙트
  UI_WHITE: 0xFFFFFF,        // 순백
  EFFECT_GLOW: 0xFF10F0,     // 핑크 글로우
  OUTLINE: 0x000000,         // 검정 외곽선

  // 적
  ENEMY_RED: 0xFF0044,       // 네온 빨강
  ENEMY_PURPLE: 0x8800FF,    // 네온 보라
} as const;

export const ColorStrings = {
  BG_DARK: '#0A0A0F',
  BG_MID: '#1A0033',
  CHAR_PRIMARY: '#00F0FF',
  CHAR_SECONDARY: '#FF00FF',
  CHAR_ACCENT: '#FFFF00',
  UI_WHITE: '#FFFFFF',
  EFFECT_GLOW: '#FF10F0',
  OUTLINE: '#000000',
  ENEMY_RED: '#FF0044',
  ENEMY_PURPLE: '#8800FF',
} as const;
