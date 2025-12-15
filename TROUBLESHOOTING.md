# Troubleshooting Guide

## HeroSection 이미지가 안보이는 경우

### 1. 브라우저 콘솔 확인
개발자 도구(F12)를 열고 콘솔에서 다음을 확인:
```
Representative works response status: 200
Representative works data: [...]
```

데이터가 비어있으면 백엔드에서 데이터를 반환하지 않는 것입니다.

### 2. 백엔드 API 테스트
터미널에서:
```bash
curl http://localhost:3000/api/representative-works
```

또는 프로덕션:
```bash
curl https://your-domain.com/api/representative-works
```

### 3. 이미지 URL 확인
반환된 데이터의 `image_path`를 확인:
- S3 URL인 경우: `https://s3.amazonaws.com/...` 형태
- 상대 경로인 경우: `/uploads/...` 형태

### 4. Admin에서 Representative Works 추가
1. `/admin/login`에서 로그인
2. `/admin/representative-works`로 이동
3. "+ Add Work" 버튼 클릭
4. 필수 필드 입력:
   - Title
   - Description (Hero에 표시됨)
   - Journal
   - Image (Upload 버튼으로 S3 업로드)
   - Active 체크박스 선택

## Admin 페이지에서 Inactive 항목이 안보이는 경우

### 백엔드 API 요구사항
Admin 페이지에서는 `?all=true` 파라미터를 전달합니다:
```
GET /api/representative-works?all=true
GET /api/research-highlights?all=true
GET /api/cover-arts?all=true
GET /api/research-areas?all=true
```

백엔드에서 이 파라미터를 처리하도록 구현해야 합니다:
- `all=true`가 있으면: 모든 항목 반환 (active + inactive)
- `all=true`가 없으면: active 항목만 반환

### Python/FastAPI 예시
```python
@app.get("/api/representative-works")
async def get_representative_works(all: bool = False):
    if all:
        # Return all items including inactive
        return db.query(RepresentativeWork).all()
    else:
        # Return only active items
        return db.query(RepresentativeWork).filter(RepresentativeWork.is_active == True).all()
```

## 이미지가 깨지거나 로드되지 않는 경우

### 1. CORS 설정 확인
백엔드에서 이미지 도메인에 대한 CORS 설정이 필요합니다.

### 2. S3 버킷 권한 확인
- 버킷이 public read 권한을 가지고 있는지 확인
- CloudFront를 사용하는 경우 올바른 URL인지 확인

### 3. 이미지 경로 디버깅
콘솔에서 확인:
```javascript
console.log('Image URL:', getImageUrl(image_path));
```

## 개발 서버 재시작
변경사항이 반영되지 않으면:
```bash
npm run dev
```

또는:
```bash
# 캐시 삭제 후 재시작
rm -rf .next
npm run dev
```

