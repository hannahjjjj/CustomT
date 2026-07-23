const form = document.querySelector("#submission-form");
const photoInput = document.querySelector("#photo");
const preview = document.querySelector("#preview");
const uploadPrompt = document.querySelector("#upload-prompt");
const statusElement = document.querySelector("#status");
const submitButton = document.querySelector("#submit-button");
const MAX_FILE_SIZE = 10 * 1024 * 1024;
let previewUrl = null;

function showStatus(message, type = "") {
  statusElement.textContent = message;
  statusElement.className = `status ${type}`;
}

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/") || file.size > MAX_FILE_SIZE) {
    photoInput.value = "";
    preview.hidden = true;
    uploadPrompt.hidden = false;
    showStatus("10MB 이하의 JPG, PNG 또는 WEBP 파일을 선택해주세요.", "error");
    return;
  }

  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(file);
  preview.src = previewUrl;
  preview.hidden = false;
  uploadPrompt.hidden = true;
  showStatus("");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const config = window.APP_CONFIG || {};
  if (!config.SUPABASE_URL || config.SUPABASE_URL.includes("YOUR_")) {
    showStatus("관리자 설정이 아직 완료되지 않았습니다. config.js를 확인해주세요.", "error");
    return;
  }

  const file = photoInput.files[0];
  if (!file || file.size > MAX_FILE_SIZE) {
    showStatus("10MB 이하의 사진을 선택해주세요.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.firstChild.textContent = "업로드 중... ";
  showStatus("사진을 안전하게 업로드하고 있어요.");

  try {
    const client = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
    const extension = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const photoPath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await client.storage
      .from("tshirt-photos")
      .upload(photoPath, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;

    const { error: insertError } = await client.from("tshirt_submissions").insert({
      name: form.elements.name.value.trim(),
      size: form.elements.size.value,
      photo_path: photoPath,
    });

    if (insertError) {
      await client.storage.from("tshirt-photos").remove([photoPath]);
      throw insertError;
    }

    form.reset();
    preview.hidden = true;
    uploadPrompt.hidden = false;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    showStatus("제출이 완료됐어요. 고맙습니다!", "success");
  } catch (error) {
    console.error(error);
    showStatus("제출하지 못했습니다. 잠시 후 다시 시도해주세요.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.firstChild.textContent = "제출하기 ";
  }
});
