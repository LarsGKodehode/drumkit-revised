// ====================
// Enviroment Variables
// ====================

const SOUND_DIR = "assets";
const root = document.getElementById("root");


// ==========================
// Setup hotkey functionality
// ==========================

/**
 * Creates a store for keybindings
 */
function createKeyBindingBuffer() {
    let functionStore = {};

    /**
     * Adds a keyDownEvent to listen for with a callback function
     */
    function bindKey(callback, key) {
        functionStore[key] = callback;
    };

    /**
     * @returns a specific callback for a keycode
     */
    function getCallback(keyCode) {
        return functionStore[keyCode];
    };

    /**
     * @returns a list of all registered keys
     */
    function list() {
        const entries = Object.entries(functionStore);
        return entries.map(entry => entry[0]);
    };

    return {
        getCallback,
        bindKey,
        list,
    };
};


/**
 * Creates a new keyboard listner
 */
function createKeyboardListner(keyBindings) {
    if(!keyBindings) {
        console.trace("No keybindings object provided");
        console.dir(keyBindings);
        return;
    };

    const controller = new AbortController();

    /**
     * Starts listning for keydown events
     */
    function start() {
        document.addEventListener("keydown", (event) => {
            if(!(typeof(keyBindings.getCallback(event.code)) === "function")) return;
        
            keyBindings.getCallback(event.code)();
            },
            {signal: controller.signal},
        );
    };

    return {
        start,
        /**
         * Cancels listning for keydown events
         */
        stop: controller.abort,
    };
};


// ============================
// Load large files into memory
// ============================

/**
 * Creates a new array buffer for storing assets in memory
 */
function createAssetBuffer() {
    let buffer = [];
    
    /**
     * Takes a path to an audio file and stores the audio file in the array buffer
     * @return refrence to audio file
     */
     function addAsset(path) {
        const newLength = buffer.push(new Audio(path));
        return buffer[newLength - 1];
    };

    /**
     * Lists all stored assets
     */
    function list() {
        return Object.assign(buffer);
    };

    return {
        list,
        addAsset,
    };
};


// ====================
// Setting up the stage
// ====================

/**
 * Creates a new DOM node
 * @returns the node
 */
function createNode(instrument, handleClick) {
    const node = document.createElement("button");

    // Custumize node
    node.textContent = instrument.type;
    node.classList = [
        "instrument",
        instrument.type,
    ].join(" ");
    
    const title = String(instrument.id).charAt(0).toUpperCase() + instrument.id.slice(1);
    node.title = title;

    // Attach event handler
    node.onclick = handleClick;

    return node;
};

/**
 * Creates a single instrument with keybindings
 */
function createInstrument(
    {
        root,
        instrument,
        soundFolder,
        soundBuffer
    }
    ) {
    const sound = soundBuffer.addAsset([soundFolder, instrument.sound].join("/"));

    /**
     * Plays a sound
     */
    function playSound() {
        sound.currentTime = 0;
        sound.play();
    }

    root.appendChild(createNode(instrument, playSound));

    keyBindings.bindKey(playSound, instrument.code);
};

/**
 * Create all the instruments
 */
function createInstruments(options) {
    options.instruments.forEach(instrument => createInstrument({instrument, ...options}));
};


// ==============================
// Actually starting up the stuff
// ==============================

// Drums
const keyBindings =  createKeyBindingBuffer();
const keyboardListner = createKeyboardListner(keyBindings);
const soundBuffer = createAssetBuffer();

// Badly placed import here
import instruments from "./data/instruments.js";
const instrumentsOptions = {
    instruments: instruments,
    root: root,
    soundFolder: SOUND_DIR + "/Drums",
    soundBuffer: soundBuffer,
};
createInstruments(instrumentsOptions);
keyboardListner.start();

// Strings
const keyBindings2 =  createKeyBindingBuffer();
const keyboardListner2 = createKeyboardListner(keyBindings2);
const soundBuffer2 = createAssetBuffer();

// Badly placed import here
import { violinNotes } from "./assets/Strings/instruments.js";
const notesViolin = violinNotes.map((note) => {
    return {id: `violin_${note.note}`, sound: note.sound, code: null, type: "string"};
})
const instrumentsOptions2 = {
    instruments: notesViolin,
    root: root,
    soundFolder: SOUND_DIR + "/Strings/violin",
    soundBuffer: soundBuffer2,
};
createInstruments(instrumentsOptions2);
keyboardListner2.start();