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

/**
 * Rounds to n decimals.
 *
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
function roundToN(value, decimals) {
    const n = 10 ** decimals;
    return Math.round(value * n) / n;
}

class Div extends HTMLDivElement {
    constructor(...elems) {
        super();
        this.classList.add("aulage-elem");
        elems?.forEach(elem => {
            this.appendChild(elem);
        });
    }
}
customElements.define("aulage-div", Div, { extends: "div" });

class Label extends HTMLLabelElement {

    /**
     * Elem that this is for
     *
     * @type {NumberInputElement}
     */
    #forElem;

    constructor(text, forElem) {
        super();
        this.classList.add("aulage-elem");
        this.#forElem = forElem;
        this.htmlFor = this.#forElem.id;
        this.textContent = text;
        this.onclick = click;
    }

    click() {
        this.#forElem.machineSet();
    }
}
customElements.define('aulage-label', Label, { extends: "label" });

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
        super();
        this.classList.add("aulage-elem");
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
customElements.define("aulage-inputbutton", InputButton, { extends: "button" });

class NumberInputElement extends HTMLInputElement {
    #min;
    #step;
    #dec;
    #inc;
    #value;
    #isUserSet = false;

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
        this.classList.add("aulage-elem");
        this.#dec = InputButton.createDecrement(id, this.decrement);
        this.#inc = InputButton.createIncrement(id, this.increment);
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

