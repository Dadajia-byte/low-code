<template>
    <div class="login-content">
        <div class="login-content-title">
            Sign in to LCPlatform
        </div>
        <div class="login-content-github">
            <i class="iconfont icon-github"></i>
            <span style="padding-left:8px;">Continue with Github</span>
        </div>
        <span class="login-content-span">or</span>
        <el-form class="login-content-form" ref="loginForm" :model="login" :rules="rules">
            <el-form-item prop="email">
                <el-input size="large" placeholder="Email" v-model="login.email"></el-input>
            </el-form-item>
            <el-form-item prop=password style="margin-bottom: 0;">
                <el-input show-password size="large" placeholder="Password" v-model="login.password"></el-input>
                <span class="login-content-span-link" style="position: absolute;right: 0;top: 76%;">重置密码</span>
            </el-form-item >
            <el-button class="login-content-form-btn" :loading="durLog" @click="handleLogin">登录</el-button>
        </el-form>
        <span class="login-content-span-other">
            其他登录方式
            <div class="login-content-span-other-set">
                <i class="iconfont icon-github"></i>
                <i class="iconfont icon-github"></i>
                <i class="iconfont icon-github"></i>
                <i class="iconfont icon-github"></i>
            </div>
        </span>
        
        <span class="login-content-span-link" @click="checkStatus('Register')">没有账号?点击注册</span>
    </div>
</template>

<script setup>
import {postLogin} from '@/apis/modules/user'
const {login,methods} = defineProps({
    login:{type:Object},

    methods:{type:Object}
})
const {hide,checkStatus} = methods
const durLog = ref(false);
const loginForm = ref(null);


const rules = {
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ],
/*     password: [
        { required: true, message: '请输入密码', trigger: 'change' },
        { min: 6, max: 15, message: '密码长度需在6到15个字符之间', trigger: 'change' },
        {
            validator: (rule, value, callback) => {
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
                if (!passwordRegex.test(value)) {
                    callback(new Error('密码必须包含字母和数字'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ] */
}; 
const handleLogin = async ()=>{
    try {
        // 验证表单
        const valid = await validateForm();
        if (!valid) return;
        durLog.value = true;
        const res = await postLogin(login);
        durLog.value = false;
        if (res.code === 10000) {
            const {access_token:accessToken,refresh_token:refreshToken} = res.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            hide();
            ElNotification.success({
                title: '欢迎回来',
                message: h('i', { style: 'color: #6965db' }, '111'),
            });
        } else if (res.code === 10006) {
            ElNotification.error({
                message: '账号不存在或密码错误',
            });
        }
    } catch (error) {
        console.error(error);
    }
}
// 验证表单
const validateForm = () => {
    return new Promise((resolve) => {
        loginForm.value.validate((valid) => {
            resolve(valid);
        });
    });
};

</script>

<style lang="scss" scoped>
.login {
    &-content {
        width: 100%;
        height: 410px;
        display: flex;
        margin-top: 20px;
        flex-direction: column;
        align-items: center;
        margin-bottom: 8px;
        &-title {
            font-size: 26px;
            font-weight: 600;
            font-family: Helvetica Arial, Helvetica, sans-serif;
            color: #333;
        }
        &-github {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 35px 0 15px;
            
            border-radius: 12px;
            height: 45px;
            font-size: 16px;
            color: #000000;
            border: 1.5px #474747 solid;
            width: 68%;
            transition: all .5s;
            cursor: pointer;
            .iconfont {
                font-size: 24px;
                padding-left: 10px;
            }
        }
        &-form {
            width: 68%;
            margin-top: 15px;
            margin-bottom: 10px;
            &-btn {
                margin-top: 24px;
                color: #fff;
                border-radius: 10px;
                height: 42px;
                border: 0;
                background-color:#6965db;
                width: 100%;
                font-size: 15px;
                transition: all .3s;
                cursor: pointer;
                &:hover {
                    background-color: #5753d0;
                    border-radius: 5px;

                }
            }
        }
        &-span-other {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            &-set {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 35px;
                width: 60%;
                margin-top: 2px;
                .iconfont {
                    font-size: 20px;
                    color: #6965db;
                    margin: 0 5px;
                    cursor: pointer;
                }
            }
        }
        &-span-link {
            font-size: 12px;
            margin-top: 4px;
            cursor: pointer;
            &:hover {
                color: #6965db;
                text-decoration: underline;
            }
        }
    }
}
</style>