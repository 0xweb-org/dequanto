import { $dependency } from '@dequanto/utils/$dependency';

declare var MozWebSocket;
declare var window;


let ws = null as typeof import('ws');

if (typeof WebSocket !== 'undefined') {
    ws = WebSocket as any;
}
if (ws == null && typeof MozWebSocket !== 'undefined') {
    ws = MozWebSocket
}
if (ws == null && typeof global !== 'undefined') {
    ws = global.WebSocket || global.MozWebSocket
}
if (ws == null && typeof window !== 'undefined') {
    ws = window.WebSocket || window.MozWebSocket
}
if (ws == null && typeof self !== 'undefined') {
    ws = self.WebSocket || (self as any).MozWebSocket
}

export namespace WebSocketProvider {
    export async function get (): Promise<typeof ws> {
        if (ws != null) {
            return ws;
        }
        return $dependency.load('ws');
    }
}
