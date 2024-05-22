<template>
    <div>
        <UserDetails v-for="user in users" :key="user.id" :user="user"></UserDetails>

    </div>
</template>
<script>
import { db, getDocs } from '@/firebase/config.js';
import UserDetails from '@/components/userDetails.vue';

export default {
    components: {
        UserDetails
    },
    data() {
        return {
            users:[],
            userId:this.$route.params.id
        }
    },

    mounted() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
        try {
            const users = collection(db, 'users');
            const querySnapshot = await getDocs(users);
            querySnapshot.forEach((doc) => {
            let user = doc.data();
            user.id = doc.id; 
            this.users.push(user);
            });
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        }
    },
    computed: {
        filteredUsers() {
        return this.users.filter(user => user.id !== this.userId);
        }
    }
}
</script>
<style></style>