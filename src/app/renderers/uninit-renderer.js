import Renderer, { createElement } from './renderer';

function Input({ text, type }) {
    const id = (''+Math.random()).slice(2);
    return (
        <label for={id}>
            <input type={type} placeholder={text} ref={text.toLowerCase()} />
        </label>
    );
}
function getValue(container, refs) {
    return Array.from(container.querySelectorAll('[data-ref]'))
        .filter((el) => refs.includes(el.dataset.ref))
        .reduce((vals, el) => ({...vals, [el.dataset.ref]: el.value }), {});
}

function testLogin(stateMachine) {
    return (event, el) => {
        console.log('getValue', getValue(el, ['username', 'password']));
        stateMachine.apply('password_ok'); event.preventDefault();
    }
}

export default function render(state, stateMachine) {
    Renderer.of(
        <div>
            <h1>DevCenter</h1>
            <form onSubmit={testLogin(stateMachine)}>
                <Input text="Username" type="text"/>
                <Input text="Password" type="password"/>
                <button type="submit">Save</button>
            </form>
        </div>
    ).into(document.body);
}