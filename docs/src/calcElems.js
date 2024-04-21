class Label extends HTMLLabelElement {
    constructor(text, for_) {
        super();
        this.htmlFor = for_;
        this.textContent = text;
    }
}

class InputButton extends HTMLButtonElement {
    /**
     * Function to be called when button is activated.
     *
     * @type {function}
     */
    #callback;

    /**
     * Creates an instance of NumInputButton.
     *
     * @constructor
     * @param {string} value
     * @param {function} callback
     */
    constructor(id, value, callback) {
        this.value = value;
        this.type = "button";
        this.#callback = callback;
        this.onclick = this.activate;
    }

    disable() {
        if (!this.disabled) this.disabled = true;
    }

    enable() {
        if (this.disabled) this.disabled = false;
    }

    activate() {
        if (!this.disabled) this.#callback();
    }

    static createIncrement(parentId, callback) {
        return new InputButton(`${parentId}-inc`, callback);
    }

    static createDecrement(parentId, callback) {
        return new InputButton(`${parentId}-dec`, callback);
    }
}

/**
 * Converts `NumberInputElement`'s values to numbers, or NaN if they
 * are invalid inputs.
 *
 * @param {string} value
 * @return {number} Converted value or NaN.
 */
function convertNumberInput(value) {
    // value = value.replace(' ', '').replace(',', '.');
    const num = /^(?<n>([\d]+\.?\d*)|(\.\d+))((?<f>\/)(?<m>([\d]+\.?\d*)|(\.\d+)))?$/;

    // if (!num.test(value)) return NaN;

    let { n, f, m } = value.match(num).groups;

    if (f) {
        if (m) {
            return +n / +m;
        }
        return NaN;
    }

    return +n;
}

class NumberInputElement extends HTMLInputElement {
    #min;
    #step;
    #value;

    /**
     * Creates a Numeric input element.
     *
     * @constructor
     * @param {string} id
     * @param {number} [step=1]
     * @param {number?} [min=null]
     */
    constructor(id, value, step, min) {
        super();
        this.id = id;
        this.type = "text";
        this.#value = value;
        this.dec = InputButton.createDecrement(id, this.decrement);
        this.inc = InputButton.createIncrement(id, this.increment);
        this.#step = step;
        this.onkeydown = event => {
            if (event.key == 'Enter') {
                this.update();
            }
            if (!['0', '1', '2', '3', '4', '5', '6',
                '7', '8', '9', '.', ',', '/',].included(event.key)) {
                    event.preventDefault();
            }

        };
        if (min !== null) this.#min = min;
    }

    increment() {
        this.#value += this.#step;
        this.dec.enable();
    }

    decrement() {
        if (this.#min === null) {
            if (this.min <= (this.#value - this.#step)) {
                this.#value -= this.#step;
            }
            else {
                this.#value = this.#min;
                this.dec.disable();
            }
        }
    }

    update(value) {

        // handle refused inputs based on this function's output
    }

    /**
     * Stored value
     *
     * @type {number}
     */
    get number() { return this.#value; }
    set number(value) {
        if (this.#min && value >= this.#min) {
            this.#value = value;
            if (this.#value == this.#min) this.dec.disable();
            else this.dec.enable();
        }
    }
}

class NumberInput extends HTMLDivElement {
    /**
     * Label
     *
     * @type {Label}
     */
    #label;
    /**
     * Number input
     *
     * @type {NumberInputElement}
     */
    #number;

    constructor(id, label, value = 0, step = 1, min = 0) {
        super();
        this.#number = new NumberInputElement(id, value, step, min);
        this.#label = new Label(label, id);
        this.id = `${id}-container`;
        this.append(this.#label, this.number, this.number.dec, this.number.inc);
    }

    /**
     * @param {number} value
     */
    set(value) {
        this.#number.number = value;
    }

    /**
     * @returns {number}
     */
    valueOf() {
        return this.#number.number;
    }
}