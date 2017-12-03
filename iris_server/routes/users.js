var express = require('express');
var router = express.Router();
var db = require("../db/mongo.js")
var axios = require('axios')
const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 9001
});
var fileupload = require("express-fileupload");
var multer = require('multer')
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('Arjun can see the ', message);
    });

    ws.send('something');
});
/* GET users listing. */

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/clearGeneralNotifications', function(req, res, next) {
    let uid = req.param("uid")
    db.users.update({"uid":uid},{"$pull":{"notifications":{"type":0}}},function(err,update){
        if(!err){
            res.send({status:1})
        }
    })
});
router.get('/rankings', function(req, res) {
    let uid = req.param("uid"), responseBody = {}, rankedUser = new Array()
    db.users.find({},{"fullName":1, "score":1, "ratings":1, "skills":1, "uid":1, "pictureUrl":1}).sort({score:-1}).toArray(function(err,users){
        if(!err){
           rankedUser = users.slice(0,5) 
           users.forEach((user,index)=>{
                if(user.uid === uid)
                {
                    console.log("rank for "+ uid)
                    user.ranking = index+1
                    responseBody["userInfo"] = user
                }
                
           })
           rankedUser.forEach((rk,index)=>{
            let totalSkills = rk.skills.length, totalRatings = 0

                rk.skills.forEach(skill=>{
                    totalRatings+=skill.rating
                })
                let userRating = totalRatings/totalSkills
                rk.rating = userRating.toFixed(1)
                rk.ranking = index+1
           })
           // let topUsers = rankedUser.slice(5)
           responseBody.rankedList = rankedUser
           res.send(responseBody)
        }    
        
    })
});
router.get('/userById', function(req, res) {
    let id = require('mongodb').ObjectId(req.param('id'))
    db.users.find({"_id":id}).toArray(function(err,user){
        if(!err){
           res.send(user[0]) 
        }    
        
    })
});
router.post('/pushRating', function(req, res) {
    let uid = req.body.uid, ratings = req.body.ratings
    let totalRatings = 0; let totalSkills = ratings.length
    ratings.forEach(rat=>{
        totalRatings+=rat.rating
    })
    let overall = parseFloat(totalRatings/totalSkills).toFixed(1)
    console.log(overall)
    if(overall>4){
        console.log("here")
        addPoints([{"uid":uid,"score":15}])
    }
    if(overall<=4 && overall>2)
        addPoints([{"uid":uid,"score":10}])
    if(overall<=2)
        addPoints([{"uid":uid,"score":5}])

    db.users.find({"uid":uid}).toArray(function(err,user){
        if(!err){
            let skillBody = []
            skills = user[0].skills
            skills.forEach(skill=>{
                ratings.forEach(rating=>{
                    if(skill.skill === rating.skill.skill)
                    {   
                        let newRating = (rating.rating!=0?(skill.rating+rating.rating)/2:skill.rating).toFixed(1)
                        let skillObj = {"skill":skill.skill,"rating":parseFloat(newRating)}
                        skillBody.push(skillObj)
                    }
                })
            })
            db.users.update({"uid":uid},{"$set":{"skills":skillBody}},function(err,result){
                res.send({status:1})
            })
            db.users.update({"uid":req.body.user},{"$pull":{"pendingRatings":uid}})
        }
    })
});
router.post('/pushPendingRating', function(req, res) {
    let uid = req.body.uid, pendingId = req.body.user
    console.log(req.body)
    db.users.update({"uid":uid},{"$addToSet":{"pendingRatings": pendingId}})
    res.send({"status":1})
});
router.post('/addFeedback', function(req, res) {
    let feed = JSON.stringify(req.body), uid = req.body.uid

    db.users.update({"uid":uid},{"$set":{"feedback": feed.toString()}})
    res.send({"status":1})
});
router.post('/clearUnread', function(req, res) {
    let uid = req.param("uid")
    db.users.update({"uid":uid},{"$set":{"unread":[]}})
    res.send({"status":1})
});
router.post("/filterDiscover", function(req,res){

    let industry = req.body.industry, skills = req.body.skills.map(sk=>{
        return sk.skill
    }),
     type = req.body.type
    let matchQuery = {}
    let unwindQuery = {}
    
    if(industry.length>0)
    {
        let industryQuery = {"$in":industry}
        matchQuery["industry"] = industryQuery
    }
    if(type.length>0)
    {
        let typeQuery = {"$in":type}
        matchQuery["type"] = typeQuery
    }
    if(skills.length>0)
    {
        let skillQuery = {"$in":skills}
        matchQuery["skills.skill"] = skillQuery
        unwindQuery["$unwind"] = "$skills"
        // console.log(JSON.stringify(unwindQuery),JSON.stringify(matchQuery))
        db.users.aggregate(unwindQuery,{"$match":matchQuery},function(err, users){
            let filteredUser = new Array()
            users.forEach(user=>{
                let discoverUser = {}
                discoverUser = {
                    "fullName": user.fullName,
                    "headline": user.headline,
                    "pictureUrl": user.pictureUrl,
                    "score": user.score,
                    "rating": user.rating,
                    "uid": user.uid,
                    "designation": user.designation,
                    "skills": [user.skills],
                    "industry":user.industry,
                    "currentWorkplace": user.currentWorkplace,
                    "lastLoginLocation": user.lastLoginLocation
                }
                filteredUser.push(discoverUser)
            })
            res.send(filteredUser)
        })
    }
    else
    {
        console.log(JSON.stringify(matchQuery))
        db.users.aggregate({"$match":matchQuery},function(err, users){
            let filteredUser = new Array()
            users.forEach(user=>{
                let discoverUser = {}
                discoverUser = {
                    "fullName": user.fullName,
                    "headline": user.headline,
                    "pictureUrl": user.pictureUrl,
                    "score": user.score,
                    "rating": user.rating,
                    "uid": user.uid,
                    "designation": user.designation,
                    "skills": user.skills,
                    "industry":user.industry,
                    "currentWorkplace": user.currentWorkplace,
                    "lastLoginLocation": user.lastLoginLocation
                }
                filteredUser.push(discoverUser)
            })
            res.send(filteredUser)
        })
    }
     

})
router.post('/data', function(req, res, next) {
    var userData = req.body
    console.log(userData.fullName)
    db.users.find({
        "uid": userData.uid
    }).toArray(function(err, user) {
        if (!err) {

            if (user.length == 0) {
                var newuser = userData
                db.users.insert(newuser, function(err, result) {
                    if (!err) {
                        console.log(result)
                        let pointArr = new Array()
                        let pointBody = {"uid":newuser.uid, "score":100}
                        pointArr.push(pointBody)
                        addPoints(pointArr)
                        res.send(newuser)
                    }
                })
            } else{
                db.users.update({"uid":userData.uid},{"$set":userData},function(err,st){
                    if(!err){
                        res.send(userData)
                    }
                })
                res.send(user[0])
            }

        } else
            console.log(err)
    })
});

