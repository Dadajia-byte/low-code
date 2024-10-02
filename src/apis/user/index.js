import {request} from '@/utils/request'

// 登录
export const postLogin = async (data)=>{
    let res =await request({
        url:'/user/login',
        method:'post',
        data,
    })

    
    return res
}