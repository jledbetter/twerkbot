var MINUTE = 42;
var tweetCount = 0;
var twitter = require('ntwitter');
var twit = new twitter({
    "consumer_key": "",
    "consumer_secret": "",
    "access_token_key": "",
    "access_token_secret": ""
});

// Start the stream, searching for the terms
twit.stream('statuses/filter', {
    'track': ['working', 'workin']
}, function(stream) {
    stream.on('data', function(data) {
        doTweet(data);
    });
});


function doTweet(data) {
    var now = new Date();

    // We don't want to tweet a lot so how about every hour
    if (now.getMinutes() === MINUTE && tweetCount < 1) {
        var twerkedTweet = constructTweet(data);

        if (twerkedTweet) {
            tweetCount += 1;
            // Twerk it
            twit.updateStatus(twerkedTweet, function(err, data) {
                if (err) {
                    // So we can try again instantly
                    tweetCount = 0;
                }
            });
        }
    }

    // Reset tweetCount cause we're going into the next hour of fun!
    if (now.getMinutes() === MINUTE - 1) {
        tweetCount = 0;
    }
}

function constructTweet(data) {
    var tweet = "";
    // We don't want retweeted tweets or tweets in a conversation
    if (data.retweeted_status === undefined && data.text.indexOf('RT') === -1 && data.text.indexOf('@') === -1) {
        tweet = data.text.replace(/work/gi, "twerk") + " " + " ~ @" + data.user.screen_name + " #TwerkedForYa";

        if (tweet.length < 140) {
            return tweet;
        }
    }
}