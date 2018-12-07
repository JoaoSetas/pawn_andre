var Username = {
    get: function () {
        return window.cookie.read("username")
    },

    set: function (name) {
        window.cookie.create("username", name, 10)
    }
};

var Timer = {

    get: function () {
        return window.cookie.read("timeout")
    },

    start: function () {
        window.cookie.create("timeout", (new Date).getTime(), 10)
    }
};

var Welcome = {
    remove: function () {
        document.getElementById("ask-name-wrapper").style.display = "none";
    }
};

var merryPawning = function () {

    /**
     * Username
     */
    function getUsername() {
        var username = window.cookie.read("username");
        if (username) {
            console.log("username: " + username);
            return username
        }
        else {
            console.log("No username set");
            return false
        }
    }

    function setUsername() {
        var input = document.getElementById('ask-name-input').value;
        if (input && input.length > 3) {
            window.cookie.create("username", input, 50000000);
            location.reload()
        }
        console.log(input)
    }

    /**
     * Other functions
     */
    function removeInputUsername() {
        document.getElementById("ask-name-wrapper").style.display = "none";
    }

    function setUsernameInTitle() {
        document.getElementById("title").innerHTML = "Merry pawning, " + getUsername() + "!";
    }

    function removeUI() {
        $('#ui').remove();
    }

    function rollTheDices() {
        // check cookie
        var cookie = window.cookie.read("usertimeout");
        if (cookie) return "Don't spam the poor guy :( Wait for your turn!"

        // if no cookie set

        // make request

        // set cookie
        window.cookie.create("usertimeout", true, 20);
        // block ui
    }

    /**
     * Binds
     */
    function binds() {
        var btn = document.getElementById('ask-name-btn').addEventListener("click", setUsername)
        var pawn = document.getElementById('ask-name-btn').addEventListener("click", rollTheDices)
    }

    /**
     * Init function
     */
    var init = (function () {
        var username = getUsername();
        binds();
        if (username === false) {
            removeUI();
            return false;
        }
        removeInputUsername();
        setUsernameInTitle()
    })();
};

var PawnSocket = {

    get: function () {
        if(typeof window.socket === "undefined"){
            window.socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + '/');
        }
        return window.socket;
    },

    register: function () {
        var s = this.get();

        // connect response receiver
        s.on('connect', function () {
            console.log("connected!");
            // TODO disable load
        });

        // pawn response event receiver
        s.on('pawn_response', function (msg) {
            console.log("pawn_response");
            $.toast({
                heading: 'Toast',
                text: "Daaaammmnn! " + msg.pawn_author + " just pawned with `" + msg.action + "`",
                position: 'bottom-right',
                loader: false,
                stack: 50,
                icon: 'success'
            })
        });
    }
};

var Binds = {
    register: function () {
        // Username
        $("#ask-name-btn").on('click', function () {
            var username = $('#ask-name-input').val();
            console.log(username);
            if (username.length > 3) {
                Username.set(username);
                $.toast({
                    heading: 'Login',
                    icon: 'success',
                    text: "Success! Prepare to voodoo someone!",
                    position: 'bottom-right',
                    loader: false
                });
                setTimeout(function () {
                    console.log("reloading");
                    window.location.reload()
                }, 2000) // for drama
            } else {
                $.toast({
                    heading: 'Username',
                    icon: 'error',
                    text: "la la la... Insert your name!",
                    position: 'bottom-right',
                    loader: false
                })
            }
        });

        // Roll the dice
        $("#pawn").on('click', function () {
            PawnSocket.get().emit("pawn", {user: window.cookie.read("username")});
        });
    }
};


$(document).ready(function () {
    // Register socket actions
    PawnSocket.register();
    // Register bind events
    Binds.register();

    // Check if username is set
    // TODO add loading to avoid visible removing
    if (Username.get()) {
        Welcome.remove();
    }
    return false; // Stop if not set
});
