<template>
    <ElDialog v-model="state.isShow" width="490px" class="custom1-color login">
        <div class="login-content">
            <div class="login-content-title">
                Sign in to LCPlatform
            </div>
            <div class="login-content-github">
                <i class="iconfont icon-github"></i>
                <span style="padding-left:8px;">Continue with Github</span>
            </div>
            <span class="login-content-span">or</span>
            <div class="login-content-form ">
                <el-form-item>
                    <el-input size="large" placeholder="Email" v-model="state.email"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 0;">
                    <el-input show-password size="large" placeholder="Password" v-model="state.pwd"></el-input>
                    <span class="login-content-span-link">重置密码</span>
                </el-form-item>
                <button class="login-content-form-btn">登录</button>
            </div>
            <span class="login-content-span-other">
                其他登录方式
                <div class="login-content-span-other-set">
                    <i class="iconfont icon-github"></i>
                    <i class="iconfont icon-github"></i>
                    <i class="iconfont icon-github"></i>
                    <i class="iconfont icon-github"></i>
                </div>
            </span>
            
            <span class="login-content-span-link">没有账号?点击注册</span>
        </div>
    </ElDialog>
</template>

<script setup>
const {option} = defineProps({
    option:{type:Object}
})

const state = reactive({
    isShow: false,
    option: option, // 用户给组件的属性
    email: "",
    pwd: "",
});
const methods = {
    show(option) {
        state.isShow = true;
        state.option = option;
    }
}

defineExpose(methods)


</script>

<style lang="scss" scoped>
.login {
    display: flex;
    justify-content: center;
    &-content {
        width: 100%;
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