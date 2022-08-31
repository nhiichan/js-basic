const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playButton = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const nextButton = $(".btn-next");
const prevButton = $(".btn-prev");

const randomButton = $(".btn-random");
const repeatButton = $(".btn-repeat");

const playlist = $(".playlist");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            id: 1,
            name: "Reality",
            singer: "Lost Frequencies",
            img: "./assets/img/img1.jpg",
            music: "./assets/music/song1.mp3",
        },
        {
            id: 2,
            name: "You Don't Know Me",
            singer: "Brodie Barclay",
            img: "./assets/img/img2.jpg",
            music: "./assets/music/song2.mp3",
        },
        {
            id: 3,
            name: "Endless Love",
            singer: "Diana Ross",
            img: "./assets/img/img3.jpg",
            music: "./assets/music/song3.mp3",
        },
        {
            id: 4,
            name: "Illusionary Daytime",
            singer: "Shirfine",
            img: "./assets/img/img4.jpg",
            music: "./assets/music/song4.mp3",
        },
        {
            id: 5,
            name: "Cause I love you",
            singer: "Noo Phuoc Thinh",
            img: "./assets/img/img5.jpg",
            music: "./assets/music/song5.mp3",
        },
        {
            id: 6,
            name: "Lệ Tình",
            singer: "Instrumental",
            img: "./assets/img/img6.jpg",
            music: "./assets/music/song6.mp3",
        },
        {
            id: 7,
            name: "1 3 5",
            singer: "Alan Walker",
            img: "./assets/img/img7.jpg",
            music: "./assets/music/song7.mp3",
        },
        {
            id: 8,
            name: "Legendary",
            singer: "Amadeus",
            img: "./assets/img/img8.jpg",
            music: "./assets/music/song8.mp3",
        },
        {
            id: 9,
            name: "Horizon",
            singer: "Janji",
            img: "./assets/img/img9.jpg",
            music: "./assets/music/song9.mp3",
        },
        {
            id: 10,
            name: "Ignite",
            singer: "Alan Walker",
            img: "./assets/img/img10.jpg",
            music: "./assets/music/song10.mp3",
        },
        {
            id: 11,
            name: "Sakura Tear",
            singer: "Snigellin",
            img: "./assets/img/img11.jpg",
            music: "./assets/music/song11.mp3",
        },
        {
            id: 12,
            name: "Something Just Like This",
            singer: "The Chainsmokers",
            img: "./assets/img/img12.jpg",
            music: "./assets/music/song12.mp3",
        },
        {
            id: 13,
            name: "N 30 N - Speed",
            singer: "Alan Walker",
            img: "./assets/img/img13.jpg",
            music: "./assets/music/song13.mp3",
        },
        {
            id: 14,
            name: "Fiction Sad",
            singer: "Instrumental",
            img: "./assets/img/img14.jpg",
            music: "./assets/music/song14.mp3",
        },
        {
            id: 15,
            name: "Melody Of The Night",
            singer: "Shi Jin",
            img: "./assets/img/img15.jpg",
            music: "./assets/music/song15.mp3",
        },
        {
            id: 16,
            name: "Kiss The Rain",
            singer: "Yiruma",
            img: "./assets/img/img16.jpg",
            music: "./assets/music/song16.mp3",
        },
        {
            name: "Họ Yêu Ai Mất Rồi",
            singer: "Doãn Hiếu",
            img: "./assets/img/img17.jpg",
            music: "./assets/music/song17.mp3",
            id: 17,
        },
        {
            name: "Dưới Những Cơn Mưa",
            singer: "Mr Siro",
            img: "./assets/img/img18.jpg",
            music: "./assets/music/song18.mp3",
            id: 18,
        },
        {
            name: "Unstoppable",
            singer: "Sia",
            img: "./assets/img/img19.jpg",
            music: "./assets/music/song19.mp3",
            id: 19,
        },
        {
            name: "Ngẫu Hứng",
            singer: "Hoaprox",
            img: "./assets/img/img20.jpg",
            music: "./assets/music/song20.mp3",
            id: 20,
        },
    ],
    setConfig: function (key, value) {
        console.log(key, value);
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${
                    index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                    <div
                        class="thumb"
                        style="
                            background-image: url(${song.img});
                        "
                    ></div>
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
        playlist.innerHTML = htmls.join("\n");
    },
    defineProperties: function () {
        Object.defineProperties(this, {
            currentSong: {
                get: function () {
                    return this.songs[this.currentIndex];
                },
            },
        });
    },
    handleEvents: function () {
        // Xử lý phóng to / thu nhỏ cd
        const cdWidth = cd.offsetWidth;

        document.onscroll = function () {
            const scrollTop = window.scrollY || window.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = (newCdWidth > 0 ? newCdWidth : 0) + "px";
            cd.style.opacity = (newCdWidth > 0 ? newCdWidth : 0) / cdWidth;
        };

        // Xử lý quay và dừng cd
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity,
        });
        cdThumbAnimate.pause();

        // Xử lý khi ấn nút play / pause
        playButton.onclick = function () {
            if (!app.isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        };

        // Khi bài hát được play
        audio.onplay = function () {
            cdThumbAnimate.play();
            app.isPlaying = true;
            player.classList.add("playing");
        };

        // Khi song bị pause
        audio.onpause = function () {
            cdThumbAnimate.pause();
            app.isPlaying = false;
            player.classList.remove("playing");
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        };

        // Xử lý khi tua bài hát
        progress.onchange = function (e) {
            console.log(e.target.value);
            const targetTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = targetTime;
        };

        // Khi next bài hát
        nextButton.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        };

        // Khi previous bài hát
        prevButton.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.previousSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        };

        // Xử lý random bật tắt
        randomButton.onclick = function () {
            app.isRandom = !app.isRandom;
            app.setConfig("isRandom", app.isRandom);
            randomButton.classList.toggle("active", app.isRandom);
        };

        // Xử lý phát lại một bài hát
        repeatButton.onclick = function () {
            app.isRepeat = !app.isRepeat;
            app.setConfig("isRepeat", app.isRepeat);
            repeatButton.classList.toggle("active", app.isRepeat);
        };

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play();
            } else {
                nextButton.click();
            }
        };

        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            // Xử lý ấn vào bài hát -> play bài hát đó
            if (songNode || e.target.closest(".option")) {
                // xử lý khi click vào song
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    console.log(songNode.dataset.index);
                    app.render();
                    app.loadCurrentSong();
                    audio.play();
                }
                // xử lý khi click vào option
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 300);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.img})`;
        audio.src = this.currentSong.music;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    previousSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
            console.log(newIndex);
        } while (this.currentIndex === newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe và xử lý các sự kiện
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong();

        // Render lại playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat và random
        randomButton.classList.toggle("active", this.isRandom);
        repeatButton.classList.toggle("active", this.isRepeat);
    },
};

app.start();
