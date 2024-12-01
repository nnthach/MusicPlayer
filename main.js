const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd')
const heading = $('header h2')
const singer = $('header p')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const wrap = $('.wrap')

const app = {
    currentIdx: 0,
    isPlaying:false,

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

    render: function () {
        const htmls = this.songs.map((song) => {
        return `
                    <div class="song">
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
        $(".playlist").innerHTML = htmls.join("");
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

        audio.onplay = () => {
            _this.isPlaying = true
            wrap.classList.add('playing')
        }

        audio.onpause = () => {
            _this.isPlaying = false
            wrap.classList.remove('playing')
        }
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        singer.textContent = this.currentSong.singer
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        console.log(heading,cdThumb,audio)
    },

    start: function () {
        this.defineProperties();

        this.handleEvents();

        this.loadCurrentSong();

        this.render();
    },
};

app.start();
