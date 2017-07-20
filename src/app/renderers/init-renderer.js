import Renderer, { createElement } from './renderer';

export default function render(state, stateMachine) {
    Renderer.of(
        <div>
            <h1>DevCenter INITED</h1>
        </div>
    ).into(document.body);
}