    /**
     * Stored value
     *
     * @type {number}
     */
    get number() { return this.#value; }
    set number(value) {
        if (this.#min && value >= this.#min) {
            this.#value = value;
            if (this.#value == this.#min) this.#dec.disable();
            else this.#dec.enable();
        }
        else {
            this.#value = value;
        }
    }

    /**
     * Stored value rounded to 2 decimals
     *
     * @readonly
     * @type {number}
     */
    get number2() { return roundToN(this.#value, 2); }

    /**
     * Stored value rounded to 6 decimals
     *
     * @readonly
     * @type {number}
     */
    get number6() { return roundToN(this.#value, 6); }

    get isUserSet() { return this.#isUserSet; }

    machineSet() {
        if (this.#isUserSet) {
            this.#isUserSet = false;
            this.classList.remove('userset');
        }
    }

    #userSet() {
        if (!this.#isUserSet) {
            this.#isUserSet = true;
            this.classList.add('userset');
        }
    }

    increment() {
        this.#value += this.#step;
        this.#dec.enable();
        this.#userSet();
    }

    decrement() {
        if (this.#min !== null) {
            if (this.min <= (this.#value - this.#step)) {
                this.#value -= this.#step;
            }
            else {
                this.#value = this.#min;
                this.#dec.disable();
            }
        }
        else {
            this.#value -= this.#step;
        }
        this.#userSet();
    }

    // update(value) {

    //     // handle refused inputs based on this function's output
    // }

    elems() {
        return [this, this.#dec, this.#inc];
    }
}
customElements.define("aulage-numberinput", NumberInputElement, { extends: "input" });

class InputContainer extends HTMLDivElement {
    /**
     * Label
     *
     * @type {Label}
     */
    _label;

    /**
     * Number input
     *
     * @type {NumberInputElement}
     */
    _input;

    /**
     * Default value.
     *
     * @type {number}
     */
    _defaultValue;

    constructor(id, defaultValue) {
        super();
        this.id = `${id}-container`;
        this.classList.add("aulage-elem");
        this._defaultValue = defaultValue;
    }

    /**
     * Set value directly
     *
     * @param {number} value
     */
    set(value) {
        this._input.number = value;
    }

    /**
     * Set value to default
     */
    setDefault() {
        this._input.number = this._defaultValue;
    }

    /**
     * @returns {number}
     */
    valueOf() {
        return this._input.number;
    }
}
customElements.define("aulage-inputcontainer", InputContainer, { extends: "div" });

class NumberInput extends InputContainer {
    /**
     * Creates an instance of NumberInput.
     *
     * @constructor
     * @param {string} id
     * @param {string} label
     * @param {number} defaultValue
     * @param {number?} [value=null]
     * @param {number} [step=1]
     * @param {number} [min=0]
     */
    constructor(id, label, defaultValue, value = null, step = 1, min = 0) {
        super(id, defaultValue);
        this._input = new NumberInputElement(id, value ?? defaultValue, step, min);
        this._label = new Label(label, this._input);
        this.append(this._label, ...this._input.elems);
    }
    set(value) {
        this._input.number = value;
    }

    setDefault() {
        this._input.number = this._defaultValue;
    }

    valueOf() {
        return this._input.number;
    }
}

class Option extends HTMLOptionElement {
    constructor(text, value) {
        super();
        this.text = text;
        this.value = value;
    }

    /**
     * Creates a new option.
     *
     * @param {string} text
     * @param {number} value
     * @returns {Option}
     */
    fromValues(text, value) {
        return new Option(text, value);
    }
}
customElements.define("aulage-option", Option, { extends: "option" });

class ListInputElement extends HTMLSelectElement {
    constructor(id, selected, ...values) {
        super();
        this.id = id;
        this.multiple = false;
        values.forEach(option => {
            this.options.add(option);
        });
        this.value = selected;
    }
}
customElements.define("aulage-listinput", ListInputElement, { extends: "select" });

// for beat note selection, etc
class ListInput extends InputContainer {
    /**
     * Creates an instance of ListInput.
     *
     * @constructor
     * @param {string} id
     * @param {string} label
     * @param {number} defaultValue
     * @param {...Option} values
     */
    constructor(id, label, defaultValue, ...values) {
        super(id, defaultValue);
        this._input = new ListInputElement(id, defaultValue, values);
        this._label = new Label(label, this._input);
        this.append(this._label, ...this_input.elems);
    }

    set(value) {
        this._input.selectedIndex = value;
    }

    setDefault() {
        this._input.selectedIndex = defaultValue;
    }

    valueOf() {
        return this._input.selectedOptions[0].text;
    }
}

class Calculator {
    /** @type {HTMLDivElement} */
    #container;
    /** @type {boolean} */
    #built = false;
    // values for default state
    #ms = new NumberInput("ms", "milliseconds", 1000);
    #fps = new NumberInput("fps", "frames per seconds", 1);
    #bpm = new NumberInput("bpm", "beats per minute", 60);
    #bpb = new NumberInput("bpb", "beats per bar", 4);
    #bn = new ListInput("bn", "beat note", 4,
        Option.fromValues("\ud834\udd5d breve", 1),
        Option.fromValues("\ud834\udd5e minim", 2),
        Option.fromValues("\ud834\udd5e\ud834\udd6d dotted minim", 3),
        Option.fromValues("\ud834\udd5f crotchet", 4),
        Option.fromValues("\ud834\udd5f\ud834\udd6d dotted crotchet", 6),
        Option.fromValues("\ud834\udd60 quaver", 8),
        Option.fromValues("\ud834\udd61 semiquaver", 16),
        Option.fromValues("\ud834\udd62 demisemiquaver", 32),
        Option.fromValues("\ud834\udd63 hemidemisemiquaver", 64),
        Option.fromValues("\ud834\udd64 semihemidemisemiquaver", 128)
    );

    constructor(containerId = "aulage", build = true) {
        this.#container = document.getElementById(containerId);

        if (build) {
            build();
        }
    }

    build() {
        if (this.#built) return;
        this.#built = true;
        this.#container.classList.add("aulage-container");



        // desired layout:
        // GENERIC | VIDEO
        //       AUDIO

        const timeContainer = new Div(this.#ms);
        timeContainer.id = "time-container";
        const videoContainer = new Div(this.#fps);
        videoContainer.id = "video-container";
        const audioContainer = new Div(this.#bpm, this.#bpb, this.#bn);
        audioContainer.id = "audio-container";

        this.#container.append(timeContainer, videoContainer, audioContainer);

        // TODO: cont here
    }
}

class OldCalculator {
    /** @type {HTMLDivElement} */
    #container;
    #built = false;
    #ms = 1000;
    #fps = 1;
    #bpm = 60;
    #bpb = 4;
    #bn = 4;

    constructor(containerId = "aulage", build = true) {
        this.#container = document.getElementById(containerId);

        if (build) {
            build();
        }
    }

    build() {
        if (this.#built) return;
        this.#built = true;
        this.#container.classList.add("aulage-container");
        // TODO: cont here
    }

    /**
     * Milliseconds
     * 
     * @type {number}
     */
    get ms() { return this.#ms; }
    set ms(ms) {
        this.#ms = ms;
    }

    /**
     * Seconds
     * 
     * @type {number}
     */
    get s() { return this.#ms * 1000; }
    set s(s) {
        this.#ms = s * 1000;
    }

    /**
     * Frames per second
     *
     * @type {number}
     */
    get fps() { return this.#fps; }
    set fps(fps) {
        this.s = 1 / fps;
    }

    /**
     * Frames per beat
     *
     * @type {number}
     */
    get fpb() { return this.bs / this.#fps; }
    // set fpb(fpb) {
    //     this.ms = this.mt * fpb;
    // }

    /**
     * Frames per measure
     *
     * @type {number}
     */
    get fpm() { return this.mt / this.#fps }

    /**
     * Frametime in milliseconds rounded to 2 decimal places.
     * 
     * @type {number}
     */
    get fms() { return (1 / this.#fps * 1000).toFixed(2); }

    /**
     * Frametime in milliseconds rounded to 6 decimal places.
     * 
     * This is to be used for Audacity labels.
     *
     * @type {number}
     */
    get fls() { return (1 / this.#fps * 1000).toFixed(6); }

    /**
     * 30 fps compatibility
     *
     * @type {boolean}
     */
    get comp30() { return this.#fps % 30 == 0; }

    /**
     * 60 fps compatibility
     *
     * @type {boolean}
     */
    get comp60() { return this.#fps % 60 == 0; }

    /**
     * Beats per minute
     *
     * @type {number}
     */
    get bpm() { return this.#bpm; }
    set bpm(bpm) {
        this.ms = 60 / bpm;
    }

    /**
     * Beats per seconds
     *
     * @type {number}
     */
    get bs() { return this.#bpm / 60; }

    /**
     * Beats per measure
     *
     * @type {number}
     */
    get bpb() { return this.#bpb; }

    /**
     * Beats per measure predefined values
     *
     * @type {number[]}
     */
    get bpbList() {
        return [1, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 19, 39];
    }

    /**
     * Beat note
     *
     * @type {number}
     */
    get bn() { return this.#bn; }

    /**
     * Beat note predefined values
     *
     * @type {number[]}
     */
    get bnList() { return [1, 2, 4, 8, 16, 32, 64]; }

    /**
     * Measure time in seconds
     *
     * @type {number}
     */
    get mt() { return this.bs * this.bpb; }
}