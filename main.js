const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);
const heading = $("header h2");
const playlist = $('.playlist');
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const play = $(".player");
const progress = $("#progress");
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $(".btn-repeat");
const PLAYER_STORAGE_KEY = "MUSIC_PLAYER";
var index;
const app ={
        currentIndex : 0,
        isPlaying : false,
        israndom : false,
        isrepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        setConfig: function(key, value){
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
        },
        songs: [
          {
            name: "Chạy Về Nơi Phía Anh",
            singer: "Khắc Việt",
            path: "audio/Chay Ve Noi Phia Anh - Khac Viet.mp3",
            image: "https://data.chiasenhac.com/data/cover/156/155099.jpg"
          },
          {
            name: "Yêu Đương Khó Quá Thì Chạy Về Khóc Với Anh",
            singer: "Erik",
            path: "audio/Yeu Duong Kho Qua Thi Chay Ve Khoc Voi A.mp3",
            image:"https://data.chiasenhac.com/data/cover/155/154074.jpg"
          },
            {
              name: "Waiting For You",
              singer: "MONO; Onionn",
              path: "audio/Waiting For You - MONO_ Onionn.mp3",
              image: "https://data.chiasenhac.com/data/cover/175/174241.jpg"
            },
           
            
            {
              name: "Tòng Phu",
              singer: "Keyo",
              path: "audio/Tong Phu - Keyo.mp3",
              image:
                "https://data.chiasenhac.com/data/cover/175/174246.jpg"
            },
            {
              name: "Không Trọn Vẹn Nữa",
              singer: "Châu Khải Phong ; ACV",
              path: "audio/Khong Tron Ven Nua - Chau Khai Phong_ AC.mp3",
              image:
                "https://data.chiasenhac.com/data/cover/153/152193.jpg"
            },
            {
              name: "Ngôi Sao Cô Đơn",
              singer: "Jack - J97",
              path:
                "audio/Ngoi Sao Co Don - Jack - J97.mp3",
              image:
                "https://data.chiasenhac.com/data/cover/172/171025.jpg"
            },
            {
              name: "Ai Chung Tình Được Mãi",
              singer: "Thương Võ; ACV",
              path: "audio/Ai Chung Tinh Duoc Mai - Thuong Vo_ ACV.mp3",
              image:
                "https://data.chiasenhac.com/data/cover/163/162555.jpg"
            } 
        ],


        render: function(){
            var htmls = this.songs.map((song,index) =>{
                return `
                <div class="song${index === this.currentIndex ? " active" : ""}" data-index =${index}>
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
            `
            });
            playlist.innerHTML = htmls.join("");
        },

          
        defineProperties: function(){
              Object.defineProperty(this,'currentSong',{
                get: function(){
                  return this.songs[this.currentIndex];
                }
              });
          },

        loadCurrentSong: function(){
              heading.textContent = this.currentSong.name;
              cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
              audio.src = this.currentSong.path;
          },


        nextSong: function() {
          this.currentIndex++
          if(this.currentIndex >= this.songs.length){
              this.currentIndex =0;
          }
          this.loadCurrentSong();
          this.render();
          this.scrollToActiveSong();
        },


        prevSong: function() {
          this.currentIndex--
          if(this.currentIndex <0  ){
              this.currentIndex = this.songs.length -1;
          }
          this.loadCurrentSong();
          this.render();
          this.scrollToActiveSong();

        },

        scrollToActiveSong: function(){
            setTimeout(()=>{
                $('.song.active').scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                })
            },200)
        },


        playRandomSong: function(){
          let Newindex;
          do{
              Newindex = Math.floor(Math.random() * this.songs.length)
          }
          while(Newindex === this.currentIndex);
          this.currentIndex = Newindex;
          this.loadCurrentSong();
          this.render();
          this.scrollToActiveSong();

        },

        

        handleEvents: function(){
              const _this = this;
              const cdWidth = cd.offsetWidth;
              document.onscroll = function(){
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                
                const newcdWidth = cdWidth - scrollTop;
                cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
                cd.style.opacity = newcdWidth/cdWidth;
              };
              const cdThumbAnimate = cdThumb.animate([
                {transform: 'rotate(360deg)'}
              ],{
                duration: 10000,
                iterations: Infinity,
              })

              playBtn.onclick = function(){
                
                if(_this.isPlaying){
                  audio.pause();
                }
                else{               
                  audio.play();                  
                }
                }
                audio.onplay = function(){
                  _this.isPlaying = true;
                  play.classList.add("playing");
                  cdThumbAnimate.play();
                }
                audio.onpause = function(){
                  _this.isPlaying = false;
                  play.classList.remove("playing");
                  cdThumbAnimate.pause();
                }

                audio.ontimeupdate = function(){
                  if(audio.duration){
                      const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                      progress.value = progressPercent;
                  }
                  
                progress.onchange = function(e){
                  const seekTime = (e.target.value)/100*audio.duration;
                  audio.currentTime = seekTime;
                }
                }

                nextBtn.onclick = function(){
                  if(_this.israndom){
                    _this.playRandomSong();
                    audio.play();
                  }else{
                  _this.nextSong();
                  audio.play();
                }
                }

                prevBtn.onclick = function(){
                  if(_this.israndom){
                    _this.playRandomSong();
                    audio.play();

                  }else{
                  _this.prevSong();
                  audio.play();
                }
                }


                randomBtn.onclick = function(e){
                    _this.israndom = !_this.israndom
                    _this.setConfig('isRandom', _this.israndom)
                    randomBtn.classList.toggle('active', _this.israndom)
                }
                
                repeatBtn.onclick = function(e){
                  _this.isrepeat = !_this.isrepeat
                  _this.setConfig('isRepeat', _this.isrepeat)
                  repeatBtn.classList.toggle("active", _this.isrepeat);
                  if(_this.isrepeat){
                    audio.loop = true;
                  }else{
                    audio.loop = false;
                  }
                }
                
                audio.onended = function(){
                  nextBtn.click();
                
                }

                playlist.onclick = function(e){

                  const songNode = e.target.closest('.song:not(.active');
                  const optionNode = e.target.closest('.option');

                  if(songNode || optionNode) {

                    if(songNode){
                      _this.currentIndex = Number(songNode.getAttribute('data-index'));
                      _this.loadCurrentSong();
                      _this.render();
                      audio.play();        
                    }

                    if(e.target.closest('option')){

                    }
                  }
                  
              }

                },
              



        

        start: function(){
            this.defineProperties();

            this.render();

            this.handleEvents();

            this.loadCurrentSong();
                
            
          },
}





app.start();
