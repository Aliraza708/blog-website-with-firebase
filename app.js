import {onAuthStateChanged,auth,getDoc,doc,db,signOut,getDocs,collection,updateDoc,arrayRemove,arrayUnion} from "./untily.js";
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


async function getAllBlog() {
    try {
      const querySnapshot = await getDocs(collection(db, "addBlogUser"));
      querySnapshot.forEach((doc) => {
        // console.log(`${doc.id} => ${doc.data()}`);
        let blogProudcut = doc.data()
        console.log(blogProudcut)
        let { title,
            content,
            image,
            date,
        } = blogProudcut
        
        const pr = `
        <div>
        <div class = "blog-img">
                <img src = "${image}" alt = ""> 
                 <button id = ${doc.id} class="like_btn"  onclick ="likeBlog(this)">
      ${
              auth?.currentUser && blogProudcut?.likes?.includes(auth?.currentUser.uid)
                ? "Liked.."
                : "Like"
            } ${blogProudcut?.likes?.length ? blogProudcut?.likes?.length : ""}
          </button> 
                       
              </div>
              <div class = "blog-text">
                <span>${date}</span>
                <h2>${title}</h2>
                <p>${content}</p>
                <a href = "#">Read More</a>
              </div>
              </div>
              ` 
          
              blogshow.innerHTML +=pr     
              window.likeBlog = likeBlog;
    })
}catch{
  console.log("Get all blog doc not run")
}
}
getAllBlog()


async function likeBlog(e) {
    if (auth.currentUser) {
      e.disabled = true;
      const docRef = doc(db, "addBlogUser", e.id);
      if (e.innerText == "Liked..") {
        updateDoc(docRef, {
          likes: arrayRemove(auth.currentUser.uid),
        })
          .then(() => {
            e.innerText = "Like";
            e.disabled = false;
          })
          .catch((err) => console.log(err));
      } else {
        updateDoc(docRef, {
          likes: arrayUnion(auth.currentUser.uid),
        })
          .then(() => {
            e.innerText = "Liked..";
            e.disabled = false;
          })
          .catch((err) => console.log(err));
      }
    } else {
      window.location.href = "assest/auth/login.html";
    }
  }