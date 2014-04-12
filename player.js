window.onload = init;
var context;
var bufferLoader;

function init() {
    // Fix up prefixing
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }

    bufferLoader = new BufferLoader(
        context,
        ['breton.mp3','nirvana.mp3',],
        finishedLoading
    );

    bufferLoader.load();

    console.log(context);
    console.log(bufferLoader);

    document.querySelector('.play').addEventListener('click', playSound);
}

function playSound() {
        source = context.createBufferSource();
        source.buffer = bufferLoader.bufferList[1];
        source.connect(context.destination);
        source.start(0);
        document.querySelector('.stop').addEventListener('click', stopSound);
}

function stopSound() {
        source.stop(0);
}

function finishedLoading(bufferList) {
    // Create two sources and play them both together.
    source1 = context.createBufferSource();
    source2 = context.createBufferSource();
    source1.buffer = bufferList[0];
    source2.buffer = bufferList[1];

    source1.connect(context.destination);
    source2.connect(context.destination);
    //source1.start(0);
    //source2.start(0);

}


/* ***************************************************
* CLASS DE CHARGEMENT D'UN OU PLUSIEURS FICHIER
* ***************************************************/

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