router.get('/discover', function(req, res, next) {
    var page = req.param("page")
    var currentUser = req.param("uid")
    var entries = 10 * page
    var usrId = [currentUser]
    db.users.find({
        "uid": currentUser
    }, {
        "connections": 1,
        "requests": 1,
        "requested": 1
    }).toArray(function(err, user) {
        if (!err) {
            var dontFind = new Array()
            dontFind.push(currentUser)
            dontFind = dontFind.concat(user[0].connections)
            dontFind = dontFind.concat(user[0].requests)
            dontFind = dontFind.concat(user[0].requested)
            console.log(user[0], dontFind)
            db.users.find({
                "uid": {
                    "$nin": dontFind
                }
            }, {
                "fullName": 1,
                "headline": 1,
                "pictureUrl": 1,
                "score": 1,
                "rating": 1,
                "uid": 1,
                "designation": 1,
                "skills": 1,
                "industry":1,
                "currentWorkplace": 1,
                "lastLoginLocation": 1
            }).limit(20).toArray(function(err, users) {
                if (!err)
                    res.send(users)
            })
        }
    })

});


router.get('/user', function(req, res) {
    var currentUser = req.param("uid")
    db.users.find({
        "uid": currentUser
    }).toArray(function(err, users) {
        if (!err) {
            if (users.length != 0)
                res.send({
                    status: 1,
                    userObject: users[0]
                })
            else
                res.send({
                    status: 0
                })
        }
    })
});


