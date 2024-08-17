import { signInWithEmailAndPassword,auth } from "../../untily.js";

const Login_form = document.getElementById("Login_form")
const login_btn = document.getElementById("login_btn")

Login_form.addEventListener("submit",(e)=>{
    e.preventDefault()
    login_btn.innerHTML = "Upload wait.."
    login_btn.disabled = true
    const email = e.target[0].value
    const Password = e.target[1].value
    console.log("e",e)
    signInWithEmailAndPassword(auth,email,Password).then(()=>{
        console.log("Login sacceful")
        window.location.href = "/"
    }).catch((err)=>{
         alert("THIS EMAIL AND PASSWORD NOT FOUND")
         login_btn.innerHTML = "Login"
         login_btn.disabled = false
    })
})