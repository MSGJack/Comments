import "./style.css";
import { commentList, me } from "./data";
import type { CommentType } from "./types";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div class="container">
  <div class="overlay"></div>
  <div class="confirm-box">
    <h2>Delete comment</h2>
    <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
    <div class="confirm-btns">
      <button id="cancel">N0, CANCEL</button>
      <button id="delete">YES, DELETE</button>
    </div>
  </div>
  <div id="comment-list"></div>
  <div class="newUserContainer">
    <div class="newUserPost">
    <img id="user-avatar" class="user-img" alt="user avatar" />
    <textarea placeholder="Add a comment..." id="my-comment"></textarea>
    <button type="submit" id="new-submit">SEND</button>
    </div>
    <div class="error"></div>
  </div>
</div>
`;

const userImg = document.querySelector<HTMLImageElement>("#user-avatar")!;
userImg.src = me.currentUser.image.png;

const commentBox = document.querySelector<HTMLDivElement>("#comment-list");

const overlay = document.querySelector(".overlay")!;
const lightBox = document.querySelector<HTMLDivElement>(".confirm-box")!;

const deleteBtn = document.querySelector<HTMLButtonElement>("#delete")!;
const cancelBtn = document.querySelector<HTMLButtonElement>("#cancel")!;
let commentToDelete: HTMLElement | null = null;

deleteBtn?.addEventListener("click", () => {
  if (commentToDelete) {
    commentToDelete.remove();
    commentToDelete = null;
  }
  closeLightBox();
});

cancelBtn?.addEventListener("click", () => {
  commentToDelete = null;
  closeLightBox();
});

function displayComments(comments: CommentType[]) {
  commentBox!.innerHTML = "";

  comments.forEach((com) => {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    const cardRepliesDiv = document.createElement("div");
    cardRepliesDiv.classList.add("cardReplies");

    const scoreDiv = document.createElement("div");
    scoreDiv.classList.add("scores");

    const addScoreDiv = document.createElement("img");
    addScoreDiv.classList.add("up-score");

    const currentScoreDiv = document.createElement("span");
    currentScoreDiv.classList.add("current-score");

    const subScoreDiv = document.createElement("img");
    subScoreDiv.classList.add("sub-score");

    const mainTopDiv = document.createElement("div");
    mainTopDiv.classList.add("main-top");

    const topLeftDiv = document.createElement("div");
    topLeftDiv.classList.add("top-left");

    const postAvatar = document.createElement("img");
    postAvatar.classList.add("top-avatar");

    const postUser = document.createElement("span");
    postUser.classList.add("top-user");

    const postTime = document.createElement("p");
    postTime.classList.add("top-time");

    const topRightDiv = document.createElement("div");
    topRightDiv.classList.add("top-right");

    const replyArrow = document.createElement("img");
    replyArrow.classList.add("reply-img");

    const replyDisplay = document.createElement("span");
    replyDisplay.classList.add("reply");

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("content-space");

    const postContent = document.createElement("section");
    postContent.classList.add("comment-section");

    currentScoreDiv.innerHTML = `${com.score}`;
    let score = com.score;

    addScoreDiv.src = "assets/icon-plus.svg";
    addScoreDiv.addEventListener("click", () => {
      score++;
      currentScoreDiv.textContent = score.toString();
    });

    subScoreDiv.src = "assets/icon-minus.svg";
    subScoreDiv.addEventListener("click", () => {
      if (score <= 0) {
        return 0;
      } else {
        score--;
        currentScoreDiv.textContent = score.toString();
      }
    });

    postAvatar.src = `${com.user.image.png}`;
    postAvatar.alt = "user avatar";

    replyArrow.src = "assets/icon-reply.svg";
    replyArrow.alt = "reply button";

    replyDisplay.innerHTML = "Reply";

    replyDisplay.addEventListener("click", () => {
      const existing = cardRepliesDiv.querySelector(".newUserContainer");
      if (existing) {
        existing.remove();
      }
      const userReplycardCon = document.createElement("div");
      userReplycardCon.classList.add("newUserContainer");
      userReplycardCon.classList.add("active-card");

      const userReplyCard = document.createElement("div");
      userReplyCard.classList.add("newUserPost");

      const userReplyAvatar = document.createElement("img");
      userReplyAvatar.classList.add("user-img");
      userReplyAvatar.src = `${me.currentUser.image.png}`;
      userReplyAvatar.alt = "user avatar";

      const userReplyTextArea = document.createElement("textarea");
      userReplyTextArea.value = `@${com.user.username} `;

      const userReplyButton = document.createElement("button");
      userReplyButton.innerHTML = "POST";

      const errorSpan = document.createElement("span");
      errorSpan.innerHTML = "No Empty Field Allowed";
      errorSpan.classList.add("error");

      userReplyCard.append(userReplyAvatar, userReplyTextArea, userReplyButton);

      userReplycardCon.appendChild(userReplyCard);

      cardRepliesDiv.appendChild(userReplycardCon);

      cardContainer.appendChild(cardRepliesDiv);
      userReplyButton.addEventListener("click", () => {
        const rawValue = userReplyTextArea.value;
        const withoutMention = rawValue
          .replace(`@${com.user.username}`, "")
          .trim();
        if (!withoutMention) {
          userReplycardCon.appendChild(errorSpan);
          return;
        }
        if (cardRepliesDiv) {
          newComment(rawValue, cardRepliesDiv);
          userReplyTextArea.value = "";
          userReplycardCon.remove();
        }
      });
    });

    postUser.innerHTML = `${com.user.username}`;
    postTime.innerHTML = `${com.createdAt}`;

    postContent.innerHTML = `${com.content}`;

    contentDiv.appendChild(postContent);

    topRightDiv.append(replyArrow, replyDisplay);

    topLeftDiv.append(postAvatar, postUser, postTime);

    mainTopDiv.append(topLeftDiv, topRightDiv);

    scoreDiv.append(addScoreDiv, currentScoreDiv, subScoreDiv);

    cardDiv.append(scoreDiv, topLeftDiv, topRightDiv, contentDiv);

    cardContainer.appendChild(cardDiv);

    {
      com.replies?.forEach((reply) => {
        const replyCardCon = document.createElement("div");
        replyCardCon.classList.add("reply-card-con");

        const replyCard = document.createElement("div");
        replyCard.classList.add("card");
        replyCard.classList.add("user-reply-card");

        const replyScoreDiv = document.createElement("div");
        replyScoreDiv.classList.add("scores");

        const replyAddScore = document.createElement("img");
        replyAddScore.classList.add("up-score");

        const replyCurrentScore = document.createElement("span");
        replyCurrentScore.classList.add("current-score");

        const replySubScore = document.createElement("img");
        replySubScore.classList.add("sub-score");

        const replyTopLeftDiv = document.createElement("div");
        replyTopLeftDiv.classList.add("top-left");

        const replyPostAvatar = document.createElement("img");
        replyPostAvatar.classList.add("top-avatar");

        const replyPostUser = document.createElement("span");
        replyPostUser.classList.add("top-user");

        const replyPostTime = document.createElement("p");
        replyPostTime.classList.add("top-time");

        const replyTopRightDiv = document.createElement("div");
        replyTopRightDiv.classList.add("top-right");

        const replyArrow = document.createElement("img");
        replyArrow.classList.add("reply-img");

        const replyDisplay = document.createElement("span");
        replyDisplay.classList.add("reply");

        const replyContentDiv = document.createElement("div");
        replyContentDiv.classList.add("content-space");

        const replyPostContent = document.createElement("section");
        replyPostContent.classList.add("comment-section");

        replyCurrentScore.innerHTML = `${reply.score}`;
        let score = reply.score;
        replyAddScore.src = "assets/icon-plus.svg";
        replyAddScore.addEventListener("click", () => {
          score++;
          replyCurrentScore.textContent = score.toString();
        });

        replySubScore.src = "assets/icon-minus.svg";
        replySubScore.addEventListener("click", () => {
          if (score <= 0) {
            return 0;
          } else {
            score--;
            replyCurrentScore.textContent = score.toString();
          }
        });

        replyPostAvatar.src = `${reply.user.image.png}`;
        replyPostAvatar.alt = "user avatar";

        replyArrow.src = "assets/icon-reply.svg";
        replyArrow.alt = "reply button";
        replyDisplay.innerHTML = "Reply";
        replyDisplay.addEventListener("click", () => {
          const existing = cardRepliesDiv.querySelector(".newUserContainer");
          if (existing) {
            existing.remove();
          }

          const userReplycardCon = document.createElement("div");
          userReplycardCon.classList.add("newUserContainer");
          userReplycardCon.classList.add("active-card");

          const userReplyCard = document.createElement("div");
          userReplyCard.classList.add("newUserPost");

          const userReplyAvatar = document.createElement("img");
          userReplyAvatar.classList.add("user-img");
          userReplyAvatar.src = `${me.currentUser.image.png}`;
          userReplyAvatar.alt = "user avatar";

          const userReplyTextArea = document.createElement("textarea");
          userReplyTextArea.value = `@${reply.user.username} `;

          const userReplyButton = document.createElement("button");
          userReplyButton.innerHTML = "POST";

          const errorSpan = document.createElement("span");
          errorSpan.innerHTML = "No Empty Field Allowed";
          errorSpan.classList.add("error");

          userReplyCard.append(
            userReplyAvatar,
            userReplyTextArea,
            userReplyButton,
          );

          userReplycardCon.appendChild(userReplyCard);

          cardRepliesDiv.appendChild(userReplycardCon);

          cardContainer.appendChild(cardRepliesDiv);

          userReplyButton.addEventListener("click", () => {
            const rawValue = userReplyTextArea.value;
            const withoutMention = rawValue
              .replace(`@${com.user.username}`, "")
              .trim();
            if (!withoutMention) {
              userReplycardCon.appendChild(errorSpan);
              return;
            }
            if (cardRepliesDiv) {
              newComment(rawValue, cardRepliesDiv);
              userReplyTextArea.value = "";
              userReplycardCon.remove();
            }
          });
        });

        replyPostUser.innerHTML = `${reply.user.username}`;
        replyPostTime.innerHTML = `${reply.createdAt}`;

        replyPostContent.innerHTML = boldAts(
          `@${reply.replyingTo} ${reply.content}`,
        );

        replyContentDiv.appendChild(replyPostContent);

        if (reply.user.username === me.currentUser.username) {
          const deleteDiv = document.createElement("div");
          deleteDiv.classList.add("delete-div");
          const trashImg = document.createElement("img");
          trashImg.src = "assets/icon-delete.svg";
          trashImg.alt = "delete";
          const deleteBtn = document.createElement("p");
          deleteBtn.classList.add("delete-display");
          deleteBtn.innerHTML = "Delete";
          deleteBtn.addEventListener("click", () => {
            commentToDelete = replyCard;
            openLightBox();
          });

          deleteDiv.append(trashImg, deleteBtn);
          replyTopRightDiv.appendChild(deleteDiv);

          const editDiv = document.createElement("div");
          editDiv.classList.add("edit-div");

          const editImg = document.createElement("img");
          editImg.alt = "edit post";
          editImg.src = "assets/icon-edit.svg";

          const editBtn = document.createElement("p");
          editBtn.classList.add("edit-display");
          editBtn.innerHTML = "Edit";

          editBtn.addEventListener("click", () => {
            const currentText = replyCard.querySelector(".comment-section");
            if (!currentText) return;
            const text = currentText.textContent || "";
            const updateTextCon = document.createElement("div");
            updateTextCon.classList.add("newUserContainer");
            updateTextCon.classList.add("active-card");

            const updateTextDiv = document.createElement("div");
            updateTextDiv.classList.add("newUserPost");

            const updateImg = document.createElement("img");
            updateImg.classList.add("user-img");
            updateImg.src = `${me.currentUser.image.png}`;
            updateImg.alt = "user avatar";

            const newTextArea = document.createElement("textarea");
            newTextArea.value = text;

            const updateBtn = document.createElement("button");
            updateBtn.innerHTML = "UPDATE";

            updateTextDiv.append(updateImg, newTextArea, updateBtn);
            updateTextCon.appendChild(updateTextDiv);

            replyCard.replaceWith(updateTextCon);

            updateBtn.addEventListener("click", () => {
              const newValue = newTextArea.value.trim();

              const errorSpan = document.createElement("span");
              errorSpan.innerHTML = "No Empty Field Allowed";
              errorSpan.classList.add("error");

              if (!newValue) {
                updateTextCon.appendChild(errorSpan);
                return;
              }

              errorSpan.innerHTML = "";
              if (currentText) {
                currentText.innerHTML = boldAts(newValue);
              }

              updateTextCon.replaceWith(replyCard);
            });
          });

          editDiv.append(editImg, editBtn);

          replyTopRightDiv.appendChild(editDiv);
        } else {
          replyTopRightDiv.append(replyArrow, replyDisplay);
        }

        replyTopLeftDiv.append(replyPostAvatar, replyPostUser);
        if (reply.user.username === me.currentUser.username) {
          const youBox = document.createElement("span");
          youBox.classList.add("you-box");
          youBox.innerHTML = "you";
          replyTopLeftDiv.appendChild(youBox);
        }
        replyTopLeftDiv.appendChild(replyPostTime);

        replyScoreDiv.append(replyAddScore, replyCurrentScore, replySubScore);

        replyCard.append(
          replyScoreDiv,
          replyContentDiv,
          replyTopLeftDiv,
          replyTopRightDiv,
        );

        cardRepliesDiv.appendChild(replyCard);

        cardContainer.appendChild(cardRepliesDiv);
      });
    }

    commentBox?.appendChild(cardContainer);
  });
}

displayComments(commentList);

function boldAts(content: string) {
  return content
    .split(" ")
    .map((word) => {
      if (word.startsWith("@") && word.length > 3) {
        return `<span class="bold-at">${word}</span>`;
      }
      return word;
    })
    .join(" ");
}

const userComment = document.querySelector<HTMLTextAreaElement>("#my-comment")!;
const submitNew = document.querySelector<HTMLButtonElement>("#new-submit")!;
const errorDiv = document.querySelector<HTMLDivElement>(".error")!;
const errorMessageElement = document.createElement("div");
errorMessageElement.classList.add("Error-Message");

function newComment(postValue?: string, parent?: HTMLElement) {
  const commentValue = postValue?.trim();

  if (!commentValue) {
    errorDiv.innerHTML = ` <p>No Empty Field Allowed</p>`;
    return;
  }

  errorDiv.innerHTML = "";
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  const cardRepliesDiv = document.createElement("div");
  cardRepliesDiv.classList.add("cardReplies");

  const scoreDiv = document.createElement("div");
  scoreDiv.classList.add("scores");

  const addScoreDiv = document.createElement("img");
  addScoreDiv.classList.add("up-score");

  const currentScoreDiv = document.createElement("span");
  currentScoreDiv.classList.add("current-score");

  const subScoreDiv = document.createElement("img");
  subScoreDiv.classList.add("sub-score");

  const mainTopDiv = document.createElement("div");
  mainTopDiv.classList.add("main-top");

  const topLeftDiv = document.createElement("div");
  topLeftDiv.classList.add("top-left");

  const postAvatar = document.createElement("img");
  postAvatar.classList.add("top-avatar");

  const postUser = document.createElement("span");
  postUser.classList.add("top-user");

  const youBox = document.createElement("span");
  youBox.classList.add("you-box");

  const postTime = document.createElement("p");
  postTime.classList.add("top-time");

  const topRightDiv = document.createElement("div");
  topRightDiv.classList.add("top-right");

  const replyArrow = document.createElement("img");
  replyArrow.classList.add("reply-img");

  const replyDisplay = document.createElement("span");
  replyDisplay.classList.add("reply");

  const contentDiv = document.createElement("div");
  contentDiv.classList.add("content-space");

  const postContent = document.createElement("section");
  postContent.classList.add("comment-section");

  currentScoreDiv.textContent = "0";
  let score = 0;
  addScoreDiv.src = "assets/icon-plus.svg";
  addScoreDiv.addEventListener("click", () => {
    score++;
    currentScoreDiv.textContent = score.toString();
  });

  subScoreDiv.src = "assets/icon-minus.svg";
  subScoreDiv.addEventListener("click", () => {
    if (score <= 0) {
      return 0;
    } else {
      score--;
      currentScoreDiv.textContent = score.toString();
    }
  });

  postAvatar.src = `${me.currentUser.image.png}`;
  postAvatar.alt = "user avatar";

  replyArrow.src = "assets/icon-reply.svg";
  replyArrow.alt = "reply button";

  replyDisplay.innerHTML = "Reply";

  postUser.innerHTML = `${me.currentUser.username}`;
  youBox.innerHTML = "you";
  postTime.innerHTML = "just now";

  postContent.innerHTML = boldAts(commentValue);

  const deleteDiv = document.createElement("div");
  deleteDiv.classList.add("delete-div");

  const trashImg = document.createElement("img");
  trashImg.src = "assets/icon-delete.svg";
  trashImg.alt = "delete";

  const deleteBtn = document.createElement("p");
  deleteBtn.classList.add("delete-display");
  deleteBtn.innerHTML = "Delete";
  deleteBtn.addEventListener("click", () => {
    commentToDelete = cardDiv;
    openLightBox();
  });

  deleteDiv.append(trashImg, deleteBtn);

  const editDiv = document.createElement("div");
  editDiv.classList.add("edit-div");

  const editImg = document.createElement("img");
  editImg.alt = "edit post";
  editImg.src = "assets/icon-edit.svg";

  const editBtn = document.createElement("p");
  editBtn.classList.add("edit-display");
  editBtn.innerHTML = "Edit";

  editBtn.addEventListener("click", () => {
    const originalCard = cardDiv;
    const currentText = cardDiv.querySelector(".comment-section");
    if (!currentText) return;
    const text = currentText.textContent || "";
    const updateTextCon = document.createElement("div");
    updateTextCon.classList.add("newUserContainer");
    updateTextCon.classList.add("active-card");

    const updateTextDiv = document.createElement("div");
    updateTextDiv.classList.add("newUserPost");

    const updateImg = document.createElement("img");
    updateImg.classList.add("user-img");
    updateImg.src = `${me.currentUser.image.png}`;
    updateImg.alt = "user avatar";

    const newTextArea = document.createElement("textarea");
    newTextArea.value = text;

    const updateBtn = document.createElement("button");
    updateBtn.innerHTML = "UPDATE";

    updateTextDiv.append(updateImg, newTextArea, updateBtn);
    updateTextCon.appendChild(updateTextDiv);

    cardDiv.replaceWith(updateTextCon);

    updateBtn.addEventListener("click", () => {
      const newValue = newTextArea.value.trim();
      const errorSpan = document.createElement("span");
      errorSpan.innerHTML = "No Empty Field Allowed";
      errorSpan.classList.add("error");
      if (newValue.startsWith("@")) {
        const withoutMention = newValue.split(/\s+/).slice(1).join(" ").trim();

        if (!withoutMention) {
          updateTextCon.appendChild(errorSpan);
          return;
        }
      }

      if (!newValue) {
        updateTextCon.appendChild(errorSpan);
        return;
      }

      errorSpan.innerHTML = "";
      if (currentText) {
        currentText.innerHTML = boldAts(newValue);
      }

      updateTextCon.replaceWith(originalCard);
    });
  });

  editDiv.append(editImg, editBtn);

  contentDiv.appendChild(postContent);
  topRightDiv.append(deleteDiv, editDiv);

  topLeftDiv.append(postAvatar, postUser, youBox, postTime);

  scoreDiv.append(addScoreDiv, currentScoreDiv, subScoreDiv);

  cardDiv.append(scoreDiv, contentDiv, topLeftDiv, topRightDiv);

  cardContainer.appendChild(cardDiv);

  if (parent) {
    cardDiv.classList.add("user-reply-card");
    parent.appendChild(cardDiv);
  } else {
    cardDiv.classList.add("card");
    commentBox?.appendChild(cardContainer);
    userComment.value = "";
  }
}

submitNew.addEventListener("click", () => {
  newComment(userComment.value);
});

function openLightBox() {
  overlay.classList.add("active");
  lightBox.classList.add("open");
}

function closeLightBox() {
  overlay.classList.remove("active");
  lightBox.classList.remove("open");
}

