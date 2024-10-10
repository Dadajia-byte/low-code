<template>
    <div class="container custom1-color">
        <header class="header">
            <div class="header-container">
                 <button class="login" @click="$Account({status:'Login'})">Log in</button>
                 <button class="get-start" @click="getStart">Get Start Now</button>
            </div>
            <el-divider style="margin-top: 10px;"></el-divider>
        </header>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router';
import { $Account } from '../../components/Account';
const router = useRouter();
const getStart = ()=>{
    router.push('/test')
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    background-color: #ffffff;
    .header {
        display: flex;
        flex-direction: column;
        
        &-container {
            height: 70px;
            width: 80%;
            display: flex;
            align-items: center;
            .login,
            .get-start {
                border-radius: 13px;
                height: 50px;
                padding: 0 20px;
                margin: 0 10px;
                font-size: 18px;
                transition: all .3s;
                color: #5a56d3;
                cursor: pointer;
                &:hover {
                    border-radius: 2px;
                }
            }
            .login {
                border: 2px solid #6965db;
                background-color: #fff;
            }
            .get-start {
                background-color: #6965db;
                color: #fff;
                border: 1px solid #5753d0;
                &:hover {
                    background-color: #5753d0;
                }
            }
        }
    }
}

</style>