router.get('/user/contact', function(req, res) {
    var contactUser = req.param("uid")
    db.users.find({
        "uid": contactUser
    }, {
        "fullName": 1,
        "pictureUrl": 1,
        "chatId": 1
    }).toArray(function(err, users) {
        if (!err)
            res.send(users[0])
    })
});

router.put("/request", function(req, res) {
    db.users.update({
            "uid": req.body.id
        }, {
            "$push": {
                "requests": req.body.uid,
                "notifications": {
                    "notificationId": (+new Date).toString(36),
                    "uid": req.body.uid,
                    "pictureUrl": req.body.pictureUrl,
                    "fullName": req.body.fullName,
                    "headline": req.body.headline,
                    "reason": req.body.reason,
                    "type": 1
                }
            }
        },
        function(err, result) {
            if (!err) {
                db.users.find({
                    "uid": req.body.id
                }, {
                    "pushId": 1
                }).toArray(function(err, user) {
                    if (!err) {
                        sendPush(user[0].pushId, 1, {
                                "fullName": req.body.fullName
                            })
                    }
                })


                console.log(result.result)
                db.users.update({
                    "uid": req.body.uid
                }, {
                    "$push": {
                        "requested": req.body.id
                    }
                }, function(err, response) {
                    if (!err){
                       addPoints([{"uid":req.body.uid,"score":15}]) 
                       res.send({status: 1}) 
                    }
                        
                })
            } else
                console.log(err)
        })

})
router.put("/chatId", function(req, res) {
    db.users.update({
        "uid": req.body.uid
    }, {
        "$set": {
            "chatId": req.body.chatid
        }
    }, function(err, success) {
        if (!err)
            res.send({
                status: 1
            })
        else console.log(err)
    })
})
router.put("/updateLocation", function(req, res) {
    let update = req.body
    db.users.update({
        "uid": update.uid
    }, {
        "$set": {
            "lastLoginLocation": update.location
        }
    }, function(err, success) {
        if (!err)
            res.send({
                status: 1
            })
    })
})
router.get("/chatId", function(req, res) {
    db.users.find({
        "uid": req.param("uid")
    }, {
        "chatId": 1
    }).toArray(function(err, user) {
        if (!err)
            res.send(user[0])
    })
})
router.get("/notifications", function(req, res) {
    db.users.find({
        "uid": req.param("uid")
    }, {
        "notifications": 1
    }).toArray(function(err, user) {
        if (!err)
            res.send(user[0])
    })
})
router.get("/connections", function(req, res) {
    var list = new Array();
    db.users.find({
        "uid": req.param("uid")
    }, {
        "connections": 1
    }).toArray(function(err, user) {
        if (!err) {
            var connectionList = user[0].connections
            console.log(connectionList)
            db.users.find({
                "uid": {
                    "$in": connectionList
                }
            }, {
                "uid": 1,
                "fullName": 1,
                "pictureUrl": 1,
                "designation":1
            }).toArray(function(err, conn) {
                if (!err) {
                    res.send(conn)
                }
            })

        }
    })
})
router.get("/connections/pending", function(req, res) {
    var list = new Array();
    db.users.find({
        "uid": req.param("uid")
    }, {
        "requested": 1
    }).toArray(function(err, user) {
        if (!err) {
            var pendingList = user[0].requested
            db.users.find({
                "uid": {
                    "$in": pendingList
                }
            }, {
                "uid": 1,
                "fullName": 1,
                "pictureUrl": 1,
                "designation":1
            }).toArray(function(err, conn) {
                if (!err) {
                    res.send(conn)
                }
            })

        }
    })
})
router.post("/acceptMeeting", function(req, res) {
    addPoints([{"uid":req.body.uid,"score":5},{"uid":req.body.eventObject.with.uid,"score":15}])
    db.users.update({
        "uid": req.body.uid
    }, {
        "$push": {
            "events": req.body.eventObject
        },
        "$pull": {
            "notifications": {
                "notificationId": req.body.eventObject.eventId
            }
        }
    }, function(err, result) {
        if (!err) {
            db.users.update({
                "uid": req.body.eventObject.with.uid,
                "events.eventId": req.body.eventObject.eventId
            }, {
                "$set": {
                    "events.$.pending": false
                }
            }, function(err, result) {
                res.send({
                    "status": 1
                })
                db.users.find({"uid":{"$in":[req.body.eventObject.with.uid,req.body.uid]}},{"fullName":1,"pushId":1}).toArray(function(err,user){
                    sendPush(user[0].pushId,4,{"fullName":user[1].fullName})
                })
            })

        }
    })

})
router.post("/rejectMeeting", function(req, res) {
    db.users.update({
        "uid": req.body.uid
    }, {
        "$pull": {
            "notifications": {
                "notificationId": req.body.eventObject.eventId
            }
        }
    }, function(err, result) {
        if (!err) {
            db.users.update({
                "uid": req.body.eventObject.with.uid
            }, {
                "$pull": {
                    "events": {
                        "eventId": req.body.eventObject.eventId
                    }
                }
            }, function(err, result) {
                res.send({
                    "status": 1
                })
            })

        }
    })
})
router.post("/acceptConnect", function(req, res) {
    var uid = req.body.uid
    var acceptId = req.body.acceptId
    addPoints([{"uid":uid,"score":5},{"uid":acceptId,"score":15}])
    db.users.update({
        "uid": uid
    }, {
        "$push": {
            "connections": acceptId
        },
        "$pull": {
            "requests": acceptId,
            "notifications": {
                "uid": acceptId
            }
        }
    }, function(err, response) {
        if (!err)
            db.users.find({
                "uid": uid
            }).toArray(function(err, acceptor) {
                console.log(err)
                if (!err)
                    db.users.update({
                        "uid": acceptId
                    }, {
                        "$push": {
                            "connections": uid,
                            "notifications": {
                                "type": 0,
                                "notificationId": (+new Date).toString(36),
                                "message": acceptor[0].fullName + " is now a connection."
                            }
                        },
                        "$pull": {
                            "requested": uid
                        }
                    }, function(err, response) {
                        console.log(err)
                        if (!err)
                            res.send({
                                "status": 1
                            })
                    })
                db.users.find({"uid":acceptId},{"pushId":1}).toArray(function(err,user){
			    	sendPush(user[0].pushId,3,{"fullName":acceptor[0].fullName})
			    })
            })
    })
    
})
router.post("/rejectConnect", function(req, res) {
    var uid = req.body.uid
    var rejectId = req.body.rejectId
    db.users.update({
            "uid": uid
        }, {
            "$pull": {
                "requests": rejectId,
                "notifications": {
                    "uid": rejectId
                }
            }
        },
        function(err, response) {
            if (!err)
                db.users.update({
                    "uid": rejectId
                }, {
                    "$pull": {
                        "requested": uid
                    }
                }, function(err, response) {
                    console.log(err)
                    if (!err)
                        res.send({
                            "status": 1
                        })
                })
        })
})
router.post("/events", function(req, res) {
    console.log(req.body)
    var uid = req.body.uid,
        eventObject = req.body.event,
        eventId = (+new Date).toString(36)
    eventObject.eventId = eventId
    addPoints([{"uid":req.body.uid,"score":15}])

    db.users.update({
        "uid": uid
    }, {
        "$push": {
            "events": eventObject
        }
    }, function(err, result) {
        if (!err) {
            db.users.find({
                "uid": uid
            }, {
                "uid": 1,
                "fullName": 1,
                "pictureUrl": 1
            }).toArray(function(err, user) {
                if (!err) {
                    var withObject = user[0]
                    withObject["id"]=withObject["_id"].toString()
                    delete withObject["_id"]
                    console.log(withObject)
                    var withUser = eventObject.with.uid
                    eventObject.with = withObject
                    db.users.update({
                        "uid": withUser
                    }, {
                        "$push": {
                            "notifications": {
                                "type": 2,
                                "notificationId": eventId,
                                "eventObject": eventObject
                            }
                        }
                    }, function(err, result) {
                        if (!err)
                            res.send({
                                "status": 1
                            })
                    })
                    db.users.find({
                        "uid": withUser
                    }, {
                        "pushId": 1
                    }).toArray(function(err, send) {
                        if (!err)
                            sendPush(send[0].pushId, 2, {
                                "fullName": withObject.fullName,
                                "eventType": eventObject.type
                            })
                    })

                }
            })
        }
    })

})
router.get("/events", function(req, res) {

    var uid = req.param("uid")
    db.users.find({
        "uid": uid
    }, {
        "events": 1
    }).toArray(function(err, user) {
        if (!err) {
            res.send(user[0].events)
        }
    })

})
router.get('/otp', function(req, res) {
    var phone = req.param('phone')
    var otp = req.param('otp')
    axios.get('https://control.msg91.com/api/sendhttp.php?authkey=169994A8BUunqq5992a81d&mobiles=' + phone + '&message=Use%20OTP%20' + otp + '%20to%20successfully%20login%20to%20IRIS&sender=TMIRIS&route=4&country=0')
        .then(response => {
            if (response != null)
                res.send({
                    status: 1
                })
        })

})
router.post("/updatePushRegistration", function(req, res) {
    let key = req.body.key,
        uid = req.body.uid
    console.log(typeof(req.body.uid))
    if (uid != "")
        db.users.find({
            "uid": uid
        }).toArray(function(err, user) {
            // console.log(err,user)
            if (user[0].pushId === key)
                res.send({
                    status: 1
                })
            else
                db.users.update({
                    "uid": uid
                }, {
                    "$set": {
                        "pushId": key
                    }
                }, function(err, result) {
                    if (!err)
                        res.send({
                            status: 1
                        })
                    else
                        res.send({
                            status: 0
                        })
                })
        })
    else
        res.send({
            status: -1
        })
})

