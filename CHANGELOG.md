# lto

## 0.4.0

### Minor Changes

- f199d63: feat!: random 함수에 min/max 파라미터 추가 및 연금복권 기능 구현
  - random() 함수를 random(min, max)로 변경하여 범위 지정 가능하도록 수정
  - 연금복권 720+ 번호 생성 기능 추가 (generate_pension_lottery_numbers)
  - MCP 서버 코드를 lotto.ts와 pension.ts로 모듈화하여 구조 개선

  BREAKING CHANGE: random() 함수가 random(min, max) 형태로 변경되어 기존 코드와 호환되지 않습니다.

## 0.3.1

### Patch Changes

- 4a1c696: refactor: 로또 당첨 확인 API 엔드포인트 및 데이터 구조 업데이트

## 0.3.0

### Minor Changes

- d2fac4b: feat: MCP 서버 기능 추가 및 로또 번호 생성 로직 개선

## 0.2.0

### Minor Changes

- bd23648: Change to use the crypto.randomValues function
