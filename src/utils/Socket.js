import {event} from './event'
/* export interface HeaderBeatProps {
  //心跳发送时间
  time: number;
  //心跳等待时间
  timeout: number;
  //重连时间
  reconnect: number;
  reconnectTotal?: number
  openHandler?: () => void;
  closeHandler?: () => void;
  errorHandler?: () => void;
  messageHandler?: (e: MessageEvent<any> | undefined) => void;
} */

class Socket extends WebSocket {
    WebSocketState;
    heartBeat/* :HeaderBeatProps */;
    isReconnect;
    reconnectTimmer;
    reconnectCurrent;
    url;
    constructor(url,protocols) {
        super(url,protocols);
        this.WebSocketState = false;
        this.heartBeat = {
            time:30*1000,
            timeout:3*1000,
            reconnect:10*1000,
        }
        this.reconnectCurrent=0;
        this.url=url;
        this.reconnectTimmer=null;
        this.isReconnect=true;
        return this
    }
    init(heartBeatConfig,isReconnect=true) {
        if(heartBeatConfig) this.heartBeat =heartBeatConfig;
        this.isReconnect = isReconnect;
        this.onopen = ()=>{
            console.log('连接成功');
            this.WebSocketState = true;
            this.send(JSON.stringify({
                type:'heart_beat',
                msg:new Date().toString(),
                url:this.url,
            }));
            if(heartBeatConfig?.openHandler) heartBeatConfig?.openHandler();
        }
        this.onclose = (error)=>{
            console.error('连接断开',error);
            this.WebSocketState = false;
            this.reconnectWebSocket();
            if(heartBeatConfig?.closeHandler) heartBeatConfig?.closeHandler();
        }
        this.onerror = ()=>{
            this.WebSocketState = false;
            console.error('连接错误,请查看网络条件');
            if(heartBeatConfig?.errorHandler) heartBeatConfig?.errorHandler();
        }
        this.onmessage = (e)=>{
            console.log('收到消息',e);
            if(heartBeatConfig?.messageHandler) heartBeatConfig?.messageHandler(e);
        }
    }
    getMsg(){}
    
    startHeartBeat(time){
        setTimeout(()=>{
            if(this.WebSocketState) {
                this.send(JSON.stringify({
                    type:'heart_beat',
                    msg:new Date().toString(),
                    url:this.url,
                }));
                console.log('发送心跳消息');
                this.waitingServer()
            }
        },time)
    }
    waitingServer(){
        setTimeout(()=>{
            if (this.webSocketState) {
                this.startHeartBeat(this.heartBeat.time)
                return
            }
            console.log('心跳无响应，已断线');
            try {
                this.close()
            } catch (error) {
                console.error('链接已关闭');
            }
            this.reconnectWebSocket()
        },this.heartBeat.timeout)
    }
    reconnectWebSocket() {
        if (!this.isReconnect) return;
        if (this.reconnectCurrent === this.heartBeat.reconnectTotal) {
            clearTimeout(this.reconnectTimer);
            console.error('尝试重连次数已到达最大限制，无法重连,请刷新重试');
            return;
        }
        this.reconnectTimer = setTimeout(() => {
            this.reconnectCurrent++
            event.emit('reconnect')
        }, this.heartBeat.reconnect)
    }
}
export default Socket;