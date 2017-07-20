const supportedEvents = {
    'onClick': 'click',
    'onSubmit': 'submit',
};
const attachedListeners = {};

function rnd() {
    return (''+Math.random()).slice(2);
}

function addContent(el, contents) {
    contents.forEach((content) => {
        if (typeof content === 'string') {
            el.appendChild(document.createTextNode(content));
        } else if (Array.isArray(content)) {
            addContent(el, content);
        } else {
            el.appendChild(content);
        }
    });
}

function setAttribute(element, key, value) {
    if (Object.keys(supportedEvents).includes(key)) {
        const eventKey = supportedEvents[key];
        let listeners = attachedListeners[eventKey];
        if (!listeners) {
            document.body.addEventListener(eventKey, eventCallback)
            listeners = { [getRID(element)]: value };
        } else {
            listeners[getRID(element)] = value;
        }
        attachedListeners[eventKey] = listeners;
    } else if (key === 'ref') {
        element.dataset.ref = value;
    } else {
        element.setAttribute(key, value);
    }
}

export function createElement(tag, attrs, ...contents) {
    if (typeof tag === 'function') {
        return tag(attrs);
    }
    const el = document.createElement(tag);

    el.dataset['rid'] = rnd();
    attrs && Object.keys(attrs).forEach((attrKey) => setAttribute(el, attrKey, attrs[attrKey]));

    addContent(el, contents);

    return el;
}

function eventCallback(event) {
    const target = event.target;
    const rid = getRID(target);
    const type = event.type;
    if (attachedListeners[type]) {
        Object.entries(attachedListeners[type])
            .filter(([elRid]) => elRid === rid)
            .forEach(([elRid, fn]) => fn(event, target));
    }
}
function getRID(element) {
    return element.dataset['rid'];
}

function findRIDS(container) {
    return Array.from(container.querySelectorAll('[data-rid]'))
        .map(getRID);
}

function purgeEventsListeners(ids) {
    Object.values(attachedListeners)
        .forEach((listeners) => {
            ids.forEach((id) => delete listeners[id]);
        });
}


class Renderer {
    constructor(el, container) {
        this.el = el;
        this.container = container;
    }

    static of(el) {
        return new Renderer(el);
    }

    place() {
        if (!this.el || !this.container) {
            throw new Error('Both `el` and `container` must be defined.')
        }
        const unmountingIds = findRIDS(this.container);
        purgeEventsListeners(unmountingIds);
        this.container.innerHTML = '';
        if (Array.isArray(this.el)) {
            this.el.forEach((e) => this.container.appendChild(e));
        } else {
            this.container.appendChild(this.el);
        }
    }

    into(container) {
        this.container = container;
        this.place();
    }
}

export default Renderer;