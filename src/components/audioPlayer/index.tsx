import {ComponentClass} from 'react';
import Taro, {Component} from '@tarojs/taro';
import {View, Slider, Text} from '@tarojs/components';
import './index.scss';
import {getMinute, getSecond} from "./util";

const CDN = 'http://cdn2.ibt.tel/';
const playSrc = CDN + 'wordcamp/stu/icon/play_icon.png';
const pauseSrc = CDN + 'wordcamp/stu/icon/pause_icon.png';

interface AudioPlayerProps {
  src: string,
  title?: string,
  author?: string,
  draggable?: boolean,
  autoplay?: boolean,
  poster?: string
}

interface AudioContext {
  src: string,
  autoplay: boolean,
  readonly currentTime: number,
  readonly onCanplay: void,
  readonly destroy: void,
  readonly duration: number,
  readonly onTimeUpdate: void,
  readonly onEnded: void,
  readonly seek: void,
  readonly play: void,
  readonly onPlay: void,
  readonly onError: void,
  readonly paused
}

interface StateType {
  readonly  currentTime: number,
  readonly iconSrc: string,
  readonly duration: number,
  readonly showTime1: string,
  readonly showTime2: string
}

//自动播放时，图标应该正确响应
class AudioPlayer extends Component  <AudioPlayerProps> {

  static defaultProps = {
    autoplay: false
  };


  // private innerAudioContext: Taro.InnerAudioContext

  constructor(props) {
    super(props);

    this.sliderChange = this.sliderChange.bind(this);
    this.changeIconSrc = this.changeIconSrc.bind(this);

  }

  state: StateType = {
    currentTime: 0, //当前播放时间，单位s
    iconSrc: playSrc,
    duration: 0,  // 默认播放总时长，单位s
    showTime1: '00:00',
    showTime2: '00:00'
  };




  componentDidMount() {

    this.innerAudioContext = Taro.createInnerAudioContext();
    this.innerAudioContext.autoplay = this.props.autoplay;
    this.innerAudioContext.src = this.props.src;

    if (this.props.autoplay) {
      this.setState({
        iconSrc: pauseSrc
      })
    } else {
      this.setState({iconSrc: playSrc})
    }

    let min: string;
    let sec: string;
    let duration: number;

    this.innerAudioContext.onCanplay((res) => {
      console.log(res, '音频进入可以播放的阶段'); //没有加载完的回调函数，所以写成setTimeout

      //延时获取音频真正的duration
      duration = this.innerAudioContext.duration; //单位秒

      min = getMinute(duration);
      sec = getSecond(duration);

      this.setState({duration: duration, showTime2: `${min}:${sec}`});

      //刷新时间
      const interval = setInterval(() => {
        duration = this.innerAudioContext.duration; //单位秒
        if (duration) {
          min = getMinute(duration);
          sec = getSecond(duration);
          this.setState({duration: duration, showTime2: `${min}:${sec}`});
          clearInterval(interval)
        }
      }, 150)

    });
    this.innerAudioContext.onTimeUpdate(() => {
      const currentTime = this.innerAudioContext.currentTime;
      min = getMinute(currentTime);
      sec = getSecond(currentTime);
      this.setState({showTime1: `${min}:${sec}`, currentTime: currentTime});

    });
    this.innerAudioContext.onPlay(() => {
      console.log('开始播放');
      duration = this.innerAudioContext.duration; //单位秒
      min = getMinute(duration);
      sec = getSecond(duration);
      this.setState({duration: duration, showTime2: `${min}:${sec}`});
    });
    this.innerAudioContext.onError((res) => {
      console.log(res.errMsg);
      console.log(res.errCode);
      Taro.showModal({title: '出错了', content: res.errMsg})
    });
    this.innerAudioContext.onEnded(() => {
      this.setState({
        iconSrc: playSrc
      })
    })

  }

  componentWillUnmount() {
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy();
    }
  }

  innerAudioContext: AudioContext;

  //播放暂停
  changeIconSrc() {
    let iconSrc = this.state.iconSrc;
    if (iconSrc === playSrc) {
      iconSrc = pauseSrc;
      this.innerAudioContext.play();
    } else {
      iconSrc = playSrc;
      this.innerAudioContext.pause();
    }

    this.setState({
      iconSrc: iconSrc
    })

  }

  //改变进度条
  sliderChange(event) {

    const min: string = getMinute(event.detail.value);
    const sec: string = getSecond(event.detail.value);
    this.setState({
      currentTime: event.detail.value,
      showTime1: `${min}:${sec}`
    });
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
    const {currentTime, showTime2, showTime1, duration} = this.state;
    const {poster, title, author, draggable} = this.props;
    return (
      <View className='co-audio-wrap'>
        {
          poster && (
            <View className='poster-wrap'>
              <Image src={poster} className='poster' mode='widthFix'/>
            </View>
          )
        }

        <View className='text-wrap'>
          {
            title && (
              <View className='audio-draggable'>
                <Text>{title}</Text>
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
          <Image src={iconSrc} onClick={this.changeIconSrc}/>
          <View className='slider'>
            <Slider
              onChange={this.sliderChange}
              min={0}
              step={1}
              max={duration}
              block-size={12} value={currentTime}
              onChanging={this.sliderChangeIng}
              disabled={!draggable}
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


export default AudioPlayer as ComponentClass;
