class Log {
    static console = true; // 私有/静态 属性，但是因为是js不支持private
    log(title,text) {
        if(!Log.console) return;
        const color = '#ff4d4f';
        console.log(
            `%c ${title} %c ${text} %c`,
            `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
            `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
            'background:transparent'
        );
    }
    closeConsole() {
        Log.console = false;
    }
}

export class EventDispatcher extends Log {
    listeners={};// 私有属性 { [type: string]: Function[] }
    addEventListener(type,listeners) { //protected
        if(!this.listeners[type]) {
            this.listeners[type] = []
        }
        if(this.listeners[type].indexOf(listeners) === -1) {
            this.listeners[type].push(listeners);
        }
    }
    removeEventListener(type) { // protected
        this.listeners[type] = [];
    }
    dispatchEvent(type,data) {
        const listenersArray = this.listeners[type] || [];
        if(listenersArray.length===0) return ;
        listenersArray.forEach(listener => {
            listener.call(this.data)
        }); 
    }
}