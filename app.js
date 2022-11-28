const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat')
const progressBar = $('.progress-bar')
const playList = $('.playlist')
const songCurrentTime = $('.current-time')
const songDurationTime = $('.duration-time')




const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    songs: [
        {
            name: 'Waiting for you',
            singer: 'MONO',
            path: './music/MONO  Waiting For You Album 22  Track No10.mp3',
            image: './img/MONO.jpg'
        },
        {
            name: 'Em là',
            singer: 'MONO',
            path: './music/MONO  Em Là Album 22  Track No03.mp3',
            image: './img/MONO.jpg'
        },
        {
            name: 'Muộn rồi sao mà còn',
            singer: 'Sơn Tùng MTP',
            path: './music/SƠN TÙNG MTP  MUỘN RỒI MÀ SAO CÒN  OFFICIAL MUSIC VIDEO.mp3',
            image: './img/MTP.jpg'
        },
        {
            name: 'Nắng ấm ngang qua',
            singer: 'Sơn Tùng MTP',
            path: './music/SƠN TÙNG MTP  SKY DECADE  Nắng Ấm Ngang Qua.mp3',
            image: './img/MTP.jpg'
        },
        {
            name: 'Có chắc yêu là đây',
            singer: 'Sơn Tùng MTP',
            path: './music/SƠN TÙNG MTP  CÓ CHẮC YÊU LÀ ĐÂY  OFFICIAL MUSIC VIDEO.mp3',
            image: './img/MTP.jpg'
        },
        {
            name: 'Nơi này có anh',
            singer: 'Sơn Tùng MTP',
            path: './music/NƠI NÀY CÓ ANH  OFFICIAL MUSIC VIDEO  SƠN TÙNG MTP.mp3',
            image: './img/MTP.jpg'
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index='${index}'>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handlEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        const cdThumbAnimate = cdThumb.animate({
            transform: ['rotate(0)', 'rotate(360deg)']
        },
        {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        audio.ontimeupdate = function () {
            if (audio.duration) {
              const progressPercent = Math.floor((audio.currentTime * 100) / audio.duration);
              progress.value = progressPercent;
              progress.style.background = `linear-gradient(to right, #ff2a5f ${progressPercent}%, #ccc 0%)`;
      
              // Xử lý tiến độ
              const minutesCurrent = Math.floor(audio.currentTime / 60) <= 9 ? '0' + Math.floor(audio.currentTime / 60) : Math.floor(audio.currentTime / 60);
              const secondsCurrent = Math.floor(audio.currentTime - minutesCurrent * 60) <= 9 ? '0' + Math.floor(audio.currentTime - minutesCurrent * 60) : Math.floor(audio.currentTime - minutesCurrent * 60);
              const minutesDuration = Math.floor(audio.duration / 60) <= 9 ? '0' + Math.floor(audio.duration / 60) : Math.floor(audio.duration / 60);
              const secondsDuration = Math.floor(audio.duration - minutesDuration * 60) <= 9 ? '0' + Math.floor(audio.duration - minutesDuration * 60) : Math.floor(audio.duration - minutesDuration * 60);
              songCurrentTime.innerText = minutesCurrent + ':' + secondsCurrent;
              songDurationTime.innerText = minutesDuration + ':' + secondsDuration;
            }
          };

        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth 
        }

        playBtn.onclick = function(){
            if (_this.isPlaying){
                audio.pause()
            }
            else{
            audio.play()
            }
        }

        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // audio.ontimeupdate = function(){
        //     if (audio.duration){
        //         const progressPercentage = Math.floor(audio.currentTime / audio.duration * 100)
        //         progress.value = progressPercentage
        //     }
        // }

        progress.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
    
        nextBtn.onclick = function() {
            if (_this.isRandom){
                _this.playRandomSong()
            } else {
            _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        prevBtn.onclick = function() {
            if (_this.isRandom){
                _this.playRandomSong()
            } else {
            _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            this.classList.toggle('active', _this.isRandom)
        }

        audio.onended = function() {
            if  (_this.isRepeat){
                audio.play()
            } else {
            nextBtn.click()
        }
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'nearest'
            })
        }, 300)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex<0) {
            this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function(){
        let random
        do {
            random = Math.floor(Math.random() * this.songs.length)
        } while (random === this.currentIndex)
        this.currentIndex = random
        this.loadCurrentSong()
        
    },

    start: function(){
        this.render();
        this.handlEvents();
        this.defineProperties();
        this.loadCurrentSong();
    }
}
app.start();