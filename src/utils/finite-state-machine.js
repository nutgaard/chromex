import constMap from './const-map';
const nodes = constMap(['UNINIT', 'INIT']);
const edges = constMap(['PASSWORD_OK']);

export const defaultConfig = {
    start: nodes.uninit,
    nodes: {
        [nodes.init]: {},
        [nodes.uninit]: {
            [edges.password_ok]: nodes.init
        }
    }
};

class FiniteStateMachine {
    constructor(config) {
        this.config = config;
        this.state = config.start;
        this.listeners = [];
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    _notifyListeners() {
        this.listeners.forEach((listener) => listener(this.state));
    }

    getState() {
        return this.state;
    }

    goto(state) {
        if (!nodes[state]) {
            throw new Error(`Unknown state ${state}. Available states: ${nodes}`);
        }
        this.state = nodes[state];
        this._notifyListeners();
        return this.state;
    }

    apply(transition) {
        const stateConfig = this.config.nodes[this.state];
        const edge = edges[transition];
        if (!stateConfig[edge]) {
            throw new Error(`Unknown transition ${transition} on state ${this.state}. Available transitions: ${Object.keys(stateConfig)}`);
        }
        this.state = stateConfig[edge];
        this._notifyListeners();
        return this.state;
    }
}

export default FiniteStateMachine;