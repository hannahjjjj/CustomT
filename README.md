# 티셔츠 신청 사이트

이름, 티셔츠 사이즈, 사진을 받는 GitHub Pages용 정적 사이트입니다. 제출 정보와 비공개 사진은 Supabase에 저장됩니다.

## 1. Supabase 연결

1. [Supabase](https://supabase.com/)에서 무료 프로젝트를 만듭니다.
2. **SQL Editor**를 열고 `supabase-setup.sql` 전체를 실행합니다.
3. **Project Settings → API**에서 Project URL과 `anon` public key를 확인합니다.
4. `config.js`의 `YOUR_SUPABASE_URL`, `YOUR_SUPABASE_ANON_KEY`를 각각 바꿉니다.

`service_role` 키는 관리자 권한이므로 절대 웹사이트 코드에 넣지 마세요.

## 2. GitHub Pages 배포

1. 이 폴더의 파일을 GitHub 저장소 루트에 올립니다.
2. 저장소의 **Settings → Pages**로 이동합니다.
3. **Deploy from a branch**를 선택하고, `main` 브랜치의 `/ (root)`를 저장합니다.
4. 표시된 `https://아이디.github.io/저장소명/` 주소로 접속합니다.

## 3. 제출 결과 내려받기

- 이름/사이즈 명단: Supabase **Table Editor → tshirt_submissions**에서 CSV로 내보냅니다.
- 사진: Supabase **Storage → tshirt-photos**에서 파일을 선택해 내려받습니다.

사진 버킷은 비공개이며, 익명 방문자는 업로드만 할 수 있습니다. 수집 목적이 끝나면 개인정보와 사진을 삭제하세요.

## 로컬 미리보기

파일을 직접 더블클릭하는 대신 이 폴더에서 간단한 로컬 서버를 실행하세요.

```powershell
python -m http.server 8000
```

그 뒤 브라우저에서 `http://localhost:8000`을 엽니다.
