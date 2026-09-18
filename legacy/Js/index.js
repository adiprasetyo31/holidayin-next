const menuBtn = document.querySelector(".menu-btn");
const navigation = document.querySelector(".navigation");
const btns = document.querySelectorAll(".nav-btn");


menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");
  navigation.classList.toggle("active");
});



var sliderNav = function (manual) {
  btns.forEach((btn) => {
    btn.classList.remove("active");
  });

  slides.forEach((slide) => {
    slide.classList.remove("active");
  });

  btns[manual].classList.add("active");
  slides[manual].classList.add("active");
}

btns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    sliderNav(i);
  });
});




const carousel = document.querySelector(".carousel"),
  firstImg = carousel.querySelectorAll("img")[0],
  arrowIcons = document.querySelectorAll("#wrapper i");

let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;

const showHideIcons = () => {
  // showing and hiding prev/next icon according to carousel scroll left value
  let scrollWidth = carousel.scrollWidth - carousel.clientWidth; // getting max scrollable width
  arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
  arrowIcons[1].style.display = carousel.scrollLeft == scrollWidth ? "none" : "block";
}

arrowIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    let firstImgWidth = firstImg.clientWidth + 14; // getting first img width & adding 14 margin value
    // if clicked icon is left, reduce width value from the carousel scroll left else add to it
    carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
    setTimeout(() => showHideIcons(), 60); // calling showHideIcons after 60ms
  });
});

const autoSlide = () => {
  // if there is no image left to scroll then return from here
  if (carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 || carousel.scrollLeft <= 0) return;

  positionDiff = Math.abs(positionDiff); // making positionDiff value to positive
  let firstImgWidth = firstImg.clientWidth + 14;
  // getting difference value that needs to add or reduce from carousel left to take middle img center
  let valDifference = firstImgWidth - positionDiff;

  if (carousel.scrollLeft > prevScrollLeft) { // if user is scrolling to the right
    return carousel.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
  }
  // if user is scrolling to the left
  carousel.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
}

const dragStart = (e) => {
  // updatating global variables value on mouse down event
  isDragStart = true;
  prevPageX = e.pageX || e.touches[0].pageX;
  prevScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
  // scrolling images/carousel to left according to mouse pointer
  if (!isDragStart) return;
  e.preventDefault();
  isDragging = true;
  carousel.classList.add("dragging");
  positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
  carousel.scrollLeft = prevScrollLeft - positionDiff;
  showHideIcons();
}

const dragStop = () => {
  isDragStart = false;
  carousel.classList.remove("dragging");

  if (!isDragging) return;
  isDragging = false;
  autoSlide();
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);



// JS KOMEN SECTION

const data = {
  currentUser: {
    image: {
      png: "./img/komen/hansohe.png",
      webp: "./img/komen/hansohe.png",
    },
    username: "Han So Hee",
  },
  comments: [
    {
      parent: 0,
      id: 1,
      content:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum, adipisci mollitia? Perferendis nulla sintiure.",
      createdAt: "1 bulan yang lalu",
      score: 12,
      user: {
        image: {
          png: "./img/komen/sukuna.png",
          webp: "./img/komen/sukuna.png",
        },
        username: "Mbah Sukuna",
      },
      replies: [],
    },
    {
      parent: 0,
      id: 2,
      content:
        "This is cogil",
      createdAt: "3 minggu yang lalu",
      score: 5,
      user: {
        image: {
          png: "./img/komen/dicaprio.png",
          webp: "./img/komen/dicaprio.png",
        },
        username: "Leonardo",
      },
      replies: [
        {
          parent: 2,
          id: 1,
          content:
            "Kiw kiw empukkjeruuuu",
          createdAt: "1 minggu yang lalu",
          score: 4,
          replyingTo: "Leonardo",
          user: {
            image: {
              png: "./img/komen/goyo.png",
              webp: "./img/komen/goyo.png",
            },
            username: "Go Yoon Jung",
          },
        },
        {
          parent: 2,
          id: 1,
          content:
            "Sorry yaaaa aku mabok, this is cegill",
          createdAt: "2 hari yang lalu",
          score: 2,
          replyingTo: "Go Yoon Jung",
          user: {
            image: {
              png: "./img/komen/hansohe.png",
              webp: "./img/komen/hansohe.png",
            },
            username: "Han So Hee",
          },
        },
      ],
    },
  ],
};
function appendFrag(frag, parent) {
  var children = [].slice.call(frag.childNodes, 0);
  parent.appendChild(frag);
  //console.log(children);
  return children[1];
}

const addComment = (body, parentId, replyTo = undefined) => {
  let commentParent =
    parentId === 0
      ? data.comments
      : data.comments.filter((c) => c.id == parentId)[0].replies;
  let newComment = {
    parent: parentId,
    id:
      commentParent.length == 0
        ? 1
        : commentParent[commentParent.length - 1].id + 1,
    content: body,
    createdAt: "Baru saja",
    replyingTo: replyTo,
    score: 0,
    replies: parent == 0 ? [] : undefined,
    user: data.currentUser,
  };
  commentParent.push(newComment);
  initComments();
};
const deleteComment = (commentObject) => {
  if (commentObject.parent == 0) {
    data.comments = data.comments.filter((e) => e != commentObject);
  } else {
    data.comments.filter((e) => e.id === commentObject.parent)[0].replies =
      data.comments
        .filter((e) => e.id === commentObject.parent)[0]
        .replies.filter((e) => e != commentObject);
  }
  initComments();
};