function addPoints(pointsBody){
    pointsBody.forEach(pbody=>{
        db.users.update({"uid":pbody.uid},{"$inc":{"score":pbody.score}})
    })
}
function sendPush(pushId, notificationType, notificationDetail) {
    let message = "",
        title = ""

    if (notificationType === 1) {
        title = "Connections"
        message = notificationDetail.fullName + " wants to connect with you. Visit Notifications --> Connections"
    }
    if (notificationType === 2) {
        title = "Meetings"
        message = notificationDetail.fullName + " has scheduled a " + notificationDetail.eventType + " with you. Visit notifications --> Meeting"
    }
    if(notificationType === 3){
    	title = "Connections"
    	message = notificationDetail.fullName + " is now a connection."
    }
    if(notificationType === 4){
        title = "Meetings"
        message = notificationDetail.fullName + " has accepted your meeting invite."
    }
    let pushKey = "key=AAAA9fMhVWc:APA91bE6AqkJnpwmMWEbU0vf6WB21OsGlSQTPPDuglRa0Y2XL0IF_NEa07ZZ_ASbUYcSnK4IJ1OtHSk3x3p9_KbHw7_z3sd0QuAkaS5Lo9m-XDRHuo5iVFvlo8iFxVlpuW4WJVJDFw_Y"
    let notification = {
            "notification": {
                "title": title,
                "body": message,
                "sound": "default"
            },
            "to": pushId
        },
        pushHeader = {
            "Authorization": pushKey
        }
    axios.post("https://fcm.googleapis.com/fcm/send", notification, {
        "headers": pushHeader
    }).then(res => {
        console.log("Pushed Notification")
    })
}
module.exports = router;