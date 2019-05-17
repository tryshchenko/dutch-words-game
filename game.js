(() => {
    // The only side effect for each function
    const state = {
        dutchWord: 'init',
        options: ['one', 'two', 'three', 'four'],
        answer: 'three',
        guessed: 0,
        iterate: () => {}
    };

    let DOM = {}

    const randomizer = () => Math.random() > 0.5 ? 1 : -1;

    const notify = (message) => {
        DOM.result.innerHTML = message;
        DOM.guessed.innerHTML = state.guessed;
        message.length && setTimeout(_ => notify(''), 1000);
        !message.length && state.iterate();
    }

    const handleClick = (id) => (event) => {
        if (event.target.innerHTML === state.answer) {
            state.guessed++;
            return notify('Correct');
        }
        state.guessed = 0;
        return notify(`Wrong. Correct was "${state.answer}"`);
    }

    const next = ({options, listeners, words}) => () => {
        const list = [...words].sort(randomizer).slice(0, 4);
        state.dutchWord = list[0][1];
        state.answer = list[0][2];
        [...options].sort(randomizer).map((option, i) => {
            option.innerHTML = list[i][2];
        });
        DOM.dutch.innerHTML = state.dutchWord;
    }

    window.onload = function() {
        const ref = document.getElementById.bind(document);
        const options = [
            ref('option-1'),
            ref('option-2'),
            ref('option-3'),
            ref('option-4')
        ];

        DOM = Object.assign({
            result: ref('result'),
            guessed: ref('guessed'),
            dutch: ref('dutch')
        }, DOM);

        const listeners = options.map((option, i) => 
            option.addEventListener('click', handleClick(i))    
        );

        state.iterate = next({options, listeners, words: window.$wordsApp.vocabulary});
        state.iterate();
    }
})();