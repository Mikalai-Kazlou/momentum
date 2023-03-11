import playList from './playList.js';

const ePlayList = document.querySelector('.play-list');

const btPlay = document.querySelector('.play');
const btPrevious = document.querySelector('.play-prev');
const btNext = document.querySelector('.play-next');

const playerButtons = {
  play: btPlay,
  previous: btPrevious,
  next: btNext,
}

class Player {
  constructor(ctrl, list) {
    this.ctrl = ctrl;
    this.list = list;
    this.isPlay = false;

    this.audio = new Audio();
    this.audio.src = this.list.getInitial();
    this.audio.addEventListener('ended', () => { this.playNext() });

    this.ctrl.buttons.play.addEventListener('click', () => { this.play() });
    this.ctrl.buttons.previous.addEventListener('click', () => { this.playPrevious() });
    this.ctrl.buttons.next.addEventListener('click', () => { this.playNext() });
  }

  play() {
    if (this.isPlay) {
      this.audio.pause();
      this.ctrl.playOn();
      this.list.setActive(-1);
    } else {
      this.audio.play();
      this.ctrl.playOff();
      this.list.setActive(this.list.current);
    }

    this.isPlay = !this.isPlay;
  }

  playPrevious() {
    this.audio.src = this.list.getPrevious();
    this.isPlay = false;
    this.play();
  }

  playNext() {
    this.audio.src = this.list.getNext();
    this.isPlay = false;
    this.play();
  }
}

class PlayerController {
  constructor(buttons) {
    this.buttons = buttons;
  }

  playOn() {
    this.buttons.play.classList.remove('pause');
  }

  playOff() {
    this.buttons.play.classList.add('pause');
  }
}

class PlayList {
  constructor(listControl, listContent) {
    this.listControl = listControl;
    this.listContent = listContent;
    this.current = 0;

    listContent.forEach(el => {
      let li = document.createElement('li');
      li.classList.add('play-item');
      li.textContent = el.title;
      this.listControl.append(li);
    });
  }

  getInitial() {
    return this.listContent[0].src;
  }

  getPrevious() {
    this.current = (this.current > 0) ? this.current -= 1 : this.listContent.length - 1;
    this.setActive(this.current);
    return this.listContent[this.current].src;
  }

  getNext() {
    this.current = (this.current < this.listContent.length - 1) ? this.current += 1 : 0;
    this.setActive(this.current);
    return this.listContent[this.current].src;
  }

  setActive(numberOfActive) {
    for (let i = 0; i < this.listControl.children.length; i++) {
      (numberOfActive === i)
        ? this.listControl.children[i].classList.add('play-item-active')
        : this.listControl.children[i].classList.remove('play-item-active')
    }
  }
}

const ctrl = new PlayerController(playerButtons);
const list = new PlayList(ePlayList, playList);

export default new Player(ctrl, list);