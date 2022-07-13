"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_BROWSER = void 0;
exports.is_BROWSER = typeof window !== 'undefined' && window.navigator?.userAgent != null;
