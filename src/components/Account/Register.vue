<template>
  <div class="register-content">
    <div class="register-content-title">
      Sign up to LCPlatform
    </div>
    <div class="register-content-github">
      <i class="iconfont icon-github"></i>
      <span style="padding-left:.1143rem;">Continue with Github</span>
    </div>
    <span class="register-content-span">or</span>
    <el-form class="register-content-form" ref="registerForm" :model="register" :rules="rules">
      <el-form-item prop="email">
        <el-input size="large" placeholder="Email" v-model="register.email"></el-input>
      </el-form-item>
      <el-form-item prop=password>
        <el-input show-password size="large" placeholder="Password" v-model="register.password"></el-input>
      </el-form-item>
      <el-form-item prop="userVerifyCode" style="margin-bottom: 0;">
        <el-input size="large" placeholder="VerifyCode" v-model="register.userVerifyCode">
          <template #append>
            <el-button size="large" :disabled="countdown > 0" @click="handleVerifyCode">
              {{ countdown > 0 ? `${countdown} s` : '获取验证码' }}
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-button class="register-content-form-btn" :loading="durReg" @click="handleRegister">注册账号</el-button>
    </el-form>

    <span class="register-content-span-link" @click="checkStatus('Login')">已有账号?点击登录</span>
  </div>
</template>

<script setup>
import {getVerifyCode, postRegister} from "@/apis/modules/user"

const registerForm = ref(null);
const {register, methods} = defineProps({
  register: {type: Object},
  methods: {type: Object}
})
const durReg = ref(false);
const handleRegister = async () => {
  let valid = await validateForm();
  if (valid) {
    durReg.value = true;
    let res = await postRegister(register)
    if (res.code === 10000) {
      ElNotification.success('注册成功');
      checkStatus('Login');
    } else {
      ElNotification.error(res.msg);
    }
    durReg.value = false;
  }
}
const rules = {
  email: [
    {required: true, message: '请输入邮箱地址', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'change'},
    {min: 6, max: 15, message: '密码长度需在6到15个字符之间', trigger: 'change'},
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
  ],
  userVerifyCode: [
    {required: true, message: '请输入验证码', trigger: 'blur'},
  ]

};
const handleVerifyCode = async () => {
  try {
    let valid = await validateEmail();
    if (!valid) {
      ElNotification.error('请输入正确邮箱');
      return;
    }
    let res = await getVerifyCode({email: register.email});
    startCountdown(60);
  } catch (error) {
    console.error('验证失败:', error);
  }
}
// 验证表单
const validateForm = () => {
  return new Promise((resolve) => {
    registerForm.value.validate((valid) => {
      resolve(valid);
    });
  });
};
const validateEmail = async () => {
  return new Promise((resolve, reject) => {
    registerForm.value.validateField('email', (valid) => {
      resolve(valid);
    });
  });
};
const countdown = ref(0);
const startCountdown = (seconds) => {
  countdown.value = seconds;
  const intervalId = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(intervalId);
    }
  }, 1000);
};
const {checkStatus} = methods;
</script>

<style lang="scss" scoped>
.register {
  &-content {
    width: 100%;
    height: 5.8571rem;
    display: flex;
    margin-top: .2857rem;
    flex-direction: column;
    align-items: center;
    margin-bottom: .1143rem;

    &-title {
      font-size: .3714rem;
      font-weight: 600;
      font-family: Helvetica Arial, Helvetica, sans-serif;
      color: #333;
    }

    &-github {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: .5rem 0 .2143rem;

      border-radius: .1714rem;
      height: .6429rem;
      font-size: .2286rem;
      color: #000000;
      border: .0214rem #474747 solid;
      width: 68%;
      transition: all .5s;
      cursor: pointer;

      .iconfont {
        font-size: .3429rem;
        padding-left: .1429rem;
      }
    }

    &-form {
      width: 68%;
      margin-top: .2143rem;
      margin-bottom: .1429rem;

      &-btn {
        margin-top: .3429rem;
        color: #fff;
        border-radius: .1429rem;
        height: .6rem;
        border: 0;
        background-color: #6965db;
        width: 100%;
        font-size: .2143rem;
        transition: all .3s;
        cursor: pointer;

        &:hover {
          background-color: #5753d0;
          border-radius: .0714rem;

        }
      }
    }

    &-span-link {
      font-size: .1714rem;
      margin-top: .0571rem;
      cursor: pointer;

      &:hover {
        color: #6965db;
        text-decoration: underline;
      }
    }
  }
}
</style>