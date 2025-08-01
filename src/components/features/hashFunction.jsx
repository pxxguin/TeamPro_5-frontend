export const hashFunction = async (password) => {
  try {
    // TextEncoder를 사용해 문자열을 바이트 배열로 변환
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // SHA-256 해시 생성
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // ArrayBuffer를 16진수 문자열로 변환
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

    return hashHex;
  } catch (error) {
    console.error("해시 생성 중 오류 발생:", error);
    throw error;
  }
};