class Calculator {
    #ms = 1000;
    #fps = 1;
    #bpm = 60;
    #bpb = 4;
    #bn = 4;

    constructor() {

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