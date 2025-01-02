const setCookie = (name, val, secs) => {
    const exp = new Date(Date.now() + secs * 1000).toUTCString(); //*1000 because Date uses ms
    console.log('cookie expires:', exp)
    document.cookie = `${name}=${val}; expires=${exp}; path=/`;
};

let cooldown = false;

const extendCookie = async (name, val, secs) => {
    if (cooldown) {
        return;
    };

    try {
        setCookie(name, val, secs);

        await fetch('/extendsess', {
            method: 'GET'
        });

        cooldown = true;
    } catch (err) {
        console.error(err);
    } finally {
        setTimeout(() => {
            cooldown = false;
        }, 420000); // 4 minute cooldown so there's not loads of requests being sent
    };
};

module.exports = {
    setCookie,
    extendCookie
};