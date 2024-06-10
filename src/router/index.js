import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/view/homePage.vue'
import signupView from '@/view/signupView.vue'
import loginView from '@/view/loginView.vue'
import mainPage from '@/view/mainPage.vue'
import newUsers from '@/view/newUsers.vue'
import profileView from '@/view/profileView.vue'
import chatRoomView from '@/view/chatRoomView.vue'
import newChatroomView from '@/view/newChatroomView.vue'

const routes = [
    { 
        path: '/',
        name:  'Home',
        component: HomePage
    },
    {
        path: '/signup',
        name:  'signup',
        component : signupView
    },
    {
        path: '/login',
        name:  'login',
        component : loginView
    },
    {
        path: '/main/:idUser',
        name:  'main',
        component :mainPage
    },
    {
        path: '/newusers/:idUser',
        name:  'newUsers',
        component :newUsers
    },
    {
        path:'/profile/:idUser' ,
        name:  'profile',
        component :profileView
    },
    {
        path: '/chat/:idUser/:idChat',
        name:  'chat',
        component:chatRoomView
    },
    {
        path: '/newchat/:idUser',
        name:  'newchat',
        component : newChatroomView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

