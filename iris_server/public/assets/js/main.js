// main.js

var isLoggedIn = false
var user = {}
var ws=new WebSocket("ws://localhost:9001/")
var peer
ws.onopen = function()
{
  // Web Socket is connected, send data using send()
  ws.send("Message to send");
  console.log("Message is sent...");
};

ws.onmessage = function (evt) 
{ 
  var received_msg = evt.data;
  console.log("Message is received..." + received_msg);
};
$(document).ready(function(){
	if(localStorage.getItem("userObject"))
		{
			isLoggedIn=true
			user = JSON.parse(localStorage.getItem("userObject"))
			
		}
	if(!isLoggedIn)
		{
			var c = window.location
			window.location = "http://localhost:8000/login.html?back="+c
		}
	else
		$( "#app-mount-point" ).load( "profile.html", function() {
			axios.get("http://localhost:9000/users/user/?uid="+user.uid)
			.then(function(response){
				console.log(response)
				localStorage.setItem("userObject", JSON.stringify(response.data))
				fillProfile(user)
				console.log(localStorage.getItem("userObject"))
			})
			
			
		  console.log("Loading Profile Screen")
		  $("#send").click(function(e){
		 	e.preventDefault()
			var text = $('#chatmsg').val()
			conn = peer.connect('thePeersome');
				
				conn.on('open', function(){
			  conn.send(text);
			});
		})
	})
	peer = new Peer({key: '8fli63luazrjatt9'}); 
	console.log(peer)
	setTimeout(updateChat, 1000)
	function updateChat(){
		axios.put("http://localhost:9000/users/chatId?uid="+user.uid+"&chatid="+peer.id)
	.then(function(response){
		console.log(response.data)
	})
		
	}
	
	// conn.on('open', function(){
	//   conn.send('hi!');
	// });
	// peer.on('connection', function(conn) {
	//   conn.on('data', function(data){
	//     // Will print 'hi!'
	//     $("#chatMessage").html(data)
	//   });
	// });

})
//fillProfileDetails from localStorage
function fillProfile(user){
	// user = JSON.parse(user)
	$("#fullName").html(user.firstName+" "+user.lastName)
	$("#headline").html(user.headline)
	$("#userImage").attr("src",user.pictureUrl)
	$("#firstName").val(user.firstName) 
	$("#firstName").attr("readonly",true)
	$("#lastName").val(user.lastName)
	$("#lastName").attr("readonly",true)	
}
function fillLocation(){
	 if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("location access NULL")
    }
}
function showPosition(position) {
    var latLong = position.coords.latitude+","+position.coords.longitude; 
    console.log(latLong)
	$.ajax({
		"url":"http://maps.googleapis.com/maps/api/geocode/json?latlng="+latLong+"&sensor=false",
		"method":"GET"
	})
	.done(function(response){
		response.results.forEach(function(result){
			if(result.types.indexOf("administrative_area_level_2")>-1)
				console.log(result.address_components[0])
		})
	})
}

//Navbar Controls Here

$(".navbar-toggle").click(function(e){
	e.preventDefault()
	e.stopPropagation()
	if($("html").hasClass('nav-open'))
		$("html").removeClass("nav-open")
	else
		$("html").addClass("nav-open")
})


//MENU ITEMS CLICK CONTROLLERS

$(".menu-item").click(function(e){
	e.stopPropagation()
	$("html").removeClass("nav-open")
})

