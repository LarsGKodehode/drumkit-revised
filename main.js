(() => {
  // src/assets/instruments.js
  var drums = [
    {
      id: "clap",
      sound: "clap.mp3",
      code: "KeyA",
      type: "drum"
    },
    {
      id: "hihat",
      sound: "hihat.mp3",
      code: "KeyS",
      type: "drum"
    },
    {
      id: "kick",
      sound: "kick.mp3",
      code: "KeyD",
      type: "drum"
    },
    {
      id: "openhat",
      sound: "openhat.mp3",
      code: "KeyF",
      type: "drum"
    },
    {
      id: "ride",
      sound: "ride.mp3",
      code: "KeyG",
      type: "drum"
    },
    {
      id: "snare",
      sound: "snare.mp3",
      code: "KeyH",
      type: "drum"
    },
    {
      id: "tink",
      sound: "tink.mp3",
      code: "KeyJ",
      type: "drum"
    },
    {
      id: "tom",
      sound: "tom.mp3",
      code: "KeyK",
      type: "drum"
    }
  ];
  var violinNotes = [
    { note: "A", sound: "violin_A3_025_mezzo-forte_arco-normal.mp3" },
    { note: "B", sound: "violin_B3_025_mezzo-forte_arco-normal.mp3" },
    { note: "C", sound: "violin_C4_025_mezzo-forte_arco-normal.mp3" },
    { note: "D", sound: "violin_D4_025_mezzo-forte_arco-normal.mp3" },
    { note: "E", sound: "violin_E4_025_mezzo-forte_arco-normal.mp3" },
    { note: "F", sound: "violin_F4_025_mezzo-forte_arco-normal.mp3" },
    { note: "G", sound: "violin_G3_025_mezzo-forte_arco-normal.mp3" }
  ];

  // src/main.js
  var SOUND_DIR = "assets";
  var root = document.getElementById("root");
  function createKeyBindingBuffer() {
    let functionStore = {};
    function bindKey(callback, key) {
      functionStore[key] = callback;
    }
    ;
    function getCallback(keyCode) {
      return functionStore[keyCode];
    }
    ;
    function list() {
      const entries = Object.entries(functionStore);
      return entries.map((entry) => entry[0]);
    }
    ;
    return {
      getCallback,
      bindKey,
      list
    };
  }
  function createKeyboardListner(keyBindings3) {
    if (!keyBindings3) {
      console.trace("No keybindings object provided");
      console.dir(keyBindings3);
      return;
    }
    ;
    const controller = new AbortController();
    function start() {
      document.addEventListener(
        "keydown",
        (event) => {
          if (!(typeof keyBindings3.getCallback(event.code) === "function"))
            return;
          keyBindings3.getCallback(event.code)();
        },
        { signal: controller.signal }
      );
    }
    ;
    return {
      start,
      stop: controller.abort
    };
  }
  function createAssetBuffer() {
    let buffer = [];
    function addAsset(path) {
      const newLength = buffer.push(new Audio(path));
      return buffer[newLength - 1];
    }
    ;
    function list() {
      return Object.assign(buffer);
    }
    ;
    return {
      list,
      addAsset
    };
  }
  function createNode(instrument, handleClick) {
    const node = document.createElement("button");
    node.textContent = instrument.type;
    node.classList = [
      "instrument",
      instrument.type
    ].join(" ");
    const title = String(instrument.id).charAt(0).toUpperCase() + instrument.id.slice(1);
    node.title = title;
    node.onclick = handleClick;
    return node;
  }
  function createInstrument({
    root: root2,
    instrument,
    soundFolder,
    soundBuffer: soundBuffer3
  }) {
    const sound = soundBuffer3.addAsset([soundFolder, instrument.sound].join("/"));
    function playSound() {
      sound.currentTime = 0;
      sound.play();
    }
    root2.appendChild(createNode(instrument, playSound));
    keyBindings.bindKey(playSound, instrument.code);
  }
  function createInstruments(options) {
    options.instruments.forEach((instrument) => createInstrument({ instrument, ...options }));
  }
  var keyBindings = createKeyBindingBuffer();
  var keyboardListner = createKeyboardListner(keyBindings);
  var soundBuffer = createAssetBuffer();
  var instrumentsOptions = {
    instruments: drums,
    root,
    soundFolder: SOUND_DIR + "/Drums",
    soundBuffer
  };
  createInstruments(instrumentsOptions);
  keyboardListner.start();
  var keyBindings2 = createKeyBindingBuffer();
  var keyboardListner2 = createKeyboardListner(keyBindings2);
  var soundBuffer2 = createAssetBuffer();
  var notesViolin = violinNotes.map((note) => {
    return { id: `violin_${note.note}`, sound: note.sound, code: null, type: "string" };
  });
  var instrumentsOptions2 = {
    instruments: notesViolin,
    root,
    soundFolder: SOUND_DIR + "/Strings/violin",
    soundBuffer: soundBuffer2
  };
  createInstruments(instrumentsOptions2);
  keyboardListner2.start();
})();
//# sourceMappingURL=main.js.map
