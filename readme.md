## 代码演示
#### 引入
```typescript jsx
    import AudioPlayer from 'taro-audio';
```
#### 基础用法

通过`src`属性设置音频资源的地址

``` jsx
    <AudioPlayer src={'你的路径'}/>
```

![lvruHP.png](http://cdn.hixiaoya.com/taro-audioPlayer/1.png)

#### 显示音频名称

通过`title`属性显示音频名称

``` jsx
    <AudioPlayer src={'你的路径'} title='泡沫'/>
```

![lvr39g.png](http://cdn.hixiaoya.com/taro-audioPlayer/2.png)

#### 显示作者

通过`author`属性显示作者

``` jsx harmony
<AudioPlayer src={'你的路径'} title='泡沫' author='邓紫棋'/>
```

![lvr83Q.png](http://cdn.hixiaoya.com/taro-audioPlayer/3.png)

#### 自动播放

通过`autoplay`设置

```jsx harmony
<AudioPlayer src={'你的路径'} title='泡沫' author='邓紫棋' autoplay />
```

![lvrQN8.png](http://cdn.hixiaoya.com/taro-audioPlayer/4.png)

#### 进度条是否可拖拽

通过`draggable`设置
```jsx harmony
 <AudioPlayer src={'你的路径'} title='泡沫' author='邓紫棋' autoplay={true} draggable={false}/>
```
![lvrnBt.png](http://cdn.hixiaoya.com/taro-audioPlayer/5.png)

#### 设置海报
通过`poster`设置

```typescript jsx
<AudioPlayer src={'你的路径'} title='泡沫' author='邓紫棋' autoplay={false} draggable poster={'你的路径'}/>
```

![lxn3vj.png](http://cdn.hixiaoya.com/taro-audioPlayer/6.png)

### Props

| 参数 | 说明 | 类型 | 默认值 | 是否必须 |
|------|------|------|------|------|
| src | 音频资源的地址  | `string` | 无 | 是 |
| draggable | 是否可以拖动进度条 | `boolean` | true | 否 |
| title | 音频名称 | `string` | 无 | 否 |
| author | 音频作者 | `string` | 无 | 否 |
| autoplay | 是否自动播放 | `boolean` | `false`| 否 |
| poster | 音频海报 | `string` | 无 | 否 |
| onPlay | 当开始/继续播放时触发play事件 | `eventHandle` | 无 | 否 
| onPause | 当暂停播放时触发 pause 事件 | `eventHandle` | 无 | 否
| onEnded | 当播放到末尾时触发 ended 事件 | `eventHandle` | 无 | 否
| onTimeUpdate | 当播放进度改变时触发 timeupdate 事件，detail = {currentTime, duration} | `eventHandle` | 无 | 否
| onError | 当发生错误时触发 error 事件，detail = {errMsg:MediaError.code} | `eventHandle` | 无 | 否
