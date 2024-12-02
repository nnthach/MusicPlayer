const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'PLAYER_MUSIC'

const cd = $('.cd')
const heading = $('header h2')
const singer = $('header p')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const wrap = $('.wrap')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeateBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIdx: 0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
        name: "Malibu",
        singer: "16Typh",
        path: "./assets/music/song1.mp3",
        image: "./assets/img/song1.jpg",
        },
        {
        name: "Get Money",
        singer: "Thai VG",
        path: "./assets/music/song2.mp3",
        image: "./assets/img/song2.jpg",
        },
        {
        name: "Thoundsand Year",
        singer: "USUK",
        path: "./assets/music/song3.mp3",
        image: "./assets/img/song3.jpg",
        },
        {
        name: "Phong Zin Zin",
        singer: "Tlinh",
        path: "./assets/music/song4.mp3",
        image: "./assets/img/song4.jpg",
        },
        {
        name: "Hop On Da Show",
        singer: "Tlinh",
        path: "./assets/music/song5.mp3",
        image: "./assets/img/song5.jpg",
        },
        {
        name: "shhhhhhhhhhh",
        singer: "Wean",
        path: "./assets/music/song6.mp3",
        image: "./assets/img/song6.jpg",
        },
        {
            name: "Alone",
            singer: "Wean",
            path: "./assets/music/song7.mp3",
            image: "./assets/img/song7.jpg",
        },
    ],

    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function () {
        const htmls = this.songs.map((song,index) => {
        return `
                <div class="song ${index == this.currentIdx ? 'active' : ''}" data-index='${index}'>
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playlist.innerHTML = htmls.join("");
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIdx]
            }
        })
    },

    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // cd rotate
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity // loop
        })
        cdThumbAnimate.pause()

        // zoom CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        };

        // click play btn
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }

        // play
        audio.onplay = () => {
            _this.isPlaying = true
            wrap.classList.add('playing')
            cdThumbAnimate.play()
        }

        // pause
        audio.onpause = () => {
            _this.isPlaying = false
            wrap.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // show music time on progress
        audio.ontimeupdate = () => {
            if(audio.duration){
                const progressPercent = Math.floor((audio.currentTime/audio.duration)*100)
                progress.value = progressPercent
                console.log('progress value',progress.value)
            }
        }

        // change song time
        progress.onchange = (e) => {
            const seekTime = audio.duration / 100 *  e.target.value // tổng thời lượng (second) / 100 * phần trăm
            console.log('seek time',seekTime)
            audio.currentTime = seekTime
        }

        // next btn
        nextBtn.onclick = () => {
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // prev btn
        prevBtn.onclick = () => {
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // randomSong
        randomBtn.onclick = () => {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // repeat
        repeateBtn.onclick = () => {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeateBtn.classList.toggle('active', _this.isRepeat)
        }

        // next song when audio ended
        audio.onended = () => {
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        // click on song want to play
        playlist.onclick = (e) => {
            const songEle = e.target.closest('.song:not(.active)')
            // take the song not active
            if(songEle || e.target.closest('.option')){
                // click on song
                if(songEle){
                    _this.currentIdx = songEle.dataset.index
                    _this.render()
                    _this.loadCurrentSong()
                    audio.play()
                }

                // click on song's option
                if(e.target.closest('.option')){

                }
            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        },300)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        singer.textContent = this.currentSong.singer
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        console.log(heading,cdThumb,audio)
    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function() {
        this.currentIdx++

        if(this.currentIdx >= this.songs.length){
            this.currentIdx = 0
        }

        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIdx--

        if(this.currentIdx < 0){
            this.currentIdx = this.songs.length-1
        }

        this.loadCurrentSong()
    },

    randomSong: function(){
        let newIndex

        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex == this.currentIdx)

        console.log(newIndex)
        this.currentIdx = newIndex
        this.loadCurrentSong()
    },

    start: function () {
        // load config
        this.loadConfig();
        // define properties for object
        this.defineProperties();
        // listen event
        this.handleEvents();
        // load song list
        this.loadCurrentSong();
        // render playlist
        this.render();

        // show status of btn
        repeateBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)

    },
};

app.start();
