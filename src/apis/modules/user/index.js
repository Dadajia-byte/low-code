import {request} from '@/utils/request'

// 登录
export const postLogin = async (data) => {
    let res = await request({
        url: '/user/login',
        method: 'post',
        data,
    })
    return res
}

export const getVerifyCode = async (data) => {
    let res = await request({
        url: '/user/sendEmail/register',
        method: 'post',
        data,
    })
    return res
}

export const postRegister = async (data) => {
    let res = await request({
        url: '/user/register',
        method: 'post',
        data,
    })
    return res;
}