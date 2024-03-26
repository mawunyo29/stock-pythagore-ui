<script  setup>
import { reactive, ref } from "vue";
import { routerKey } from "vue-router";
// const { scrfToken, getScrfToken } = useScrfToken()
// const appConfig = useRuntimeConfig().public;
// const api_url = appConfig;

const formLogin = reactive({

  email: {
    label: "Email",
    prop: "email",
    value: "",
    placeholder: "Email",
    type: "email",
    is_visible: true
  },
  password: {
    label: "Password",
    prop: "password",
    value: "",
    placeholder: "Password",
    type: "password",
    is_visible: true
  },
  remeber: {
    label: "Remember me",
    prop: "remeber",
    value: false,
    type: "checkbox",
    is_visible: true
  },
});
const title = "Login";
const stringRegex = /^[a-zA-Z0-9]+$/;
const rules = ref({
  // username: [
  //   { required: true, message: "Please input username", trigger: "blur" },
  // ],
  email: [
    { required: true, message: "Please input email", trigger: "blur" },
  ],

  password: [
    { required: true, message: "Please input password", trigger: "blur" },
  ],
});

// const { authentificate, options } = useAuth()
// const userConnet = useAuthStore();
let formData = new FormData();
const login = async () => {
  formData.append("email", formLogin.email.value);
  formData.append("password", formLogin.password.value);
  // getScrfToken("/sanctum/csrf-cookie")
  // const cookie = scrfToken('XSRF-TOKEN')
  // options.value = {
  //   headers: {
  //     Accept: "application/json",
  //     'X-Requested-With': 'XMLHttpRequest',
  //     'X-XSRF-TOKEN': cookie
  //   }
  // }

  // const {data, status, pending, error, refresh}= await userConnet.authentificateHandler(formData)
  // // const { data, status } = await authentificate(`/api/login`, formData)
  // console.log(data, status);
  //      const authToken  = data.value
       
  //       try {
  //           if (status.value == "success" && authToken.token) {
  //               //redirect to dashboard
  //               await navigateTo({ path: '/dashboard' })

  //           } else {
  //               ElMessage.error(authToken.message || "An error occured");
  //           }
  //       } catch (error) {
  //           console.log(error);
  //       }
  // try {
  //   if (status.value == "success" && data.value.token) {
  //     //redirect to dashboard
  //     await navigateTo({ path: '/dashboard' })

  //   } else {
  //     ElMessage.error(data.message);
  //   }
  // } catch (error) {
  //   console.log(error);
  // }

}
const submit = (data) => {
  formData.append("email", data.email.value);
  formData.append("password", data.password.value);
  login()
};

</script>

<template>
  <form-request :title="title" :dataInput="formLogin" :rules="rules" @submit="submit"></form-request>
</template>

<style scoped></style>