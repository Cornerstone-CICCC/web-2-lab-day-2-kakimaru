$(function () {
  const infoImage = $(".info__image");
  const infoWrap = $(".info__content");
  const postWrap = $(".posts");
  const todosWrap = $(".todos");
  const container = $(".container");

  // modal
  const overlay = $("<div>").addClass('overlay').hide();

  const modalDiv = $("<div>").css({
    padding: "16px",
    position: "fixed",
    "z-index": 1,
    left: "50%",
    top: "50%",
    "background-color": "white",
    transform: "translate(-50%, -50%)",
    display: "none",
    "max-width": "420px",
  });
  const modalTitle = $("<h4>");
  const modalText = $("<p>");
  const modalViews = $("<p>");
  const closeBtn = $("<button>").text("Close Modal").css({
    "text-align": "center",
    padding: "8px",
    "background-color": "lightgray",
    "margin-top": "8px",
    width: "100%",
    cursur: "pointer",
  });

  modalDiv.append(modalTitle, modalText, modalViews, closeBtn);
  container.append(overlay, modalDiv);

  let curUserId = 1;

  function getData(endpoint) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `https://dummyjson.com/${endpoint}`,
        type: "GET",
        success: function (response) {
          resolve(response);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }

  function getUserById(userId) {
    return getData(`users/${userId}`);
  }

  function getPostById(userId) {
    return getData(`users/${userId}/posts`);
  }

  function getPostDetailsById(postId) {
    return getData(`posts/${postId}`);
  }

  function getTodosById(userId) {
    return getData(`users/${userId}/todos`);
  }

  const showData = async function (id) {
    curUserId = id;

    try {
      const userData = await getUserById(id);
      const postData = await getPostById(id);
      const todoData = await getTodosById(id);

      // user info
      infoImage.find("img").attr("src", userData.image);
      infoWrap.empty();
      infoWrap.append(`
      <div>
        <h1>${userData.firstName} ${userData.lastName}</h1>
        <p>
          <span>Age:</span>
          ${userData.age}
        </p>
        <p>
          <span>Email:</span>
          ${userData.email}
        </p>
        <p>
          <span>Phone:</span>
          ${userData.phone}
        </p>
      </div>
      `);

      // post info
      postWrap.find("h3").text(`${userData.firstName}'s Posts`);
      postWrap.find("ul").empty();

      if (postData.posts.length === 0) {
        const li = $("<li>").text(`No posts`);
        postWrap.find("ul").append(li);
      }

      postData.posts.forEach((post) => {
        const li = $("<li>");
        const title = $("<h4>").text(post.title).data("postId", post.id)
        const text = $("<p>").text(post.body);

        li.append(title, text);

        postWrap.find("ul").append(li);
      });

      // todo info
      todosWrap.find("h3").text(`${userData.firstName}'s To Dos`);
      todosWrap.find("ul").empty();

      if (todoData.todos.length === 0) {
        const li = $("<li>").text(`No To Dos`);
        todosWrap.find("ul").append(li);
      }

      todoData.todos.forEach((todo) => {
        const li = $("<li>");
        li.text(todo.todo);
        todosWrap.find("ul").append(li);
      });
    } catch (err) {
      console.error(err);
    }
  };

  showData(curUserId);

  // next btn
  container
    .find("header")
    .children("button")
    .last()
    .on("click", async function () {
      if (curUserId === 30) {
        curUserId = 1;
      }
      curUserId++;
      await showData(curUserId);
    });

  // prev btn
  container
    .find("header")
    .children("button")
    .first()
    .on("click", async function () {
      if (curUserId === 1) {
        curUserId = 30;
      }
      curUserId--;
      await showData(curUserId);
    });

  // slide
  postWrap.find("ul").hide();
  todosWrap.find("ul").hide();

  postWrap.find("h3").on("click", function () {
    $(this).next().slideToggle();
  });

  todosWrap.find("h3").on("click", function () {
    $(this).next().slideToggle();
  });

  // modal show or hide
  postWrap.find("ul").on("click", "h4", async function () {
    const postId = $(this).data("postId");

    try {
      const postDetailsData = await getPostDetailsById(postId)

      modalTitle.text(postDetailsData.title);
      modalText.text(postDetailsData.body);
      modalViews.text(`Views: ${postDetailsData.views}`).show();
  
      overlay.fadeIn();
      modalDiv.fadeIn();
    } catch (err) {
      console.error(err);
    }
  });

  modalDiv.on("click", "button", function () {
    overlay.fadeOut();
    modalDiv.fadeOut();
  });
});
