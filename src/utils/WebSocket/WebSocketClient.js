import { EventDispatcher } from "./Dispatcher";


export class WebSocketClient extends EventDispatcher {
    url = ''; // socket链接
    socket = null ; // socket实例
    reconnectCount = 0; // 重连次数
    reconnectMax = 5; // 最大重连次数
    reconnectInterval = 5000; // 重连间隔 5s
    heartbeatInterval = 5000; // 发送心跳间隔 5s
    heartbeatTimer = NodeJS.Timeout; // 计时器id
    stopWs = false; // 彻底终止socket
    dataPrefix;
    constructor(url,dataPrefix) {
        super();
        this.url = url;
        this.dataPrefix = dataPrefix;
    }
    // 生命周期钩子
    onopen(callback) {
        this.addEventListener('open',callback);
    }
    onclose(callback) {
        this.addEventListener('close',callback)
    }
    onmessage(callback) {
        this.addEventListener('message',callback)
    }
    onreconnect(callback) {
        this.addEventListener('reconnect',callback)
    } 
    onerror(callback) {
        this.addEventListener('error',callback)
    }
    ondead(callback) {
        this.addEventListener('dead',callback)
    }
    // 修改dataPrefix
    setDataPrefix(dataPrefix) {
        this.dataPrefix = {
            ...this.dataPrefix,
            ...dataPrefix
        }
    }

    // 消息发送
    send(message) {
        if(this.socket&&this.socket.readyState===WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                ...message,
                ...this.dataPrefix
            }))
        } else {
            console.error('[Websocket] 未连接',message);
        }
    }
    // 初始化连接
    connect() {
        if(this.reconnectCount===0) {
            this.log('WebSocket',`初始化连接中... ${this.url}`)
        }
        if(this.socket && this.socket.readyState===WebSocket.OPEN) {
            return
        }
        this.socket = new WebSocket(this.url);
        this.socket.onopen = event=>{
            this.stopWs = false;
            // 重置重连尝试成功连接
            this.reconnectCount = 0;
            this.startHeartbeat();
            this.log('WebSocket', `连接成功,等待服务端数据推送[onopen]... ${this.url}`);
            this.dispatchEvent('open',event);
        };
        this.socket.onmessage = event =>{
            if(this.reconnectCount===0) {
                this.log('WebSocket',`连接断开[onclose]... ${this.url}`);
            }
            this.dispatchEvent('close',event);
        }
        this.socket.onerror = event=>{
            if(this.reconnectCount===0) {
                this.log('WebSocket',`连接异常[onerror]... ${this.url}`);
            }
            this.closeHeartbeat();
            this.dispatchEvent('error',event);
        }
    }
    handleReconnect() {
        if(this.reconnectCount<this.reconnectMax) {
            this.reconnectCount++;
            this.log('WebSocket',`尝试重连中... ${this.reconnectCount}/${this.reconnectMax} ${this.url}`);
            this.dispatchEvent('reconnect',this.reconnectCount);
            setTimeout(()=>{
                this.connect();
            },this.reconnectInterval)
        } else {
            this.closeHeartbeat();
            this.dispatchEvent('dead',{});
            this.log('WebSocket',`尝试重连失败... ${this.url}`);
        }
    }
    
    close() {
        if(this.socket) {
            this.stopWs = true;
            this.socket.close();
            this.socket = null;
            this.removeEventListener('open');
            this.removeEventListener('close');
            this.removeEventListener('message');
            this.removeEventListener('error');
        }
        this.closeHeartbeat()
    }
    // 开启心跳检测 -> 定时发送心跳消息
    startHeartbeat() { // private
        if(this.stopWs) return;
        if(this.heartbeatTimer) {
            this.closeHeartbeat();
        }
        this.heartbeatTimer = setInterval(()=>{
            if(this.socket) {
                this.send({
                    type:'heart_beat',
                    msg:new Date().toString(),
                    url:this.url
                });
                this.log('WebSocket',`发送心跳消息... ${this.url}`);
            } else {
                console.error('[Websocket] 未连接')
            }
        },this.heartbeatInterval)
    }
    // 关闭心跳
    closeHeartbeat() { // private
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
    }
}