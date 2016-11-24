/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Space Geek for a space fact"
 *  Alexa: "Here's your space fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing space facts.
 */

var convert = {
    
    caloriesToWalk: function(calories) {
        return this.timeBeauty( Math.ceil(calories/5) ); // returns minutes
    },
    caloriesToJog: function(calories) {
        return this.timeBeauty( Math.ceil(calories/12.5) ); // returns minutes
    },
    caloriesToRun: function(calories) {
        return this.timeBeauty( Math.ceil(calories/17) ); // returns minutes
    },
    caloriesToSwim: function(calories) {
        return this.timeBeauty( Math.ceil(calories/9.5) ); // returns minutes
    },
    caloriesToBike: function(calories) {
        return this.timeBeauty( Math.ceil(calories/9.5) ); // returns minutes
    },


    timeBeauty(minutes) {
        var hours = parseInt(minutes / 60);
        var mins = minutes % 60;
        if (minutes >= 60 && mins > 0) {
            if (hours == 1) {
                return hours + " hour and " + mins + " minutes";
            }
            else {
                return hours + " hours and " + mins + " minutes";
            }
        }
        else if (minutes >= 60 && mins == 0) {
            if (hours == 1) {
                return hours + " hour";
            }
            else {
                return hours + " hours";
            }
        }
        else {
            return minutes + " minutes";
        }
    },


    caloriesToSteps: function(calories) {
        return parseInt(calories * 26.471);
    },
    milesToTime(miles) {
        return 'time';
    },
    timeToMiles(minutes) {
        return 'miles';
    },
    stepsToMiles(steps) {
        return parseInt(steps / 2200);
    }
}

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var Fact = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Fact.prototype = Object.create(AlexaSkill.prototype);
Fact.prototype.constructor = Fact;

Fact.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    //console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Fact.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    //console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Hey, it's Cal Pal! Your Calorie calculator." +
        "You can ask me a question like: how long it will take to burn five hundred calories";
    var cardTitle = '';
    response.ask(speechOutput);
    // handleNewConversion(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Fact.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    //console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Fact.prototype.intentHandlers = {
    // "GetNewFactIntent": function (intent, session, response) {
    //     handleNewConversion(response);
    // },
    "GetConvertionIntent": function(intent, session, response) {
        console.log("HERE: ", intent.slots.Number.value);
        // console.log("TYPEOF: ", intent.slots.value);
        // var slotActOptions = intent.slots.ActOptions.value;
        var slotActOptions = intent.slots.ActOptions.value;
        var slotNumber = intent.slots.Number.value;
        handleNewConversion(response, slotActOptions, slotNumber);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("Ask me this: How long would I have to swim to burn off five hundred calories");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewConversion(response, actOptions, Number) {
    // Create speech output
    var speechOutput = '';
    var cardTitle = '';
    console.log("action: ", actOptions, "number: ", Number)
    

    if (actOptions == "walk" || actOptions == "walking" || !actOptions) {
        speechOutput = "To burn " + Number + " calories you would need to walk for about " + convert.caloriesToWalk(Number);
    }
    else if (actOptions && Number) {
        if (actOptions == "jog" || actOptions == "jogging") {
            speechOutput = "To burn " + Number + " calories you would need to jog for about " + convert.caloriesToJog(Number);
        }
        else if (actOptions == "bike" || actOptions == "biking") {
            speechOutput = "To burn " + Number + " calories you would need to bike for about " + convert.caloriesToBike(Number);
        }
        else if (actOptions == "swim" || actOptions == "swimming" ) {
            speechOutput = "To burn " + Number + " calories you would need to swim for about " + convert.caloriesToSwim(Number);
        }
        else if (actOptions == "run" || actOptions == "running") {
            speechOutput = "To burn " + Number + " calories you would need to run for about " + convert.caloriesToRun(Number);
        }

        // If all else fails, do this...
        if (speechOutput == '') {
            speechOutput = "To burn " + Number + " calories, how about you walk for " + convert.caloriesToWalk(Number) + " instead?";
        }
    }
    else if (!Number) {
        speechOutput = "I didn't catch that. However, you burn five calories a minute walking."
    }


    response.tell(speechOutput);
    // response.ask(speechOutput);
    // response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var fact = new Fact();
    fact.execute(event, context);
};

