import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import './index.scss'
import AudioPlayer from "../../components/audioPlayer";

const PaoMao = "http://cdn.hixiaoya.com/paomo.mp3";
const DzqImg = "http://cdn.hixiaoya.com/dzq.jpg";

class Index extends Component {

  config: Config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    return (
      <View>

        <View className='demo'><AudioPlayer src={PaoMao}/></View>
        <View className='demo'><AudioPlayer src={PaoMao} title='泡沫'/></View>
        <View className='demo'><AudioPlayer src={PaoMao} title='泡沫' author='邓紫棋'/></View>
        <View className='demo'><AudioPlayer src={PaoMao} title='泡沫' author='邓紫棋' autoplay/></View>
        <View className='demo'><AudioPlayer src={PaoMao} title='泡沫' author='邓紫棋' autoplay={false}
                                            draggable={false}/></View>
        <View className='demo'><AudioPlayer src={PaoMao} title='泡沫' author='邓紫棋' autoplay={false} draggable
                                            poster={DzqImg}/></View>


      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index;