const promptDel = (commentObject) => {
  const modalWrp = document.querySelector(".modal-wrp");
  modalWrp.classList.remove("invisible");
  modalWrp.querySelector(".yes").addEventListener("click", () => {
    deleteComment(commentObject);
    modalWrp.classList.add("invisible");
  });
  modalWrp.querySelector(".no").addEventListener("click", () => {
    modalWrp.classList.add("invisible");
  });
};

const spawnReplyInput = (parent, parentId, replyTo = undefined) => {
  if (parent.querySelectorAll(".reply-input")) {
    parent.querySelectorAll(".reply-input").forEach((e) => {
      e.remove();
    });
  }
  const inputTemplate = document.querySelector(".reply-input-template");
  const inputNode = inputTemplate.content.cloneNode(true);
  const addedInput = appendFrag(inputNode, parent);
  addedInput.querySelector(".bu-primary").addEventListener("click", () => {
    let commentBody = addedInput.querySelector(".cmnt-input").value;
    if (commentBody.length == 0) return;
    addComment(commentBody, parentId, replyTo);
  });
};

const createCommentNode = (commentObject) => {
  const commentTemplate = document.querySelector(".comment-template");
  var commentNode = commentTemplate.content.cloneNode(true);
  commentNode.querySelector(".usr-name").textContent =
    commentObject.user.username;
  commentNode.querySelector(".usr-img").src = commentObject.user.image.webp;
  commentNode.querySelector(".cmnt-at").textContent = commentObject.createdAt;
  commentNode.querySelector(".c-body").textContent = commentObject.content;
  if (commentObject.replyingTo)
    commentNode.querySelector(".reply-to").textContent =
      "@" + commentObject.replyingTo;


  if (commentObject.user.username == data.currentUser.username) {
    commentNode.querySelector(".comment").classList.add("this-user");
    commentNode.querySelector(".delete").addEventListener("click", () => {
      promptDel(commentObject);
    });
    commentNode.querySelector(".edit").addEventListener("click", (e) => {
      const path = e.path[3].querySelector(".c-body");
      if (
        path.getAttribute("contenteditable") == false ||
        path.getAttribute("contenteditable") == null
      ) {
        path.setAttribute("contenteditable", true);
        path.focus()
      } else {
        path.removeAttribute("contenteditable");
      }

    });
    return commentNode;
  }
  return commentNode;
};

const appendComment = (parentNode, commentNode, parentId) => {
  const bu_reply = commentNode.querySelector(".reply");
  // parentNode.appendChild(commentNode);
  const appendedCmnt = appendFrag(commentNode, parentNode);
  const replyTo = appendedCmnt.querySelector(".usr-name").textContent;
  bu_reply.addEventListener("click", () => {
    if (parentNode.classList.contains("replies")) {
      spawnReplyInput(parentNode, parentId, replyTo);
    } else {
      //console.log(appendedCmnt.querySelector(".replies"));
      spawnReplyInput(
        appendedCmnt.querySelector(".replies"),
        parentId,
        replyTo
      );
    }
  });
};

function initComments(
  commentList = data.comments,
  parent = document.querySelector(".comments-wrp")
) {
  parent.innerHTML = "";
  commentList.forEach((element) => {
    var parentId = element.parent == 0 ? element.id : element.parent;
    const comment_node = createCommentNode(element);
    if (element.replies && element.replies.length > 0) {
      initComments(element.replies, comment_node.querySelector(".replies"));
    }
    appendComment(parent, comment_node, parentId);
  });
}

initComments();
const cmntInput = document.querySelector(".reply-input");
cmntInput.querySelector(".bu-primary").addEventListener("click", () => {
  let commentBody = cmntInput.querySelector(".cmnt-input").value;
  if (commentBody.length == 0) return;
  addComment(commentBody, 0);
  cmntInput.querySelector(".cmnt-input").value = "";
});


// Pagination

const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const pageButtons = document.querySelectorAll(".page");

prevButton.addEventListener("click", () => {
  const activePage = document.querySelector(".page.active");
  const previousPage = activePage.previousElementSibling;

  if (
    previousPage !== null &&
    previousPage.classList.contains("page")
  ) {
    activePage.classList.remove("active");
    previousPage.classList.add("active");
  }
  updatePaginationButtons();
});

nextButton.addEventListener("click", () => {
  const activePage = document.querySelector(".page.active");
  const nextPage = activePage.nextElementSibling;

  if (
    nextPage !== null &&
    nextPage.classList.contains("page")
  ) {
    activePage.classList.remove("active");
    nextPage.classList.add("active");
  }
  updatePaginationButtons();
});

pageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const activePage = document.querySelector(".page.active");
    activePage.classList.remove("active");
    button.classList.add("active");
    updatePaginationButtons();
  });
});

const updatePaginationButtons = () => {
  const activePage = document.querySelector(".page.active");

  if (
    activePage.previousElementSibling === null ||
    !activePage.previousElementSibling.classList.contains("page")
  ) {
    prevButton.classList.add("disabled");
  } else {
    prevButton.classList.remove("disabled");
  }

  if (
    activePage.nextElementSibling === null ||
    !activePage.nextElementSibling.classList.contains("page")
  ) {
    nextButton.classList.add("disabled");
  } else {
    nextButton.classList.remove("disabled");
  }
};

updatePaginationButtons();






