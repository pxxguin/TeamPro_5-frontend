let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

export const setCurrentUser = (user) => {
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const getCurrentUser = () => {
  return currentUser;
};

export const clearCurrentUser = () => {
  currentUser = null;
  localStorage.removeItem("currentUser"); // 로그아웃 시 localStorage에서 제거
};
