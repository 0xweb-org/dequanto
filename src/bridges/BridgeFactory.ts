import { HopBridge } from './hop/HopBridge';
import { IBridge } from './models/IBridge';

export class BridgeFactory {
    bridges = [
        new HopBridge()
    ] as  IBridge[];

    get(name: 'hop' | string): IBridge {
        let bridge = this.bridges.find(x => x.name === name);
        if (bridge == null) {
            throw new Error(`Bridge $${name} not supported.`);
        }
        return bridge;
    }
}
