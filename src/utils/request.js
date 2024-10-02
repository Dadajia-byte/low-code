import axios from "axios"
// 这里手写了一个简易的LRU，就不在引入相关依赖了
class LRUCache {
    #map;
    #capacity;
    #maxAge;
    constructor({capacity,maxAge}) {
        this.#capacity = capacity;
        this.#maxAge = maxAge;
        this.#map = new Map();
    }
    get(key) {
        const item = this.#map.get(key);
        if(!item || Date.now() - item.timestamp > this.#maxAge) {
            this.#map.delete(key);
            return undefined;
        }
        this.#map.delete(key)
        this.#map.set(key,item)
        return item.value;
    }
    put(key,value) {
        if(this.#map.has(key)) {
            this.#map.delete(key);
        }
        this.#map.set(key,{value,timestamp:Date.now()});
        if(this.#map.size > this.#capacity) {
            this.#map.delete(this.#map.keys().next().value);
        }
    }
}

class AxiosService {
    constructor(options) {
        // 初始化请求管理队列
        this.pendingRequests = new Map();
        
        // 初始化最大接口数量
        this.activeRequestsCount = 0;
        this.maxRequestsCount = options.maxRequestsCount || 5;

        // 初始化实例
        this.instance = axios.create({
            baseURL:options.baseURL || process.env.VUE_APP_BASE_URL,
            timeout:options.timeout || 5000
        })
        
        // 初始化 LRU 缓存
        this.cache = new LRUCache({ // 这里的缓存会被刷新，不是真正意义上的C端的缓存，所以缓存时间不需要太长，容量也不需要太大
            capacity:options.capacity || 50,
            maxAge:options.maxAge || 1000*60*5 
        })
        
        // 初始化请求拦截器
        this.instance.interceptors.request.use(
            config=>{
                if(this.activeRequestsCount>=this.maxRequestsCount) {
                    return Promise.reject(`同时请求过多请稍后再试`)
                }
                
                this.removePendingRequest(config); // 移除重复请求
                this.addPendingRequest(config); // 添加请求至pengding队列
                
                // 缓存判断
                if(config.cache && this.cache.has(config.url)) {
                    return Promise.resolve(this.cache.get(config.url))
                }

                /* 使用双token判断 */
                const accessToken = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem('refreshToken');
                
                if(accessToken) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`
                }
                if(refreshToken && !accessToken) { // 存在刷新token但是访问token不存在，则使用刷新token获取访问token
                    return this.refreshToken().then(accessToken=>{
                        localStorage.setItem('accessToken',accessToken);
                        config.headers['Authorization'] = `Bearer ${accessToken}`
                        return config
                    }).catch(err=>{
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('accessToken');
                        return Promise.reject(err);
                    })
                }
                this.activeRequestsCount++;
                return config
            },
            err=> Promise.reject(err)
        )
        
        // 在实例上挂载refresh获取access的请求
        this.instance.refreshToken= ()=>{
            const refreshToken = localStorage.getItem('refreshToken');
            return axios.post('/api/user/getAccessToken',{refreshToken}).then(response=>{
                const accessToken = response.data.data.accessToken;
                return accessToken
            }).catch(err=>{
                console.log(err);
                throw err;
            })
        }

        // 相应拦截器
        this.instance.interceptors.response.use(
            response=>{
                this.removePendingRequest(response.config);
                
                // 缓存处理
                if(response.config.cache) { // 在接口中增加cache字段主动开启缓存
                    this.cache.put(response.config.url,response.data);
                }
                this.activeRequestsCount--;
               return response.data
            },
            error=>{
                this.removePendingRequest(error.config||{});
                this.activeRequestsCount--;
                return Promise.reject(error)
            }
        )
    }
    // pending请求队列，避免重复请求
    addPendingRequest(config) {
        const key = `${config.url}-${JSON.stringify(config.params||{})}-${JSON.stringify(config.data || {})}`;
        if(this.pendingRequests.has(key)) {
            config.cancelToken = new axios.CancelToken(cancel=>cancel(`请求取消`))
        } else {
            config.cancelToken = new axios.CancelToken(cancel=>{
                this.pendingRequests.set(key,cancel)
            });
        }
    } 
    // 移除请求队列
    removePendingRequest(config) {
        const key = `${config.url}-${JSON.stringify(config.params||{})}-${JSON.stringify(config.data || {})}`;
        if(this.pendingRequests.has(key)) {
            const cancel = this.pendingRequests.get(key);
            cancel(key);
            this.pendingRequests.delete(key);
        }
    }
}

const options = {
    baseURL:'/api',
    timeout:5000,
    // capacity:50, // 开启缓存后，缓存数量
    // maxAge:1000*60*5 // 开启缓存后，缓存生命周期
    // maxRequestsCount:5, // 最大同时发送接口数
}

const request =  new AxiosService(options)

export default request;