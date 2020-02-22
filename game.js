const Authentication = new Promise((res, rej) => {
  const user = netlifyIdentity.currentUser();
  console.log({ user });
  if (!user) {
    netlifyIdentity.open();
    netlifyIdentity.on("init", user => res(user));
    netlifyIdentity.on("login", user => res(user));
  }
  netlifyIdentity.on("close", () => rej(user));
})(() => {
  const MESSAGE_DELAY = 3000;
  // The only side effect for each function
  const state = {
    dutchWord: "init",
    options: ["one", "two", "three", "four"],
    answer: "three",
    guessed: 0,
    iterate: () => {}
  };

  let DOM = {};

  const randomizer = () => (Math.random() > 0.5 ? 1 : -1);

  const notify = message => {
    if (!message.length && this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    DOM.result.innerHTML = message;
    DOM.guessed.innerHTML = state.guessed;
    if (message.length) {
      this.timer = setTimeout(_ => notify(""), MESSAGE_DELAY);
    }
    !message.length && state.iterate();
  };

  const handleClick = id => event => {
    if (this.timer) return;
    event.target.classList.add("selected");
    if (event.target.innerHTML === state.answer) {
      state.guessed++;
      document.body.classList.add("success");
      return notify("Correct");
    }
    document.body.classList.add("failure");
    state.guessed = 0;
    return notify(`Wrong. Correct was "${state.answer}"`);
  };

  const next = ({ options, listeners, words }) => () => {
    const list = [...words].sort(randomizer).slice(0, 4);
    state.dutchWord = list[0][1];
    state.answer = list[0][2];
    [...options].sort(randomizer).map((option, i) => {
      option.innerHTML = list[i][2];
      option.classList.remove("selected");
      document.body.classList.remove("success", "failure");
    });
    DOM.dutch.innerHTML = state.dutchWord;
    document.activeElement.blur();
  };

  window.onload = function() {
    const ref = document.getElementById.bind(document);

    Authentication.then(user => {
      const options = [
        ref("option-1"),
        ref("option-2"),
        ref("option-3"),
        ref("option-4")
      ];

      DOM = Object.assign(
        {
          result: ref("result"),
          guessed: ref("guessed"),
          dutch: ref("dutch")
        },
        DOM
      );

      const listeners = options.map((option, i) =>
        option.addEventListener("click", handleClick(i))
      );

      state.iterate = next({
        options,
        listeners,
        words: window.$wordsApp.vocabulary
      });
      state.iterate();
    }).catch(error => console.error(error));
  };
})();
