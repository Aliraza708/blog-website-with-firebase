
import { auth, onAuthStateChanged, collection, query, deleteDoc, where, signOut, getDoc, doc, db, getDocs } from "../../untily.js";
const loginBtn = document.getElementById("loginBtn")
const userImage = document.getElementById("userImage")
const Logoutbtn = document.getElementById("Logoutbtn")
const popupdiv = document.getElementById("popupdiv")
const username_email = document.getElementById("username_email")
const blogshow = document.getElementById("blogshow")
onAuthStateChanged(auth,(user)=>{
    if (user) {
        userImage.style.display = "flex"
        popupdiv.style.display = "block"
        userImage.addEventListener('click', function() {
            document.getElementById('popup').style.display = 'flex';
            
        });
        
        document.getElementById('closePopup').addEventListener('click', function() {
            document.getElementById('popup').style.display = 'none';
        });
        
        window.addEventListener('click', function(event) {
            const popup = document.getElementById('popup');
            if (event.target === popup) {
                popup.style.display = 'none';
            }
        });
       loginBtn.style.display = "none"
        const uid = user.uid;
        console.log(uid)
        userProfile(uid)
        getMyBlog(uid)

        // ...
      } else {
         console.log("out")
         userImage.style.display = "none"
          loginBtn.style.display = "flex"
           popupdiv.style.display = "none"
        // ...
      }
})
function userProfile(uid){
    const profileImageRef = doc(db, "blogUser", uid)
    getDoc(profileImageRef).then((data)=>{
        console.log(data.data())
        userImage.src =data.data().userImage
        const div = `<p>Name : ${data.data().userName}</p>
        <p>Email : ${data.data().userEmail}</p>`
        username_email.innerHTML += div
    }).catch((err)=>{
        console.log("err",err)
    })

}

Logoutbtn.addEventListener("click",()=>{
signOut(auth).then(()=>{
    alert("Sign-out successful.")
}).catch(()=>{
    console.log("An error happened.")
})
})


async function getMyBlog(uid) {
        console.log("fun")
        try {
          blogshow.innerHTML = ""
          console.log(uid)          
            const q = query(collection(db,"addBlogUser"),where("createdBy", "==", uid));
            console.log(q)
            const qurerySnapshot = await getDocs(q)
            qurerySnapshot.forEach((doc) => {
              // console.log(`${doc.id} => ${doc.data()}`);
              let blogProudcut = doc.data()
              console.log(blogProudcut)
              let { title,
                  content,
                  image,
                  date,
              } = blogProudcut
              const pr = `<div class="bolg2">
              <div class = "blog-img">
              <img src = "${image}" alt = ""> 
               <button id = ${doc.id} class="like_btn"  onclick ="delectBlog(this)">
             DELECT
        </button> 
                     
            </div>
            <div class = "blog-text">
              <span>${date}</span>
              <h2>${title}</h2>
              <p>${content}</p>
              <a href = "#">Read More</a>
            </div>
            </div>` 
        
            blogshow.innerHTML +=pr    
          })
        } catch {
          alert("err")
        }
      }
      
      
      window.delectBlog = delectBlog
      
      async function delectBlog(e) {
        console.log(e)
        const delRef = doc(db, "addBlogUser", e.id)
        await deleteDoc(delRef)
        getMyProduct(auth.currentUser.uid)
      }
      
    















