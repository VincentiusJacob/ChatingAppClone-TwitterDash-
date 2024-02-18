const chatContainer = document.getElementById("chat-container");
const tweetscontent = document.getElementById("tweet-tweets");
const tweetprofilecontainer = document.getElementById("tweet-profile");
const displaytext = document.getElementById("display-text");
const arrowspan = document.getElementById("material-symbols-outlined");
const tweetcontainer = document.getElementById("tweet-container");
const prevBtn = document.getElementById("prevbutton");
const nextBtn = document.getElementById("nextbutton");
prevBtn.classList.add("button");
nextBtn.classList.add("button");
const displaypage = document.getElementById("displaypage");
const searchinput = document.getElementById("searchinput");
let url;
let startPage;
let maxPage;
let currentpage = 1;

function setColor(item) {
  resetColor();
  item.style.backgroundColor = "rgba(29, 155, 240, 0.2)";
}
function resetColor() {
  const divs = document.getElementsByClassName("chat");
  for (let i = 0; i < divs.length; i++) {
    const div = divs[i];
    div.style.backgroundColor = "#222222";
  }
}

async function getData(page, value) {
  chatContainer.innerHTML = `<div class="loadingpage"> <p> Loading ... <br> Please Wait </div>`;
  let limit = 10;
  let skip = (page - 1) * limit;
  url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
  if (value) {
    url = `https://dummyjson.com/users/search?q=${value}&skip=${skip}&limit=${limit}`;
  } else {
    url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  const total = data.total;
  const user = data.users;
  console.log(user);
  let currentuser;
  chatContainer.innerHTML = "";
  for (let i = 0; i < user.length; i++) {
    currentuser = user[i];
    let status;
    if (currentuser.gender === "male") {
      status = `<img src="male.webp">`;
    } else if (currentuser.gender === "female") {
      status = `<img src="female.png">`;
    }
    chatContainer.innerHTML += `<div class="chat" id="chat">
      <div class="chat-innercontainer">
        <div class="profile-photo">
          <img src=${currentuser.image}>
        </div>
         <div class="profile-detail">
          <div class="profile-detail-name">
            <p> ${currentuser.firstName} ${currentuser.lastName} </p>
            ${status}
          </div>
          <div class="profile-detail-email">
            <span> ${currentuser.email} </span>
          </div>
        </div>
      </div>
      <div class="arrow">
        <span class="material-symbols-outlined"> chevron_right </span>
      </div>
    </div>`;
  }

  if (
    url ===
    `https://dummyjson.com/users/search?q=${value}&skip=${skip}&limit=${limit}`
  ) {
    const totalPage = document.getElementById("displaypagetwo");
    Pagination(total);
    if (total > 10) {
      nextBtn.disabled = false;
      startPage = (currentpage - 1) * limit + 1;
      displaypage.innerHTML = `Showing ${startPage}-${startPage + limit - 1}`;
      nextBtn.addEventListener("click", () => {
        currentpage++;
        getData(currentpage);
        displaypage.innerHTML = `Showing ${startPage}-${startPage + limit - 1}`;
        prevBtn.disabled = false;
      });
      if (currentpage > 1) {
        prevBtn.addEventListener("click", () => {
          currentpage--;
          nextBtn.disabled = false;
          getData(currentpage);
        });
      }
      if (currentpage === 1) {
        prevBtn.disabled = true;
        nextBtn.disabled = false;
      }
    } else if (total < 10 && total != 0) {
      displaypage.innerHTML = `Showing 1-${total}`;
      nextBtn.disabled = true;
      prevBtn.disabled = true;
    } else if (total === 10) {
      startPage = (currentpage - 1) * limit + 1;
      displaypage.innerHTML = `Showing 1-${total}`;
      nextBtn.disabled = true;
      prevBtn.disabled = true;
    } else if (total === 0) {
      displaypage.innerHTML = `Showing ${total}-${total}`;
      nextBtn.disabled = true;
      prevBtn.disabled = true;
    }
    totalPage.innerHTML = `from ${total} results`;
  } else if (
    url === `https://dummyjson.com/users?limit=${limit}&skip=${skip}`
  ) {
    startPage = (currentpage - 1) * limit + 1;
    const totalPage = document.getElementById("displaypagetwo");
    displaypage.innerHTML = `Showing ${startPage}-${startPage + limit - 1}`;
    totalPage.innerHTML = `from ${total} results`;
    if (currentpage < 10 && currentpage >= 1) {
      nextBtn.disabled = false;
      nextBtn.addEventListener("click", () => {
        displaypage.innerHTML = `Showing ${startPage}-${startPage + limit - 1}`;
      });
    }
    if (currentpage > 1) {
      prevBtn.disabled = false;
    }
  }

  const chatDiv = document.querySelectorAll(".chat");
  chatDiv.forEach((chatDiv, index) => {
    chatDiv.addEventListener("click", () => {
      setColor(chatDiv);
      currentuser = user[index];
      tweetPost(currentuser);
    });
  });

  async function tweetPost(currentuser) {
    tweetcontainer.innerHTML = `<div class="loadingpage"> <p> Loading ... <br> Please Wait </div>`;
    const userposturl = await fetch(
      `https://dummyjson.com/users/${currentuser.id}/posts`
    );
    const userpost = await userposturl.json();
    const post = userpost.posts;
    console.log(post);
    tweetcontainer.innerHTML = `<div class="tweet-profile" id="tweet-profile">
      <div class="tweet-profile-box">
        <div class="tweet-display-profile">
          <div class="innerprofile">
            <div class="profile-photo">
              <img src="${currentuser.image}" />
            </div>
            <div class="profile-detail">
              <div class="profile-detail-name">
                <p id="tweet-name">${currentuser.firstName} ${currentuser.lastName}</p>
                <img src="male.webp" />
              </div>
              <div class="profile-detail-email">
                <span id="tweet-email"> ${currentuser.email} </span>
              </div>
            </div>
          </div>
        </div>
        <!-- tweet display profile -->
        <div class="tweet-profile-detail">
          <div class="tweet-profile-detail-left">
            <div class="top">
              <span> Education</span>
              <p id="tweet-education"> ${currentuser.university}</p>
            </div>
            <div class="bottom">
              <span> Occupation</span>
              <p id="tweet-occupation">${currentuser.company.title}</p>
            </div>
          </div>
          <div class="tweet-profile-detail-right">
            <div class="top">
              <span> Address</span>
              <p id="tweet-address">${currentuser.address.address} ${currentuser.address.city}</p>
            </div>
            <div class="bottom">
              <span> Company name</span>
              <p id="tweet-company">${currentuser.company.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Tweet Profile Box-->
    <div class="tweet-tweets" id="tweet-tweets">
      <h1>${currentuser.firstName}'s Post</h1>
      <div class="tweets" id="tweets">`;
    for (let i = 0; i <= post.length; i++) {
      const tweetSpace = document.getElementById("tweets");
      tweetSpace.innerHTML += `<div class="first-tweet">
          <h1>${post[i].title}</h1>
          <p>
            ${post[i].body}
          </p>
          <div class="topic-buttons-${i}" id="topicButton">`;
      const buttonCont = document.getElementsByClassName(
        `topic-buttons-${i}`
      )[0];
      for (let tag of post[i].tags) {
        buttonCont.innerHTML += `<button> ${tag} </button>`;
      }
      `</div>
        </div>`;
    }
  }
  searchinput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      currentpage = 1;
      getData(currentpage, searchinput.value);
    }
  });
  function Pagination(totalUser) {
    if (totalUser > 10) {
      prevBtn.disabled = true;
      nextBtn.disabled = false;
    } else if (totalUser < 10) {
      nextBtn.disabled = true;
      prevBtn.disabled = true;
    } else if (totalUser != 0 && totalUser < 10) {
      startPage = (currentpage - 1) * limit + 1;
      displaypage.innerHTML = `Showing ${startPage}-${total}`;
    }
  }
}
// Paging //

if (currentpage === 1) {
  prevBtn.disabled = true;
  nextBtn.disabled = false;
} else if (currentpage < 10) {
  nextBtn.disabled = false;
}
nextBtn.addEventListener("click", (event) => {
  if (currentpage < 10 && currentpage >= 1) {
    currentpage++;
    getData(currentpage);
  } else if (currentpage >= 10) {
    event.preventDefault();
  }
  if (currentpage == 10) {
    nextBtn.disabled = true;
  }
  const totalPage = document.getElementById("displaypagetwo");
  totalPage.innerHTML = `from 100 results`;
  prevBtn.disabled = false;
});

prevBtn.addEventListener("click", (event) => {
  if (currentpage > 1) {
    currentpage--;
    getData(currentpage);
  } else if (currentpage === 0) {
    event.preventDefault();
  } else if (currentpage < 10) {
    nextBtn.disabled = false;
  }
  if (currentpage <= 1) {
    prevBtn.disabled = true;
  }
});
getData(currentpage);
