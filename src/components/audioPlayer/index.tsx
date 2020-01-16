import Taro, {Component} from '@tarojs/taro';
import {View, Slider, Text} from '@tarojs/components';
import './index.scss';

const CDN = 'http://cdn2.ibt.tel/';
const playSrc = CDN + 'wordcamp/stu/icon/play_icon.png';
const pauseSrc = CDN + 'wordcamp/stu/icon/pause_icon.png';

interface AudioPlayerProps {
  src: string,
  controls?: boolean,
  name?: string,
  author?: string,
  dragable?: boolean,
  autoplay?: boolean
}

interface AudioContext {
  src: string,
  autoplay: boolean,
  readonly onCanplay: void
}
//自动播放时，图标应该正确响应
class AudioPlayer extends Component  <AudioPlayerProps> {
  // private innerAudioContext: {
  //   autoplay: boolean
  //   src: string
  //   onCanplay(param: (res) => void): void;
  // };
  static defaultProps = {
    controls: true,
    autoplay: false
  };
  innerAudioContext: AudioContext;

  // private innerAudioContext: Taro.InnerAudioContext

  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0, //当前播放时间，单位s
      playing: false, //是否在播放
      iconSrc: playSrc,
      duration: 0,  // 默认播放总时长，单位s
      showTime1: '00:00',
      showTime2: '00:00'
    };

    this.sliderChange = this.sliderChange.bind(this);
    this.changeIconSrc = this.changeIconSrc.bind(this);

  }



  componentDidMount() {

    this.innerAudioContext = Taro.createInnerAudioContext();
    this.innerAudioContext.autoplay = this.props.autoplay;
    this.innerAudioContext.src = this.props.src;

    const that = this;
    this.innerAudioContext.onCanplay((res) => {
      console.log(res, '音频进入可以播放的阶段'); //没有加载完的回调函数，所以写成setTimeout
      console.log(this.innerAudioContext, that.innerAudioContext, 38);

      //延时获取音频真正的duration
      const duration: number = this.innerAudioContext.duration; //单位秒
      console.log(duration, 41);
      let min = parseInt(  duration / 60);
      let sec = parseInt(duration % 60);
      if (min.toString().length === 1) {
        min = `0${min}`;
      }
      if (sec.toString().length === 1) {
        sec = `0${sec}`;
      }
      this.setState({duration: duration, showTime2: `${min}:${sec}`});

      //刷新时间
      that.interval = setInterval(() => {
        let duration = that.innerAudioContext.duration; //单位秒
        if (duration) {
          let min = parseInt(duration / 60);
          let sec = parseInt(duration % 60);
          if (min.toString().length === 1) {
            min = `0${min}`;
          }
          if (sec.toString().length === 1) {
            sec = `0${sec}`;
          }
          that.setState({duration: duration, showTime2: `${min}:${sec}`});
          clearInterval(that.interval)
        }
      }, 150)

    });
    this.innerAudioContext.onTimeUpdate(() => {
      const currentTime = that.innerAudioContext.currentTime;
      let min = parseInt(currentTime / 60);
      let sec = parseInt(currentTime % 60);
      if (min.toString().length === 1) {
        min = `0${min}`;
      }
      if (sec.toString().length === 1) {
        sec = `0${sec}`;
      }
      that.setState({showTime1: `${min}:${sec}`, currentTime: currentTime});

    });
    this.innerAudioContext.onPlay(() => {
      console.log('开始播放');
      const duration = that.innerAudioContext.duration; //单位秒
      let min = parseInt(duration / 60);
      let sec = parseInt(duration % 60);
      if (min.toString().length === 1) {
        min = `0${min}`;
      }
      if (sec.toString().length === 1) {
        sec = `0${sec}`;
      }
      that.setState({duration: duration, showTime2: `${min}:${sec}`});
    });
    this.innerAudioContext.onError((res) => {
      console.log(res.errMsg);
      console.log(res.errCode)
    });
    this.innerAudioContext.onEnded(() => {
      that.setState({
        iconSrc: playSrc
      })
    })

  }

  componentWillUnmount() {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy();
    }
  }


  //改变播放状态
  changeIconSrc() {
    let iconSrc = this.state.iconSrc;
    if (iconSrc === playSrc) {
      iconSrc = pauseSrc;
      console.log(this.innerAudioContext, 63);
      this.innerAudioContext.play();
    } else {
      iconSrc = playSrc;
      this.innerAudioContext.pause();
    }

    this.setState({
      playing: !this.state.playing,
      iconSrc: iconSrc
    })

  }

  //改变进度条
  sliderChange(event) {
    console.log(event.detail);
    let min = parseInt(event.detail.value / 60);
    let sec = parseInt(event.detail.value % 60);
    if (min.toString().length === 1) {
      min = `0${min}`;
    }
    if (sec.toString().length === 1) {
      sec = `0${sec}`;
    }
    this.setState({
      currentTime: event.detail.value,
      showTime1: `${min}:${sec}`
    });
    console.log(this.state.currentTime, 149);
    this.innerAudioContext.seek(event.detail.value);
    if (this.innerAudioContext.paused) {

    } else {
      this.innerAudioContext.play();
    }
  }

  // 正在拖动的过程中
  sliderChangeIng() {

  }


  render() {
    let {currentTime, showTime2, showTime1, duration} = this.state;
    let {poster, name, author, dragable} = this.props;
    return (
      <View className='co-audio-wrap'>
        {
          poster && (
            <View className='poster-wrap'>
              <Image src={poster} className='poster' mode='widthFix' />
            </View>
          )
        }

        <View className="text-wrap">
          {
            name && (
              <View className="audio-name">
                <Text>{name}</Text>
              </View>
            )
          }
          {
            author && (
              <View className='audio-author'>
                <Text>{author}</Text>
              </View>
            )
          }

        </View>


        <View className='player'>
          <Image src={iconSrc} onClick={this.changeIconSrc} />
          <View className='slider'>
            <Slider
              onChange={this.sliderChange}
              min={0}
              step={1}
              max={duration}
              block-size={12} value={currentTime}
              onChanging={this.sliderChangeIng}
              disabled={!dragable}
            />
          </View>
          <View className='time'>
            {showTime1}/{showTime2}
          </View>
        </View>
      </View>

    )
  }
}


export default AudioPlayer;
