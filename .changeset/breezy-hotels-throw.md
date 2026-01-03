---
'lto': minor
---

feat!: random 함수에 min/max 파라미터 추가 및 연금복권 기능 구현

- random() 함수를 random(min, max)로 변경하여 범위 지정 가능하도록 수정
- 연금복권 720+ 번호 생성 기능 추가 (generate_pension_lottery_numbers)
- MCP 서버 코드를 lotto.ts와 pension.ts로 모듈화하여 구조 개선

BREAKING CHANGE: random() 함수가 random(min, max) 형태로 변경되어 기존 코드와 호환되지 않습니다.