$("#connect").click(function(){
	console.log(user)
	$("#app-mount-point").html("")
	$( "#app-mount-point" ).load( "connect.html", function() {
	  console.log("loading discover")
	  axios.get("http://localhost:9000/users/discover?uid="+user.uid)
	  	.then(function(response){
			var discoverList = response.data
			discoverList.forEach(function(discovery){
				var dscBody = `<div class="col-sm-6">
			<div class="card card-profile ">
				<div class="card-avatar">
					<a href="#pablo">
						<img class="img" src="!!PICTUREURL!!" />
					</a>
				</div>

				<div class="content" style="padding-bottom: 4vh">
					<h7 class="card-title">!!FULLNAME!!</h7>
					<p class="card-content">
						!!HEADLINE!!
					</p>
					<span class="connect-btn dscCard" data-uid="!!UID!!" >Connect</span>
				</div>
			</div>
		</div>`
		dscBody=dscBody.replace("!!PICTUREURL!!",discovery.pictureUrl)
		dscBody=dscBody.replace("!!FULLNAME!!",discovery.fullName)
		dscBody=dscBody.replace("!!HEADLINE!!",discovery.headline)
		dscBody=dscBody.replace("!!UID!!",discovery.uid)
		$("#discoverBody").append($(dscBody))
		console.log(dscBody)
			})

			 $('.discover').slick({
			    centerMode:true,
			    focusOnSelect:true,
			    arrows:false,
			    centerPadding:'25px'
			});
			 $(".dscCard").mousedown(function(e){
			 	new WebSocket("ws://localhost:9001/")
			 	var requesterId = e.target.dataset.uid
			 	axios.put("http://localhost:9000/users/request",{"id":requesterId,"uid":user.uid})
			 	.then(function(response){
			 		console.log(response.data)
			 		var p=e.target
			 		$(p).html("Connection request sent.")
			 		$(p).removeClass("connect-btn")
			 	})
			 })
        });
	  	})
	 
	})

$("#profile").click(function(){
    $("#app-mount-point").html("")
    $( "#app-mount-point" ).load( "profile.html", function() {
      console.log("ummh")
      fillProfile(user)
    });
})

$("#connections").click(function(){

    $("#app-mount-point").html("")
    $( "#app-mount-point" ).load( "connections.html", function() {
    	var usr = JSON.parse(localStorage.getItem("userObject"))
    	var connectionList = usr.connections
    	connectionList.forEach(function(connection){
			axios.get("http://localhost:9000/users/user/contact?uid="+connection)
			.then(function(response){
				var contactedUser = response.data
				console.log(contactedUser)
				var contactElementString = `<div class="col-lg-3 col-md-6 col-sm-6">
							<div class="card card-stats" ">
								<div class="card-header" data-background-color="blue">
									<div class="card-avatar">
										<a href="#pablo">
											<img class="img" src="!!PICTUREURL!!" />
										</a>
									</div>
								</div>
								<div class="card-content">
									<h7 class="title" style="padding: 10px;">!!FULLNAME!!</h7>
									<p class="category">
										<span >
											<i class="material-icons connect-icons" data-chat="!!CHATID!!">phone</i>
											<i class="material-icons connect-icons" data-chat="!!CHATID!!">videocam</i>
											<i class="material-icons connect-icons" data-chat="!!CHATID!!">message</i>
										</span>
									</p>
									<input class="chatInput"/> <a class="sendChat" href="#">send</a>
								</div>
							</div>
						</div>`
				contactElementString = contactElementString.replace(/!!CHATID!!/g,contactedUser.chatId)
				contactElementString = contactElementString.replace("!!PICTUREURL!!",contactedUser.pictureUrl)
				contactElementString = contactElementString.replace("!!FULLNAME!!",contactedUser.fullName)
				$("#contactPage").append($(contactElementString))

			})

    	})
    	var sendee
	 $("body").on('click',function(e){
		
	 		callerBody = $(e.target)
	 		if($(callerBody).hasClass("connect-icons"))
			{
				console.log(e.target.dataset)
				sendee = e.target.dataset.chat
				$( "#app-mount-point" ).load( "chat.html", function() {
					$.getScript("assets/js/mCustomScrollbar.js",function(){
					$.getScript("assets/js/chat.js",function(){
						$('<link>')
						  .appendTo('head')
						  .attr({
						      type: 'text/css', 
						      rel: 'stylesheet',
						      href: 'assets/css/chat.css'
						  });
					})
				})
				})
			}
			if($(callerBody).hasClass("closeOverlay"))
				$("#overlaySpace").removeClass("active")
			if($(callerBody).hasClass("sendChat"))
			{
				var val = $(".chatInput").val()
				console.log(val, sendee)
				var conn = peer.connect(sendee);
				conn.on('open', function(){
				  conn.send(val);
				});
				peer.on('connection', function(conn) {
				  conn.on('data', function(data){
				    // Will print 'hi!'
				    $("#chatMessage").html(data)
				  });
				});
			}
		})
     
      console.log("Loading User's connection")
     
 	
    });
})

//Connect Utility Buttons Controller


