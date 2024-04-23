declare var MozWebSocket;
declare var window;


var ws = null as typeof import('ws');

if (typeof WebSocket !== 'undefined') {
  ws = WebSocket as any;
} else if (typeof MozWebSocket !== 'undefined') {
  ws = MozWebSocket
} else if (typeof global !== 'undefined') {
  ws = global.WebSocket || global.MozWebSocket
} else if (typeof window !== 'undefined') {
  ws = window.WebSocket || window.MozWebSocket
} else if (typeof self !== 'undefined') {
  ws = self.WebSocket || (self as any).MozWebSocket
} else {
  ws = require('ws');
}

export default ws
