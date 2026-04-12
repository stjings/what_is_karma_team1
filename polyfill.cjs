// Node.js 환경에서 깨진 localStorage 폴리필 교체
// --localstorage-file 플래그가 잘못된 경로로 주입될 때 발생하는 오류 방지
'use strict';

(function patchLocalStorage() {
  const store = Object.create(null);

  const mockStorage = {
    getItem(key) { return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null; },
    setItem(key, value) { store[String(key)] = String(value); },
    removeItem(key) { delete store[String(key)]; },
    clear() { const keys = Object.keys(store); keys.forEach(k => delete store[k]); },
    key(index) { return Object.keys(store)[index] ?? null; },
    get length() { return Object.keys(store).length; },
  };

  try {
    // localStorage가 존재하지만 getItem이 함수가 아닐 때 교체
    if (typeof global.localStorage === 'undefined' || typeof global.localStorage.getItem !== 'function') {
      Object.defineProperty(global, 'localStorage', {
        value: mockStorage,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    // sessionStorage도 동일하게 처리
    if (typeof global.sessionStorage === 'undefined' || typeof global.sessionStorage.getItem !== 'function') {
      Object.defineProperty(global, 'sessionStorage', {
        value: mockStorage,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
  } catch (e) {
    // 정의 실패 시 직접 할당
    global.localStorage = mockStorage;
    global.sessionStorage = mockStorage;
  }
})();
