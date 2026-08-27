/*
  طبقة الحفظ للوحة الإدارة: تقرأ وتكتب assets/data.json مباشرة على GitHub
  عبر REST API، باستخدام Personal Access Token يُدخله المستخدم مرة واحدة
  ويُحفظ في localStorage الخاص بمتصفحه فقط (لا يُرسل لأي جهة غير GitHub).

  عدّلي REPO_BRANCH إذا صار الموقع يُنشر من فرع مختلف عن main.
*/

const REPO_OWNER = "fatimahAlzhrani25";
const REPO_NAME = "my-new-app";
const REPO_BRANCH = "main";
const DATA_PATH = "assets/data.json";

const TOKEN_KEY = "gh_pat";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function base64ToUtf8(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function ghRequest(path, options = {}) {
  const token = getToken();
  const base = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
  const url = path ? `${base}/${path}` : base;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${body}`);
  }
  return res.json();
}

async function fetchDataFile() {
  const json = await ghRequest(`contents/${DATA_PATH}?ref=${REPO_BRANCH}`);
  const content = base64ToUtf8(json.content);
  return { data: JSON.parse(content), sha: json.sha };
}

async function saveDataFile(dataObj, sha, message) {
  const content = JSON.stringify(dataObj, null, 2);
  const json = await ghRequest(`contents/${DATA_PATH}`, {
    method: "PUT",
    body: JSON.stringify({
      message: message || "تحديث بيانات ملف الأداء الوظيفي",
      content: utf8ToBase64(content),
      sha,
      branch: REPO_BRANCH,
    }),
  });
  return json.content.sha;
}

async function verifyToken() {
  await ghRequest("");
}
